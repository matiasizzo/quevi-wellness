// ─────────────────────────────────────────────────────────────────────────────
// TEXTOS DE LAS LANDINGS DE CAMPAÑA (español e inglés)
//
// Una landing por idioma, con el mismo esqueleto. La regla que manda: el titular
// tiene que repetir literalmente lo que buscó el usuario. Quien busca "clínica
// estética Estepona" debe leer "Clínica de Medicina Estética en Estepona" antes
// de hacer nada más, o rebota.
//
// La oferta se escribe igual aquí que en el anuncio. Google audita esa
// coherencia, y además es lo que sostiene la confianza de la paciente.
// ─────────────────────────────────────────────────────────────────────────────

export type LandingCopy = {
  locale: 'es' | 'en'
  source: string
  /** Ruta de la versión en el otro idioma */
  altHref: string
  altLabel: string
  meta: { title: string; description: string }
  eyebrow: string
  headline: string
  headlineEm: string
  subheadline: string
  offer: { was: string; now: string; note: string }
  bullets: string[]
  stats: { value: string; label: string }[]
  form: {
    title: string
    subtitle: string
    name: string
    phone: string
    email: string
    interest: string
    interestOptions: string[]
    consent: string
    consentLink: string
    submit: string
    sending: string
    error: string
    successTitle: string
    successBody: string
    whatsapp: string
    disclaimer: string
  }
  includes: { title: string; items: { n: string; title: string; desc: string }[] }
  testimonialsTitle: string
  testimonials: { name: string; text: string }[]
  location: {
    title: string
    hoursLabel: string
    hours: string
    directions: string
    phoneLabel: string
  }
  faqTitle: string
  faq: { q: string; a: string }[]
  stickyCta: string
}

