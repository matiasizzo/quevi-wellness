-- ═══════════════════════════════════════════════════════════════════════════
-- CUPONES PARA PACIENTES (gancho del Dr.)
-- Ejecutar en el SQL Editor de Supabase.
--
-- Ámbito (scope) de cada cupón:
--   'all'      → descuento sobre TODA la web (productos + rituales)
--   'products' → descuento SOLO sobre productos de la tienda
--
-- QUEVI10 / QUEVI20  → toda la web
-- SELFCARE10 / SELFCARE20 → solo productos
-- Uso ilimitado y sin caducidad. Para limitar, ajustar max_uses / active.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Columna de ámbito (solo añade; los cupones existentes quedan como 'all')
alter table discount_codes add column if not exists scope text not null default 'all';

-- 2. Cupones de toda la web
insert into discount_codes (code, discount_percent, max_uses, uses, active, scope)
values
  ('QUEVI10', 10, null, 0, true, 'all'),
  ('QUEVI20', 20, null, 0, true, 'all')
on conflict (code) do update
  set discount_percent = excluded.discount_percent,
      scope            = 'all',
      active           = true;

-- 3. Cupones solo para productos
insert into discount_codes (code, discount_percent, max_uses, uses, active, scope)
values
  ('SELFCARE10', 10, null, 0, true, 'products'),
  ('SELFCARE20', 20, null, 0, true, 'products')
on conflict (code) do update
  set discount_percent = excluded.discount_percent,
      scope            = 'products',
      active           = true;

-- Verificación
select code, discount_percent, scope, max_uses, uses, active
from discount_codes
where code in ('QUEVI10', 'QUEVI20', 'SELFCARE10', 'SELFCARE20')
order by scope, code;
