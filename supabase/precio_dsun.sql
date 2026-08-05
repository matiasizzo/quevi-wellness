-- ═══════════════════════════════════════════════════════════════════════════
-- PRECIO CONFIRMADO: DSun Defence
-- Ejecutar en el SQL Editor de Supabase.
-- ═══════════════════════════════════════════════════════════════════════════

update product_variants v
set price_cents = 3726, stock_quantity = 100, active = true
from products p
where p.id = v.product_id and p.slug = 'dsun-defence';

-- Asegurar que el producto está publicado
update products set active = true, updated_at = now() where slug = 'dsun-defence';

-- Verificación
select p.name, p.slug, p.active,
       to_char(v.price_cents / 100.0, 'FM999990.00') || ' €' as precio,
       v.stock_quantity as stock
from products p join product_variants v on v.product_id = p.id
where p.slug = 'dsun-defence';
