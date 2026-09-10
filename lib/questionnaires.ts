// Cuestionarios de salud — definición única de los dos formularios.
//
// Los formularios públicos (/chequeo-piel y /chequeo-capilar) y el panel de
// administración leen de aquí, para que la pregunta que firma la paciente y la
// que lee el equipo médico sean literalmente la misma. Si hay que cambiar una
// pregunta, se cambia aquí y cambia en los dos sitios a la vez.

type BaseField = { id: string; label: string; help?: string }

export type Field =
  | (BaseField & { type: 'text' | 'number' | 'textarea'; placeholder?: string })
  | (BaseField & { type: 'radio'; options: string[] })
  | (BaseField & { type: 'checkboxes'; options: string[] })
  // Sí/No con un campo de detalle que solo aparece al responder lo que diga `detailOn`
  | (BaseField & { type: 'yesno'; options?: string[]; detail?: string; detailOn?: string })
  | (BaseField & { type: 'scale'; min: number; max: number; minLabel?: string; maxLabel?: string })
  | (BaseField & {
      type: 'matrix'
      rows: { id: string; label: string }[]
      options: string[]
      groups?: Record<string, string>
    })

export type Section = {
  id: string
  title: string
  intro?: string
  fields: Field[]
}

const FRECUENCIA = [
  'Una vez al mes o menos',
  'De 2 a 4 veces al mes',
  'De 2 a 3 veces por semana',
  '4 o más veces por semana',
]

const SI_NO = ['Sí', 'No']

// Los seis productos de la rutina, cada uno con su "¿cuál?"
function rutinaProducto(id: string, label: string): Field[] {
  return [
    { id: `rutina_${id}`, type: 'yesno', label, options: SI_NO, detail: '¿Cuál?', detailOn: 'Sí' },
  ]
}

// Los tratamientos previos comparten forma: Sí/No + detalle
function tratamiento(id: string, label: string, detail: string): Field {
  return { id: `trat_${id}`, type: 'yesno', label, options: SI_NO, detail, detailOn: 'Sí' }
}

// ── Identificación y contacto ────────────────────────────────────────────────
// Común a los dos cuestionarios. Son los campos que pide el documento de
// consentimiento, para que la ficha sirva como parte de la historia clínica.
const SECCION_DATOS: Section = {
  id: 'datos',
  title: 'Tus datos',
  intro:
    'Necesitamos saber de quién es este cuestionario para poder asociarlo a tu historia clínica. ' +
    'El nombre y el correo son obligatorios; el resto nos ayuda a tenerte bien identificada.',
  fields: [
    { id: 'nombre', type: 'text', label: 'Nombre', placeholder: 'Tu nombre' },
    { id: 'apellidos', type: 'text', label: 'Apellidos', placeholder: 'Tus apellidos' },
    { id: 'dni', type: 'text', label: 'DNI o pasaporte', placeholder: '00000000X' },
    { id: 'fecha_nacimiento', type: 'text', label: 'Fecha de nacimiento', placeholder: 'DD/MM/AAAA' },
    { id: 'email', type: 'text', label: 'Correo electrónico', placeholder: 'tu@email.com' },
    { id: 'telefono', type: 'text', label: 'Teléfono', placeholder: '+34 …' },
    { id: 'direccion', type: 'text', label: 'Dirección', placeholder: 'Calle y número' },
    { id: 'cp', type: 'text', label: 'Código postal', placeholder: '29680' },
    { id: 'ciudad', type: 'text', label: 'Ciudad', placeholder: 'Estepona' },
    { id: 'provincia', type: 'text', label: 'Provincia', placeholder: 'Málaga' },
  ],
}

