-- ═══════════════════════════════════════════════════════════════════════════
-- CATÁLOGO: DSun Defence (nuevo) y D-Omeg3 PURE (ficha completa)
-- Textos oficiales transcritos de los documentos del cliente.
-- Ejecutar en el SQL Editor de Supabase. Afecta a las tiendas QUEVI y Dall'O.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Columna para la información nutricional (obligatoria en complementos alimenticios)
alter table products add column if not exists nutrition_facts text;

-- ─── DSun Defence · 30 cápsulas de 695 mg (PRODUCTO NUEVO) ─────────────────
insert into products
  (name, slug, tagline, description, ingredients, nutrition_facts,
   usage_instructions, dosage, frequency, storage, precautions, available_on, category_id)
select
  'DSun Defence',
  'dsun-defence',
  'Tu aliado nutricional frente al sol',
  'DSun es un complemento alimenticio premium en cápsulas que contribuye a protección de las células frente al daño oxidativo, con el Cobre, Licopeno, Beta Caroteno y Polypodium Leucotomos. 30 cápsulas de 695 mg. Peso neto 20,80 g. Nota importante: Este producto no sustituye el uso de tu protector solar tópico obligatorio. Su función es potenciar y complementar tu cuidado habitual. Sin gluten y sin lactosa.',
  'POLYPODIUM (POLYPODIUM LEUCOTOMOS POIR. HOJAS, MALTODEXTRINA) E.S. 1-4, CÁPSULA: GELATINA ANIMAL, E170; AGENTE DE CARGA: FOSFATO DICÁLCICO; LICOPENO TIT. 5% (ALMIDÓN DE ARROZ), BETA CAROTENO TIT. 10%, VITAMINA E (DL-ALFA-TOCOFERIL ACETATO), ESTABILIZANTE: POLIVINILPIRROLIDONA; COBRE GLUCONATO, AGENTES ANTIAGLOMERANTES: SALES DE MAGNESIO DE ÁCIDOS GRASOS, DIÓXIDO DE SILICIO. SIN GLUTEN Y SIN LACTOSA.',
  'Polypodium leucotomos (hojas de polypodium E.S.) … 250 mg · Vitamina E (DL-alfa-tocoferil acetato) … 20 mg (166% VRN*) · Betacaroteno … 7 mg · Licopeno … 4 mg · Cobre … 1,5 mg (150% VRN*). *VRN: Valores de Referencia de Nutrientes.',
  'Mayores de 12 años: 1 cápsula al día fuera de las comidas, comenzando 30 días antes de la exposición solar. Seguir la misma dosis durante la exposición solar. No exceder las dosis recomendadas. No está indicado para gestantes ni en periodo de lactancia sin recomendación médica.',
  '1 cápsula al día',
  'Diaria, fuera de las comidas',
  'Mantener en lugar fresco y seco, alejado de fuentes de calor. La fecha de caducidad se refiere al producto correctamente conservado en su envase sin abrir.',
  'Los complementos alimenticios no deben considerarse como sustituto de una dieta variada y equilibrada y un estilo de vida saludable. No está indicado para mujeres embarazadas ni en período de lactancia sin recomendación médica. Mantener fuera del alcance de los niños. Alérgenos: no contiene gluten ni lactosa.',
  '{"both"}',
  (select id from categories where slug in ('nutri','suplementos') order by slug limit 1)
where not exists (select 1 from products where slug = 'dsun-defence');

-- Variante: precio pendiente de confirmar por el cliente (0 = "Consultar precio")
insert into product_variants (product_id, name, price_cents, is_default, stock_quantity, active)
select p.id, '30 cápsulas', 0, true, 0, true from products p
where p.slug = 'dsun-defence'
  and not exists (select 1 from product_variants v where v.product_id = p.id);

-- ─── D-Omeg3 PURE · 80 cápsulas blandas (YA EXISTÍA: se completa la ficha) ──
update products set
  name = 'D-Omeg3 PURE',
  tagline = 'EPA 400 mg + DHA 300 mg · Certificación IFOS 5 estrellas',
  description = 'Es un complemento alimenticio que auxilia en tu salud cardiovascular, cerebral y visual con nuestro Omega-3 de alta concentración. Formulado con niveles superiores de EPA y DHA, este suplemento te ayuda a controlar la presión arterial y los triglicéridos. Cuenta con la prestigiosa certificación de 5 estrellas IFOS (Canadá), que garantiza la máxima pureza, un grado mínimo de oxidación y una excelente digestibilidad en cómodas cápsulas blandas. 80 cápsulas blandas de 1,41 g / 122,80 g.',
  ingredients = 'ACEITE DE PESCADO, ENVOLTURA: GELATINA BOVINA, AGENTE REAFIRMANTE: GLICEROL (E422). SIN GLUTEN NI LACTOSA.',
  nutrition_facts = 'Dosis máxima diaria (5 cápsulas blandas): Aceite de pescado 5 g, de los cuales EPA 2 g y DHA 1,5 g. Aceite desodorizado: minimiza el retrogusto.',
  usage_instructions = '1 cápsula blanda al día: EPA + DHA auxilia en una mejor función cardíaca; el DHA auxilia la función normal del cerebro y la visión en dosis de 250 mg de EPA + DHA. 3 cápsulas blandas al día (1,2 g de EPA + 900 mg de DHA): auxilia en una mejor función cardíaca y en mantener niveles normales de triglicéridos en sangre. 5 cápsulas blandas al día (2 g de EPA y 1,5 g de DHA): contribuye al mantenimiento de una presión arterial saludable, en combinación con una dieta equilibrada y actividad física regular.',
  dosage = '1 a 5 cápsulas blandas al día según el objetivo',
  frequency = 'Diaria',
  storage = 'Mantener en lugar fresco y seco, alejado de fuentes de calor. La fecha de caducidad se refiere al producto correctamente conservado en su envase sin abrir.',
  precautions = 'Los complementos alimenticios no deben utilizarse como sustitutos de una dieta variada y un estilo de vida saludable. Este producto no sustituye a ningún tratamiento farmacológico. Consulte a su médico o profesional de la salud antes de consumirlo. No superar la dosis diaria expresamente recomendada. Mantener fuera del alcance de los niños.',
  updated_at = now()
where slug = 'd-omega-3';

-- ─── Verificación ──────────────────────────────────────────────────────────
select p.name, p.slug, p.active,
       to_char(v.price_cents / 100.0, 'FM999990.00') || ' €' as precio,
       v.stock_quantity as stock,
       left(coalesce(p.nutrition_facts,''), 30) as nutricional
from products p
left join product_variants v on v.product_id = p.id
where p.slug in ('dsun-defence', 'd-omega-3');

-- ─── PENDIENTE DE DECISIÓN DEL CLIENTE ─────────────────────────────────────
-- 1) DSun Defence no tiene precio ni stock. Para activarlo cuando lo confirme:
--    update product_variants v set price_cents = XXXX, stock_quantity = 100
--    from products p where p.id = v.product_id and p.slug = 'dsun-defence';
--
-- 2) D-Omeg3 PURE está INACTIVO (no se muestra en ninguna tienda). Para publicarlo:
--    update products set active = true where slug = 'd-omega-3';
