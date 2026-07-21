-- ═══════════════════════════════════════════════════════════════════════════
-- FICHAS OFICIALES DE PRODUCTO DALL'O (listado_productos.docx — Julio 2026)
-- Textos legales transcritos tal cual del documento del cliente
-- (bromatología / colegio de médicos). Afecta a las tiendas QUEVI y Dall'O.
--
-- Ejecutar completo en el SQL Editor de Supabase.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Columna nueva para Precauciones / Contraindicaciones (solo añade, no rompe nada)
alter table products add column if not exists precautions text;

-- ─── ACTUALIZACIONES DE PRODUCTOS EXISTENTES ────────────────────────────────

-- D-AOX Oil · 20 ml
update products set
  tagline = 'Protección · Regeneración · Longevidad',
  description = 'Es un blend de activos con acción de protección: NAD + Vitamina E - Freno total al envejecimiento ambiental, regeneración: Rosa Mosqueta, la energía: Coenzima Q10 - Rostro descansado y vitalizado y longevidad: Resveratrol. Estos activos auxilia en la producción de caramidas y del factor hidratante natural (NMF), ayuda a restaurar la barrera cutánea. Indicaciones: Auxilia en la recuperación de la de barrera cutánea, ayuda a reducir inflamación y estrés oxidativo, incluso en pieles atópicas o trás procedimientos dermatológicos.',
  ingredients = 'Tocopheryl Acetate, Ethylhexyl Stearate, Oryza Sativa Bran Oil, Rosa Canina Fruit Oil, Olea Europaea Fruit Oil, Nicotinamide Adenine Dinucleotide, Resveratrol, Vitis Vinifera Seed Extract, Squalane, Oryzanol, Ubiquinone, Citrus Reticulata Fruit Extract, Parfum.',
  usage_instructions = 'Uso exclusivo por la noche, aplicar 4-8 gotas, si podemos asociar con Retinol en la misma rutina nocturna.',
  dosage = '4-8 gotas',
  frequency = 'Noche',
  storage = 'Esta fórmula ha sido elaborada bajo pedido para garantizar la máxima calidad y eficacia de sus componentes. El periodo de consumo preferente es de 3 meses después de su apertura. Conservar en un lugar fresco, seco y protegido de la luz directa del sol.',
  shelf_life_months = 3,
  volume_ml = 20,
  precautions = 'Uso externo exclusivamente. Evitar el contacto directo con ojos y mucosas. En caso de contacto, aclarar con abundante agua. Si aparece irritación, suspender su uso y consultar a un especialista. Mantener fuera del alcance de los niños.',
  updated_at = now()
where slug = 'd-aox-oil';

-- D-EVENGLOW Serum · 20 ml
update products set
  tagline = 'Iluminación y Bio-Regeneración',
  description = 'Sérum facial que ayuda a difuminar manchas rebeldes, protege del daño solar y devuelve la luminosidad perdida. Su fórmula combina el poder regenerador del PDRN y la acción iluminadora del Glutatión con Vitamina C, Niacinamida, Ácido Tranexámico e Hialurónico. Auxilia en la uniformidad de la piel. Indicaciones: Ideal para todo tipo de pieles, especialmente aquellas con manchas (hiperpigmentación), foto-envejecidas o en recuperación post-procedimientos dermatológicos. En pieles sensibles o bajo tratamiento médico, seguir la orientación de su especialista.',
  ingredients = 'Aqua, Glycerin, Polysorbate 20, Tranexamic Acid, Sodium Hyaluronate, DNA (PDRN), Glutathione, Ascorbic Acid, Citrus Reticulata Fruit Extract, Hydroxyethylcellulose, Phenoxyethanol, Methylparaben, Ethylparaben, Propylparaben, Butylparaben, Butylated Hydroxytoluene (BHT), Parfum.',
  usage_instructions = 'Restricciones: NO combinar con Retinol en la misma rutina nocturna. Consejos para obtener resultados óptimos, siga el protocolo de aplicación: Cuándo: Uso exclusivo por la noche. Dosificación: Aplicar 4-8 gotas. Zona: Rostro, cuello y escote y dorsos de la manos. Técnica: Realizar un suave masaje ascendente hasta su total absorción.',
  dosage = '4-8 gotas',
  frequency = 'Noche',
  storage = 'Debido a la pureza de sus activos (especialmente la Vitamina C), mantener en un lugar fresco, seco y estrictamente protegido de la luz directa. Utilizar preferentemente dentro de los 3 meses posteriores a su apertura para garantizar la máxima eficacia de la fórmula.',
  shelf_life_months = 3,
  volume_ml = 20,
  precautions = 'Uso externo. Evitar contacto directo con ojos. En caso de irritación, suspender uso. Mantener en lugar fresco y oscuro.',
  skin_type = '{"todo tipo","manchas","fotoenvejecimiento","post-procedimiento"}',
  updated_at = now()
