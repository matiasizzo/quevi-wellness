-- ═══════════════════════════════════════════════════════════════════════════
-- CAMBIOS DE TIENDA — cierre de la promo de verano 2026
--
-- Ejecutar en el SQL Editor de Supabase, por pasos y en este orden. Cada paso
-- lleva primero un SELECT para ver sobre qué filas va a actuar: mira el
-- resultado antes de lanzar el UPDATE de debajo.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1 · PRODUCTOS SIN STOCK
--     D-Hydrapeptide, D-Evenglow, D-Senolytic y D-Rescue pasan a 0 unidades.
--     Con el cambio de código que acompaña a esta query, salen como "Agotado"
--     y no se pueden añadir al carrito. Siguen visibles en la tienda: cuando
--     repongáis, basta con volver a subir el stock desde el panel.
-- ───────────────────────────────────────────────────────────────────────────

-- 1.a · Mira primero qué filas coinciden
select p.name, p.slug, v.name as variante, v.stock_quantity
  from product_variants v
  join products p on p.id = v.product_id
 where p.name ilike '%hydrapeptide%'
    or p.name ilike '%evenglow%'
    or p.name ilike '%senolytic%'
    or p.name ilike '%rescue%'
 order by p.name;

-- 1.b · Si la lista es la correcta, aplica el cambio
update product_variants v
   set stock_quantity = 0
  from products p
 where v.product_id = p.id
   and (p.name ilike '%hydrapeptide%'
     or p.name ilike '%evenglow%'
     or p.name ilike '%senolytic%'
     or p.name ilike '%rescue%');


-- ───────────────────────────────────────────────────────────────────────────
-- 2 · CERRAR LA PROMO DE VERANO
--     El precio de D-Relax Legs en la web ya es 132 €: los 99 € salían del
--     cupón VERANOQUEVI, que descontaba un 25 % al pagar. Mientras el cupón
--     siga activo, cualquiera que lo conozca puede seguir pagando 99 €.
-- ───────────────────────────────────────────────────────────────────────────

-- 2.a · Ver el estado del cupón y cuántas veces se usó
select code, discount_percent, scope, applies_to_slugs, uses, active
  from discount_codes
 where code = 'VERANOQUEVI';

-- 2.b · Desactivarlo (no se borra: queda el histórico de usos)
update discount_codes
   set active = false
 where code = 'VERANOQUEVI';


-- ───────────────────────────────────────────────────────────────────────────
-- 3 · OPCIONAL · PRODUCTO D-ACTIVE RELIEF CREAM-OIL
--     Los rituales D-Active Relief y D-Bio Lumina ya están descatalogados por
--     código. Si además quieres retirar de la tienda el producto de home care
--     "D-Active Relief Cream-Oil", ejecuta esto. Si el producto se sigue
--     vendiendo suelto, NO lo ejecutes.
-- ───────────────────────────────────────────────────────────────────────────

-- 3.a · Ver el producto
-- select id, name, slug, active from products where slug = 'd-active-relief';

-- 3.b · Retirarlo de la tienda sin borrarlo (reversible con active = true)
-- update products set active = false where slug = 'd-active-relief';


-- ───────────────────────────────────────────────────────────────────────────
-- COMPROBACIÓN FINAL
-- ───────────────────────────────────────────────────────────────────────────
-- select p.name, p.slug, p.active, v.stock_quantity
--   from products p
--   left join product_variants v on v.product_id = p.id and v.is_default
--  order by p.name;