const SKIN_SECTIONS: Section[] = [
  SECCION_DATOS,

  // ── 1 · Estilo de vida ────────────────────────────────────────────────────
  {
    id: 'estilo_vida',
    title: '1 · Estilo de vida y hábitos',
    fields: [
      { id: 'fuma', type: 'yesno', label: '¿Fumas?', options: ['No', 'Sí'], detail: '¿Cuánto al día?', detailOn: 'Sí' },
      { id: 'alcohol', type: 'yesno', label: '¿Bebes alcohol?', options: ['No', 'Sí'], detail: '¿Qué bebes?', detailOn: 'Sí' },
      { id: 'alcohol_frecuencia', type: 'radio', label: 'Frecuencia con la que bebes alcohol', options: FRECUENCIA },
      { id: 'sueno_horas', type: 'text', label: 'Horas de sueño por noche', placeholder: 'Ej. 7' },
      { id: 'sueno_calidad', type: 'radio', label: 'Calidad del sueño', options: ['Buena', 'Regular', 'Mala / no duermo bien'] },
      { id: 'sueno_dificultad', type: 'radio', label: 'Dificultad para conciliar o mantener el sueño', options: SI_NO },
      { id: 'actividad_tipo', type: 'text', label: 'Actividad física — tipo', placeholder: 'Ej. pilates, correr, gimnasio' },
      { id: 'actividad_frecuencia', type: 'radio', label: 'Frecuencia de actividad física', options: FRECUENCIA },
      { id: 'agua', type: 'text', label: 'Consumo de agua (litros al día, aprox.)', placeholder: 'Ej. 1,5' },
      {
        id: 'estres',
        type: 'scale',
        label: 'Nivel de estrés percibido',
        min: 1,
        max: 10,
        minLabel: 'Nada estresada',
        maxLabel: 'Extremadamente estresada',
      },
      { id: 'menopausia', type: 'radio', label: '¿Estás en perimenopausia o menopausia?', options: ['Sí', 'No', 'No lo sé'] },
      {
        id: 'hormonal',
        type: 'yesno',
        label: '¿Tomas terapia hormonal (sustitutiva, anticonceptivos…)?',
        options: SI_NO,
        detail: '¿Cuál y desde cuándo?',
        detailOn: 'Sí',
      },
    ],
  },

  // ── 2 · Sol ───────────────────────────────────────────────────────────────
  {
    id: 'sol',
    title: '2 · Exposición solar y fotoprotección',
    intro:
      'Tus respuestas nos ayudan a evaluar el nivel de fotoenvejecimiento, el riesgo dermatológico y la ' +
      'tolerancia de tu piel ante tratamientos lumínicos o ácidos.',
    fields: [
      {
        id: 'fototipo',
        type: 'radio',
        label: '¿Cuál es tu fototipo de piel / tolerancia al sol?',
        options: [
          'I-II: piel muy clara, siempre se quema, nunca se broncea',
          'III-IV: piel clara a mediterránea, a veces se quema, se broncea con facilidad',
          'V-VI: piel oscura o negra, raramente se quema, se broncea de forma muy intensa',
          'No lo conozco',
        ],
      },
      {
        id: 'exposicion',
        type: 'radio',
        label: '¿Cuál es tu exposición solar diaria o semanal aproximada (por trabajo u ocio)?',
        options: [
          'Baja: menos de 1 hora al día (trabajo en interiores, poca exposición)',
          'Moderada: entre 1 y 3 horas al día',
          'Alta: más de 3 horas al día o actividades prolongadas al aire libre de forma habitual',
        ],
      },
      {
        id: 'spf',
        type: 'radio',
        label: '¿Con qué frecuencia aplicas o reaplicas tu protector solar (SPF)?',
        options: [
          'No uso protector solar habitualmente',
          'Lo aplico solo 1 vez al día (por la mañana)',
          'Lo aplico antes de salir y lo reaplico cada 2-3 horas si estoy expuesta',
          'Solo lo uso en verano, en la playa o piscina',
        ],
      },
      {
        id: 'sol_habitos',
        type: 'matrix',
        label: 'Hábitos y antecedentes de radiación solar',
        options: SI_NO,
        rows: [
          { id: 'broncear', label: '¿Tomas el sol de forma habitual con la intención de broncearte (playa, piscina, terrazas)?' },
          { id: 'uva', label: '¿Haces uso de "duchas solares" o cabinas de rayos UVA / bronceado artificial?' },
          { id: 'quemaduras', label: '¿Sufriste quemaduras solares graves (con ampollas o peladura intensa) en tu infancia o adolescencia?' },
        ],
      },
    ],
  },

  // ── 3 · Rutina ────────────────────────────────────────────────────────────
  {
    id: 'rutina',
    title: '3 · Rutina de skincare actual',
    fields: [
      { id: 'rutina_habitual', type: 'radio', label: '¿Sigues una rutina facial habitualmente?', options: SI_NO },
      ...rutinaProducto('limpiador', '1 · Limpiador'),
      ...rutinaProducto('tonico', '2 · Tónico'),
      ...rutinaProducto('serum', '3 · Sérum'),
      ...rutinaProducto('crema_dia', '4 · Crema de día'),
      ...rutinaProducto('crema_noche', '5 · Crema de noche'),
      ...rutinaProducto('exfoliante', '6 · Exfoliante'),
      { id: 'rutina_frecuencia', type: 'radio', label: 'Frecuencia de la rutina', options: FRECUENCIA },
      { id: 'rutina_desde', type: 'text', label: '¿Desde cuándo sigues esta rutina?', placeholder: 'Ej. 2 años' },
      {
        id: 'acidos',
        type: 'checkboxes',
        label: 'Uso de ácidos y activos — marca los que uses actualmente',
        options: [
          'Retinol / ácido retinoico',
          'Ácido glicólico',
          'Ácido azelaico',
          'Ácido salicílico',
          'Ácido láctico',
          'Ácido mandélico',
          'Ácido hialurónico tópico',
          'Vitamina C',
          'Niacinamida',
        ],
      },
      { id: 'acidos_detalle', type: 'text', label: '¿Cuál y qué concentración?', placeholder: 'Marca y %' },
      { id: 'acidos_frecuencia', type: 'radio', label: 'Frecuencia de uso de ácidos y activos', options: FRECUENCIA },
    ],
  },

  // ── 4 · Suplementación ────────────────────────────────────────────────────
  {
    id: 'suplementos',
    title: '4 · Suplementación nutricional',
    intro: 'Marca lo que tomas actualmente y detalla la dosis o la pauta en el campo de cada bloque.',
    fields: [
      {
        id: 'vitaminas',
        type: 'checkboxes',
        label: 'Vitaminas',
        options: ['Vitamina A', 'Vitamina D3', 'Vitamina K2 MK7', 'Vitamina E', 'Vitamina C', 'Vitamina del grupo B'],
      },
      { id: 'vitaminas_detalle', type: 'textarea', label: 'Qué tomo y cómo lo tomo (vitaminas)' },
      {
        id: 'colageno',
        type: 'checkboxes',
        label: 'Colágeno y proteína',
        options: ['Colágeno hidrolizado', 'Colágeno + ácido hialurónico', 'Whey protein', 'Creatina'],
      },
      { id: 'colageno_detalle', type: 'textarea', label: 'Marca y dosis (colágeno y proteína)' },
      {
        id: 'antioxidantes',
        type: 'checkboxes',
        label: 'Ácidos grasos y antioxidantes',
        options: ['Omega-3', 'Coenzima Q10', 'Astaxantina', 'Resveratrol', 'Glutatión'],
      },
      { id: 'antioxidantes_detalle', type: 'textarea', label: 'Qué tomo y cómo lo tomo (ácidos grasos y antioxidantes)' },
      {
        id: 'minerales',
        type: 'checkboxes',
        label: 'Minerales y otros',
        options: ['Zinc', 'Selenio', 'Magnesio', 'Biotina'],
      },
      { id: 'suplementos_otros', type: 'textarea', label: 'Otros suplementos no listados' },
    ],
  },

  // ── 5 · Medicación e historial médico-estético ────────────────────────────
  {
    id: 'medicacion',
    title: '5 · Medicación e historial médico-estético',
    intro:
      'Este bloque es el más importante para tu seguridad. Por favor no omitas ningún dato, aunque te parezca ' +
      'poco relevante: hay tratamientos que no se pueden hacer sobre una piel que viene de ciertos fármacos o ' +
      'procedimientos.',
    fields: [
      {
        id: 'medicamentos',
        type: 'yesno',
        label: '¿Tomas algún medicamento importante de forma habitual?',
        options: SI_NO,
        detail: '¿Cuál o cuáles?',
        detailOn: 'Sí',
      },
      {
        id: 'antibioticos',
        type: 'yesno',
        label: '¿Tomas o has tomado antibióticos recientemente?',
        options: SI_NO,
        detail: '¿Cuál o cuáles y cuándo?',
        detailOn: 'Sí',
      },
      {
        id: 'fotosensibles',
        type: 'yesno',
        label:
          '¿Tomas medicamentos fotosensibles (antibióticos como doxiciclina o tetraciclinas, isotretinoína u otros retinoides orales, diuréticos…)?',
        options: ['Sí', 'No', 'No lo sé'],
        detail: '¿Cuál o cuáles?',
        detailOn: 'Sí',
      },
      tratamiento('peeling', 'Peeling químico', 'Tipo y cuándo'),
      tratamiento('laser', 'Láser (CO₂ fraccionado, IPL, Nd:YAG…)', 'Tipo, zona y cuándo'),
      tratamiento('microneedling', 'Microneedling / radiofrecuencia', 'Cuándo'),
      tratamiento('ecografia', 'Ecografía cutánea', 'Motivo y cuándo'),
      tratamiento('hialuronico', 'Ácido hialurónico inyectable (relleno)', 'Zona y cuándo'),
      tratamiento('polilactico', 'Ácido poli-L-láctico (ej. Sculptra)', 'Zona y cuándo'),
      tratamiento('hidroxiapatita', 'Hidroxiapatita cálcica (ej. Radiesse)', 'Zona y cuándo'),
      tratamiento('pdrn', 'PDRN (polinucleótidos / bio-revitalización)', 'Zona y cuándo'),
      tratamiento('prp', 'Plasma rico en plaquetas (PRP)', 'Zona y cuándo'),
      tratamiento('toxina', 'Toxina botulínica u otros tratamientos no listados', '¿Cuál, zona y cuándo?'),
      tratamiento('labios', 'Aumento de labios', 'Con qué producto y cuándo'),
      tratamiento('hilos', 'Hilos tensores de PDO (con anclaje)', 'Zona y cuándo'),
      {
        id: 'permanentes',
        type: 'yesno',
        label:
          'Productos permanentes (implantes de silicona, hilos permanentes, sustancia inyectada no reabsorbible)',
        options: SI_NO,
        detail: '¿Dónde y cuándo?',
        detailOn: 'Sí',
        help: 'Condicionan de forma decisiva qué tratamientos son seguros para ti hoy.',
      },
    ],
  },

  // ── 6 · Antecedentes dermatológicos ───────────────────────────────────────
  {
    id: 'dermatologia',
    title: '6 · Antecedentes dermatológicos',
    fields: [
      { id: 'tipo_piel', type: 'radio', label: 'Tipo de piel', options: ['Grasa', 'Seca', 'Mixta', 'Sensible', 'Normal'] },
      {
        id: 'alergia_medicamento',
        type: 'yesno',
        label: '¿Alergia a algún medicamento?',
        options: SI_NO,
        detail: '¿Cuál?',
        detailOn: 'Sí',
      },
      {
        id: 'alergia_antibiotico',
        type: 'yesno',
        label: '¿Alergia a algún antibiótico?',
        options: SI_NO,
        detail: '¿Cuál?',
        detailOn: 'Sí',
      },
      {
        id: 'tolerancias',
        type: 'matrix',
        label: 'Alergias, intolerancias y sensibilidades',
        help:
          'En alimentación: alergia es una reacción inmunitaria grave, intolerancia es un problema digestivo. ' +
          'En cosmética: alergia es una reacción fuerte o eccema, irritación es sensibilidad o rojez temporal.',
        options: ['Alergia / reacción fuerte', 'Intolerancia / irritación', 'Lo tolero perfectamente'],
        groups: {
          lacteos: 'Alimentación',
          acidos_exfoliantes: 'Cosmética y piel',
        },
        rows: [
          { id: 'lacteos', label: 'Lácteos (lactosa o proteína)' },
          { id: 'frutos_secos', label: 'Frutos secos o cacahuetes' },
          { id: 'frutas', label: 'Frutas (fructosa, sorbitol o fruta entera)' },
          { id: 'gluten', label: 'Gluten / trigo' },
          { id: 'pescado', label: 'Pescado o marisco' },
          { id: 'huevo', label: 'Huevo' },
          { id: 'acidos_exfoliantes', label: 'Ácidos exfoliantes (glicólico, salicílico…)' },
          { id: 'retinoides', label: 'Retinol / retinoides' },
          { id: 'vitamina_c', label: 'Vitamina C' },
          { id: 'perfumes', label: 'Perfumes y fragancias' },
          { id: 'filtros', label: 'Filtros solares químicos o maquillaje' },
        ],
      },
      {
        id: 'alergias_detalle',
        type: 'textarea',
        label:
          'Si has marcado alguna alergia, intolerancia o irritación, detalla el alimento, el ácido o la enfermedad de la piel exacta',
      },
      {
        id: 'contacto_cruzado',
        type: 'radio',
        label: 'En caso de alergia alimentaria, ¿el contacto cruzado o las trazas son un riesgo grave para ti?',
        options: [
          'Sí, exclusión total (riesgo de reacción grave o anafilaxia)',
          'No, solo si consumo el alimento directamente',
          'No tengo alergias alimentarias',
        ],
      },
      {
        id: 'diagnosticos',
        type: 'matrix',
        label: 'Diagnósticos y antecedentes dermatológicos',
        options: SI_NO,
        rows: [
          { id: 'enfermedades', label: 'Enfermedades de la piel diagnosticadas (acné, rosácea, dermatitis, psoriasis, melasma, vitíligo…)' },
          { id: 'lunares', label: 'Lunares que han cambiado de forma, color o tamaño recientemente' },
          { id: 'cancer_personal', label: 'Antecedentes personales de cáncer de piel o melanoma' },
          { id: 'cancer_familiar', label: 'Antecedentes familiares de cáncer de piel o melanoma' },
        ],
      },
      { id: 'preocupacion', type: 'textarea', label: '¿Qué es lo que más te preocupa de tu piel hoy?' },
    ],
  },
]