where slug = 'd-evenglow-serum';

-- D-LONGEVITY Mousse · 150 ml
update products set
  tagline = 'Pureza Ozonizada & Renovación',
  description = 'Este mousse limpia a profundidad y protege la barrera cutánea, formulado con aceites vegetales ozonizados, rosa mosqueta, ácidos glicólicos y láctico, además de vitaminas B5 y B12, brindando al rostro un cuidado completo y delicado. Indicaciones: Indicado para todo tipo de pieles, incluso pieles sensibles.',
  ingredients = 'Aqua, Ozonized Olive Oil, Sodium Laureth Sulfate, Acrylates Copolymer, Sodium Chloride, Glycolic Acid, Lactic Acid, Tocofpheryl acetado, limone, Vitamin B12, Depantenol, rosehip oil, Coca midopropyl Betaine, Socum Bezat, Potassium Sorbate, Glycal Distearate Parfum, Cocamide MEA, Tetasodium EDTA, parfum.',
  usage_instructions = 'Por la mañana y noche, haga espuma y masajear sobre el rostro y el cuello humedecidos y dejar actuar durante uno o dos minutos, enjuagar bien con agua tibia.',
  dosage = 'Media cucharadita',
  frequency = 'Mañana y noche',
  storage = 'Fórmula elaborada bajo pedido para garantizar calidad y eficacia. Tras su apertura, se recomienda usar en un máximo de 5 meses debido a la baja estabilidad de los activos. Para conservar el producto en óptimas condiciones, guárdalo en un lugar fresco, seco y protegido de la luz directa.',
  shelf_life_months = 5,
  volume_ml = 150,
  precautions = 'Uso externo exclusivamente. Evitar el contacto directo con ojos y mucosas. En caso de contacto, aclarar con abundante agua. Si aparece irritación, suspender su uso y consultar a un especialista. Mantener fuera del alcance de los niños.',
  skin_type = '{"todo tipo","sensibles"}',
  updated_at = now()
where slug = 'd-longevity-mousse';

-- D-PURIFYING Mousse · 150 ml
update products set
  tagline = 'Equilibrio de la Microbiota & Control Pureza',
  description = 'Es una mousse limpiadora diseñada para eliminar impurezas mientras protege la microbiota de la piel. Ofrece una agradable sensación de frescor y suavidad. Su fórmula avanzada combina aceites vegetales ozonizados y aceite de geranio (no comedogénicos), potenciados con ácido salicílico y vitamina B3 (niacinamida). Indicaciones: Apta para todo tipo de pieles, especialmente indicada para pieles grasas o con tendencia a la acumulación de lípidos.',
  ingredients = 'Aqua, Ozonized Olea Europaea (Olive) Oil, Pelargonium Graveolens Oil, Sodium Laureth Sulfate, Acrylates Copolymer, Sodium Chloride, Lactic Acid, Niacinamide (Vitamin B3), Cocamidopropyl Betaine, Sodium Benzoate, Potassium Sorbate, Glycol Distearate, Cocamide MEA, Tetrasodium EDTA, Parfum (Fragrance).',
  usage_instructions = 'Por la mañana y noche, haga espuma y masajear sobre el rostro y el cuello humedecidos y dejar actuar durante uno o dos minutos, enjuagar bien con agua tibia.',
  dosage = 'Media cucharadita',
  frequency = 'Mañana y noche',
  storage = 'Fórmula elaborada bajo pedido para garantizar calidad y eficacia. Tras su apertura, se recomienda usar en un máximo de 5 meses debido a la baja estabilidad de los activos. Para conservar el producto en óptimas condiciones, guárdalo en un lugar fresco, seco y protegido de la luz directa.',
  shelf_life_months = 5,
  volume_ml = 150,
  precautions = 'Uso externo exclusivamente. Evitar el contacto directo con ojos y mucosas. En caso de contacto, aclarar con abundante agua. Si aparece irritación, suspender su uso y consultar a un especialista. Mantener fuera del alcance de los niños.',
  skin_type = '{"grasa","mixta","acné"}',
  updated_at = now()
