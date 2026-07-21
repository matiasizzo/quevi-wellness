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
  address: 'Calle Gibraltar 2, Local Bajo, 29680 Estepona, Málaga',
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
  badge: 'QUEVI SKIN-SCAN · Diagnóstico 360°',
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
  badge: 'QUEVI SKIN-SCAN',
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
  duration?: string
  sessions?: string
  durability?: string
  anesthesia?: string
  requirements?: string
  recovery?: string
  aftercare?: string
  note?: string
}

export interface Treatment {
  name: string
  desc: string
  image: string
  detail: TreatmentDetail
}

export interface TreatmentCategory {
  category: string
  desc: string
  color: string
  items: Treatment[]
}

export const TREATMENTS: TreatmentCategory[] = [
  {
    category: 'Terapias ProAging',
    desc: 'Terapias que ayudan a estimular la renovación celular y prolongan la vida cutánea.',
    color: '#355539',
    items: [
      {
        name: 'Neuromoduladores',
        desc: 'Expresión serena y piel luminosa: atenúa las arrugas dinámicas reduciendo temporalmente la contracción muscular.',
        image: '/images/tratamientos/neuromoduladores.jpg',
        detail: {
          duration: '30 minutos',
          sessions: '1 sesión cada 3–6 meses',
          durability: '3–4 meses, variable según tipo de piel y hábitos de vida',
          aftercare:
            'Rutina personalizada de SkinCare, protección solar estricta y evitar sauna y nieve para prevenir hiperpigmentación.',
        },
      },
      {
        name: 'Remodelación Facial con Ácido Hialurónico',
        desc: 'Restaura el contorno facial con naturalidad y precisión: redefine el óvalo y mejora la textura y elasticidad cutánea.',
        image: '/images/tratamientos/hialuronico-v2.jpg',
        detail: {
          duration: '30–60 minutos',
          anesthesia: 'Local o infiltrativa',
          durability: '6 a 18 meses, según estilo de vida',
          aftercare: 'SkinCare médica personalizada, protección solar y evitar sauna y nieve.',
        },
      },
      {
        name: 'Remodelación de Labios — DallÒ LIPS',
        desc: 'Labios definidos, con volumen y efecto glow, con ácido hialurónico reticulado.',
        image: '/images/tratamientos/lips.jpg',
        detail: {
          application:
            'Valoración morfológica exhaustiva del labio, musculatura perioral y oclusión dental, complementada con imágenes en reposo y movimiento antes del tratamiento.',
          duration: '30–60 minutos',
          anesthesia: 'Local o infiltrativa',
          durability: '6 a 12 meses',
          aftercare: 'Evitar calor intenso (sol, sauna). Posibles hematomas o edema durante 7 días.',
          note: 'Es fundamental mantener expectativas realistas: en ciertos casos puede requerirse más de una sesión para lograr resultados óptimos.',
        },
      },
      {
        name: 'Plasma Concentrado en Plaquetas (PRP)',
        desc: 'Tratamiento regenerativo: plasma de tu propia sangre, rico en factores de crecimiento que estimulan la regeneración de piel, articulaciones y cabello.',
        image: '/images/tratamientos/prp-v2.jpg',
        detail: {
          application: 'Microinyecciones intradérmicas con pápulas.',
          duration: '30–60 minutos',
          anesthesia: 'Local o infiltrativa',
          sessions: '1 sesión cada 30–90 días',
          durability: '3–12 meses',
          requirements: 'Pruebas sanguíneas previas para confirmar que eres apto para este procedimiento.',
          aftercare: 'Rutina médica, protección solar y evitar sauna, sol y nieve.',
        },
      },
      {
        name: 'Revitalización Facial PDRN — Polinucleótidos',
        desc: 'Revitaliza desde el ADN, protege y calma: polidesoxirribonucleótidos derivados de salmón que auxilian en el control de la inflamación, la pigmentación y la regeneración celular.',
        image: '/images/tratamientos/pdrn.jpg',
        detail: {
          application: 'Mesoterapia con microagujas o radiofrecuencia, con anestesia local.',
          duration: '60 minutos',
          sessions: '1–4, con intervalos de 4–6 semanas',
          aftercare: 'Rutina médica, protección solar y evitar calor extremo.',
        },
      },
      {
        name: 'Inductores de Colágeno',
        desc: 'Activa el colágeno y mejora la calidad de tu piel: el ácido poli-D,L-láctico estimula la producción natural de colágeno.',
        image: '/images/tratamientos/inductores.jpg',
        detail: {
          application: 'Inyecciones con aguja fina o cánula, bajo anestesia local.',
          sessions: '1 cada 12 meses',
          durability: '12–18 meses, según fabricante',
          aftercare: 'Masajes dirigidos, rutina médica, protección solar y evitar calor y nieve.',
        },
      },
      {
        name: 'Peelings',
        desc: 'Exfoliación profunda y controlada que mejora la calidad y uniformidad de la piel, atenúa cicatrices de acné y aporta luminosidad y suavidad.',
        image: '/images/tratamientos/peelings.jpg',
        detail: {
          application: 'Combinaciones precisas de ácidos como glicólico, retinoico, tricloroacético, mandélico y kójico.',
          sessions: '2–4 sesiones, espaciadas cada 4–6 semanas según diagnóstico médico',
          aftercare:
            'Rutina personalizada de SkinCare indicada por el equipo médico, protector solar diario (SPF alto) y evitar sauna y nieve los días posteriores.',
        },
      },
    ],
  },
  {
    category: 'Tecnologías BOOST',
    desc: 'Innovación con tecnologías de última generación para potenciar la salud y belleza de tu piel.',
    color: '#b06e52',
    items: [
      {
        name: 'Fototerapia LED — Biohacking Lumínico',
        desc: 'Luz roja, azul e infrarroja que auxilia en la estimulación del metabolismo celular y promueve la autorregulación natural de la piel.',
        image: '/images/tratamientos/led.jpg',
        detail: {
          duration: '30–60 minutos',
          sessions: '1 cada 1–4 semanas',
          aftercare: 'Protección solar. Sin recuperación requerida.',
        },
      },
      {
        name: 'Microneedling — Radiofrecuencia con Microagujas',
        desc: 'Uniformiza la piel y trata cicatrices con energía térmica en la dermis profunda, sin dañar la epidermis. Reduce poros.',
        image: '/images/tratamientos/microneedling.jpg',
        detail: {
          duration: '30–60 minutos',
          sessions: '1–4, cada 2–6 semanas',
          aftercare: 'Posible inflamación leve; seguir los cuidados médicos personalizados.',
        },
      },
      {
        name: 'Elegance — Infrarrojo con Vibración Hipertérmica',
        desc: 'Bienestar facial y corporal: combina calor infrarrojo y vibración que favorece la circulación, el drenaje linfático y el detox celular.',
        image: '/images/tratamientos/elegance.jpg',
        detail: {
          duration: '30–60 minutos · indolora, sin anestesia',
          sessions: '1–15, cada 1–30 días',
          aftercare: 'Adaptado según intensidad, supervisado por el equipo médico.',
        },
      },
      {
        name: 'Láser CO₂',
        desc: 'Luz infrarroja de alta energía cuyos pulsos llegan a capas profundas de la piel: estimula colágeno y trata cicatrices, manchas y queratosis.',
        image: '/images/tratamientos/laser-co2.jpg',
        detail: {
          duration: '60 minutos',
          anesthesia: 'Local o infiltrativa',
          sessions: 'Individualizadas por diagnóstico',
          recovery: 'De 7 a 21 días, según intensidad',
          aftercare: 'Posible inflamación leve a intensa; seguir los cuidados médicos personalizados.',
        },
      },
      {
        name: 'Fotorejuvenecimiento IPL',
        desc: 'Piel luminosa y uniforme: luz pulsada intensa que trata melasma y atenúa manchas solares y microvasos, desde capas superficiales hasta profundas.',
        image: '/images/tratamientos/ipl.jpg',
        detail: {
          duration: '60 minutos',
          sessions: 'Personalizadas por indicación médica',
          recovery: 'Hasta 21 días en algunos casos',
          aftercare: 'Posible inflamación leve a intensa; seguir los cuidados médicos recomendados.',
        },
      },
    ],
  },
]

