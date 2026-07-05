export interface BlogPost {
  slug: string
  date: string
  dateISO: string
  category: string
  title: string
  excerpt: string
  body: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'que-revela-analisis-n-gene-piel',
    date: 'Abril 2026',
    dateISO: '2026-04-15',
    category: 'Diagnóstico',
    title: '¿Qué revela el análisis N-GENE sobre tu piel?',
    excerpt:
      'Tu ADN determina predisposiciones que ningún espejo puede ver. Descubre cómo el análisis genético cambia la medicina estética.',
    body: [
      'Cuando te miras al espejo ves el presente de tu piel: su luminosidad, sus manchas, sus líneas. Lo que no puedes ver es su futuro. El análisis genético N-GENE lee exactamente eso: las predisposiciones escritas en tu ADN que determinarán cómo envejece tu piel en los próximos veinte años.',
      'El test analiza variantes genéticas asociadas a procesos clave del envejecimiento cutáneo: la velocidad a la que degradas colágeno, tu capacidad antioxidante natural, la predisposición a hiperpigmentación, la sensibilidad inflamatoria y la eficiencia de tu barrera cutánea. Cada persona presenta un perfil único, y ese perfil cambia radicalmente qué tratamientos tienen sentido y cuáles son una pérdida de tiempo y dinero.',
      'Un ejemplo práctico: dos pacientes de 40 años con piel aparentemente similar. La primera tiene una variante genética que acelera la degradación de colágeno; la segunda tiene una capacidad antioxidante reducida. La primera necesita bioestimuladores de colágeno cuanto antes; la segunda necesita un protocolo antioxidante intensivo con vitamina C estabilizada y protección solar estricta. Sin el análisis genético, ambas recibirían el mismo tratamiento genérico — y una de las dos estaría malgastando su inversión.',
      'En QUEVI, el N-GENE es una de las tres tecnologías del diagnóstico BIO-SCAN SKIN 360°, junto al análisis facial 3D AURA y la espectrofotometría OligoCheck. El médico cruza los tres resultados con tu historia clínica para emitir un juicio clínico real — no una recomendación comercial.',
      'La genética no es una condena: es un mapa. Conocer tus predisposiciones te permite adelantarte a ellas con la precisión que la medicina estética moderna hace posible.',
    ],
  },
  {
    slug: 'fototerapia-led-ciencia-luz-rejuvenece',
    date: 'Marzo 2026',
    dateISO: '2026-03-10',
    category: 'Biohacking',
    title: 'Fototerapia LED: la ciencia detrás de la luz que rejuvenece',
    excerpt:
      'La luz roja e infrarroja no es magia. Es fotobiología celular. Te explicamos el mecanismo real detrás de los resultados.',
    body: [
      'La fototerapia LED suena a tendencia de Instagram, pero es una de las tecnologías con más evidencia científica acumulada en dermatología. Su origen no está en la cosmética, sino en la NASA: investigando cómo cultivar plantas en el espacio, descubrieron que ciertas longitudes de onda aceleraban la cicatrización de heridas en los astronautas.',
      'El mecanismo se llama fotobiomodulación. Las mitocondrias — las centrales energéticas de tus células — contienen un cromóforo llamado citocromo c oxidasa que absorbe fotones de luz roja (660 nm) e infrarroja (850 nm). Al absorberlos, la mitocondria produce más ATP, la molécula de energía celular. Una célula con más energía sintetiza más colágeno, se repara más rápido y gestiona mejor la inflamación.',
      'La luz roja actúa en las capas superficiales: estimula fibroblastos, mejora la textura y aporta luminosidad. La infrarroja penetra hasta la dermis profunda, donde actúa sobre la microcirculación y los procesos regenerativos. La combinación de ambas, en sesiones de 30 a 60 minutos con dispositivos médicos de clase II, produce resultados acumulativos sin dolor, sin agujas y sin tiempo de recuperación.',
      'En QUEVI integramos la fototerapia LED dentro del pilar BOOST y como fase de sellado en varios de nuestros Rituales de Firma. También la usamos como potenciador post-tratamiento: después de un microneedling o un peeling, la luz acelera la recuperación y multiplica los resultados.',
      '¿Es para ti? Si buscas mejorar calidad de piel general, calmar inflamación o potenciar otros tratamientos, probablemente sí. La frecuencia ideal — entre 1 sesión semanal y 1 mensual — la define el médico tras el diagnóstico BIO-SCAN.',
    ],
  },
  {
    slug: 'estres-cortisol-destruye-colageno',
    date: 'Febrero 2026',
    dateISO: '2026-02-12',
    category: 'Cortisol & Piel',
    title: 'Por qué el estrés destruye tu colágeno más rápido que el sol',
    excerpt:
      'El cortisol es el enemigo silencioso de tu piel. Así actúa nuestro protocolo RESET para cortarlo desde la raíz.',
    body: [
      'Llevamos décadas hablando de protección solar — y con razón. Pero hay un agresor del que casi nadie habla y que trabaja contra tu piel las 24 horas del día: el cortisol crónico.',
      'El cortisol es la hormona del estrés. En picos puntuales es útil: te despierta por la mañana, te prepara para responder ante un peligro. El problema es el cortisol sostenido — el del estrés laboral, la falta de sueño, la sobreestimulación digital. Ese cortisol crónico tiene efectos directos y medibles sobre la piel: inhibe la síntesis de colágeno de los fibroblastos, degrada el colágeno existente activando las metaloproteinasas, debilita la barrera cutánea y dispara la inflamación de bajo grado que acelera todos los procesos de envejecimiento.',
      'Los estudios son contundentes: la piel de personas con estrés crónico envejece medible y visiblemente más rápido. La paradoja es que muchas de esas personas invierten en tratamientos estéticos cuyos resultados el propio cortisol sabotea. Estimular colágeno con un tratamiento mientras el cortisol lo degrada es llenar una bañera con el desagüe abierto.',
      'Por eso en QUEVI el equilibrio es un pilar clínico — RESET / SOUL — y no un extra de spa. Trabajamos la reducción del cortisol con herramientas concretas: masajes neuro-sedantes que activan el nervio vago, aromaterapia clínica con aceites de grado terapéutico (Boswellia, Ylang-Ylang, Bergamota), y técnicas de mindfulness estético que entrenan la respuesta de relajación.',
      'El ritual D-ZEN HARMONY® condensa este enfoque en 60-90 minutos: cuando la mente se silencia, la piel se regenera. No es una frase bonita — es fisiología.',
    ],
  },
  {
    slug: 'seffiller-celulas-madre-tejido-propio',
    date: 'Enero 2026',
    dateISO: '2026-01-20',
    category: 'ProAging',
    title: 'SEFFILLER: células madre de tu propio cuerpo para tu piel',
    excerpt:
      'Usamos tu tejido adiposo para estimular colágeno. Sin materiales externos. La regeneración más natural y duradera.',
    body: [
      'La medicina estética vive una transición profunda: de rellenar hacia regenerar. Y pocas tecnologías representan mejor ese cambio que SEFFILLER, un procedimiento que utiliza tu propio tejido adiposo como fuente de regeneración cutánea.',
      'El tejido adiposo es uno de los reservorios más ricos de células madre mesenquimales del cuerpo adulto. Estas células tienen una capacidad extraordinaria: donde se implantan, liberan factores de crecimiento que estimulan la formación de nuevo colágeno, elastina y vasos sanguíneos. No añaden volumen artificial — despiertan la maquinaria regenerativa de tu propia piel.',
      'El procedimiento es más sencillo de lo que suena. Bajo anestesia local, se extrae una pequeña cantidad de tejido adiposo (habitualmente del abdomen o las caderas). Ese tejido se procesa mecánicamente — sin manipulación enzimática, cumpliendo la normativa europea — para obtener la fracción rica en células regenerativas. Y se infiltra en las zonas estratégicas del rostro donde la piel ha perdido calidad, densidad y elasticidad.',
      'Los resultados no son inmediatos, y eso es precisamente su virtud: durante las semanas siguientes, la piel mejora progresivamente en textura, densidad y luminosidad, con una naturalidad que ningún material externo puede imitar. El mantenimiento típico es de una sesión cada 24 meses — frente a los 6-12 meses de los rellenos convencionales.',
      'SEFFILLER forma parte del pilar REPAIR de QUEVI y requiere valoración médica previa con el diagnóstico BIO-SCAN SKIN 360°. Porque regenerar bien empieza siempre por diagnosticar bien.',
    ],
  },
]
