// Cuestionarios de salud — versión en inglés.
//
// Solo cambia lo que la paciente LEE. Lo que se GUARDA sigue siendo el texto
// en castellano de lib/questionnaires.ts, así que el panel, los avisos médicos
// y la huella de la firma funcionan igual se rellene en un idioma o en otro.
//
// La clave es el texto exacto en castellano. Si alguien cambia una pregunta
// allí y no aquí, esa pregunta se verá en castellano en la versión inglesa:
// nunca se rompe, como mucho queda sin traducir.

export type Lang = 'es' | 'en'

export const LANGS: Lang[] = ['es', 'en']

export function isLang(v: unknown): v is Lang {
  return v === 'es' || v === 'en'
}

const EN: Record<string, string> = {
  "Cuestionario previo al chequeo de piel":
    "Pre-assessment questionnaire for your skin check",
  "Piel":
    "Skin",
  "Confirmo que la información aportada en este cuestionario es veraz y completa según mi conocimiento actual, y entiendo que es la base sobre la que el equipo de QUEVI Wellness Clinic interpretará mi chequeo de piel y diseñará mi plan de tratamiento.":
    "I confirm that the information given in this questionnaire is true and complete to the best of my current knowledge, and I understand that it is the basis on which the QUEVI Wellness Clinic team will interpret my skin check and design my treatment plan.",
  "Los productos permanentes, los implantes y los tratamientos recientes con láser, peeling o ácidos pueden condicionar qué tratamientos son seguros para ti hoy. Por favor no omitas ningún dato, aunque parezca poco relevante.":
    "Permanent products, implants and recent laser, peel or acid treatments can determine which treatments are safe for you today. Please do not leave anything out, even if it seems minor.",
  "Tus datos":
    "Your details",
  "Necesitamos saber de quién es este cuestionario para poder asociarlo a tu historia clínica. El nombre y el correo son obligatorios; el resto nos ayuda a tenerte bien identificada.":
    "We need to know who this questionnaire belongs to so we can link it to your medical record. Name and email are required; the rest helps us identify you correctly.",
  "Nombre":
    "First name",
  "Tu nombre":
    "Your first name",
  "Apellidos":
    "Surname(s)",
  "Tus apellidos":
    "Your surname(s)",
  "DNI o pasaporte":
    "ID card or passport",
  "00000000X":
    "Passport or ID number",
  "Fecha de nacimiento":
    "Date of birth",
  "DD/MM/AAAA":
    "DD/MM/YYYY",
  "Correo electrónico":
    "Email address",
  "tu@email.com":
    "you@email.com",
  "Teléfono":
    "Phone",
  "+34 …":
    "+44 … / +34 …",
  "Dirección":
    "Address",
  "Calle y número":
    "Street and number",
  "Código postal":
    "Postcode",
  "Ciudad":
    "Town / city",
  "Provincia":
    "Province",
  "1 · Estilo de vida y hábitos":
    "1 · Lifestyle and habits",
  "¿Fumas?":
    "Do you smoke?",
  "¿Cuánto al día?":
    "How many a day?",
  "Sí":
    "Yes",
  "¿Bebes alcohol?":
    "Do you drink alcohol?",
  "¿Qué bebes?":
    "What do you drink?",
  "Frecuencia con la que bebes alcohol":
    "How often do you drink alcohol?",
  "Una vez al mes o menos":
    "Once a month or less",
  "De 2 a 4 veces al mes":
    "2 to 4 times a month",
  "De 2 a 3 veces por semana":
    "2 to 3 times a week",
  "4 o más veces por semana":
    "4 or more times a week",
  "Horas de sueño por noche":
    "Hours of sleep per night",
  "Ej. 7":
    "e.g. 7",
  "Calidad del sueño":
    "Sleep quality",
  "Buena":
    "Good",
  "Regular":
    "Fair",
  "Mala / no duermo bien":
    "Poor / I don't sleep well",
  "Dificultad para conciliar o mantener el sueño":
    "Difficulty falling or staying asleep",
  "Actividad física — tipo":
    "Physical activity — type",
  "Ej. pilates, correr, gimnasio":
    "e.g. pilates, running, gym",
  "Frecuencia de actividad física":
    "How often do you exercise?",
  "Consumo de agua (litros al día, aprox.)":
    "Water intake (approx. litres per day)",
  "Ej. 1,5":
    "e.g. 1.5",
  "Nivel de estrés percibido":
    "Perceived stress level",
  "¿Estás embarazada actualmente?":
    "Are you currently pregnant?",
  "No lo sé":
    "I don't know",
  "¿Estás en período de lactancia?":
    "Are you currently breastfeeding?",
  "¿Has estado embarazada alguna vez?":
    "Have you ever been pregnant?",
  "¿Cuántos embarazos?":
    "How many pregnancies?",
  "¿Estás en perimenopausia o menopausia?":
    "Are you perimenopausal or menopausal?",
  "¿Tomas terapia hormonal (sustitutiva, anticonceptivos…)?":
    "Are you taking hormone therapy (HRT, contraceptives…)?",
  "¿Cuál y desde cuándo?":
    "Which one and since when?",
  "2 · Exposición solar y fotoprotección":
    "2 · Sun exposure and sun protection",
  "Tus respuestas nos ayudan a evaluar el nivel de fotoenvejecimiento, el riesgo dermatológico y la tolerancia de tu piel ante tratamientos lumínicos o ácidos.":
    "Your answers help us assess photoageing, dermatological risk and how well your skin will tolerate light-based or acid treatments.",
  "¿Cuál es tu fototipo de piel / tolerancia al sol?":
    "What is your skin phototype / sun tolerance?",
  "I-II: piel muy clara, siempre se quema, nunca se broncea":
    "I-II: very fair skin, always burns, never tans",
  "III-IV: piel clara a mediterránea, a veces se quema, se broncea con facilidad":
    "III-IV: fair to Mediterranean skin, sometimes burns, tans easily",
  "V-VI: piel oscura o negra, raramente se quema, se broncea de forma muy intensa":
    "V-VI: dark or black skin, rarely burns, tans very deeply",
  "No lo conozco":
    "I don't know",
  "¿Cuál es tu exposición solar diaria o semanal aproximada (por trabajo u ocio)?":
    "Roughly how much sun do you get each day or week (work or leisure)?",
  "Baja: menos de 1 hora al día (trabajo en interiores, poca exposición)":
    "Low: less than 1 hour a day (indoor work, little exposure)",
  "Moderada: entre 1 y 3 horas al día":
    "Moderate: between 1 and 3 hours a day",
  "Alta: más de 3 horas al día o actividades prolongadas al aire libre de forma habitual":
    "High: more than 3 hours a day or regular prolonged outdoor activities",
  "¿Con qué frecuencia aplicas o reaplicas tu protector solar (SPF)?":
    "How often do you apply or reapply sunscreen (SPF)?",
  "No uso protector solar habitualmente":
    "I don't usually wear sunscreen",
  "Lo aplico solo 1 vez al día (por la mañana)":
    "I only apply it once a day (in the morning)",
  "Lo aplico antes de salir y lo reaplico cada 2-3 horas si estoy expuesta":
    "I apply it before going out and reapply every 2-3 hours when exposed",
  "Solo lo uso en verano, en la playa o piscina":
    "I only use it in summer, at the beach or pool",
  "Hábitos y antecedentes de radiación solar":
    "Sun exposure habits and history",
  "¿Tomas el sol de forma habitual con la intención de broncearte (playa, piscina, terrazas)?":
    "Do you regularly sunbathe to get a tan (beach, pool, terraces)?",
  "¿Haces uso de \"duchas solares\" o cabinas de rayos UVA / bronceado artificial?":
    "Do you use sunbeds or UV tanning booths / artificial tanning?",
  "¿Sufriste quemaduras solares graves (con ampollas o peladura intensa) en tu infancia o adolescencia?":
    "Did you have severe sunburn (with blisters or heavy peeling) as a child or teenager?",
  "3 · Rutina de skincare actual":
    "3 · Current skincare routine",
  "¿Sigues una rutina facial habitualmente?":
    "Do you follow a regular facial routine?",
  "1 · Limpiador":
    "1 · Cleanser",
  "¿Cuál?":
    "Which one?",
  "2 · Tónico":
    "2 · Toner",
  "3 · Sérum":
    "3 · Serum",
  "4 · Crema de día":
    "4 · Day cream",
  "5 · Crema de noche":
    "5 · Night cream",
  "6 · Exfoliante":
    "6 · Exfoliant",
  "Frecuencia de la rutina":
    "How often do you follow the routine?",
  "¿Desde cuándo sigues esta rutina?":
    "How long have you followed this routine?",
  "Ej. 2 años":
    "e.g. 2 years",
  "Uso de ácidos y activos — marca los que uses actualmente":
    "Acids and actives — tick the ones you currently use",
  "Retinol / ácido retinoico":
    "Retinol / retinoic acid",
  "Ácido glicólico":
    "Glycolic acid",
  "Ácido azelaico":
    "Azelaic acid",
  "Ácido salicílico":
    "Salicylic acid",
  "Ácido láctico":
    "Lactic acid",
  "Ácido mandélico":
    "Mandelic acid",
  "Ácido hialurónico tópico":
    "Topical hyaluronic acid",
  "Vitamina C":
    "Vitamin C",
  "Niacinamida":
    "Niacinamide",
  "¿Cuál y qué concentración?":
    "Which one and at what concentration?",
  "Marca y %":
    "Brand and %",
  "Frecuencia de uso de ácidos y activos":
    "How often do you use acids and actives?",
  "4 · Suplementación nutricional":
    "4 · Nutritional supplements",
  "Marca lo que tomas actualmente y detalla la dosis o la pauta en el campo de cada bloque.":
    "Tick what you currently take and give the dose or regimen in each section's field.",
  "Vitaminas":
    "Vitamins",
  "Vitamina A":
    "Vitamin A",
  "Vitamina D3":
    "Vitamin D3",
  "Vitamina K2 MK7":
    "Vitamin K2 MK7",
  "Vitamina E":
    "Vitamin E",
  "Vitamina del grupo B":
    "Vitamin B complex",
  "Qué tomo y cómo lo tomo (vitaminas)":
    "What I take and how (vitamins)",
  "Colágeno y proteína":
    "Collagen and protein",
  "Colágeno hidrolizado":
    "Hydrolysed collagen",
  "Colágeno + ácido hialurónico":
    "Collagen + hyaluronic acid",
  "Creatina":
    "Creatine",
  "Marca y dosis (colágeno y proteína)":
    "Brand and dose (collagen and protein)",
  "Ácidos grasos y antioxidantes":
    "Fatty acids and antioxidants",
  "Coenzima Q10":
    "Coenzyme Q10",
  "Astaxantina":
    "Astaxanthin",
  "Glutatión":
    "Glutathione",
  "Qué tomo y cómo lo tomo (ácidos grasos y antioxidantes)":
    "What I take and how (fatty acids and antioxidants)",
  "Minerales y otros":
    "Minerals and others",
  "Selenio":
    "Selenium",
  "Magnesio":
    "Magnesium",
  "Biotina":
    "Biotin",
  "Otros suplementos no listados":
    "Other supplements not listed",
  "5 · Medicación e historial médico-estético":
    "5 · Medication and aesthetic treatment history",
  "Este bloque es el más importante para tu seguridad. Por favor no omitas ningún dato, aunque te parezca poco relevante: hay tratamientos que no se pueden hacer sobre una piel que viene de ciertos fármacos o procedimientos.":
    "This is the most important section for your safety. Please do not leave anything out, even if it seems minor: some treatments cannot be performed on skin that has recently been exposed to certain drugs or procedures.",
  "¿Tomas algún medicamento importante de forma habitual?":
    "Do you take any significant medication regularly?",
  "¿Cuál o cuáles?":
    "Which one(s)?",
  "¿Tomas o has tomado antibióticos recientemente?":
    "Are you taking, or have you recently taken, antibiotics?",
  "¿Cuál o cuáles y cuándo?":
    "Which one(s) and when?",
  "¿Tomas medicamentos fotosensibles (antibióticos como doxiciclina o tetraciclinas, isotretinoína u otros retinoides orales, diuréticos…)?":
    "Do you take photosensitising medication (antibiotics such as doxycycline or tetracyclines, isotretinoin or other oral retinoids, diuretics…)?",
  "Peeling químico":
    "Chemical peel",
  "Tipo y cuándo":
    "Type and when",
  "Láser (CO₂ fraccionado, IPL, Nd:YAG…)":
    "Laser (fractional CO₂, IPL, Nd:YAG…)",
  "Tipo, zona y cuándo":
    "Type, area and when",
  "Microneedling / radiofrecuencia":
    "Microneedling / radiofrequency",
  "Cuándo":
    "When",
  "Ecografía cutánea":
    "Skin ultrasound",
  "Motivo y cuándo":
    "Reason and when",
  "Ácido hialurónico inyectable (relleno)":
    "Injectable hyaluronic acid (filler)",
  "Zona y cuándo":
    "Area and when",
  "Ácido poli-L-láctico (ej. Sculptra)":
    "Poly-L-lactic acid (e.g. Sculptra)",
  "Hidroxiapatita cálcica (ej. Radiesse)":
    "Calcium hydroxylapatite (e.g. Radiesse)",
  "PDRN (polinucleótidos / bio-revitalización)":
    "PDRN (polynucleotides / bio-revitalisation)",
  "Plasma rico en plaquetas (PRP)":
    "Platelet-rich plasma (PRP)",
  "Toxina botulínica u otros tratamientos no listados":
    "Botulinum toxin or other treatments not listed",
  "¿Cuál, zona y cuándo?":
    "Which one, area and when?",
  "Aumento de labios":
    "Lip augmentation",
  "Con qué producto y cuándo":
    "Which product and when",
  "Hilos tensores de PDO (con anclaje)":
    "PDO thread lift (with anchoring)",
  "Productos permanentes (implantes de silicona, hilos permanentes, sustancia inyectada no reabsorbible)":
    "Permanent products (silicone implants, permanent threads, non-absorbable injected substance)",
  "Condicionan de forma decisiva qué tratamientos son seguros para ti hoy.":
    "These are decisive in determining which treatments are safe for you today.",
  "¿Dónde y cuándo?":
    "Where and when?",
  "6 · Antecedentes dermatológicos":
    "6 · Dermatological history",
  "Tipo de piel":
    "Skin type",
  "Grasa":
    "Oily",
  "Seca":
    "Dry",
  "Mixta":
    "Combination",
  "Sensible":
    "Sensitive",
  "¿Alergia a algún medicamento?":
    "Are you allergic to any medication?",
  "¿Alergia a algún antibiótico?":
    "Are you allergic to any antibiotic?",
  "Alergias, intolerancias y sensibilidades":
    "Allergies, intolerances and sensitivities",
  "En alimentación: alergia es una reacción inmunitaria grave, intolerancia es un problema digestivo. En cosmética: alergia es una reacción fuerte o eccema, irritación es sensibilidad o rojez temporal.":
    "For food: an allergy is a severe immune reaction, an intolerance is a digestive problem. For cosmetics: an allergy is a strong reaction or eczema, irritation is sensitivity or temporary redness.",
  "Alergia / reacción fuerte":
    "Allergy / strong reaction",
  "Intolerancia / irritación":
    "Intolerance / irritation",
  "Lo tolero perfectamente":
    "I tolerate it perfectly",
  "Lácteos (lactosa o proteína)":
    "Dairy (lactose or protein)",
  "Frutos secos o cacahuetes":
    "Nuts or peanuts",
  "Frutas (fructosa, sorbitol o fruta entera)":
    "Fruit (fructose, sorbitol or whole fruit)",
  "Gluten / trigo":
    "Gluten / wheat",
  "Pescado o marisco":
    "Fish or shellfish",
  "Huevo":
    "Egg",
  "Ácidos exfoliantes (glicólico, salicílico…)":
    "Exfoliating acids (glycolic, salicylic…)",
  "Retinol / retinoides":
    "Retinol / retinoids",
  "Perfumes y fragancias":
    "Perfumes and fragrances",
  "Filtros solares químicos o maquillaje":
    "Chemical sunscreens or make-up",
  "Alimentación":
    "Food",
  "Cosmética y piel":
    "Cosmetics and skin",
  "Si has marcado alguna alergia, intolerancia o irritación, detalla el alimento, el ácido o la enfermedad de la piel exacta":
    "If you ticked any allergy, intolerance or irritation, please specify the exact food, acid or skin condition",
  "En caso de alergia alimentaria, ¿el contacto cruzado o las trazas son un riesgo grave para ti?":
    "If you have a food allergy, are cross-contamination or traces a serious risk for you?",
  "Sí, exclusión total (riesgo de reacción grave o anafilaxia)":
    "Yes, total exclusion (risk of severe reaction or anaphylaxis)",
  "No, solo si consumo el alimento directamente":
    "No, only if I eat the food directly",
  "No tengo alergias alimentarias":
    "I have no food allergies",
  "Diagnósticos y antecedentes dermatológicos":
    "Diagnoses and dermatological history",
  "Enfermedades de la piel diagnosticadas (acné, rosácea, dermatitis, psoriasis, melasma, vitíligo…)":
    "Diagnosed skin conditions (acne, rosacea, dermatitis, psoriasis, melasma, vitiligo…)",
  "Lunares que han cambiado de forma, color o tamaño recientemente":
    "Moles that have recently changed shape, colour or size",
  "Antecedentes personales de cáncer de piel o melanoma":
    "Personal history of skin cancer or melanoma",
  "Antecedentes familiares de cáncer de piel o melanoma":
    "Family history of skin cancer or melanoma",
  "¿Qué es lo que más te preocupa de tu piel hoy?":
    "What concerns you most about your skin today?",
  "Cuestionario previo a tratamientos de tricología":
    "Pre-treatment questionnaire for trichology (hair and scalp)",
  "Capilar":
    "Hair",
  "Confirmo que la información aportada en este cuestionario es veraz y completa según mi conocimiento actual, y entiendo que es la base sobre la que el equipo de QUEVI Wellness Clinic diseñará mi plan de tratamiento capilar.":
    "I confirm that the information given in this questionnaire is true and complete to the best of my current knowledge, and I understand that it is the basis on which the QUEVI Wellness Clinic team will design my hair treatment plan.",
  "Los corticoides, las hormonas, el minoxidil, el finasteride o el dutasteride y un trasplante previo pueden condicionar qué tratamientos son seguros para ti hoy. No omitas ningún dato.":
    "Corticosteroids, hormones, minoxidil, finasteride or dutasteride and a previous hair transplant can determine which treatments are safe for you today. Please do not leave anything out.",
  "1 · Historia de la caída capilar":
    "1 · Hair loss history",
  "Inicio de la caída":
    "When did the hair loss start?",
  "Fecha o tiempo aproximado":
    "Date or approximate time",
  "Patrón de caída":
    "Hair loss pattern",
  "Brusca o repentina":
    "Sudden",
  "Por zonas o parches":
    "In patches",
  "Difusa":
    "Diffuse",
  "Zona donde más se nota":
    "Where is it most noticeable?",
  "Entradas":
    "Receding hairline",
  "Coronilla":
    "Crown",
  "Zona occipital":
    "Occipital area (back of the head)",
  "Otra":
    "Other",
  "Si has marcado \"otra\", ¿cuál?":
    "If you ticked \"other\", where?",
  "Antecedentes familiares de calvicie":
    "Family history of baldness",
  "¿Quién y desde qué edad?":
    "Who, and from what age?",
  "Trasplante capilar previo":
    "Previous hair transplant",
  "Técnica (FUE o FUT), fecha y clínica":
    "Technique (FUE or FUT), date and clinic",
  "2 · Salud general y hormonal":
    "2 · General and hormonal health",
  "No aplica":
    "Not applicable",
  "Menopausia o perimenopausia":
    "Menopause or perimenopause",
  "Andropausia o testosterona baja diagnosticada":
    "Andropause or diagnosed low testosterone",
  "Antecedentes de tiroides":
    "Thyroid history",
  "Enfermedad autoinmune diagnosticada":
    "Diagnosed autoimmune disease",
  "Alopecia areata, Hashimoto, lupus, psoriasis, celiaquía…":
    "Alopecia areata, Hashimoto's, lupus, psoriasis, coeliac disease…",
  "Evento de estrés físico o emocional intenso en los últimos 6-12 meses":
    "Intense physical or emotional stress in the last 6-12 months",
  "Parto, cirugía, duelo, dieta drástica…":
    "Childbirth, surgery, bereavement, crash diet…",
  "Detalla qué pasó y cuándo":
    "Describe what happened and when",
  "3 · Medicamentos, suplementos y hormonas":
    "3 · Medication, supplements and hormones",
  "Este bloque es el más importante para tu seguridad: los corticoides, las hormonas y algunos fármacos condicionan de forma directa qué tratamiento capilar se te puede hacer.":
    "This is the most important section for your safety: corticosteroids, hormones and some drugs directly determine which hair treatment you can have.",
  "Medicamento habitual":
    "Regular medication",
  "¿Cuál o cuáles y desde cuándo?":
    "Which one(s) and since when?",
  "Corticoides o esteroides":
    "Corticosteroids or steroids",
  "Orales, inyectados, tópicos o anabolizantes":
    "Oral, injected, topical or anabolic",
  "¿Cuál, dosis, vía y cuándo?":
    "Which one, dose, route and when?",
  "Terapia hormonal o anticonceptivos":
    "Hormone therapy or contraceptives",
  "Suplementos habituales":
    "Regular supplements",
  "Biotina, hierro, vitamina D, colágeno…":
    "Biotin, iron, vitamin D, collagen…",
  "¿Cuáles y en qué dosis?":
    "Which ones and at what dose?",
  "Ferritina baja o anemia diagnosticada":
    "Diagnosed low ferritin or anaemia",
  "4 · Tratamientos capilares actuales o previos":
    "4 · Current or previous hair treatments",
  "Formato (loción, espuma u oral), concentración, desde cuándo y frecuencia":
    "Format (lotion, foam or oral), concentration, since when and how often",
  "Formato (oral o tópico), dosis y desde cuándo":
    "Format (oral or topical), dose and since when",
  "Efectos secundarios con alguno de estos tratamientos":
    "Side effects from any of these treatments",
  "¿Cuáles?":
    "Which ones?",
  "PRP — plasma rico en plaquetas":
    "PRP — platelet-rich plasma",
  "¿Cuándo y cuántas sesiones?":
    "When and how many sessions?",
  "Mesoterapia capilar":
    "Scalp mesotherapy",
  "Microneedling capilar":
    "Scalp microneedling",
  "Láser capilar":
    "Hair laser therapy",
  "Casco, peine o banda LED":
    "Helmet, comb or LED band",
  "¿Desde cuándo y con qué frecuencia?":
    "Since when and how often?",
  "5 · Rutina de cuidado capilar":
    "5 · Hair care routine",
  "Frecuencia de lavado":
    "How often do you wash your hair?",
  "Diario":
    "Daily",
  "Día sí, día no":
    "Every other day",
  "2-3 veces por semana":
    "2-3 times a week",
  "1 vez por semana o menos":
    "Once a week or less",
  "Momento del lavado":
    "When do you wash it?",
  "Mañana":
    "Morning",
  "Noche":
    "Evening",
  "Ambos":
    "Both",
  "Varía":
    "It varies",
  "Champú habitual":
    "Usual shampoo",
  "Marca y producto":
    "Brand and product",
  "¿Tu champú es anticaída o específico, o de uso general?":
    "Is your shampoo anti-hair-loss or specific, or for general use?",
  "Anticaída o específico":
    "Anti-hair-loss or specific",
  "De uso general":
    "General use",
  "Acondicionador o mascarilla":
    "Conditioner or hair mask",
  "Sérum o loción capilar, fuera de tratamiento médico":
    "Hair serum or lotion (outside medical treatment)",
  "¿Cuál y con qué frecuencia?":
    "Which one and how often?",
  "Coloración, mechas o alisado químico":
    "Hair colouring, highlights or chemical straightening",
  "¿Con qué frecuencia y desde cuándo?":
    "How often and since when?",
  "6 · Estilo de vida":
    "6 · Lifestyle",
  "Mala, no duermo bien":
    "Poor, I don't sleep well",
  "Actividad física — frecuencia":
    "Physical activity — frequency",
  "Diaria":
    "Daily",
  "1 vez por semana":
    "Once a week",
  "Apenas":
    "Hardly ever",
  "7 · Preocupación principal":
    "7 · Main concern",
  "¿Qué es lo que más te preocupa de tu cabello o cuero cabelludo hoy?":
    "What concerns you most about your hair or scalp today?",
  "Quevi Wellness Clinic (NIF B88657044), NICA 70353, centro autorizado por la Junta de Andalucía. Calle Gibraltar 2, Bajos, 29680 Estepona, Málaga. Contacto: pacientes@queviwellnessclinic.es":
    "Quevi Wellness Clinic (Tax ID B88657044), NICA 70353, healthcare centre authorised by the Regional Government of Andalusia. Calle Gibraltar 2, Bajos, 29680 Estepona, Málaga, Spain. Contact: pacientes@queviwellnessclinic.es",
  "Tus datos personales y de salud se usan para gestionar tu historia clínica, prestarte los servicios de Quevi y hacer seguimiento de tu tratamiento. La base legal es la ejecución del servicio médico y tu consentimiento expreso, al tratarse de datos de salud (art. 9.2.a RGPD). Se conservan mientras dure la relación asistencial y, como mínimo, el plazo que exige la Ley de Autonomía del Paciente. No se ceden a terceros salvo obligación legal o proveedores necesarios (laboratorios, sistemas de historia clínica) con las garantías de seguridad exigidas. Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y portabilidad escribiendo al email de contacto indicado arriba.":
    "Your personal and health data are used to manage your medical record, provide Quevi's services and follow up on your treatment. The legal basis is the provision of the medical service and your explicit consent, as this is health data (Art. 9.2.a GDPR). The data are kept for as long as the care relationship lasts and, at a minimum, for the period required by the Spanish Patient Autonomy Act. They are not shared with third parties except where required by law or with necessary providers (laboratories, medical record systems) under the required security safeguards. You can exercise your rights of access, rectification, erasure, restriction and portability by writing to the contact email above.",
  "Autorizo el tratamiento de mis datos de salud para mi historia clínica y para recibir recomendaciones antes y después del tratamiento.":
    "I authorise the processing of my health data for my medical record and to receive recommendations before and after treatment.",
  "Autorizo la toma de fotografías y vídeos de carácter médico para el seguimiento de mi tratamiento.":
    "I authorise medical photographs and videos to be taken to monitor my treatment.",
  "Autorizo recibir comunicaciones sobre citas, resultados o recordatorios por WhatsApp, e-mail o SMS.":
    "I authorise communications about appointments, results or reminders by WhatsApp, email or SMS.",
  "Autorizo el uso de mis fotos con fines científicos, docentes o de promoción de Quevi Wellness Clinic, anonimizando mis rasgos siempre que sea posible.":
    "I authorise the use of my photos for scientific, educational or promotional purposes by Quevi Wellness Clinic, with my features anonymised wherever possible.",
  "Nada estresada":
    "Not stressed at all",
  "Extremadamente estresada":
    "Extremely stressed",
  // Protección de datos como documento aparte
  "Protección de datos":
    "Data protection",
  "Protección de datos y consentimiento":
    "Data protection and consent",
  "Cuestionario de piel":
    "Skin questionnaire",
  "Cuestionario de tricología":
    "Trichology questionnaire",
  "Estos datos identifican a quién pertenece tu historia clínica. El nombre y el correo son obligatorios; el resto nos ayuda a tenerte bien identificada.":
    "These details identify whose medical record this is. Your name and email are required; the rest helps us identify you correctly.",
  "El tratamiento de tus datos se rige por el documento de protección de datos y consentimiento de QUEVI Wellness Clinic. Puedes ejercer tus derechos escribiendo a pacientes@queviwellnessclinic.es.":
    "Your data is processed in accordance with the QUEVI Wellness Clinic data protection and consent document. You can exercise your rights by writing to pacientes@queviwellnessclinic.es.",
}

