/* ============================================================
   NOXTUA. Contenido del sitio
   Extraído 1:1 del archivo original (index 1.html).
   NO editar el copy salvo que se quiera cambiar la web.
   ============================================================ */

/* ---------- Contacto ---------- */
export const CONTACTO = {
  email: "noxtuacreative@gmail.com",
  whatsapp: "5492611234567",
  whatsappVisible: "+54 9 261 123 4567",
  ciudad: "Mendoza, Argentina",
} as const;

export const WA_DEFAULT_MSG = "Hola NOXTUA, me gustaría hacer una consulta.";

/* ---------- Navegación ---------- */
export const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Método", href: "#metodo" },
  { label: "Planes", href: "#planes" },
  { label: "Trabajo", href: "#trabajo" },
  { label: "Equipo", href: "#equipo" },
] as const;

export const NAV_LINKS_MOBILE = [
  { label: "Servicios", href: "#servicios", num: "01" },
  { label: "Método", href: "#metodo", num: "02" },
  { label: "Planes", href: "#planes", num: "03" },
  { label: "Trabajo", href: "#trabajo", num: "04" },
  { label: "Equipo", href: "#equipo", num: "05" },
  { label: "Preguntas", href: "#faq", num: "06" },
] as const;

export const NAV_CTA = "Empezar el análisis";

/* ---------- Hero ---------- */
export const HERO = {
  badgeKicker: "Sin costo",
  badge: "Analizamos tu marca antes de la primera reunión",
  h1: [
    "Diseñamos tu marca,",
    "construimos tu sitio",
    "y hacemos que ",
  ],
  h1Em: "venda.",
  subBefore: "Cuatro personas trabajando sobre la misma estrategia para que la ",
  subStrong: "identidad, el sitio y las campañas",
  subAfter: " de tu negocio digan exactamente lo mismo.",
  primaryCta: "Solicitar el análisis",
  ghostCta: "Ver trabajo",
  note: "El análisis inicial no tiene costo y el formulario lleva ocho minutos.",
} as const;

/* ---------- Riel del hero (Cómo trabajamos) ---------- */
export const RAIL = {
  title: "Cómo trabajamos",
  live: "5 PASOS",
  foot: "Recibís el primer reporte de resultados a las 72 horas del lanzamiento.",
  ariaLabel: "Cronograma de incorporación",
  steps: [
    {
      num: "01",
      label: "Análisis previo",
      meta: "Revisamos tu sitio, tus redes y lo que publica tu competencia antes de hablar con vos.",
    },
    {
      num: "02",
      label: "Reunión de estrategia",
      meta: "Entre 60 y 90 minutos para acordar objetivos, métricas y accesos.",
    },
    {
      num: "03",
      label: "Marca y recursos visuales",
      meta: "Analizamos el material disponible y, si tu marca no tiene identidad, la construimos.",
    },
    {
      num: "04",
      label: "Estrategia y contenidos",
      meta: "Hasta 15 días hábiles para la primera entrega completa, lista para que la apruebes.",
    },
    {
      num: "05",
      label: "Lanzamiento y optimización",
      meta: "Publicamos con tu aprobación y revisamos el rendimiento cada semana.",
    },
  ],
} as const;

/* ---------- Marquesina ---------- */
export const MARQUEE_CLAIMS = [
  "Análisis inicial sin costo",
  "Marca, web y pauta en un mismo equipo",
  "Cronograma con fechas desde el primer día",
  "Reportes que se entienden",
  "Tus cuentas siempre son tuyas",
  "Un canal directo con el equipo",
  "Sin permanencia después del tercer mes",
  "Autorización de rubros regulados incluida",
] as const;