export const LANDING_ES: LandingCopy = {
  locale: 'es',
  source: 'landing-es',
  altHref: '/en/skin-consultation',
  altLabel: 'English',
  meta: {
    title: 'Diagnóstico de piel en Estepona — Primera sesión de cortesía',
    description:
      'Diagnóstico SKIN-SCAN Multiespectral en Estepona: 20–30 minutos con valoración médica y prescripción personalizada. Precio oficial 90 €, tu primera sesión es cortesía de QUEVI.',
  },
  eyebrow: 'QUEVI Wellness Clinic · Estepona, Málaga',
  headline: 'Diagnóstico de piel en Estepona,',
  headlineEm: 'de cortesía',
  subheadline:
    'Antes de tratar nada, entendemos por qué tu piel está como está. Análisis multiespectral con tecnología D-ScanSkin, valoración de un médico estético y una prescripción hecha solo para ti.',
  offer: { was: '90 €', now: 'Cortesía', note: 'Primera sesión · sin compromiso' },
  bullets: [
    '20–30 minutos en suite privada, con médico estético',
    'Analizamos inflamación, glicación, fotodaño y barrera cutánea',
    'Sales con un informe y una rutina prescrita, no con un presupuesto',
    'Sin compromiso de contratar ningún tratamiento',
  ],
  stats: [
    { value: '360°', label: 'Diagnóstico completo' },
    { value: '4', label: 'Marcadores medidos' },
    { value: '30 min', label: 'Duración' },
  ],
  form: {
    title: 'Pide tu diagnóstico',
    subtitle: 'Te llamamos para darte cita. Sin pagar nada por adelantado.',
    name: 'Nombre y apellidos',
    phone: 'Teléfono',
    email: 'Email',
    interest: '¿Qué te preocupa? (opcional)',
    interestOptions: [
      'Diagnóstico SKIN-SCAN',
      'Arrugas y líneas de expresión',
      'Manchas y tono desigual',
      'Firmeza y pérdida de colágeno',
      'Acné o piel reactiva',
      'Todavía no lo sé',
    ],
    consent: 'He leído y acepto la',
    consentLink: 'política de privacidad',
    submit: 'Solicitar mi diagnóstico',
    sending: 'Enviando…',
    error: 'No hemos podido enviar la solicitud. Prueba otra vez o escríbenos por WhatsApp.',
    successTitle: 'Solicitud recibida',
    successBody:
      'Te llamamos en horario de clínica (lunes a viernes, de 9:00 a 20:00) para darte cita. Si prefieres ir más rápido, escríbenos por WhatsApp.',
    whatsapp: 'Escribir por WhatsApp',
    disclaimer: 'Tus datos se usan solo para gestionar tu cita. No enviamos publicidad sin tu permiso.',
  },
  includes: {
    title: 'Qué incluye el diagnóstico',
    items: [
      {
        n: '01',
        title: 'Anamnesis y consulta médica',
        desc: 'Una entrevista personal donde el médico evalúa tu historial, estilo de vida, descanso y objetivos. Es el momento de entender el porqué.',
      },
      {
        n: '02',
        title: 'Análisis multiespectral D-ScanSkin',
        desc: 'Medimos los cuatro marcadores de degradación dérmica: inflamación silenciosa, glicación y reserva de colágeno, fotodaño acumulado y barrera biológica.',
      },
      {
        n: '03',
        title: 'Valoración del informe',
        desc: 'El médico cruza los resultados con tu anamnesis y emite un juicio clínico. No es una lectura automática de datos.',
      },
      {
        n: '04',
        title: 'Prescripción personalizada',
        desc: 'Sales con una rutina médica diseñada para los parámetros de tu piel. Tú decides si la sigues aquí o por tu cuenta.',
      },
    ],
  },
  testimonialsTitle: 'Lo que dicen nuestras pacientes',
  testimonials: [
    {
      name: 'María G.',
      text: 'El diagnóstico SKIN-SCAN fue revelador. Por primera vez un médico entendió el origen real de mis problemas de piel.',
    },
    {
      name: 'Carlos M.',
      text: 'Vine escéptico y salí convencido. El cruce de mi genética con el análisis facial fue algo que nunca había vivido.',
    },
    {
      name: 'Ana L.',
      text: 'La rutina prescrita por el médico transformó mi piel en 6 semanas. No es una recomendación comercial, es una fórmula médica.',
    },
  ],
  location: {
    title: 'Dónde estamos',
    hoursLabel: 'Horario',
    hours: 'Lunes a viernes, de 9:00 a 20:00',
    directions: 'Cómo llegar',
    phoneLabel: 'Llamar ahora',
  },
  faqTitle: 'Antes de que preguntes',
  faq: [
    {
      q: '¿De verdad es gratis?',
      a: 'El diagnóstico tiene un precio oficial de 90 € y la primera sesión es cortesía de QUEVI. No hay letra pequeña ni obligación de contratar nada después.',
    },
    {
      q: '¿Cuánto dura?',
      a: 'Entre 20 y 30 minutos en suite privada, incluyendo el análisis y la valoración médica.',
    },
    {
      q: '¿Tengo que pagar algo el día de la cita?',
      a: 'No. Si después decides hacer algún tratamiento, te damos el precio por escrito antes de empezar.',
    },
  ],
  stickyCta: 'Pedir diagnóstico',
}