// ── Cuestionario de tricología ───────────────────────────────────────────────

// Los tratamientos capilares comparten forma: Sí/No + detalle
function capilar(id: string, label: string, detail: string, help?: string): Field {
  return { id: `cap_${id}`, type: 'yesno', label, options: SI_NO, detail, detailOn: 'Sí', help }
}

const HAIR_SECTIONS: Section[] = [
  SECCION_DATOS,

  {
    id: 'caida',
    title: '1 · Historia de la caída capilar',
    fields: [
      { id: 'caida_inicio', type: 'text', label: 'Inicio de la caída', placeholder: 'Fecha o tiempo aproximado' },
      {
        id: 'caida_patron',
        type: 'radio',
        label: 'Patrón de caída',
        options: ['Gradual', 'Brusca o repentina', 'Por zonas o parches', 'Difusa'],
      },
      {
        id: 'caida_zona',
        type: 'checkboxes',
        label: 'Zona donde más se nota',
        options: ['Entradas', 'Coronilla', 'Difusa', 'Zona occipital', 'Otra'],
      },
      { id: 'caida_zona_otra', type: 'text', label: 'Si has marcado "otra", ¿cuál?' },
      {
        id: 'caida_familiar',
        type: 'yesno',
        label: 'Antecedentes familiares de calvicie',
        options: SI_NO,
        detail: '¿Quién y desde qué edad?',
        detailOn: 'Sí',
      },
      {
        id: 'trasplante',
        type: 'yesno',
        label: 'Trasplante capilar previo',
        options: SI_NO,
        detail: 'Técnica (FUE o FUT), fecha y clínica',
        detailOn: 'Sí',
      },
    ],
  },

  {
    id: 'salud_hormonal',
    title: '2 · Salud general y hormonal',
    fields: [
      { id: 'menopausia_cap', type: 'radio', label: 'Menopausia o perimenopausia', options: ['Sí', 'No', 'No lo sé'] },
      { id: 'andropausia', type: 'radio', label: 'Andropausia o testosterona baja diagnosticada', options: ['Sí', 'No', 'No lo sé'] },
      { id: 'tiroides', type: 'yesno', label: 'Antecedentes de tiroides', options: SI_NO, detail: '¿Cuál?', detailOn: 'Sí' },
      {
        id: 'autoinmune',
        type: 'yesno',
        label: 'Enfermedad autoinmune diagnosticada',
        help: 'Alopecia areata, Hashimoto, lupus, psoriasis, celiaquía…',
        options: SI_NO,
        detail: '¿Cuál y desde cuándo?',
        detailOn: 'Sí',
      },
      {
        id: 'estres_evento',
        type: 'yesno',
        label: 'Evento de estrés físico o emocional intenso en los últimos 6-12 meses',
        help: 'Parto, cirugía, duelo, dieta drástica…',
        options: SI_NO,
        detail: 'Detalla qué pasó y cuándo',
        detailOn: 'Sí',
      },
    ],
  },

  {
    id: 'medicacion_cap',
    title: '3 · Medicamentos, suplementos y hormonas',
    intro:
      'Este bloque es el más importante para tu seguridad: los corticoides, las hormonas y algunos fármacos ' +
      'condicionan de forma directa qué tratamiento capilar se te puede hacer.',
    fields: [
      {
        id: 'med_habitual',
        type: 'yesno',
        label: 'Medicamento habitual',
        options: SI_NO,
        detail: '¿Cuál o cuáles y desde cuándo?',
        detailOn: 'Sí',
      },
      {
        id: 'corticoides',
        type: 'yesno',
        label: 'Corticoides o esteroides',
        help: 'Orales, inyectados, tópicos o anabolizantes',
        options: SI_NO,
        detail: '¿Cuál, dosis, vía y cuándo?',
        detailOn: 'Sí',
      },
      {
        id: 'hormonal_cap',
        type: 'yesno',
        label: 'Terapia hormonal o anticonceptivos',
        options: SI_NO,
        detail: '¿Cuál y desde cuándo?',
        detailOn: 'Sí',
      },
      {
        id: 'suplementos_cap',
        type: 'yesno',
        label: 'Suplementos habituales',
        help: 'Biotina, hierro, vitamina D, colágeno…',
        options: SI_NO,
        detail: '¿Cuáles y en qué dosis?',
        detailOn: 'Sí',
      },
      { id: 'ferritina', type: 'radio', label: 'Ferritina baja o anemia diagnosticada', options: ['Sí', 'No', 'No lo sé'] },
    ],
  },

  {
    id: 'tratamientos_cap',
    title: '4 · Tratamientos capilares actuales o previos',
    fields: [
      capilar('minoxidil', 'Minoxidil', 'Formato (loción, espuma u oral), concentración, desde cuándo y frecuencia'),
      capilar('finasteride', 'Finasteride', 'Formato (oral o tópico), dosis y desde cuándo'),
      capilar('dutasteride', 'Dutasteride', 'Formato (oral o tópico), dosis y desde cuándo'),
      {
        id: 'efectos_secundarios',
        type: 'yesno',
        label: 'Efectos secundarios con alguno de estos tratamientos',
        options: SI_NO,
        detail: '¿Cuáles?',
        detailOn: 'Sí',
      },
      capilar('prp', 'PRP — plasma rico en plaquetas', '¿Cuándo y cuántas sesiones?'),
      capilar('mesoterapia', 'Mesoterapia capilar', '¿Cuándo y cuántas sesiones?'),
      capilar('microneedling', 'Microneedling capilar', '¿Cuándo y cuántas sesiones?'),
      capilar('laser', 'Láser capilar', '¿Desde cuándo y con qué frecuencia?', 'Casco, peine o banda LED'),
    ],
  },

  {
    id: 'rutina_cap',
    title: '5 · Rutina de cuidado capilar',
    fields: [
      {
        id: 'lavado_frecuencia',
        type: 'radio',
        label: 'Frecuencia de lavado',
        options: ['Diario', 'Día sí, día no', '2-3 veces por semana', '1 vez por semana o menos'],
      },
      { id: 'lavado_momento', type: 'radio', label: 'Momento del lavado', options: ['Mañana', 'Noche', 'Ambos', 'Varía'] },
      { id: 'champu', type: 'text', label: 'Champú habitual', placeholder: 'Marca y producto' },
      {
        id: 'champu_tipo',
        type: 'radio',
        label: '¿Tu champú es anticaída o específico, o de uso general?',
        options: ['Anticaída o específico', 'De uso general', 'No lo sé'],
      },
      { id: 'acondicionador', type: 'yesno', label: 'Acondicionador o mascarilla', options: SI_NO, detail: '¿Cuál?', detailOn: 'Sí' },
      {
        id: 'serum_cap',
        type: 'yesno',
        label: 'Sérum o loción capilar, fuera de tratamiento médico',
        options: SI_NO,
        detail: '¿Cuál y con qué frecuencia?',
        detailOn: 'Sí',
      },
      {
        id: 'coloracion',
        type: 'yesno',
        label: 'Coloración, mechas o alisado químico',
        options: SI_NO,
        detail: '¿Con qué frecuencia y desde cuándo?',
        detailOn: 'Sí',
      },
    ],
  },

  {
    id: 'estilo_vida_cap',
    title: '6 · Estilo de vida',
    fields: [
      {
        id: 'estres_cap',
        type: 'scale',
        label: 'Nivel de estrés percibido',
        min: 1,
        max: 10,
        minLabel: 'Nada estresada',
        maxLabel: 'Extremadamente estresada',
      },
      { id: 'sueno_horas_cap', type: 'text', label: 'Horas de sueño por noche', placeholder: 'Ej. 7' },
      { id: 'sueno_calidad_cap', type: 'radio', label: 'Calidad del sueño', options: ['Buena', 'Regular', 'Mala, no duermo bien'] },
      {
        id: 'actividad_cap',
        type: 'radio',
        label: 'Actividad física — frecuencia',
        options: ['Diaria', '2-3 veces por semana', '1 vez por semana', 'Apenas'],
      },
    ],
  },

  {
    id: 'preocupacion_cap',
    title: '7 · Preocupación principal',
    fields: [
      {
        id: 'preocupacion_capilar',
        type: 'textarea',
        label: '¿Qué es lo que más te preocupa de tu cabello o cuero cabelludo hoy?',
      },
    ],
  },
]

