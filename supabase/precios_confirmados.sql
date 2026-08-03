-- ═══════════════════════════════════════════════════════════════════════════
-- PRECIOS Y STOCK CONFIRMADOS POR EL CLIENTE
-- Hoja "QUEVI precios revisión" devuelta el 02/08/2026.
-- Ejecutar en el SQL Editor de Supabase.
--
-- Cambios respecto a la revisión anterior: los 3 productos nuevos pasan de
-- 0,00 € (no vendibles) a precio real y 50 unidades de stock.
-- El resto de la cosmética y los suplementos se confirman sin cambios.
-- ═══════════════════════════════════════════════════════════════════════════

-- D-Hydrapeptide · 150 ml → 32,40 €
update product_variants v set price_cents = 3240, stock_quantity = 50, active = true
from products p where p.id = v.product_id and p.slug = 'd-hydrapeptide';

-- D-Active Relief · 150 ml → 28,40 €
update product_variants v set price_cents = 2840, stock_quantity = 50, active = true
from products p where p.id = v.product_id and p.slug = 'd-active-relief';

-- D-Zen Harmony Oil · 150 ml → 28,40 €
update product_variants v set price_cents = 2840, stock_quantity = 50, active = true
from products p where p.id = v.product_id and p.slug = 'd-zen-harmony-oil';

-- ─── Verificación: no debe quedar ningún producto activo a 0 € ──────────────
select p.name, p.slug, v.name as formato,
       to_char(v.price_cents / 100.0, 'FM999990.00') || ' €' as precio,
       v.stock_quantity as stock,
       case when p.active and v.active then 'Sí' else 'No' end as activo
from products p
join product_variants v on v.product_id = p.id
where p.slug in ('d-hydrapeptide', 'd-active-relief', 'd-zen-harmony-oil',
                 'd-senolytic', 'd-aox-oil', 'd-evenglow-serum',
                 'd-longevity-mousse', 'd-purifying-mousse',
                 'd-purifying-serum', 'd-rescue-serum')
order by p.name;

-- ─── Pendiente de decisión del cliente ─────────────────────────────────────
-- D-Senolytic Sérum (150 €) sigue ACTIVO con stock 0 → aparece agotado.
-- Para reponer stock:
--   update product_variants v set stock_quantity = 50
--   from products p where p.id = v.product_id and p.slug = 'd-senolytic';