export const LANDING_EN: LandingCopy = {
  locale: 'en',
  source: 'landing-en',
  altHref: '/cita/diagnostico',
  altLabel: 'Español',
  meta: {
    title: 'Skin Diagnosis in Estepona — First Session on Us',
    description:
      'Multispectral SKIN-SCAN diagnosis in Estepona: a 20–30 minute analysis with a doctor’s assessment and a personalised prescription. Regular price €90, your first session is on us.',
  },
  eyebrow: 'QUEVI Wellness Clinic · Estepona, Málaga',
  headline: 'Skin diagnosis in Estepona,',
  headlineEm: 'on us',
  subheadline:
    'Before treating anything, we work out why your skin is the way it is. Multispectral analysis with D-ScanSkin technology, an aesthetic doctor’s assessment, and a prescription built only for you.',
  offer: { was: '€90', now: 'On us', note: 'First session · no obligation' },
  bullets: [
    '20–30 minutes in a private suite, with an aesthetic doctor',
    'We measure inflammation, glycation, sun damage and skin barrier',
    'You leave with a report and a prescribed routine, not a quote',
    'No obligation to book any treatment',
  ],
  stats: [
    { value: '360°', label: 'Full diagnosis' },
    { value: '4', label: 'Markers measured' },
    { value: '30 min', label: 'Duration' },
  ],
  form: {
    title: 'Book your diagnosis',
    subtitle: 'We call you back to arrange a time. Nothing to pay upfront.',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    interest: 'What concerns you? (optional)',
    interestOptions: [
      'SKIN-SCAN diagnosis',
      'Wrinkles and expression lines',
      'Pigmentation and uneven tone',
      'Firmness and collagen loss',
      'Acne or reactive skin',
      'Not sure yet',
    ],
    consent: 'I have read and accept the',
    consentLink: 'privacy policy',
    submit: 'Request my diagnosis',
    sending: 'Sending…',
    error: 'We could not send your request. Please try again or message us on WhatsApp.',
    successTitle: 'Request received',
    successBody:
      'We will call you during clinic hours (Monday to Friday, 9am to 8pm) to arrange your appointment. If you would rather be quicker, message us on WhatsApp.',
    whatsapp: 'Message us on WhatsApp',
    disclaimer: 'Your details are used only to arrange your appointment. No marketing without your permission.',
  },
  includes: {
    title: 'What the diagnosis includes',
    items: [
      {
        n: '01',
        title: 'Medical history and consultation',
        desc: 'A personal interview where the doctor reviews your history, lifestyle, sleep and goals. This is where we understand the why.',
      },
      {
        n: '02',
        title: 'D-ScanSkin multispectral analysis',
        desc: 'We measure the four markers of dermal degradation: silent inflammation, glycation and collagen reserve, accumulated sun damage and biological barrier.',
      },
      {
        n: '03',
        title: 'Report assessment',
        desc: 'The doctor cross-reads the results against your history and gives a clinical judgement. It is not an automated data readout.',
      },
      {
        n: '04',
        title: 'Personalised prescription',
        desc: 'You leave with a medical routine designed for your skin’s parameters. Whether you follow it here or elsewhere is up to you.',
      },
    ],
  },
  testimonialsTitle: 'What our patients say',
  testimonials: [
    {
      name: 'María G.',
      text: 'The SKIN-SCAN diagnosis was eye-opening. For the first time a doctor understood the real source of my skin problems.',
    },
    {
      name: 'Carlos M.',
      text: 'I came sceptical and left convinced. Cross-reading my genetics against the facial analysis was something I had never experienced.',
    },
    {
      name: 'Ana L.',
      text: 'The routine the doctor prescribed transformed my skin in 6 weeks. It is not a sales pitch, it is a medical formula.',
    },
  ],
  location: {
    title: 'Where to find us',
    hoursLabel: 'Opening hours',
    hours: 'Monday to Friday, 9am to 8pm',
    directions: 'Get directions',
    phoneLabel: 'Call now',
  },
  faqTitle: 'Before you ask',
  faq: [
    {
      q: 'Is it really free?',
      a: 'The diagnosis has a regular price of €90 and the first session is on us. There is no small print and no obligation to book anything afterwards.',
    },
    {
      q: 'How long does it take?',
      a: 'Between 20 and 30 minutes in a private suite, including the analysis and the doctor’s assessment.',
    },
    {
      q: 'Do I pay anything on the day?',
      a: 'No. If you then decide to go ahead with a treatment, you get the price in writing before we start.',
    },
  ],
  stickyCta: 'Book diagnosis',
}