where slug = 'd-purifying-mousse';

-- D-Purifying Serum · 20 ml
-- (En el documento esta ficha aparece con cabecera "D-RESCUE Serum" por error,
--  pero el contenido — niacinamida, salicílico, geranio, piel mixta/grasa/acneica —
--  corresponde al D-Purifying Serum. Confirmar con el cliente.)
update products set
  description = 'Es un sérum Facial alta precisión diseñado no auxilio de control de la micro-inflamación y en la arquitectura de los poros gracias Palmitoyl Tripeptide-8, Niacinamida, el poder exfoliante del Ácido Salicílico y Ácido Hialurónico y al Aceite de Geranio mantiene la hidratación óptima. Una sensación de frescor inmediato sin dejar residuo graso. Indicaciones: Piel mixta a grasa y con tendencia acneica.',
  ingredients = 'Aqua, Niacinamide, Sodium Hyaluronate, Salicylic Acid, Palmitoyl Tripeptide-8, Leuconostoc/Radish Root Ferment Filtrate, Pelargonium Graveolens Flower Oil, Citrus Limon Peel Oil, Citrus Paradisi Peel Oil, Cymbopogon Citratus Leaf Oil, Parfum.',
  usage_instructions = 'Restricciones: NO combinar con Retinol en la misma rutina nocturna. Consejos para obtener resultados óptimos, siga el protocolo de aplicación: Cuándo: Uso exclusivo por la noche. Dosificación: Aplicar 4-8 gotas. Zona: Rostro, cuello y escote y dorsos de la manos. Técnica: Realizar un suave masaje ascendente hasta su total absorción.',
  dosage = '4-8 gotas',
  frequency = 'Noche',
  storage = 'Debido a la pureza de sus activos, mantener en un lugar fresco, seco y estrictamente protegido de la luz directa. Utilizar preferentemente dentro de los 3 meses posteriores a su apertura para garantizar la máxima eficacia de la fórmula.',
  shelf_life_months = 3,
  volume_ml = 20,
  precautions = 'Uso externo. Evitar contacto directo con ojos. En caso de irritación, suspender uso. Mantener en lugar fresco y oscuro.',
  skin_type = '{"grasa","mixta","acné"}',
  updated_at = now()
where slug = 'd-purifying-serum';

