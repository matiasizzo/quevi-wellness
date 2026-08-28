-- ─────────────────────────────────────────────────────────────────────────────
-- QUEVI — DESCUENTO DE STOCK EN LAS COMPRAS ONLINE
-- Requiere haber ejecutado antes supabase/ventas_tienda.sql (stock_movements).
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Marca de que a este pedido ya se le descontó el stock. Stripe reintenta los
-- eventos, así que esta columna es lo que evita descontar dos veces.
alter table orders add column if not exists stock_applied_at timestamptz;

-- Enlaza el movimiento con el pedido online que lo originó
alter table stock_movements add column if not exists order_id uuid references orders(id) on delete set null;

create index if not exists stock_movements_order_idx on stock_movements (order_id);

-- ─── APLICAR EL STOCK DE UN PEDIDO ONLINE ─────────────────────────────────────
-- Las líneas del pedido viven en orders.shipping_address->'items' y llevan el
-- slug del producto, que es único. De ahí sacamos la variante a descontar.
--
-- Las líneas que no correspondan a ningún producto (rituales, bonos, vales) se
-- ignoran: son servicios y no tienen stock.
--
-- El pago ya está cobrado cuando llega el webhook, así que aquí NO se rechaza
-- nada por falta de stock: se permite que quede en negativo. Un -2 en el admin
-- es justo la información que necesita el personal (deben 2 unidades).
create or replace function apply_online_sale_stock(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_rows        integer;
  v_items       jsonb;
  v_item        jsonb;
  v_slug        text;
  v_qty         integer;
  v_variant_id  uuid;
  v_stock       integer;
  v_applied     integer := 0;
  v_skipped     integer := 0;
  v_negative    integer := 0;
begin
  -- Reclamar el pedido: si otra ejecución ya lo hizo, esto actualiza 0 filas
  -- y salimos sin tocar el stock. Es la garantía contra reintentos de Stripe.
  update orders
     set stock_applied_at = now()
   where id = p_order_id
     and stock_applied_at is null;

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return jsonb_build_object('applied', false, 'reason', 'ya aplicado o pedido inexistente');
  end if;

  select shipping_address->'items' into v_items from orders where id = p_order_id;

  if v_items is null or jsonb_typeof(v_items) <> 'array' then
    return jsonb_build_object('applied', true, 'lines', 0, 'skipped', 0);
  end if;

  for v_item in select * from jsonb_array_elements(v_items) loop
    v_slug := nullif(trim(coalesce(v_item->>'slug', '')), '');
    v_qty  := coalesce((v_item->>'quantity')::integer, 0);

    if v_slug is null or v_qty <= 0 then
      v_skipped := v_skipped + 1;
      continue;
    end if;

    -- Variante por defecto del producto; si no hay, la primera activa
    select v.id, v.stock_quantity
      into v_variant_id, v_stock
      from product_variants v
      join products p on p.id = v.product_id
     where p.slug = v_slug
       and v.active
     order by v.is_default desc, v.created_at asc
     limit 1
     for update of v;

    if not found then
      -- Ritual, bono, vale regalo… no es un producto con stock
      v_skipped := v_skipped + 1;
      continue;
    end if;

    update product_variants
       set stock_quantity = stock_quantity - v_qty
     where id = v_variant_id;

    if v_stock - v_qty < 0 then
      v_negative := v_negative + 1;
    end if;

    insert into stock_movements (variant_id, delta, reason, order_id, note)
    values (
      v_variant_id,
      -v_qty,
      'online_sale',
      p_order_id,
      case when v_stock - v_qty < 0
        then 'Compra online — stock en negativo, faltan ' || (v_qty - v_stock) || ' uds.'
        else 'Compra online'
      end
    );

    v_applied := v_applied + 1;
  end loop;

  return jsonb_build_object(
    'applied',  true,
    'lines',    v_applied,
    'skipped',  v_skipped,
    'negative', v_negative
  );
end;
$fn$;

-- ─── DEVOLVER EL STOCK DE UN PEDIDO ONLINE ────────────────────────────────────
-- Para reembolsos o pedidos cancelados. De momento se llama a mano desde el
-- SQL Editor; no hay webhook de reembolso conectado.
create or replace function revert_online_sale_stock(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_mv      record;
  v_count   integer := 0;
begin
  for v_mv in
    select id, variant_id, delta
      from stock_movements
     where order_id = p_order_id
       and reason = 'online_sale'
  loop
    update product_variants
       set stock_quantity = stock_quantity - v_mv.delta   -- delta es negativo: lo suma de vuelta
     where id = v_mv.variant_id;

    insert into stock_movements (variant_id, delta, reason, order_id, note)
    values (v_mv.variant_id, -v_mv.delta, 'online_sale_void', p_order_id, 'Devolución de pedido online');

    v_count := v_count + 1;
  end loop;

  update orders set stock_applied_at = null where id = p_order_id;

  return jsonb_build_object('reverted', v_count);
end;
$fn$;

-- ─── PERMISOS ─────────────────────────────────────────────────────────────────
revoke all on function apply_online_sale_stock(uuid) from public;
revoke all on function revert_online_sale_stock(uuid) from public;
grant execute on function apply_online_sale_stock(uuid) to service_role;
grant execute on function revert_online_sale_stock(uuid) to service_role;

-- ─── COMPROBACIÓN ─────────────────────────────────────────────────────────────
-- Movimientos de stock más recientes, vengan de donde vengan:
-- select m.created_at, p.name, v.name as variante, m.delta, m.reason, m.note
--   from stock_movements m
--   left join product_variants v on v.id = m.variant_id
--   left join products p on p.id = v.product_id
--  order by m.created_at desc limit 50;
--
-- Devolver el stock de un pedido concreto:
-- select revert_online_sale_stock('<order_id>');