/* ---------- Diferencia ---------- */
export const DIFERENCIA = {
  eyebrow: "Por qué Noxtua",
  h2: "Contratar marketing no debería sentirse como una apuesta.",
  lead:
    "La mayoría de las marcas termina con un diseñador, alguien que hace la web y una tercera persona que gestiona la pauta, cada uno trabajando por su cuenta y con criterios distintos.",
  badTag: "Cómo lo resolvemos",
  badH3: "Un equipo, una estrategia",
  badP1:
    "Las diseñadoras, el desarrollador y el responsable de pauta trabajan sobre el mismo documento de estrategia, así que lo que se define para la identidad baja al sitio y a las campañas sin traducciones en el medio.",
  badP2:
    "Cuando algo deja de funcionar se corrige en los tres lugares a la vez, y siempre hablás con las mismas cuatro personas que están haciendo el trabajo.",
  goodTag: "Qué incluye siempre",
  goodH3: "Nuestros compromisos",
  goodItems: [
    "Análisis previo sin costo, con oportunidades concretas identificadas antes de que firmes nada.",
    "Identidad, sitio y campañas producidos por el mismo equipo.",
    "Si tu marca todavía no tiene recursos visuales, los creamos como parte del trabajo.",
    "Reportes que explican la inversión, el resultado y el siguiente paso.",
    "Un canal directo de WhatsApp con el equipo.",
  ],
} as const;

/* ---------- Servicios ---------- */
export const SERVICIOS_HEAD = {
  eyebrow: "Servicios",
  h2: "Todo lo que tu marca necesita para vender online.",
  lead:
    "Podés tomar una pieza suelta o el sistema completo. Lo que no hacemos es venderte algo que tu negocio todavía no necesita.",
} as const;

export type ServicioIco = "target" | "camera" | "palette" | "code" | "search" | "chart";

export const SERVICIOS: ReadonlyArray<{
  ico: ServicioIco;
  t: string;
  d: string;
  tags: string[];
}> = [
  {
    ico: "target",
    t: "Publicidad digital",
    d: "Campañas en Meta y Google pensadas para vender, no para juntar clics. Setup técnico, creatividades y optimización semanal.",
    tags: ["Meta Ads", "Google Ads", "Remarketing"],
  },
  {
    ico: "camera",
    t: "Redes y contenido",
    d: "Calendario editorial, piezas y textos con una línea visual consistente. Publicamos con intención, no por llenar la grilla.",
    tags: ["Instagram", "Facebook", "Contenido"],
  },
  {
    ico: "palette",
    t: "Identidad y diseño",
    d: "Sistemas de marca completos: logo, paleta, tipografía y las reglas para aplicarlos en cualquier canal sin que se desarme.",
    tags: ["Branding", "Sistema de marca", "Piezas"],
  },
  {
    ico: "code",
    t: "Diseño y desarrollo web",
    d: "Sitios y landings rápidas, medibles y pensadas para convertir el tráfico que traen las campañas.",
    tags: ["Landing", "Sitio", "E-commerce"],
  },
  {
    ico: "search",
    t: "SEO y visibilidad en IA",
    d: "Posicionamiento en Google y, cada vez más importante, aparecer cuando alguien pregunta por tu rubro en ChatGPT o Perplexity.",
    tags: ["SEO", "GEO / IA", "Contenido"],
  },
  {
    ico: "chart",
    t: "Analítica y reportes",
    d: "Medición bien configurada y un reporte mensual que explica qué se invirtió, qué produjo y qué sigue.",
    tags: ["GA4", "Tableros", "Email marketing"],
  },
];

/* ---------- Método ---------- */
export const METODO_HEAD = {
  eyebrow: "Método",
  h2: "Cinco etapas con fechas desde el primer día.",
  lead:
    "Este es el proceso que seguimos con cada cliente, desde antes de la primera reunión hasta la optimización mensual.",
} as const;

export const METODO: ReadonlyArray<{ n: string; t: string; d: string }> = [
  {
    n: "Paso 01",
    t: "Análisis previo",
    d: "Revisamos tu sitio, tus redes, tus reseñas y lo que publica tu competencia antes de la primera reunión.",
  },
  {
    n: "Paso 02",
    t: "Reunión de estrategia",
    d: "Entre 60 y 90 minutos para acordar objetivos, métricas y canales, y dejar resueltos los accesos.",
  },
  {
    n: "Paso 03",
    t: "Marca y recursos visuales",
    d: "Analizamos el material disponible y, si tu marca todavía no tiene identidad, la construimos antes de producir contenido.",
  },
  {
    n: "Paso 04",
    t: "Estrategia y contenidos",
    d: "Hasta 15 días hábiles para la primera entrega completa, lista para que la apruebes.",
  },
  {
    n: "Paso 05",
    t: "Lanzamiento y optimización",
    d: "Publicamos con tu aprobación, reportamos a las 72 horas y revisamos el rendimiento cada semana.",
  },
];