/** Traduce un texto del cuestionario al idioma elegido. */
export function tr(text: string | undefined, lang: Lang): string {
  if (!text) return ''
  if (lang === 'es') return text
  return EN[text] ?? text
}

// ── Textos de la interfaz del formulario (botones, avisos, errores) ─────────
const UI = {
  es: {
    step: (n: number, total: number) => `Paso ${n} de ${total}`,
    continue: 'Continuar',
    back: 'Atrás',
    submit: 'Firmar y enviar',
    sending: 'Enviando…',
    finalTitle: 'Consentimiento, declaración y firma',
    important: 'Importante:',
    responsable: 'Responsable del tratamiento',
    finalidad: 'Finalidad, base legal y conservación',
    declaration: 'Declaración',
    confirmDeclaration: 'Confirmo la declaración anterior.',
    requiredToContinue: '(obligatorio para continuar)',
    optionalConsents: 'Autorizaciones opcionales',
    signature: 'Firma',
    signatureHint: 'Firma con el dedo o con el ratón dentro del recuadro',
    clearSignature: 'Borrar firma',
    yes: 'Sí',
    no: 'No',
    footer:
      'Tus respuestas solo las ve el equipo médico de la clínica. Lo que escribes se conserva en este dispositivo hasta que envías el cuestionario, por si se te cierra la página.',
    sentTitle: 'Cuestionario recibido',
    sentBody:
      'Gracias. Tu equipo médico lo revisará antes de tu cita. Si necesitamos aclarar algo, te lo preguntaremos en la consulta.',
    errName: 'Necesitamos tu nombre para saber de quién es el cuestionario',
    errEmail: 'Escribe un correo electrónico válido',
    errDeclaration: 'Confirma la declaración para poder enviar el cuestionario',
    errConsent: 'Necesitamos tu autorización para tratar tus datos',
    errSignature: 'Falta tu firma',
    errSend: 'No se pudo enviar el cuestionario. Inténtalo de nuevo.',
    errNetwork: 'No hay conexión. Comprueba la red e inténtalo otra vez.',
    langLabel: 'Idioma',
    finalTitleDatos: 'Consentimiento y firma',
    finalTitleForm: 'Declaración y firma',
    docStep: (n: number, total: number) => `Documento ${n} de ${total}`,
    signedDatos: 'Protección de datos firmada. Ahora completa el cuestionario.',
    fillingAs: (name: string) => `Rellenando como ${name}.`,
    notYou: '¿No eres tú? Empezar de nuevo',
    sentTitleDatos: 'Documento firmado',
    sentBodyDatos: 'Gracias. Lo hemos guardado en tu historia clínica.',
  },
  en: {
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    continue: 'Continue',
    back: 'Back',
    submit: 'Sign and submit',
    sending: 'Sending…',
    finalTitle: 'Consent, declaration and signature',
    important: 'Important:',
    responsable: 'Data controller',
    finalidad: 'Purpose, legal basis and retention',
    declaration: 'Declaration',
    confirmDeclaration: 'I confirm the declaration above.',
    requiredToContinue: '(required to continue)',
    optionalConsents: 'Optional authorisations',
    signature: 'Signature',
    signatureHint: 'Sign with your finger or mouse inside the box',
    clearSignature: 'Clear signature',
    yes: 'Yes',
    no: 'No',
    footer:
      'Your answers are only seen by the clinic’s medical team. What you type is kept on this device until you submit the questionnaire, in case the page closes.',
    sentTitle: 'Questionnaire received',
    sentBody:
      'Thank you. Your medical team will review it before your appointment. If anything needs clarifying, we will ask you during the consultation.',
    errName: 'We need your name to know who this questionnaire belongs to',
    errEmail: 'Please enter a valid email address',
    errDeclaration: 'Please confirm the declaration to submit the questionnaire',
    errConsent: 'We need your authorisation to process your data',
    errSignature: 'Your signature is missing',
    errSend: 'The questionnaire could not be sent. Please try again.',
    errNetwork: 'No connection. Check your network and try again.',
    langLabel: 'Language',
    finalTitleDatos: 'Consent and signature',
    finalTitleForm: 'Declaration and signature',
    docStep: (n: number, total: number) => `Document ${n} of ${total}`,
    signedDatos: 'Data protection signed. Now please complete the questionnaire.',
    fillingAs: (name: string) => `Filling in as ${name}.`,
    notYou: 'Not you? Start again',
    sentTitleDatos: 'Document signed',
    sentBodyDatos: 'Thank you. It has been saved to your medical record.',
  },
}

export function ui(lang: Lang) {
  return UI[lang]
}
