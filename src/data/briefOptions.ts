/* ============================================================
   NOXTUA. Opciones del formulario de brief
   Copiadas 1:1 del archivo original (index 1.html).
   NO editar el copy salvo que se quiera cambiar la web.
   ============================================================ */

export const STEP_NAMES = ["Servicios", "Tu negocio", "Situación", "Objetivos", "Presupuesto", "Cierre"];

export type Opt = { i?: string; t: string; d?: string };

/* ---------- Opciones del formulario (FORM_DATA) ---------- */
export type FormOptions = {
  servicios: Opt[];
  plataformas: string[];
  adsStatus: Opt[];
  objetivos: Opt[];
  plazo: Opt[];
  involucramiento: Opt[];
  accesos: string[];
  materiales: string[];
  cuando: Opt[];
};

export const FORM: FormOptions = {
  servicios: [
    { i:"📱", t:"Meta Ads",           d:"Publicidad en Facebook e Instagram" },
    { i:"🔍", t:"Google Ads",         d:"Search, Display y YouTube" },
    { i:"🌐", t:"SEO",                d:"Posicionamiento orgánico en buscadores" },
    { i:"🤖", t:"GEO / IA Search",    d:"Visibilidad en ChatGPT y Perplexity" },
    { i:"📸", t:"Redes sociales",     d:"Gestión de contenido e Instagram" },
    { i:"✍️", t:"Contenido y blog",   d:"Artículos, textos y contenido web" },
    { i:"🎨", t:"Diseño gráfico",     d:"Identidad visual, piezas y creatividades" },
    { i:"💻", t:"Diseño web",         d:"Landing pages y sitios web" },
    { i:"📧", t:"Email marketing",    d:"Newsletters y automatizaciones" },
    { i:"🛒", t:"E-commerce",         d:"Tiendas online y optimización de ventas" },
    { i:"📊", t:"Analytics e informes",d:"Tableros y reportes de rendimiento" },
    { i:"💡", t:"Consultoría IA",     d:"Implementación de IA en tu negocio" }
  ],
  plataformas: ["Instagram","Facebook","TikTok","YouTube","LinkedIn","X / Twitter","WhatsApp Business","Sitio web","Tienda Nube","MercadoLibre","Ninguna todavía"],
  adsStatus: [
    { t:"Sí, tengo campañas activas",  d:"Están corriendo ahora mismo" },
    { t:"Lo hice antes pero paré",     d:"Nos vas a contar por qué en la reunión" },
    { t:"Nunca hice publicidad paga",  d:"Arrancamos desde cero, sin vicios" }
  ],
  objetivos: [
    { t:"Conseguir más clientes o ventas",  d:"Aumentar el volumen de leads o transacciones" },
    { t:"Mejorar el costo por venta",       d:"Gastar menos para el mismo resultado" },
    { t:"Crecer en redes sociales",         d:"Más comunidad, más interacción" },
    { t:"Posicionarme en Google",           d:"Aparecer cuando buscan lo que vendo" },
    { t:"Lanzar un producto o servicio",    d:"Necesito visibilidad para algo que arranca" },
    { t:"Construir o mejorar mi marca",     d:"Imagen, identidad y percepción" },
    { t:"Retener clientes existentes",      d:"Fidelización, email y recompra" },
    { t:"Escalar lo que ya funciona",       d:"Tengo algo que convierte y quiero más volumen" }
  ],
  plazo: [
    { t:"1 mes",     d:"Quiero probar primero" },
    { t:"3 meses",   d:"Tiempo real para ver resultados" },
    { t:"6 meses",   d:"Apuesto a una estrategia" },
    { t:"Sin límite",d:"Busco una agencia de largo plazo" }
  ],
  involucramiento: [
    { t:"Muy involucrado",  d:"Quiero aprobar todo antes de publicar" },
    { t:"Intermedio",       d:"Solo lo estratégico y resultados semanales" },
    { t:"Delego",           d:"Confío en el equipo, quiero reportes mensuales" }
  ],
  accesos: ["Business Manager de Meta","Cuenta de Google Ads","Google Analytics","Google Search Console","Instagram (perfil de empresa)","Facebook (página)","Hosting o web","Tienda online","No tengo nada de esto todavía"],
  materiales: ["Logo en alta resolución","Manual de marca","Paleta de colores","Tipografías","Fotos profesionales","Videos","Nada por ahora"],
  cuando: [
    { t:"Esta semana",         d:"Tengo urgencia" },
    { t:"La semana que viene", d:"Sin apuro pero pronto" },
    { t:"Cuando puedan",       d:"Coordinamos por el calendario" }
  ]
};

/* ---------- Escala de presupuesto de pauta (CONFIG.presupuesto) ---------- */
export const PRESUPUESTO: { txt: string; band: string; note: string }[] = [
  { txt:"Todavía no lo sé",   band:"Lo definimos juntos en la reunión",              note:"Perfecto. En el diagnóstico te proponemos un mínimo realista según tu rubro y tu objetivo." },
  { txt:"Menos de USD 200",   band:"Presupuesto de arranque",                        note:"Con esta inversión conviene concentrarse en un solo objetivo y un solo canal. Te vamos a decir cuál." },
  { txt:"USD 200 – 350",      band:"Presupuesto de arranque",                        note:"Alcanza para validar audiencias y creatividades en un canal. Buen punto de partida." },
  { txt:"USD 350 – 500",      band:"Presupuesto inicial sólido",                     note:"Permite testear varias audiencias y salir de la fase de aprendizaje en tiempo razonable." },
  { txt:"USD 500 – 750",      band:"Presupuesto de crecimiento",                     note:"Suficiente para trabajar captación y remarketing en paralelo." },
  { txt:"USD 750 – 1.000",    band:"Presupuesto de crecimiento",                     note:"Podemos abrir un segundo canal y comparar rendimiento entre ambos." },
  { txt:"USD 1.000 – 1.500",  band:"Presupuesto de escala",                          note:"Rango donde la optimización semanal empieza a mover la aguja de verdad." },
  { txt:"USD 1.500 – 2.500",  band:"Presupuesto de escala",                          note:"Da margen para estructura de campañas por etapa del embudo." },
  { txt:"USD 2.500 – 3.500",  band:"Presupuesto avanzado",                           note:"Conviene sumar producción de contenido dedicada para no agotar las creatividades." },
  { txt:"USD 3.500 – 5.000",  band:"Presupuesto avanzado",                           note:"A este nivel el cuello de botella suele ser el volumen creativo, no el presupuesto." },
  { txt:"Más de USD 5.000",   band:"Presupuesto alto",                               note:"Armamos una propuesta a medida con dedicación reforzada del equipo." }
];

export const CALENDLY = "";