export const METODO_CALLOUT = {
  lead: "Sobre el período de aprendizaje:",
  body: " las campañas de Meta necesitan alrededor de 50 conversiones en siete días para que su optimización se estabilice, así que el costo por resultado suele moverse bastante durante las primeras semanas.",
} as const;

/* ---------- Planes ---------- */
export const PLANES_HEAD = {
  eyebrow: "Planes",
  h2: "Precios claros desde la primera conversación.",
  lead:
    "Honorarios de agencia. La inversión en plataformas (pauta) va aparte y siempre la controlás vos desde tu propia cuenta.",
} as const;

export const MONEDA = "USD";

/** Item de plan: `lead` se pinta en negrita, `rest` en el mismo párrafo. */
export type PlanItem = { lead?: string; rest: string };

export const PLANES: ReadonlyArray<{
  nombre: string;
  para: string;
  precio: number;
  periodo: string;
  destacado?: boolean;
  flag?: string;
  nota: string;
  items: PlanItem[];
  cta: string;
}> = [
  {
    nombre: "Presencia",
    para: "Marcas que necesitan verse bien y publicar con constancia.",
    precio: 390,
    periodo: "/mes",
    nota: "Compromiso inicial de 3 meses.",
    items: [
      { lead: "12 piezas mensuales", rest: " de contenido para redes" },
      { rest: "Calendario editorial y textos incluidos" },
      { rest: "Gestión de Instagram y Facebook" },
      { rest: "Diseño de historias y destacados" },
      { rest: "Reporte trimestral de comunidad" },
    ],
    cta: "Empezar con Presencia",
  },
  {
    nombre: "Performance",
    para: "Negocios que ya venden y quieren que la pauta rinda más.",
    precio: 590,
    periodo: "/mes",
    nota: "No incluye la inversión en plataformas.",
    items: [
      { lead: "Gestión de Meta Ads y Google Ads", rest: "" },
      { rest: "Setup técnico: píxel, conversiones y API" },
      { rest: "Creatividades y textos para campañas" },
      { rest: "Optimización semanal de presupuesto" },
      { rest: "Reporte mensual en lenguaje humano" },
      { rest: "Renovación de piezas cada 3–4 semanas" },
    ],
    cta: "Empezar con Performance",
  },
  {
    nombre: "Sistema",
    para: "Marcas que quieren identidad, web y pauta funcionando como una sola cosa.",
    precio: 950,
    periodo: "/mes",
    destacado: true,
    flag: "Más elegido",
    nota: "Incluye el sitio web sin costo de desarrollo inicial.",
    items: [
      { lead: "Todo lo de Presencia + Performance", rest: "" },
      { rest: "Sitio web o landing incluida y mantenida" },
      { rest: "Sistema de marca aplicado a todos los canales" },
      { rest: "Analítica unificada y tablero de resultados" },
      { rest: "Reunión mensual de estrategia" },
      { rest: "Prioridad de respuesta en el canal directo" },
    ],
    cta: "Empezar con Sistema",
  },
];

export const PLANS_FOOT = {
  strong: "¿Necesitás algo puntual?",
  rest: " También hacemos proyectos cerrados: identidad de marca, sitio web o landing de campaña, sin abono mensual.",
  cta: "Analizar mi caso",
} as const;

/* ---------- Trabajo (portafolio) ---------- */
export const TRABAJO_HEAD = {
  eyebrow: "Trabajo",
  h2: "Sistemas de marca que funcionan en todos lados.",
  lead:
    "Cada proyecto arranca por la estructura: qué dice la marca, cómo lo dice y en qué canal. Después viene lo visual.",
} as const;

