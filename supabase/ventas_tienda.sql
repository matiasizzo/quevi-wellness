-- ─────────────────────────────────────────────────────────────────────────────
-- QUEVI — VENTAS EN TIENDA (mostrador)
-- Registra ventas hechas en el local y descuenta el stock de forma atómica.
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── VENTAS EN TIENDA ─────────────────────────────────────────────────────────
create table if not exists store_sales (
  id              uuid primary key default uuid_generate_v4(),
  sold_at         timestamptz not null default now(),
  -- efectivo | tarjeta | bizum | otro
  payment_method  text not null default 'efectivo',
  customer_name   text,
  customer_phone  text,
  subtotal_cents  integer not null default 0,
  discount_cents  integer not null default 0,
  total_cents     integer not null default 0,
  -- Snapshot de las líneas: [{ variant_id, product_name, variant_name, quantity, unit_price_cents }]
  items           jsonb not null default '[]'::jsonb,
  notes           text,
  -- completed | cancelled
  status          text not null default 'completed',
  cancelled_at    timestamptz,
  created_at      timestamptz default now()
);

create index if not exists store_sales_sold_at_idx on store_sales (sold_at desc);

-- ─── MOVIMIENTOS DE STOCK ─────────────────────────────────────────────────────
-- Histórico de cada cambio de stock, para poder auditar y revertir
create table if not exists stock_movements (
  id          uuid primary key default uuid_generate_v4(),
  variant_id  uuid references product_variants(id) on delete set null,
  delta       integer not null,          -- negativo = salida, positivo = entrada
  -- store_sale | store_sale_void | manual_adjust
  reason      text not null,
  sale_id     uuid references store_sales(id) on delete set null,
  note        text,
  created_at  timestamptz default now()
);

create index if not exists stock_movements_variant_idx on stock_movements (variant_id, created_at desc);

-- ─── REGISTRAR UNA VENTA EN TIENDA ────────────────────────────────────────────
-- Todo dentro de una transacción: o se descuenta todo el stock, o no se
-- descuenta nada. Bloquea cada variante (for update) para evitar que una venta
-- en mostrador y una compra online se pisen el stock a la vez.
create or replace function register_store_sale(
  p_items          jsonb,
  p_payment_method text        default 'efectivo',
  p_customer_name  text        default null,
  p_customer_phone text        default null,
  p_discount_cents integer     default 0,
  p_notes          text        default null,
  p_sold_at        timestamptz default now()
) returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_sale_id        uuid;
  v_item           jsonb;
  v_variant_id     uuid;
  v_qty            integer;
  v_price          integer;
  v_stock          integer;
  v_variant_price  integer;
  v_variant_name   text;
  v_product_name   text;
  v_subtotal       integer := 0;
  v_discount       integer := greatest(coalesce(p_discount_cents, 0), 0);
  v_snapshot       jsonb   := '[]'::jsonb;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta no tiene líneas de producto';
  end if;

  insert into store_sales (
    sold_at, payment_method, customer_name, customer_phone,
    discount_cents, notes, items, subtotal_cents, total_cents
  ) values (
    coalesce(p_sold_at, now()),
    coalesce(nullif(trim(coalesce(p_payment_method, '')), ''), 'efectivo'),
    nullif(trim(coalesce(p_customer_name, '')), ''),
    nullif(trim(coalesce(p_customer_phone, '')), ''),
    v_discount,
    nullif(trim(coalesce(p_notes, '')), ''),
    '[]'::jsonb, 0, 0
  )
  returning id into v_sale_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_variant_id := nullif(v_item->>'variant_id', '')::uuid;
    v_qty        := coalesce((v_item->>'quantity')::integer, 0);

    if v_variant_id is null then
      raise exception 'Falta seleccionar el producto en una de las líneas';
    end if;
    if v_qty <= 0 then
      raise exception 'La cantidad debe ser mayor que 0';
    end if;

    select v.stock_quantity, v.price_cents, v.name, p.name
      into v_stock, v_variant_price, v_variant_name, v_product_name
      from product_variants v
      join products p on p.id = v.product_id
     where v.id = v_variant_id
     for update of v;

    if not found then
      raise exception 'Producto no encontrado (%)', v_variant_id;
    end if;

    if v_stock < v_qty then
      raise exception 'Stock insuficiente en % (%): quedan % uds. y se intentan vender %',
        v_product_name, v_variant_name, v_stock, v_qty;
    end if;

    -- Precio: el que venga del formulario (permite descuentos de mostrador),
    -- y si no viene, el precio de catálogo de la variante
    v_price := greatest(coalesce((v_item->>'unit_price_cents')::integer, v_variant_price), 0);

    update product_variants
       set stock_quantity = stock_quantity - v_qty
     where id = v_variant_id;

    insert into stock_movements (variant_id, delta, reason, sale_id, note)
    values (v_variant_id, -v_qty, 'store_sale', v_sale_id, 'Venta en tienda');

    v_subtotal := v_subtotal + (v_qty * v_price);
    v_snapshot := v_snapshot || jsonb_build_object(
      'variant_id',       v_variant_id,
      'product_name',     v_product_name,
      'variant_name',     v_variant_name,
      'quantity',         v_qty,
      'unit_price_cents', v_price
    );
  end loop;

  if v_discount > v_subtotal then
    v_discount := v_subtotal;
  end if;

  update store_sales
     set items          = v_snapshot,
         subtotal_cents = v_subtotal,
         discount_cents = v_discount,
         total_cents    = v_subtotal - v_discount
   where id = v_sale_id;

  return jsonb_build_object(
    'id',             v_sale_id,
    'subtotal_cents', v_subtotal,
    'discount_cents', v_discount,
    'total_cents',    v_subtotal - v_discount,
    'items',          v_snapshot
  );
