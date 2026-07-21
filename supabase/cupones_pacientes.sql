-- ═══════════════════════════════════════════════════════════════════════════
-- CUPONES PARA PACIENTES (gancho del Dr. — 10% y 20%)
-- Ejecutar en el SQL Editor de Supabase.
-- Uso ilimitado y sin caducidad. Para limitar, ajustar max_uses / active.
-- ═══════════════════════════════════════════════════════════════════════════

insert into discount_codes (code, discount_percent, max_uses, uses, active)
values
  ('QUEVI10', 10, null, 0, true),
  ('QUEVI20', 20, null, 0, true)
on conflict (code) do update
  set discount_percent = excluded.discount_percent,
      active           = true;

-- Verificación
select code, discount_percent, max_uses, uses, active
from discount_codes
where code in ('QUEVI10', 'QUEVI20');