// ── Consentimiento informado y protección de datos ───────────────────────────
// Texto acordado con la clínica; se muestra igual en los dos cuestionarios,
// justo antes de la firma.
export const RESPONSABLE =
  'Quevi Wellness Clinic (NIF B88657044), NICA 70353, centro autorizado por la Junta de Andalucía. ' +
  'Calle Gibraltar 2, Bajos, 29680 Estepona, Málaga. Contacto: pacientes@queviwellnessclinic.es'

export const FINALIDAD =
  'Tus datos personales y de salud se usan para gestionar tu historia clínica, prestarte los servicios de Quevi ' +
  'y hacer seguimiento de tu tratamiento. La base legal es la ejecución del servicio médico y tu consentimiento ' +
  'expreso, al tratarse de datos de salud (art. 9.2.a RGPD). Se conservan mientras dure la relación asistencial ' +
  'y, como mínimo, el plazo que exige la Ley de Autonomía del Paciente. No se ceden a terceros salvo obligación ' +
  'legal o proveedores necesarios (laboratorios, sistemas de historia clínica) con las garantías de seguridad ' +
  'exigidas. Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y portabilidad ' +
  'escribiendo al email de contacto indicado arriba.'

// La primera es obligatoria para poder continuar; las demás son opcionales y
// ninguna viene marcada por defecto
export const CONSENTIMIENTO =
  'Autorizo el tratamiento de mis datos de salud para mi historia clínica y para recibir recomendaciones antes ' +
  'y después del tratamiento.'