end;
$fn$;

-- ─── ANULAR UNA VENTA EN TIENDA ───────────────────────────────────────────────
-- Devuelve el stock exactamente como estaba antes de la venta
create or replace function void_store_sale(p_sale_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_status text;
  v_items  jsonb;
  v_item   jsonb;
begin
  select status, items into v_status, v_items
    from store_sales
   where id = p_sale_id
   for update;

  if not found then
    raise exception 'Venta no encontrada';
  end if;
  if v_status = 'cancelled' then
    raise exception 'La venta ya estaba anulada';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(v_items, '[]'::jsonb)) loop
    update product_variants
       set stock_quantity = stock_quantity + coalesce((v_item->>'quantity')::integer, 0)
     where id = nullif(v_item->>'variant_id', '')::uuid;

    insert into stock_movements (variant_id, delta, reason, sale_id, note)
    values (
      nullif(v_item->>'variant_id', '')::uuid,
      coalesce((v_item->>'quantity')::integer, 0),
      'store_sale_void',
      p_sale_id,
      'Anulación de venta en tienda'
    );
  end loop;

  update store_sales
     set status = 'cancelled', cancelled_at = now()
   where id = p_sale_id;

  return jsonb_build_object('id', p_sale_id, 'status', 'cancelled');
end;
$fn$;

-- ─── PERMISOS ─────────────────────────────────────────────────────────────────
-- Solo el backend (service_role) puede tocar ventas y movimientos.
-- RLS activo y sin políticas públicas: nadie con la anon key puede leerlas.
alter table store_sales     enable row level security;
alter table stock_movements enable row level security;

revoke all on function register_store_sale(jsonb, text, text, text, integer, text, timestamptz) from public;
revoke all on function void_store_sale(uuid) from public;
grant execute on function register_store_sale(jsonb, text, text, text, integer, text, timestamptz) to service_role;
grant execute on function void_store_sale(uuid) to service_role;

-- ─── COMPROBACIÓN ─────────────────────────────────────────────────────────────
-- select p.name, v.name, v.stock_quantity
--   from product_variants v join products p on p.id = v.product_id
--  order by p.name;
