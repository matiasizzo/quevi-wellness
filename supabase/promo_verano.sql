-- ═══════════════════════════════════════════════════════════════════════════
-- PROMO VERANO 2026 — 25 % en los rituales D-Relax Legs y D-Bio Lumina
-- (tarifa 132 € → 99 € con el código)
-- Ejecutar en el SQL Editor de Supabase.
--
-- El cupón NO baja el precio en la base de datos: se aplica solo al pagar,
-- únicamente sobre esos dos rituales. Así el precio de referencia (100 €) sigue
-- visible y la promo se puede cerrar en cualquier momento con un solo update.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Columna que restringe un cupón a ítems concretos (por slug)
alter table discount_codes add column if not exists applies_to_slugs text[];

-- 2. Cupón de verano
insert into discount_codes (code, discount_percent, max_uses, uses, active, scope, applies_to_slugs)
values
  ('VERANOQUEVI', 25, null, 0, true, 'all', '{"relax-piernas","bio-lumina"}')
on conflict (code) do update
  set discount_percent = excluded.discount_percent,
      scope            = 'all',
      applies_to_slugs = excluded.applies_to_slugs,
      active           = true;

-- Verificación
select code, discount_percent, scope, applies_to_slugs, uses, active
from discount_codes
order by code;

-- ── Para CERRAR la promo cuando acabe el verano ─────────────────────────────
-- update discount_codes set active = false where code = 'VERANOQUEVI';

-- ── Para ver cuántas veces se ha usado ──────────────────────────────────────
-- select code, uses from discount_codes where code = 'VERANOQUEVI';