export type OptionalConsent = { id: 'fotos' | 'comunicaciones' | 'promocion'; label: string }

export const CONSENTIMIENTOS_OPCIONALES: OptionalConsent[] = [
  {
    id: 'fotos',
    label: 'Autorizo la toma de fotografías y vídeos de carácter médico para el seguimiento de mi tratamiento.',
  },
  {
    id: 'comunicaciones',
    label: 'Autorizo recibir comunicaciones sobre citas, resultados o recordatorios por WhatsApp, e-mail o SMS.',
  },
  {
    id: 'promocion',
    label:
      'Autorizo el uso de mis fotos con fines científicos, docentes o de promoción de Quevi Wellness Clinic, ' +
      'anonimizando mis rasgos siempre que sea posible.',
  },
]

export const DECLARACION_PIEL =
  'Confirmo que la información aportada en este cuestionario es veraz y completa según mi conocimiento actual, ' +
  'y entiendo que es la base sobre la que el equipo de QUEVI Wellness Clinic interpretará mi chequeo de piel y ' +
  'diseñará mi plan de tratamiento.'

export const DECLARACION_CAPILAR =
  'Confirmo que la información aportada en este cuestionario es veraz y completa según mi conocimiento actual, ' +
  'y entiendo que es la base sobre la que el equipo de QUEVI Wellness Clinic diseñará mi plan de tratamiento capilar.'

