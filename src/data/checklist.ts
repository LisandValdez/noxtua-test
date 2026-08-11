/* ============================================================
   NOXTUA. Checklist interno de incorporación
   Copiado 1:1 del archivo original (index 1.html).
   NO editar el copy salvo que se quiera cambiar la web.
   ============================================================ */

export type CheckItem = { t: string; d?: string; tag?: "crit" | "cliente" };

export type CheckPhase = { ico: string; t: string; sub: string; items: CheckItem[] };

export const CHECKLIST: CheckPhase[] = [
  { ico:"📋", t:"Etapa 01. Antes de la primera reunión", sub:"Lo que hacés antes de encontrarte con el cliente", items:[
    { t:"Enviar el link del formulario al cliente", tag:"cliente", d:"Por WhatsApp o email, pidiéndole que lo complete antes de la reunión." },
    { t:"Investigar el negocio antes de la reunión", d:"Web, Instagram, Facebook, reseñas de Google. Ver qué hace la competencia." },
    { t:"Revisar las respuestas del formulario", d:"Identificar qué hay que profundizar en persona y preparar preguntas específicas." },
    { t:"Confirmar la grabación de la reunión", d:"Activarla antes de que arranque la llamada." }
  ]},
  { ico:"🤝", t:"Etapa 02. La primera reunión", sub:"Duración estimada de 60 a 90 minutos", items:[
    { t:"Avisar que se está grabando", d:"Para tomar notas. En general no hay problema." },
    { t:"Validar y profundizar las respuestas", d:"No arrancar de cero: partir de lo que ya completó." },
    { t:"Entender el proceso de venta actual", d:"¿Cómo cierra ventas hoy? ¿Cuánto tarda un lead? ¿Hay seguimiento post-venta?" },
    { t:"Definir KPIs y métricas de éxito", d:"Qué considera el cliente un buen resultado. Dejarlo escrito y acordado." },
    { t:"Explicar el cronograma de trabajo", d:"Los cinco pasos, qué se le va a pedir y que la primera entrega llega en hasta 15 días hábiles." },
    { t:"Acordar canal y frecuencia de comunicación", d:"WhatsApp, email o llamada. Cada cuánto se reporta." },
    { t:"Acceso de administrador al Business Manager", tag:"crit", d:"business.facebook.com → Configuración → Usuarios → Agregar." },
    { t:"Acceso a Google Ads", tag:"crit", d:"Google Ads → Admin → Acceso y seguridad → Invitar usuario, nivel Administrador." },
    { t:"Acceso a Google Analytics 4", d:"GA4 → Admin → Administración de accesos. Rol: Editor o Administrador." },
    { t:"Acceso a Instagram y página de Facebook", d:"Desde el Business Manager del cliente → Cuentas → Agregar persona." },
    { t:"Método de pago cargado en Meta y Google", tag:"cliente", d:"La tarjeta la carga el cliente. Confirmar que tenga límite disponible." },
    { t:"Assets de marca: logo, colores, tipografías, fotos", tag:"cliente", d:"Si no los tiene, queda como parte del alcance." }
  ]},
  { ico:"🔬", t:"Etapa 03. Investigación, marca y estrategia", sub:"Hasta 15 días hábiles hasta la entrega para aprobación", items:[
    { t:"Auditar cuentas publicitarias existentes" },
    { t:"Investigar competidores en Meta Ad Library" },
    { t:"Investigar keywords y volumen de búsqueda" },
    { t:"Analizar el sitio web del cliente" },
    { t:"Definir buyer personas y segmentaciones" },
    { t:"Revisar los recursos visuales de la marca", d:"Si no hay identidad, logo o paleta, construirlos antes de producir contenido." },
    { t:"Verificar píxel de Meta instalado y funcionando", tag:"crit" },
    { t:"Configurar o verificar Conversion API", tag:"crit" },
    { t:"Verificar conversiones de Google Ads vinculadas", tag:"crit" },
    { t:"Configurar GA4 correctamente" },
    { t:"Agregar la cuenta al MCC de Google" },
    { t:"Crear carpeta del cliente en Drive" },
    { t:"Redactar la estrategia inicial de campañas" },
    { t:"Solicitar materiales faltantes al cliente", tag:"cliente" },
    { t:"Producir creatividades de la primera tanda" },
    { t:"Escribir los textos de los anuncios" },
    { t:"Enviar propuesta y creatividades para aprobación", tag:"cliente" }
  ]},
  { ico:"🚀", t:"Etapa 04. Lanzamiento", sub:"El arranque oficial de las campañas", items:[
    { t:"Confirmar la aprobación del cliente", tag:"crit" },
    { t:"Crear la estructura de campañas" },
    { t:"Verificar el cumplimiento de políticas de todos los anuncios", tag:"crit" },
    { t:"Activar campañas y confirmar que entregan" },
    { t:"Avisar al cliente que están activas" },
    { t:"Registrar fecha de inicio y presupuesto acordado" }
  ]},
  { ico:"📊", t:"Etapa 05. Seguimiento y optimización", sub:"El trabajo continuo, mes a mes", items:[
    { t:"Reporte de las primeras 48–72 horas" },
    { t:"Revisión semanal de rendimiento" },
    { t:"Reporte mensual al cliente" },
    { t:"Renovar creatividades cada 3–4 semanas" },
    { t:"Reunión mensual de estrategia" }
  ]}
];
