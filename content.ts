// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO QUEVI — WELLNESS CLINIC · MÁLAGA
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'QUEVI Wellness Clinic',
  tagline: 'Tu nueva historia de vida de piel',
  description:
    'No analizamos datos, entendemos tu historia clínica para diseñar tu mejor versión con tecnología de precisión.',
  phone: '+34 683 462 705',
  email: 'info@queviwellnessclinic.es',
  address: 'Calle Gibraltar 2, 29680 Estepona, Málaga',
  bookingUrl: '#booking',
}

export const NAV_LINKS = [
  { label: 'Inicio',       href: '#hero' },
  { label: 'Diagnóstico',  href: '#about' },
  { label: 'Tratamientos', href: '#services' },
  { label: 'Tecnología',   href: '#treatments' },
  { label: 'Rituales',     href: '#rituales' },
  { label: 'Testimonios',  href: '#testimonials' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contacto',     href: '#booking' },
]

export const HERO = {
  badge: 'QUEVI BIO-SCAN SKIN · Diagnóstico 360°',
  headline: 'Tu nueva historia\nde vida de piel',
  subheadline:
    'Aquí es donde empezamos a escribir tu nueva historia de vida de piel. No analizamos datos, entendemos tu historia clínica para diseñar tu mejor versión. Medicina estética de precisión con tecnología diagnóstica única.',
  cta1: { label: 'Solicitar diagnóstico', href: '#booking' },
  cta2: { label: 'Ver tratamientos',      href: '#services' },
  stats: [
    { value: '360°',  label: 'Diagnóstico personalizado' },
    { value: '4',     label: 'Tecnologías de precisión' },
    { value: '100%',  label: 'Medicina individualizada' },
  ],
}

export const SERVICES = [
  {
    id: 'shield',
    icon: '🛡',
    title: 'SHIELD — Bio-Protección',
    description:
      'El seguro de vida de tu piel contra el daño ambiental. Prevención activa antes de que el daño sea visible. Diagnóstico con Luz de Wood y sistemas AURA.',
    href: '#treatments',
  },
  {
    id: 'repair',
    icon: '✦',
    title: 'REPAIR — Regeneración',
    description:
      'Restauramos la capacidad biológica de la piel para sanarse. Células madre, PRP, bioestimuladores de colágeno y plan de nutrición basado en espectrofotometría.',
    href: '#treatments',
  },
  {
    id: 'boost',
    icon: '◈',
    title: 'BOOST — Optimización',
    description:
      'Biohacking y máximo rendimiento celular. Exosomas autólogos, fotobiomodulación LED, Ellegance infrarrojo vibracional y optimización del sueño y energía vital.',
    href: '#treatments',
  },
  {
    id: 'reset',
    icon: '◉',
    title: 'RESET / SOUL — Equilibrio',
    description:
      'Armonía para una belleza consciente. Cortamos el cortisol, enemigo principal del colágeno, con rituales médico-estéticos, aromaterapia clínica y mindfulness estético.',
    href: '#treatments',
  },
]

export const ABOUT = {
  badge: 'QUEVI BIO-SCAN SKIN',
  headline: 'No analizamos datos,\nentendemos tu historia',
  description:
    'El diagnóstico más completo de medicina estética. Cruzamos tu historial clínico con tres tecnologías de precisión para prescribir una rutina médica única, diseñada exclusivamente para tu piel y tu salud interna.',
  steps: [
    {
      number: '01',
      title: 'Anamnesis y consulta médica',
      description:
        'Todo comienza con una entrevista personal. Nuestro médico estético evalúa tu historial, estilo de vida, hábitos de sueño, alimentación y objetivos. Es el momento de entender el "porqué" de tu estado actual.',
    },
    {
      number: '02',
      title: 'Trilogía tecnológica AURA + N-GENE + OligoCheck',
      description:
        'Realizamos las tres pruebas de precisión: AURA (tu estado facial en 3D), N-GENE (tu predisposición genética / ADN) y OLIGOCHECK (tus niveles de minerales y metales pesados en tiempo real).',
    },
    {
      number: '03',
      title: 'Valoración del informe médico',
      description:
        'El médico especialista cruza los resultados tecnológicos con tu anamnesis para emitir un juicio clínico. Interpretamos las gráficas de OligoCheck y cruzamos el mapa de AURA con tu genética N-GENE.',
    },
    {
      number: '04',
      title: "Prescripción y cosmética Dall'O Skin",
      description:
        'Con el informe validado, prescribimos tu rutina de cosmética personalizada. No es una recomendación comercial, es una fórmula médica diseñada exclusivamente para los parámetros de tu piel y tu salud interna.',
    },
  ],
  features: [
    'Anamnesis y consulta médica personalizada',
    'Trilogía tecnológica: AURA (3D facial) + N-GENE (ADN) + OLIGOCHECK (minerales)',
    'Valoración del informe médico con juicio clínico experto',
    "Prescripción de cosmética Dall'O Skin con fórmula médica exclusiva",
  ],
  doctor: {
    name: 'Equipo Médico QUEVI',
    title: 'Medicina Estética Avanzada · Diagnóstico 360°',
    bio: 'Especialistas en medicina estética con diagnóstico de precisión. Formados en las últimas tecnologías de análisis dérmico genético y molecular.',
  },
}

export const STATS = [
  { value: 4,    suffix: '',   label: 'Tecnologías de diagnóstico' },
  { value: 360,  suffix: '°',  label: 'Diagnóstico personalizado' },
  { value: 7,    suffix: '+',  label: 'Terapias ProAging' },
  { value: 0,    suffix: '',   label: 'Protocolos genéricos' },
]

export interface TreatmentDetail {
  application?: string
  benefits?: string[]
  duration?: string
  sessions?: string
  durability?: string
  anesthesia?: string
  requirements?: string
  aftercare?: string
  note?: string
}

export interface Treatment {
  name: string
  desc: string
  detail: TreatmentDetail
}

export const TREATMENTS: { category: string; items: Treatment[] }[] = [
  {
    category: 'Terapias ProAging',
    items: [
      {
        name: 'Neuromoduladores',
        desc: 'Atenuación de arrugas dinámicas para una expresión serena.',
        detail: {
          benefits: [
            'Minimiza arrugas faciales',
            'Mejora el aspecto de la piel',
            'Apariencia más relajada y rejuvenecida',
          ],
          sessions: '1 sesión cada 3–6 meses',
          durability: '3–4 meses, variable según tipo de piel y hábitos de vida',
          aftercare:
            'Rutina personalizada de SkinCare. Protección solar estricta. Evitar sauna y nieve para prevenir hiperpigmentación.',
        },
      },
      {
        name: "DallÒ LIPS",
        desc: 'Labios definidos con ácido hialurónico reticulado. El efecto "Glow".',
        detail: {
          application:
            'Valoración morfológica exhaustiva del labio, musculatura perioral y oclusión dental, con imágenes en reposo y movimiento antes del tratamiento.',
          benefits: [
            'Volumen natural y simétrico',
            'Efecto glow inmediato',
            'Mejora en el perfil y proyección del labio',
          ],
          duration: '30–60 minutos',
          anesthesia: 'Local o infiltrativa',
          durability: '6 a 12 meses',
          aftercare: 'Evitar calor intenso (sol, sauna). Posibles hematomas o edema durante 7 días.',
        },
      },
      {
        name: 'Arquitectura Face',
        desc: 'Ácido hialurónico y bioestimuladores de colágeno para restaurar el contorno facial con naturalidad y precisión.',
        detail: {
          benefits: [
            'Reposición de volumen facial',
            'Redefinición del óvalo facial',
            'Mejora de la textura y elasticidad cutánea',
          ],
          duration: '30–60 minutos',
          anesthesia: 'Local o infiltrativa',
          durability: '6 a 18 meses (según estilo de vida)',
          aftercare: 'SkinCare médica personalizada. Protección solar. Evitar sauna y nieve.',
          note: 'Es fundamental mantener expectativas realistas. En ciertos casos puede requerirse más de una sesión para lograr resultados óptimos.',
        },
      },
      {
        name: 'PRP Photoativa',
        desc: 'Concentrado plaquetario activado por luz para mejorar textura facial y densidad capilar. Regeneración desde adentro.',
        detail: {
          application:
            'Plasma obtenido de tu propia sangre, rico en factores de crecimiento que estimulan regeneración celular. Micro inyecciones intradérmicas con pápulas.',
          duration: '30–60 minutos',
          sessions: 'Cada 4–6 semanas',
          durability: '3–12 meses',
          requirements: 'Pruebas de VIH, hepatitis, sífilis, hemograma, coagulación.',
          aftercare: 'Rutina médica. Protección solar. Evitar sauna, sol y nieve.',
        },
      },
      {
        name: 'PDRN — Polinucleótidos',
        desc: 'Revitaliza desde el ADN. Derivados de salmón que actúan sobre inflamación, pigmentación y regeneración celular.',
        detail: {
          application: 'Mesoterapia con micro agujas.',
          benefits: ['Rosácea', 'Melasma', 'Arrugas finas', 'Acné atrófico'],
          sessions: '1–4, con intervalos de 4–6 semanas',
          duration: '30–60 minutos',
          aftercare: 'Rutina médica. Protección solar. Evitar calor extremo.',
        },
      },
      {
        name: 'Peelings',
        desc: 'Revela una piel renovada, uniforme y visiblemente más tersa. Fórmulas adaptadas a tu tipo de piel.',
        detail: {
          benefits: [
            'Exfoliación profunda y controlada',
            'Mejora la calidad y uniformidad de la piel',
            'Atenúa cicatrices causadas por acné',
            'Aporta luminosidad y suavidad',
          ],
          sessions: '2–4 sesiones, espaciadas cada 4–6 semanas según diagnóstico médico',
          aftercare: 'Rutina personalizada de SkinCare indicada por el equipo médico. Protección solar estricta.',
        },
      },
      {
        name: 'SEFFILLER — Células Madre',
        desc: 'Uso de tejido adiposo propio para auxiliar en producción de colágeno y vitalidad cutánea duradera.',
        detail: {
          application:
            'Extracción bajo anestesia local (abdomen o caderas) + infiltración en zonas estratégicas.',
          benefits: ['Mejora de textura', 'Elasticidad', 'Calidad dérmica'],
          sessions: '1–2, con mantenimiento cada 24 meses',
          aftercare:
            'Higiene, protección solar, evitar calor excesivo. Posibles hematomas o inflamación leve por 7 días.',
        },
      },
    ],
  },
  {
    category: 'Tecnologías High-Tech',
    items: [
      {
        name: 'Fototerapia LED — Biohacking Lumínico',
        desc: 'Autorregulación celular y equilibrio dérmico. Estimula el metabolismo celular y promueve la autorregulación natural de la piel.',
        detail: {
          application:
            'Dispositivo médico clase II con luz roja (660 nm) e infrarroja (850 nm).',
          duration: '30–60 minutos',
          sessions: '1 cada 1–4 semanas',
          aftercare: 'Protección solar. Sin recuperación requerida.',
        },
      },
      {
        name: 'Ellegance — Infrarrojo Vibracional',
        desc: 'Combinación de calor infrarrojo y vibración hipertérmica que favorece la circulación, drenaje linfático y detox celular profundo.',
        detail: {
          duration: '30–60 minutos',
          sessions: '1–15 (cada 1–30 días)',
          aftercare: 'Adaptado según intensidad, supervisado por el equipo médico.',
        },
      },
      {
        name: 'Radiofrecuencia con Microagujas',
        desc: 'Tecnología bipolar que libera energía térmica en la dermis profunda. Textura uniforme, poros reducidos, tratamiento de cicatrices de acné.',
        detail: {
          application:
            'Energía térmica en dermis profunda sin dañar la epidermis. Reduce poros y mejora piel sensible o con acné.',
          duration: '30–60 minutos',
          sessions: '1–4 (cada 2–6 semanas)',
          aftercare: 'Posible inflamación leve. Seguir cuidados médicos personalizados.',
        },
      },
      {
        name: 'Láser CO₂',
        desc: 'Pulsos de luz infrarroja de alta energía que estimulan colágeno y tratan cicatrices, manchas y queratosis.',
        detail: {
          application:
            'Láser con larga trayectoria que utiliza dióxido de carbono como medio activo. Sus pulsos llegan a capas profundas de la piel.',
          duration: '60 minutos',
          sessions: 'Individualizadas por diagnóstico',
          aftercare: 'Recuperación de 7 a 21 días según intensidad. Posible inflamación leve a intensa.',
        },
      },
      {
        name: 'Fotorejuvenecimiento IPL',
        desc: 'Piel uniforme. Atenúa manchas solares y microvasos desde capas superficiales hasta profundas.',
        detail: {
          duration: '60 minutos',
          sessions: 'Personalizadas por indicación médica',
          aftercare: 'Recuperación de hasta 21 días en algunos casos. Posible inflamación leve a intensa.',
        },
      },
    ],
  },
]

export const RITUALES = [
  {
    id: 'bioblindskin',
    badge: 'Reset Biológico',
    name: 'D-BIOBLINDSKIN®',
    tagline: 'El despertar de tu piel',
    description:
      'Intervención biológica para ayudar a prevenir el daño del exposoma mediante microneedling, exosomas y sellado vibracional infrarrojo.',
    duration: '60–90 minutos',
    priceEur: 290,
    results: [
      'Poros visiblemente refinados y superficie cutánea suavizada',
      'Brillo "desde el interior", libre de signos de fatiga',
    ],
    phases: [
      {
        title: 'Diagnóstico Digital & Purificación',
        desc: 'Chequeo de alta tecnología para entender las necesidades de tu dermis. Limpieza profunda mediante hidro-succión y peeling de seda.',
      },
      {
        title: 'Infusión de Juventud',
        desc: 'Mediante Microneedling o Electroporación, canalizamos ácido hialurónico purificado, antioxidantes, PDRN y Exosomas.',
      },
      {
        title: 'Sellado Vibracional',
        desc: 'Biohacking Lumínico (LED) con terapia infrarroja vibracional exclusiva. Un masaje rítmico que sella los activos mientras te sumerges en relajación total.',
      },
    ],
  },
  {
    id: 'bodysculpt',
    badge: 'Arquitectura Corporal',
    name: 'D-BODY SCULPT & DETOX®',
    tagline: 'Arquitectura molecular para la silueta',
    description:
      'Tratamos el cuerpo no solo como forma, sino como un sistema biológico que necesita detoxificación y firmeza estructural.',
    duration: '60–90 minutos',
    priceEur: 320,
    results: [
      'Silueta armonizada y reducción de retención de líquidos',
      'Piel corporal elástica y rejuvenecida',
    ],
    phases: [
      {
        title: 'Bio-Limpieza de Adsorción',
        desc: 'Eliminación de metales pesados mediante bio-limpieza de adsorción de alta eficiencia.',
      },
      {
        title: 'Activos Lipolíticos y Tensores',
        desc: 'Entrega de activos lipolíticos y tensores que activan el drenaje osmótico.',
      },
      {
        title: 'Síntesis de Elastina',
        desc: 'Estimulación de la síntesis de elastina mejorando la calidad del tejido conectivo de forma estructural.',
      },
    ],
  },
  {
    id: 'zenharmony',
    badge: 'Neuro-Estético',
    name: 'D-ZEN HARMONY®',
    tagline: 'Cuando la mente se silencia, la piel se regenera',
    description:
      'Sinergia de aceites clínicos y masajes neuro-sedantes para auxiliar en el control de la inflamación del cuerpo.',
    duration: '60–90 minutos',
    priceEur: 260,
    results: [
      'Paz mental profunda',
      'Piel intensamente nutrida, calmada y libre de rojeces',
    ],
    phases: [
      {
        title: 'Fórmula Magistral Zen Harmony',
        desc: 'Sinergia de aceites de Incienso (Boswellia), Jojoba, Bergamota e Ylang-Ylang de grado clínico.',
      },
      {
        title: 'Masaje Neuro-Sedante',
        desc: 'Técnicas que activan el nervio vago, reduciendo el cortisol y restaurando la barrera lipídica.',
      },
      {
        title: 'Sellado Nutritivo',
        desc: 'Restauración profunda de la piel con nutrición intensa y calma cutánea duradera.',
      },
    ],
  },
  {
    id: 'activerelief',
    badge: 'Recuperación',
    name: 'D-ACTIVE RELIEF®',
    tagline: 'Fisioterapia molecular para tensiones profundas',
    description:
      'Diseñado para liberar al cuerpo de tensiones profundas y contracturas con activos como Árnica e Hipérico.',
    duration: '60 minutos',
    priceEur: 250,
    price: '250 € – 380 €',
    results: [
      'Alivio inmediato del dolor muscular',
      'Recuperación de la movilidad y descompresión total del cuerpo',
    ],
    phases: [
      {
        title: 'Emulsión D-Active Relief',
        desc: 'Árnica Montana, Gaultheria (aspirina natural) e Hipérico — potentes analgésicos y antiinflamatorios botánicos.',
      },
      {
        title: 'Liberación Miofascial',
        desc: 'Masaje que elimina el ácido láctico y desinfama las fibras musculares de forma acelerada.',
      },
      {
        title: 'Descompresión Total',
        desc: 'Sesión de inmersión total para la recuperación completa de la movilidad y el bienestar.',
      },
    ],
  },
]

export const SELLO_DALLO = {
  title: "El Sello Dall'O: Cuidado In & Out",
  description:
    "Todos nuestros rituales finalizan con nuestra exclusiva Infusión Antioxidante Molecular. Mientras tu piel se recupera por fuera, tu organismo absorbe colágeno y minerales por dentro, completando el ciclo de regeneración.",
  homecare:
    "Al finalizar, recibirás tu Prescripción Home-Care: una rutina de productos Dall'O Skin personalizada para mantener los resultados del ritual en tu vida diaria.",
}

export const TESTIMONIALS = [
  {
    name: 'María G.',
    role: 'Paciente QUEVI',
    rating: 5,
    text: 'El diagnóstico BIO-SCAN fue revelador. Por primera vez un médico entendió el origen real de mis problemas de piel. Los resultados hablan solos.',
  },
  {
    name: 'Carlos M.',
    role: 'Paciente QUEVI',
    rating: 5,
    text: 'Vine escéptico y salí convencido. El cruce de mi genética N-Gene con el análisis AURA fue algo que nunca había vivido. Totalmente personalizado.',
  },
  {
    name: 'Ana L.',
    role: 'Paciente QUEVI',
    rating: 5,
    text: 'La rutina de cosmética prescrita por el médico transformó mi piel en 6 semanas. No es una recomendación comercial, es una fórmula médica real.',
  },
  {
    name: 'Laura S.',
    role: 'Paciente QUEVI',
    rating: 5,
    text: 'Desde la sesión LED hasta el protocolo REPAIR, todo tiene un fundamento clínico. Se nota que es medicina de verdad, no solo estética.',
  },
]

export const BLOG_POSTS = [
  {
    date: 'Abr 2026',
    category: 'Diagnóstico',
    title: '¿Qué revela el análisis N-GENE sobre tu piel?',
    excerpt:
      'Tu ADN determina predisposiciones que ningún espejo puede ver. Descubre cómo el análisis genético cambia la medicina estética.',
    href: '#blog',
  },
  {
    date: 'Mar 2026',
    category: 'Biohacking',
    title: 'Fototerapia LED: ciencia detrás de la luz que rejuvenece',
    excerpt:
      'La luz roja e infrarroja no es magia. Es fotobiología celular. Te explicamos el mecanismo real detrás de los resultados.',
    href: '#blog',
  },
  {
    date: 'Feb 2026',
    category: 'Cortisol & Piel',
    title: 'Por qué el estrés destruye tu colágeno más rápido que el sol',
    excerpt:
      'El cortisol es el enemigo silencioso de tu piel. Así actúa nuestro protocolo RESET para cortarlo desde la raíz.',
    href: '#blog',
  },
  {
    date: 'Ene 2026',
    category: 'ProAging',
    title: 'SEFFILLER: células madre de tu propio cuerpo para tu piel',
    excerpt:
      'Usamos tu tejido adiposo para estimular colágeno. Sin materiales externos. La regeneración más natural y duradera.',
    href: '#blog',
  },
]

export const FAQS = [
  {
    question: '¿Qué es el diagnóstico BIO-SCAN SKIN 360°?',
    answer:
      'Es nuestro proceso diagnóstico exclusivo en 4 fases: anamnesis médica, análisis tecnológico con AURA + N-GENE + OLIGOCHECK, valoración del informe por un médico especialista y prescripción de cosmética médica personalizada.',
  },
  {
    question: '¿Qué diferencia a QUEVI de una clínica estética convencional?',
    answer:
      'Cada protocolo en QUEVI parte de un diagnóstico clínico real, no de una consulta estándar. Cruzamos tu historial, tu genética y tu bioquímica antes de tocar tu piel. El resultado es una prescripción médica, no una recomendación comercial.',
  },
  {
    question: '¿Cuántas sesiones necesito?',
    answer:
      'Depende del protocolo y de tu diagnóstico. Los neuromoduladores y rellenos pueden ser sesión única. Tecnologías como LED o Ellegance pueden requerir entre 1 y 15 sesiones. El médico lo define tras el BIO-SCAN.',
  },
  {
    question: '¿Son dolorosos los procedimientos?',
    answer:
      'La mayoría son muy bien tolerados. Aplicamos anestesia tópica o infiltrativa cuando es necesario. Tecnologías como la fototerapia LED o el infrarrojo vibracional Ellegance son completamente indoloras.',
  },
  {
    question: '¿Qué es el protocolo RESET/SOUL?',
    answer:
      'Es nuestra aproximación al bienestar mental como parte del cuidado de la piel. El cortisol crónico degrada el colágeno. RESET combina masajes y aromaterapia clínica, meditación guiada y mindfulness estético para reducir el cortisol desde adentro.',
  },
  {
    question: '¿En qué consisten los Rituales de Firma QUEVI?',
    answer:
      'Son experiencias de 60 a 90 minutos que combinan ingeniería cutánea y Biohacking. Cada ritual usa la línea Dall\'O Skin y tecnologías de entrega transdérmica para cuidar tu piel y tu cuerpo desde el interior. Incluyen: D-BIOBLINDSKIN®, D-BODY SCULPT & DETOX®, D-ZEN HARMONY® y D-ACTIVE RELIEF®.',
  },
  {
    question: '¿Puedo empezar sin haber hecho el diagnóstico?',
    answer:
      'Recomendamos siempre comenzar con el BIO-SCAN SKIN para garantizar resultados óptimos. Sin embargo, puedes consultar por tratamientos específicos. En todos los casos, la primera consulta médica es el primer paso.',
  },
]

export const FOOTER_LINKS = {
  servicios: [
    { label: 'SHIELD — Bio-Protección',  href: '#services' },
    { label: 'REPAIR — Regeneración',    href: '#services' },
    { label: 'BOOST — Optimización',     href: '#services' },
    { label: 'RESET / SOUL',             href: '#services' },
  ],
  empresa: [
    { label: 'Diagnóstico BIO-SCAN', href: '#about' },
    { label: 'Terapias ProAging',    href: '#treatments' },
    { label: 'Tecnología High-Tech', href: '#treatments' },
    { label: 'Rituales de Firma',    href: '#rituales' },
    { label: 'Contacto',             href: '#booking' },
  ],
  legal: [
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Aviso Legal',            href: '#' },
    { label: 'Cookies',                href: '#' },
  ],
}