// ── Avisos para el equipo médico ─────────────────────────────────────────────
// Respuestas que el panel debe destacar nada más abrir el cuestionario, porque
// condicionan qué se puede hacer con esa piel hoy.
export type Answers = Record<string, unknown>

type FlagRule = { label: string; check: (a: Answers) => boolean }

function val(a: Answers, id: string): string {
  const v = a[id]
  return typeof v === 'string' ? v : ''
}

function matrixVal(a: Answers, id: string, row: string): string {
  const m = a[id]
  if (!m || typeof m !== 'object') return ''
  const v = (m as Record<string, unknown>)[row]
  return typeof v === 'string' ? v : ''
}

const SKIN_FLAGS: FlagRule[] = [
  { label: 'Medicación fotosensible', check: a => val(a, 'fotosensibles') === 'Sí' },
  { label: 'Fotosensibles: no lo sabe', check: a => val(a, 'fotosensibles') === 'No lo sé' },
  { label: 'Alergia a medicamento', check: a => val(a, 'alergia_medicamento') === 'Sí' },
  { label: 'Alergia a antibiótico', check: a => val(a, 'alergia_antibiotico') === 'Sí' },
  { label: 'Producto permanente', check: a => val(a, 'permanentes') === 'Sí' },
  { label: 'Lunares que han cambiado', check: a => matrixVal(a, 'diagnosticos', 'lunares') === 'Sí' },
  { label: 'Antecedente de cáncer de piel', check: a => matrixVal(a, 'diagnosticos', 'cancer_personal') === 'Sí' },
  { label: 'Enfermedad de la piel diagnosticada', check: a => matrixVal(a, 'diagnosticos', 'enfermedades') === 'Sí' },
  { label: 'Riesgo de anafilaxia', check: a => val(a, 'contacto_cruzado').startsWith('Sí') },
  {
    label: 'Alergia cosmética',
    check: a =>
      ['acidos_exfoliantes', 'retinoides', 'vitamina_c', 'perfumes', 'filtros']
        .some(row => matrixVal(a, 'tolerancias', row) === 'Alergia / reacción fuerte'),
  },
  { label: 'Toma medicación habitual', check: a => val(a, 'medicamentos') === 'Sí' },
  { label: 'Antibióticos recientes', check: a => val(a, 'antibioticos') === 'Sí' },
]