-- D-RESCUE Serum · 20 ml
update products set
  tagline = 'DNA Repair System · PDRN + SOD + Q10 + Açaí',
  description = 'Es un serum de alta precisión diseñado para auxiliar en la salud dérmica, cuando la piel pierde su capacidad de defensa tras el estrés diario o procedimientos clínicos, este serum actúa como un aliado de regeneración avanzada de microbiota y longevidad cutánea. EL PDRN (polinucleótidos) y la potencia enzimática de la SOD (Superóxido Dismutase), el suero instruye a la piel para repararse a sí misma, devolviendo la firmeza y vitalidad perdidas. La fórmula se ha optimizado integrando el Aceite de Açaí, una joya botánica rica en antocianinas y polifenoles, que crea una sinergia antioxidante y antiinflamatoria superior junto a la Coenzima Q10 y la Vitamina E. Indicaciones: Ideal para todo tipo de pieles, especialmente foto-envejecidas o en recuperación post-procedimientos dermatológicos. En pieles sensibles o bajo tratamiento médico, seguir la orientación de su especialista.',
  ingredients = 'Aloe Barbadensis Leaf Juice, Aqua, Glycerin, Sodium Hyaluronate (Liposomated), DNA (PDRN), Ubiquinone (Coenzyme Q10 Liposomated), Tocopheryl Acetate, Superoxide Dismutase, Propanediol, Prunus Armeniaca Fruit Extract, Euterpe Oleracea Fruit Oil, Benzyl Alcohol, Dehydroacetic Acid, Citric Acid.',
  usage_instructions = 'Restricciones: NO combinar con Retinol en la misma rutina nocturna. Consejos para obtener resultados óptimos, siga el protocolo de aplicación: Cuándo: Uso día y noche. Dosificación: Aplicar 4-8 gotas. Zona: Rostro, cuello y escote y dorsos de la manos. Técnica: Realizar un suave masaje ascendente hasta su total absorción.',
  dosage = '4-8 gotas',
  frequency = 'Día y noche',
  storage = 'Debido a la pureza de sus activos, mantener en un lugar fresco, seco y estrictamente protegido de la luz directa. Utilizar preferentemente dentro de los 3 meses posteriores a su apertura para garantizar la máxima eficacia de la fórmula.',
  shelf_life_months = 3,
  volume_ml = 20,
  precautions = 'Uso externo. Evitar contacto directo con ojos. En caso de irritación, suspender uso. Mantener en lugar fresco y oscuro.',
  skin_type = '{"todo tipo","post-procedimiento","fotoenvejecimiento"}',
  updated_at = now()
where slug = 'd-rescue-serum';

-- D-Senolytic Sérum · 20 ml
update products set
  tagline = 'Advanced Cellular Recovery',
  description = 'D-Senolytic serum auxilia en combate de la senescencia celular. Su fórmula sinérgica del NAD+ Péptidos GHK-Cu e Ácido Hialurónico actúa como un arquitecto dérmico, restaurando la densidad y protegiendo la integridad de la barrera cutánea. Piel visiblemente más firme, elástica y revitalizada. Indicaciones: Ideal para todo tipo de pieles, especialmente foto-envejecidas o en recuperación post-procedimientos dermatológicos. En pieles sensibles o bajo tratamiento médico, seguir la orientación de su especialista.',
  ingredients = 'Aqua, Sodium Hyaluronate, Copper Tripeptide-1 GHK-Cu, Polydeoxyribonucleotide, mononucleótido de nicotinamida / β-NMN, Ethylhexyl Stearate, Squalane, Glycerin, Citrus Reticulata Peel Oil, Leuconostoc/Radish Root Ferment Filtrate, Parfum, Limonene, Linalool. Componentes naturales presentes en el aceite esencial de mandarina y el perfume.',
  usage_instructions = 'Restricciones: NO combinar con Retinol en la misma rutina nocturna. Consejos para obtener resultados óptimos, siga el protocolo de aplicación: Cuándo: Uso día y noche. Dosificación: Aplicar 4-8 gotas. Zona: Rostro, cuello y escote y dorsos de la manos. Técnica: Realizar un suave masaje ascendente hasta su total absorción.',
  dosage = '4-8 gotas',
  frequency = 'Día y noche',
  storage = 'Debido a la pureza de sus activos, mantener en un lugar fresco, seco y estrictamente protegido de la luz directa. Utilizar preferentemente dentro de los 3 meses posteriores a su apertura para garantizar la máxima eficacia de la fórmula.',
  shelf_life_months = 3,
  volume_ml = 20,
  precautions = 'Uso externo. Evitar contacto directo con ojos. En caso de irritación, suspender uso. Mantener en lugar fresco y oscuro.',
  skin_type = '{"todo tipo","envejecimiento","post-procedimiento"}',
  updated_at = now()