export interface RitualHomeCare {
  name: string
  vol: string
  desc: string
  image: string
}

export interface Ritual {
  id: string
  badge: string
  name: string
  tagline: string
  description: string
  duration: string
  priceEur: number
  /** Bono multi-sesión opcional (ej. pack de 10 sesiones) */
  pack?: { sessions: number; priceEur: number }
  color: string
  image: string
  results: string[]
  phases: { title: string; desc: string }[]
  homeCare: RitualHomeCare[]
}

/** Etiqueta usada en el selector de reservas para cada ritual */
export function ritualBookingLabel(name: string) {
  return name.startsWith('Ritual') ? name : `Ritual ${name}`
}

export const RITUALES: Ritual[] = [
  {
    id: 'd-purifying',
    badge: 'Ritual Facial',
    name: 'Ritual Facial D-Purifying',
    tagline: 'El reset biológico de tu piel',
    description:
      'Sesión de 60 minutos diseñada para ayudar a revertir los daños del exposoma (polución, radiación, estrés) y despertar la luminosidad perdida.',
    duration: '60 minutos',
    priceEur: 290,
    color: '#5f9c7d',
    image: '/images/rituales/cover-purifying.jpg',
    results: [
      'Piel visiblemente más firme y poros refinados',
      'Efecto glow saludable: los activos siguen trabajando hasta 72 h después de la sesión',
    ],
    phases: [
      {
        title: 'Higiene térmica y extracción celular',
        desc: 'Purificación profunda con mousse ozonizado, vapor e hidrosucción para limpiar cada poro.',
      },
      {
        title: 'Tecnología Ellegance — vibración + infrarrojo',
        desc: 'Estimulación profunda de colágeno, apta y segura incluso para pacientes hipertensas. Reduce la inflamación de la piel.',
      },
      {
        title: 'Infusión liposomada y Foto-Calma LED',
        desc: 'El sérum D-Purifying (ácido hialurónico liposomal termosensible, NAD y péptidos calmantes) sella el poro; el biohacking lumínico fija los activos en la membrana celular hasta 72 h.',
      },
    ],
    homeCare: [
      {
        name: 'D-Purifying Mousse Limpiador',
        vol: '150 ml',
        desc: 'Pureza ozonizada diaria.',
        image: '/images/rituales/d-purifying-mousse.jpg',
      },
      {
        name: 'Sérum D-Purifying',
        vol: '20 ml',
        desc: 'Bio-hidratación profunda y prolongada con hialurónico liposomal y péptidos.',
        image: '/images/rituales/d-purifying-serum.jpg',
      },
    ],
  },
  {
    id: 'd-longevity',
    badge: 'Ritual Facial',
    name: 'Ritual Facial D-Longevity',
    tagline: 'Reparación y longevidad',
    description:
      'Experiencia VIP de 60 minutos en cabina donde la biotecnología de vanguardia se une a la alta cosmética botánica para ayudar a restaurar la integridad cutánea.',
    duration: '60 minutos',
    priceEur: 290,
    color: '#b47ba0',
    image: '/images/rituales/cover-longevity.jpg',
    results: [
      'Firmeza y vitalidad recuperadas',
      'Textura renovada y barrera cutánea protegida',
    ],
    phases: [
      {
        title: 'Higiene de alta precisión y renovación',
        desc: 'Limpieza y oxigenación con aceites ozonizados, rosa mosqueta, ácidos glicólico y láctico, y vitaminas B5 y B12, mediante vapor e hidrosucción.',
      },
      {
        title: 'Tecnología Ellegance — vibración + infrarrojo',
        desc: 'Estimula el metabolismo celular, reduce la inflamación sistémica del tejido y activa la producción de colágeno.',
      },
      {
        title: 'Infusión bio-regenerativa D-Rescue con LED',
        desc: 'PDRN (polinucleótidos) y Superóxido Dismutasa (SOD) ayudan a la célula en su autorreparación, mientras el aceite de açaí y la Coenzima Q10 liposomada neutralizan el estrés oxidativo.',
      },
    ],
    homeCare: [
      {
        name: 'D-Longevity Mousse Limpiador',
        vol: '150 ml',
        desc: 'Pureza ozonizada y equilibrio del pH diario.',
        image: '/images/rituales/d-longevity-mousse.jpg',
      },
      {
        name: 'D-Rescue Serum',
        vol: '20 ml',
        desc: 'Bio-regeneración intensiva con PDRN, SOD y vitamina E para una sinergia antioxidante superior.',
        image: '/images/rituales/d-rescue-serum.jpg',
      },
    ],
  },
  {
    id: 'd-evenglow',
    badge: 'Ritual Facial',
    name: 'Ritual Facial D-Evenglow',
    tagline: 'Uniformidad y luz',
    description:
      'Un "up" en el control de la pigmentación y la longevidad cutánea: 60 minutos para unificar el tono y devolver la luminosidad natural a la piel.',
    duration: '60 minutos',
    priceEur: 290,
    color: '#c08a2d',
    image: '/images/rituales/cover-evenglow.jpg',
    results: [
      'Tono visiblemente más uniforme',
      'Luminosidad natural recuperada y barrera cutánea fortalecida',
    ],
    phases: [
      {
        title: 'Higiene de alta precisión y renovación',
        desc: 'Limpieza profunda y oxigenación con aceites ozonizados, rosa mosqueta, ácidos glicólico y láctico, y vitaminas B5 y B12.',
      },
      {
        title: 'Tecnología Ellegance — vibración + infrarrojo',
        desc: 'Reduce la inflamación sistémica, activa el colágeno y prepara el tejido para la máxima penetración de activos.',
      },
      {
        title: 'Infusión D-Evenglow — inducción profesional',
        desc: 'Ampolla con PDRN, ácido tranexámico, glutatión y vitamina C aplicada mediante microneedling o radiofrecuencia, auxiliando a inhibir la síntesis de melanina.',
      },
      {
        title: 'Sellado Foto-Calma',
        desc: 'LED terapia final para neutralizar el estrés oxidativo y asegurar la autorreparación de la piel.',
      },
    ],
    homeCare: [
      {
        name: 'D-Longevity Mousse Limpiador',
        vol: '150 ml',
        desc: 'Pureza ozonizada y equilibrio del pH diario.',
        image: '/images/rituales/d-longevity-mousse.jpg',
      },
      {
        name: 'D-Evenglow Serum',
        vol: '20 ml',
        desc: 'PDRN, vitamina C estable, ácido tranexámico, hialurónico y niacinamida para unificar el tono a diario.',
        image: '/images/rituales/d-evenglow-serum.jpg',
      },
    ],
  },
  {
    id: 'zen-harmony',
    badge: 'Neuro-Estético · Face & Body',
    name: 'D-Zen Harmony',
    tagline: 'Cuando la mente se silencia, la piel se regenera',
    description:
      'El estrés crónico es el mayor oxidante de la piel y el causante del envejecimiento inflamatorio (inflammaging). Una experiencia inmersiva que equilibra el eje mente-cuerpo con aceites esenciales de grado clínico y biohacking.',
    duration: '60 minutos',
    priceEur: 260,
    color: '#7f9987',
    image: '/images/rituales/ritual-zen.jpg',
    results: [
      'Paz mental profunda y cortisol a la baja',
      'Piel desinflamada, oxigenada y calmada',
    ],
    phases: [
      {
        title: 'Inmersión sensorial y meditación',
        desc: 'Música de alta relajación, bruma de aromaterapia y meditación guiada para ralentizar el ritmo cardíaco y liberar la mente.',
      },
      {
        title: 'Biohacking lumínico + masaje neuro-sedante',
        desc: 'LED selectivo sobre el rostro durante el masaje manual con la fórmula magistral de Incienso (Boswellia), Jojoba y Bergamota — activa el nervio vago y reduce el cortisol.',
      },
      {
        title: 'Terapia térmica Ellegance',
        desc: 'Vibración hipertérmica e infrarrojos en zonas clave de tensión para desinflamar la dermis, mejorar la microcirculación y oxigenar el tejido.',
      },
      {
        title: 'Drenaje y sello Zen — presoterapia',
        desc: 'Presoterapia suave para evacuar toxinas y activar el sistema linfático, con aromaterapia de anclaje y un té botánico antioxidante selecto.',
      },
    ],
    homeCare: [
      {
        name: 'D-AOX Oil',
        vol: '20 ml',
        desc: 'Aceite antioxidante de grado clínico — NMN, resveratrol, rosa mosqueta y vitamina E — para prolongar la calma antioxidante en casa.',
        image: '/images/rituales/d-aox-oil.jpg',
      },
    ],
  },
  {
    id: 'active-relief',
    badge: 'Recuperación · Face & Body',
    name: 'D-Active Relief',
    tagline: 'Biohacking muscular de alto rendimiento',
    description:
      '¿Cuerpo pesado, sobrecargado o con contracturas que no desaparecen? El nexo perfecto entre la medicina deportiva de alta competición y el bienestar de lujo. No es un masaje común.',
    duration: '60 minutos',
    priceEur: 250,
    color: '#2c4a68',
    image: '/images/rituales/ritual-active.jpg',
    results: [
      'Alivio inmediato del dolor muscular',
      'Movilidad recuperada y cuerpo descomprimido',
    ],
    phases: [
      {
        title: 'Descontracturante térmico — Ellegance',
        desc: 'Vibración hipertérmica e infrarrojos para ablandar las fascias y aumentar el riego sanguíneo al instante.',
      },
      {
        title: 'Liberación miofascial de élite',
        desc: 'Masaje técnico profundo con la emulsión magistral de Árnica, Gaultheria e Hipérico — potentes analgésicos clínicos que desactivan los puntos de dolor.',
      },
      {
        title: 'Reparación celular — LED infrarroja',
        desc: 'Luz de alta penetración que llega al corazón del músculo para desinflamar y acelerar la regeneración de los tejidos.',
      },
      {
        title: 'Vaciado de toxinas — presoterapia deportiva',
        desc: 'Compresión neumática secuencial que expulsa el ácido láctico acumulado, eliminando la fatiga de golpe.',
      },
    ],
    homeCare: [
      {
        name: 'D-Rescue Serum',
        vol: '20 ml',
        desc: 'Bio-regeneración intensiva con PDRN, SOD y vitamina E — el sistema de auxilio para acelerar la recuperación de la piel tras el esfuerzo.',
        image: '/images/rituales/d-rescue-serum.jpg',
      },
    ],
  },
  {
    id: 'relax-piernas',
    badge: 'Biohacking Muscular · Piernas',
    name: 'D-Relax Legs',
    tagline: 'Ligereza inmediata para piernas cansadas',
    description:
      'El ritual de biohacking muscular y linfático para piernas cansadas: reactiva la circulación, elimina la retención de líquidos, vacía toxinas y devuelve la ligereza inmediata a tus extremidades inferiores. En sesión única o bono de 10 sesiones.',
    duration: '60 minutos',
    priceEur: 100,
    pack: { sessions: 10, priceEur: 800 },
    color: '#b06e52',
    image: '/images/rituales/cover-piernas-v2.jpg',
    results: [
      'Ligereza inmediata y alivio de la pesadez',
      'Menos retención de líquidos y fatiga muscular borrada de golpe',
    ],
    phases: [
      {
        title: 'Activación térmica circulatoria — Ellegance',
        desc: 'Vibración hipertérmica con infrarrojos para dilatar los vasos sanguíneos, estimular el riego y ablandar los tejidos tensos de forma inmediata.',
      },
      {
        title: 'Masaje manual de retorno venoso',
        desc: 'Maniobras de drenaje linfático profundo con cremas y aceites personalizados. La emulsión magistral desinflama, activa el flujo sanguíneo y alivia la pesadez.',
      },
      {
        title: 'Presoterapia deportiva de vaciado',
        desc: 'Compresión neumática secuencial que actúa como bomba de retorno: expulsa el ácido láctico, elimina los líquidos acumulados y borra la fatiga de golpe.',
      },
    ],
    homeCare: [
      {
        name: 'D-AOX Oil',
        vol: '20 ml',
        desc: 'Aceite antioxidante de grado clínico para prolongar el masaje drenante en casa.',
        image: '/images/rituales/d-aox-oil.jpg',
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
    text: 'El diagnóstico SKIN-SCAN fue revelador. Por primera vez un médico entendió el origen real de mis problemas de piel. Los resultados hablan solos.',
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
    question: '¿Qué es el diagnóstico SKIN-SCAN Multiespectral?',
    answer:
      'Es un análisis multiespectral de 20–30 minutos en suite privada con la tecnología D-ScanSkin. Evalúa los 4 marcadores clave de degradación dérmica — inflamación silenciosa, glicación y reserva de colágeno, fotodaño acumulado y barrera biológica — y termina con valoración médica y prescripción personalizada. Precio oficial: 90 €; tu primera sesión es cortesía de QUEVI.',
  },
  {
    question: '¿Qué diferencia a QUEVI de una clínica estética convencional?',
    answer:
      'Cada protocolo en QUEVI parte de un diagnóstico clínico real, no de una consulta estándar. Cruzamos tu historial, tu genética y tu bioquímica antes de tocar tu piel. El resultado es una prescripción médica, no una recomendación comercial.',
  },
  {
    question: '¿Cuántas sesiones necesito?',
    answer:
      'Depende del protocolo y de tu diagnóstico. Los neuromoduladores y rellenos pueden ser sesión única. Tecnologías como LED o Ellegance pueden requerir entre 1 y 15 sesiones. El médico lo define tras el SKIN-SCAN.',
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
      'Recomendamos siempre comenzar con el SKIN-SCAN para garantizar resultados óptimos. Sin embargo, puedes consultar por tratamientos específicos. En todos los casos, la primera consulta médica es el primer paso.',
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
    { label: 'Diagnóstico SKIN-SCAN', href: '#about' },
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