export const TRABAJOS: ReadonlyArray<{
  cat: string;
  t: string;
  d: string;
  imgs: string[];
}> = [
  {
    cat: "Branding · Sistema de marca",
    t: "Un sistema que sostiene la marca en todos lados",
    d: "Construcción de identidad completa: del logotipo a las reglas de aplicación, para que la marca se vea igual de sólida en un cartel, en Instagram y en una factura.",
    imgs: [
      "/assets/Sistema de marca/Sist. de Marca s1.jpg",
      "/assets/Sistema de marca/Sist. de Marca s2.jpg",
      "/assets/Sistema de marca/Sist. de Marca s3.jpg",
    ],
  },
  {
    cat: "Comunicación · Multicanal",
    t: "Una sola idea, adaptada a cada canal",
    d: "Bajada de un mismo concepto a formatos de feed, historias, vía pública y piezas impresas, cuidando que el mensaje no se diluya al cambiar de soporte.",
    imgs: [
      "/assets/Comunicación Multicanal/Com. Multicanal S1.jpg",
      "/assets/Comunicación Multicanal/Com. Multicanal S2.jpg",
      "/assets/Comunicación Multicanal/Com. Multicanal S3.jpg",
      "/assets/Comunicación Multicanal/Com. Multicanal S4.jpg",
    ],
  },
];

export const WORK_INVITE = {
  cat: "Próximo proyecto",
  h3: "Acá va tu marca",
  p: "Estamos tomando tres proyectos nuevos este trimestre para poder trabajar de cerca con cada uno. Contanos el tuyo y vemos si encaja.",
  link: "Empezar el diagnóstico",
  ph: "Espacio disponible",
  phPlus: "+",
} as const;

/* ---------- Equipo ---------- */
export const EQUIPO_HEAD = {
  eyebrow: "Equipo",
  h2: "Un equipo de cuatro personas que trabaja de cerca con cada marca.",
  lead:
    "Quien diseña tu identidad, quien construye tu sitio y quien maneja tu pauta se sientan en la misma mesa y hablan con vos directamente.",
} as const;

export const EQUIPO: ReadonlyArray<{
  n: string;
  r: string;
  d: string;
  img: string;
  in: string;
}> = [
  {
    n: "Florentina Vera",
    r: "Dirección creativa · Diseño gráfico",
    d: "Define el concepto visual y la bajada de cada marca.",
    img: "/assets/FV.png",
    in: "https://www.linkedin.com/in/florentina-vera/",
  },
  {
    n: "Paula Sandri",
    r: "Diseño gráfico · Sistemas de marca",
    d: "Construye las piezas y las reglas que las mantienen coherentes.",
    img: "/assets/PS.png",
    in: "https://www.linkedin.com/in/paulasandridg/",
  },
  {
    n: "Lisandro Valdez",
    r: "Desarrollo web",
    d: "Construye los sitios, la medición y todo lo que hay detrás.",
    img: "/assets/LV.png",
    in: "https://www.linkedin.com/in/lisandro-valdez-6a603114b/",
  },
  {
    n: "Gastón Godoy",
    r: "Marketing digital · Pauta",
    d: "Estrategia, campañas y el contacto directo con vos.",
    img: "/assets/GG.png",
    in: "https://www.linkedin.com/in/gastongodoy7/",
  },
];

/* ---------- FAQ ---------- */
export const FAQ_HEAD = {
  eyebrow: "Preguntas",
  h2: "Lo que todos nos preguntan antes de empezar.",
} as const;