where slug = 'd-senolytic-serum';

-- ─── PRODUCTOS NUEVOS ───────────────────────────────────────────────────────
-- Precios pendientes (price_cents = 0 → la web muestra "Consultar precio").
-- Ajustar precio y stock desde el panel /admin o con updates posteriores.

-- D-Active Relief · Cream-Oil Face & Body · 150 ml
insert into products
  (name, slug, tagline, description, ingredients, usage_instructions, dosage, storage, shelf_life_months, volume_ml, skin_type, available_on, precautions, category_id)
select
  'D-Active Relief',
  'd-active-relief',
  'Cream-Oil · Face & Body · Auxilia en las tensiones musculares',
  'Es una crema-aceite diseñada para auxiliar en el tratamiento de tensiones musculares y contracturas. Combina fitoterapia con aceites esenciales de grado clínico como: Arnica Montana Flower Extract, Hypericum Perforatum Extract, Gaultheria Procumbens, Eucalyptus Citriodora Oil, Mentha Piperita Oil. La sinergia de los activos proporciona un efecto analgésico, antiinflamatorio y regenerador.',
  'Aqua, Prunus Amygdalus Dulcis Oil, Arnica Montana Flower Extract, Hypericum Perforatum Extract, Glyceryl Stearate, Gaultheria Procumbens Leaf Oil, Eucalyptus Citriodora Oil, Mentha Piperita Oil, Rosmarinus Officinalis Leaf Oil, Tocopherol.',
  'Activar 10 ml en las palmas durante 10 seg. hasta obtener una textura sedosa. Effleurage: Pases largos para inducir hiperemia. Liberación: Presión profunda con nudillos/antebrazo. Puntos Gatillo: Presión estática (30-45 seg) durante la exhalación del paciente. No retirar el producto para permitir el efecto "parche térmico" natural.',
  '10 ml',
  'Lugar fresco y seco, protegido de la luz.',
  6, 150,
  '{"corporal","tensiones musculares"}',
  '{"both"}',
  'Contraindicaciones: NO usar en personas alérgicas a los salicilatos (aspirina) o bajo tratamiento anticoagulante. Uso externo. Evitar contacto con ojos y mucosas. Realizar prueba de parche previa. Evitar exposición solar inmediata en la zona tratada.',
  (select id from categories where slug = 'aceites')
where not exists (select 1 from products where slug = 'd-active-relief');

insert into product_variants (product_id, name, price_cents, is_default, stock_quantity)
select p.id, '150ml', 0, true, 0 from products p
where p.slug = 'd-active-relief'
  and not exists (select 1 from product_variants v where v.product_id = p.id);

-- D-Zen Harmony Oil · Face / Body · 150 ml
insert into products
  (name, slug, tagline, description, ingredients, usage_instructions, storage, shelf_life_months, volume_ml, skin_type, available_on, precautions, category_id)
select
  'D-Zen Harmony Oil',
  'd-zen-harmony-oil',
  'El ritual del silencio · Face & Body',
  'Hemos destilado la serenidad en una fórmula personalizada y precisa. Es un aceite exclusivamente para el masaje corporal, al contacto con tu piel, la sinergia de lavanda, bergamota, ylang-ylang e incienso no solo relaja los músculos; calma el diálogo interno, permitiendo que tu cuerpo y mente se sincronicen de nuevo. Testado por fisioterapeutas | Libre de parabenos | No testeado en animales.',
  'Prunus Amygdalus Dulcis Oil (Almendras Dulces), Simmondsia Chinensis Seed Oil (Jojoba), Lavandula Angustifolia Oil (Lavanda), Citrus Aurantium Bergamia Peel Oil (Bergamota FCF), Cananga Odorata Flower Oil (Ylang-Ylang), Boswellia Carterii Oil (Incienso).',
  'Calentar una pequeña cantidad de producto en las palmas de las manos antes de aplicar sobre la piel con maniobras de masaje siguiendo el protocolo estándar de Dall''O Skin. Su formulación de rápida penetración permite un deslizamiento óptimo sin dejar residuo graso excesivo, dejando la piel nutrida y sedosa.',
  'Mantener en lugar fresco, seco y protegido de la luz solar. Consumir preferentemente en un plazo máximo de 5 meses tras su apertura para garantizar la estabilidad de la formula.',
  5, 150,
  '{"corporal","relajación"}',
  '{"both"}',
  'Uso externo. Evitar contacto con ojos y mucosas. Realizar prueba de parche 15 min antes de su uso. En caso de irritación, suspenda su uso y consulte a su médico.',
  (select id from categories where slug = 'aceites')