// Los mismos puntos que en el cuestionario de tricología en papel iban
// marcados en color: condicionan qué tratamiento capilar es seguro hoy
const HAIR_FLAGS: FlagRule[] = [
  { label: 'Toma medicación habitual', check: a => val(a, 'med_habitual') === 'Sí' },
  { label: 'Corticoides o esteroides', check: a => val(a, 'corticoides') === 'Sí' },
  { label: 'Terapia hormonal o anticonceptivos', check: a => val(a, 'hormonal_cap') === 'Sí' },
  { label: 'Enfermedad autoinmune', check: a => val(a, 'autoinmune') === 'Sí' },
  { label: 'Minoxidil', check: a => val(a, 'cap_minoxidil') === 'Sí' },
  { label: 'Finasteride', check: a => val(a, 'cap_finasteride') === 'Sí' },
  { label: 'Dutasteride', check: a => val(a, 'cap_dutasteride') === 'Sí' },
  { label: 'Efectos secundarios previos', check: a => val(a, 'efectos_secundarios') === 'Sí' },
  { label: 'Trasplante capilar previo', check: a => val(a, 'trasplante') === 'Sí' },
  { label: 'Ferritina baja o anemia', check: a => val(a, 'ferritina') === 'Sí' },
  { label: 'Antecedentes de tiroides', check: a => val(a, 'tiroides') === 'Sí' },
]