export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "¿Cuánto tarda en estar todo funcionando?",
    a: "La primera entrega de estrategia y contenidos lista para aprobar toma hasta 15 días hábiles, porque antes analizamos los recursos visuales de tu marca y, si hacen falta, los creamos. Una vez publicadas las campañas los primeros datos útiles aparecen dentro de la semana, aunque para leer tendencias reales hace falta un mes completo de actividad.",
  },
  {
    q: "¿El presupuesto de pauta va aparte de los honorarios?",
    a: "Sí, y siempre. La inversión en Meta o Google se carga con tu propia tarjeta en tu propia cuenta publicitaria: nosotros la administramos, pero la plata nunca pasa por nosotros. Vos ves cada peso gastado en tiempo real y podés frenar todo cuando quieras.",
  },
  {
    q: "¿Necesito tener todo listo para empezar?",
    a: "No. Si no tenés logo, ni web, ni cuentas publicitarias configuradas, eso es parte de lo que resolvemos. Lo único que necesitamos desde el día uno es que puedas darnos acceso a lo que sí existe y que haya alguien del lado tuyo que pueda aprobar.",
  },
  {
    q: "¿Tengo que firmar permanencia?",
    a: "Pedimos un compromiso inicial de 3 meses porque antes de ese plazo no hay datos suficientes para saber si algo funciona. Después de ese período seguís mes a mes, sin penalidad por irte.",
  },
  {
    q: "¿Quién es el dueño de las cuentas y las creatividades?",
    a: "Vos. Las cuentas publicitarias, el píxel, los datos y las piezas terminadas son tuyos. Si algún día dejamos de trabajar juntos, te quedás con todo y te ayudamos con la transición.",
  },
  {
    q: "¿Trabajan con negocios de rubros regulados?",
    a: "Sí. Tenemos experiencia gestionando la autorización especial que Meta exige para categorías reguladas como juego, salud o finanzas, que suele frenar a muchos anunciantes. Ese trámite lo llevamos nosotros y no tiene costo extra.",
  },
  {
    q: "¿Qué pasa si no me gusta una pieza?",
    a: "Nada sale publicado sin tu aprobación. Cada tanda de creatividades incluye rondas de ajuste, y si algo no representa a la marca lo rehacemos. Lo que sí vamos a hacer es explicarte cuándo una decisión estética puede costarte rendimiento.",
  },
  {
    q: "¿Cuánto cuesta el análisis inicial?",
    a: "Nada. Completás el formulario, revisamos tu situación y te devolvemos oportunidades concretas en una llamada de 30 minutos. Si después querés avanzar con nosotros, seguimos. Si no, el análisis te queda igual.",
  },
];

/* ---------- CTA final ---------- */
export const CTA = {
  eyebrow: "Próximo paso",
  h2: "Contanos en qué momento está tu marca y te devolvemos un plan concreto.",
  lead:
    "El formulario lleva ocho minutos, termina con la llamada agendada y llegamos a esa reunión con tu caso ya leído.",
  primary: "Empezar el análisis sin costo",
  ghost: "Escribir por WhatsApp",
  ghostHref: `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`,
  micro: ["Sin costo", "Respondemos en 24 horas hábiles"],
} as const;

/* ---------- Contacto (tarjetas) ---------- */
export const CONTACTO_CARDS = [
  {
    span: "Correo",
    strong: CONTACTO.email,
    em: "Respondemos en 24 h hábiles",
    href: `mailto:${CONTACTO.email}`,
    external: false,
  },
  {
    span: "Canal directo",
    strong: CONTACTO.whatsappVisible,
    em: "WhatsApp, de lunes a viernes de 9 a 18",
    href: `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`,
    external: true,
  },
  {
    span: "Base operativa",
    strong: CONTACTO.ciudad,
    em: "Trabajamos con clientes de toda Argentina",
    href: null,
    external: false,
  },
] as const;

/* ---------- Footer ---------- */
export const FOOTER = {
  brand: "Un equipo de cuatro personas que diseña marcas, construye sitios y gestiona campañas para negocios que quieren crecer con intención.",
  navTitle: "Navegación",
  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Método", href: "#metodo" },
    { label: "Planes", href: "#planes" },
    { label: "Trabajo", href: "#trabajo" },
    { label: "Equipo", href: "#equipo" },
  ],
  contactTitle: "Contacto",
  contact: [
    { label: "Análisis sin costo", href: "#/brief" },
    { label: "Escribirnos", href: `mailto:${CONTACTO.email}` },
    { label: "WhatsApp", href: `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}` },
    { label: "Acceso equipo", href: "#/panel" },
  ],
  bottom: "NOXTUA. Diseño, estrategia y comunicación con dirección.",
  city: "Mendoza, Argentina",
} as const;

/* ---------- FAB ---------- */
export const FAB = {
  label: "Hablemos",
  href: `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`,
} as const;