where not exists (select 1 from products where slug = 'd-zen-harmony-oil');

insert into product_variants (product_id, name, price_cents, is_default, stock_quantity)
select p.id, '150ml', 0, true, 0 from products p
where p.slug = 'd-zen-harmony-oil'
  and not exists (select 1 from product_variants v where v.product_id = p.id);

-- D-Hydrapeptide · Hydration Oil-in-Mist · 150 ml
insert into products
  (name, slug, tagline, description, ingredients, usage_instructions, frequency, storage, shelf_life_months, volume_ml, skin_type, available_on, precautions, category_id)
select
  'D-Hydrapeptide',
  'd-hydrapeptide',
  'Hydration Oil-in-Mist',
  'Bruma facial bifásica de última generación que fusiona dos fases en un solo gesto. Su fase acuosa aporta una hidratación profunda gracias al Ácido Hialurónico, el Pantenol (B5) y el Agua de Rosas, potenciados con Péptidos con efecto tensor y reafirmante. Su fase oleosa ultraligera con Aceite de Jojoba sella la humedad y nutre intensamente la piel sin dejar sensación grasa. El resultado es un rostro fresco, firme y con un brillo natural radiante a cualquier hora del día. Indicaciones: Pieles deshidratadas, opacas o con falta de firmeza. Ideal para rostros expuestos a ambientes secos (aire acondicionado/calefacción) que buscan un efecto tensor inmediato, hidratación profunda y un brillo natural (glow) a lo largo del día.',
  'Aqua, Rosa Damascena Flower Water, Simmondsia Chinensis Seed Oil, Glycerin, Sodium Hyaluronate, Palmitoyl Tripeptide-8, Panthenol, Niacinamide, Benzyl Alcohol, Dehydroacetic Acid, Tocopherol.',
  '¡Agita, pulveriza y brilla! Agita bien el envase para fusionar ambas fases. Cierra los ojos y rocía sobre el rostro a unos 20 cm de distancia. Úsalo mañana y noche sobre la piel limpia, o llévalo contigo para refrescar, iluminar y rehidratar tu rostro en cualquier momento del día (¡incluso sobre el maquillaje!).',
  'Mañana y noche',
  'Mantener en su envase original, en un lugar fresco y seco, alejado de fuentes directas de luz y calor para garantizar la máxima efectividad de sus activos. Consumir preferentemente antes de los 6 meses tras su apertura para mantener la pureza de activos.',
  6, 150,
  '{"deshidratadas","todo tipo"}',
  '{"both"}',
  'Solo para uso externo. Evitar el contacto con los ojos. No aplicar sobre piel irritada. Suspender su uso si presenta irritación. Mantener fuera del alcance de los niños.',
  (select id from categories where slug = 'serums')
where not exists (select 1 from products where slug = 'd-hydrapeptide');

insert into product_variants (product_id, name, price_cents, is_default, stock_quantity)
select p.id, '150ml', 0, true, 0 from products p
where p.slug = 'd-hydrapeptide'
  and not exists (select 1 from product_variants v where v.product_id = p.id);

-- Verificación rápida
select slug, name, volume_ml, shelf_life_months,
       left(coalesce(precautions, ''), 40) as precauciones,
       (select count(*) from product_variants v where v.product_id = p.id) as variantes
from products p
order by name;