// ── Los dos formularios ──────────────────────────────────────────────────────
export type FormKey = 'piel' | 'capilar'

export type QuestionnaireForm = {
  key: FormKey
  /** Ruta pública donde se rellena */
  slug: string
  /** Nombre corto, para las etiquetas del panel */
  label: string
  title: string
  declaracion: string
  /** Aviso que se muestra antes de firmar */
  aviso: string
  sections: Section[]
  flags: FlagRule[]
}

export const FORMS: Record<FormKey, QuestionnaireForm> = {
  piel: {
    key: 'piel',
    slug: '/chequeo-piel',
    label: 'Piel',
    title: 'Cuestionario previo al chequeo de piel',
    declaracion: DECLARACION_PIEL,
    aviso:
      'Los productos permanentes, los implantes y los tratamientos recientes con láser, peeling o ácidos pueden ' +
      'condicionar qué tratamientos son seguros para ti hoy. Por favor no omitas ningún dato, aunque parezca poco ' +
      'relevante.',
    sections: SKIN_SECTIONS,
    flags: SKIN_FLAGS,
  },
  capilar: {
    key: 'capilar',
    slug: '/chequeo-capilar',
    label: 'Capilar',
    title: 'Cuestionario previo a tratamientos de tricología',
    declaracion: DECLARACION_CAPILAR,
    aviso:
      'Los corticoides, las hormonas, el minoxidil, el finasteride o el dutasteride y un trasplante previo pueden ' +
      'condicionar qué tratamientos son seguros para ti hoy. No omitas ningún dato.',
    sections: HAIR_SECTIONS,
    flags: HAIR_FLAGS,
  },
}

export const FORM_KEYS: FormKey[] = ['piel', 'capilar']

export function isFormKey(value: unknown): value is FormKey {
  return value === 'piel' || value === 'capilar'
}

export function medicalFlags(form: FormKey, answers: Answers): string[] {
  return (FORMS[form]?.flags ?? []).filter(r => {
    try {
      return r.check(answers)
    } catch {
      return false
    }
  }).map(r => r.label)
}
