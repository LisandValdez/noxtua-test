# NOXTUA — Diagnóstico (formulario brief) + Panel interno

**Fecha:** 2026-08-11
**Estado:** aprobado por el usuario
**Proyecto:** migración a React 18 + TypeScript + Vite (Enfoque A)

## 1. Objetivo

Portar a React el formulario de diagnóstico ("brief", 6 pasos + pantalla final) y el
panel interno del archivo original (`index 1.html`), reutilizando la capa de datos y el
sistema de diseño ya migrados, y extendiendo Framer Motion a todo el sitio (formulario
y panel incluidos).

**Alcance elegido por el usuario:** formulario brief 6 pasos + envío real a email +
panel interno (leads + checklist). **Fuera de alcance:** agendador propio de día/hora,
pestaña Config del panel, botón de datos demo, backend propio.

## 2. Contexto

- La web ya está migrada: tema navy/dorado en `src/index.css`, copy1:1 en
  `src/data/content.ts`, componentes por sección, `Reveal`/`Ambient`/`useMediaQuery`.
- El original usa un mini router por hash (`#/`, `#/brief`, `#/panel`), un `Store`
  tolerante a fallos sobre `localStorage`, FormSubmit para el email y un panel con
  clave de acceso.
- Copy del formulario y el checklist deben portarse 1:1 (sin resumir ni reformular),
  igual que se hizo con el sitio.

## 3. Arquitectura

Enfoque **A** aprobado: módulos separados con una capa de datos compartida. El brief
**escribe** leads y el panel **lee** desde el mismo módulo, sin prop-drilling.

### 3.1 Capa de datos (`src/data/`)

- **`storage.ts`** — `Store` con `get`/`set`/`del` tolerante a fallos (replica el
  `Store` original). Claves: `nx_leads`, `nx_draft`, `nx_check`, `nx_auth`.
- **`types.ts`** — tipos compartidos:
  - `LeadData`: campos planos del formulario (ver §5).
  - `LeadRecord`: `{ ref, estado, creado, actualizado, origen, data }`.
  - `Estado` = `"parcial" | "nuevo" | "contactado" | "reunion" | "cliente" | "perdido"`.
  - `ESTADOS`: mapa `{ parcial: "Incompleto", nuevo: "Nuevo", contactado: "Contactado",
    reunion: "Con reunión", cliente: "Cliente", perdido: "Descartado" }`.
- **`leads.ts`** — `loadLeads()`, `upsertLead(rec)` (por `ref`), `setEstado(ref, estado)`,
  `removeLead(ref)`, `exportCSV(leads)` (columnas fijas, BOM, `"` escapadas, arrays
  unidos con `|`), `makeRef()` → `NX-{AAMMDD}-{XXXX}`.
- **`briefOptions.ts`** — port1:1 de `FORM_DATA` (12 servicios, plataformas, adsStatus,
  objetivos, plazo, involucramiento, accesos, materiales, cuando), las **11 bandas** de
  `CONFIG.presupuesto` (`txt`/`band`/`note`), `STEP_NAMES` =
  `["Servicios","Tu negocio","Situación","Objetivos","Presupuesto","Cierre"]`, y el
  valor `calendly` (vacío por defecto).
- **`checklist.ts`** — port1:1 de `CHECKLIST` (5 etapas; items con `t`/`d`/`tag` donde
  `tag` ∈ `"crit" | "cliente"`).

> El copy del sitio sigue en `content.ts`. El copy del brief y el checklist viven en
> sus módulos de datos. Todo 1:1.

### 3.2 Ruteo (`src/router.ts`)

Mini router por hash sin dependencias:
- `useHashRoute()` → hook que escucha `hashchange` y devuelve `"/" | "/brief" | "/panel"`.
- `App.tsx` renderiza según la ruta:
  - `#/` → vista sitio actual (Nav + secciones + Footer + Fab + Ambient).
  - `#/brief` → `BriefView` (con su propio app-bar "Volver al sitio").
  - `#/panel` → `PanelView` (gate + app-bar "Panel interno").
- En brief/panel no se montan Nav/Footer/Fab/Ambient.
- Enlaces: CTA del Nav → `#/brief`; "Análisis sin costo" (footer) → `#/brief`;
  "Acceso equipo" (footer) → `#/panel`. CTAs del hero/planes quedan en `#contacto`
  (vista sitio).
- Al cambiar de ruta: scroll arriba y foco al encabezado de la vista.

## 4. Formulario brief (`src/components/brief/`)

### 4.1 `BriefView.tsx` — contenedor

- Estado con `useReducer`: `{ step, values, errors, status }`.
- **Hidratación**: al montar, lee `nx_draft` y restaura `values` + `step` (con toast
  "Retomamos donde lo dejaste").
- **Autoguardado**: debounce 500ms de `values`+`step` en `nx_draft`; indicador
  "Guardado" en el app-bar (desaparece a los 2.2s). Al enviar, se borra el borrador.
- **Validación por paso** (replica exacta del original):
  - paso1: ≥1 servicio marcado **o** `servicios_otro` no vacío.
  - paso2: `empresa`/`rubro`/`nombre` con `trim().length > 1`; `email` con
    `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. Errores marcan el `.field` (clase `err`) y
    enfocan el primero inválido.
  - paso4: ≥1 objetivo (mensaje propio).
  - paso6: checkbox de privacidad requerido (mensaje + toast).
- **Objetivos**: tope de 3 con toast "Elegí hasta 3 objetivos para poder priorizar".
- **Enter** avanza (excepto en `TEXTAREA`).
- **Nav inferior**: "Atrás" (oculto en paso1) / "Continuar" → "Enviar diagnóstico" en
  paso6. Contador "Paso X de 6". Al enviar: botón "Enviando…" deshabilitado mientras
  dura el envío.
- **Steps rail**: 6 botones con número + nombre; click permite volver atrás y avanzar
  validando los pasos intermedios. Estados `current`/`done`.

### 4.2 Controles (`controls.tsx` + `steps.ts`)

- `steps.ts`: configuración declarativa por paso (campos, opciones, layout grid-2).
- `OptionCard` (checkbox/radio con ícono+título+descripción), `Pill` (multi, chips),
  `Field` (label + input/textarea/select + mensaje de error), `BudgetSlider`
  (range 0–10; muestra `txt`/`band`/`note` de la banda y relleno `--pct`).
- Callout de privacidad en el paso2 ("Tus datos quedan entre nosotros…").

### 4.3 `DoneView.tsx` — pantalla final

- Check de éxito animado, saludo "¡Ya lo tenemos, {primer nombre}! che" (o "che" sin
  nombre), ref `NX-…`.
- **Resumen** con filas: Empresa, Contacto, Rubro, Servicios de interés, Objetivos,
  Inversión en pauta, Horizonte, Próximo paso → "Elegí el horario de la llamada acá abajo"
  (copy1:1 del original; cuando `calendly` está vacío, el fallback de la sección siguiente
  lo supera en la práctica).
- **Slot Calendly**: si `calendly` está configurado, embebe el iframe; si no, fallback
  "Te contactamos para coordinar la llamada" + botón WhatsApp (mensaje prefabricado).
- Acciones: "Volver al sitio" (`#/`) y "Enviar otro formulario" (reset + limpia
  borrador + vuelve al paso1).

### 4.4 Envío

`sendRecord(estado)`:
1. Construye el `LeadRecord` (ref persistente en la sesión, `creado`/`actualizado`
   ISO, `origen` = hostname).
2. **Siempre**: upsert en `nx_leads` (localStorage).
3. Al salir del paso2 por primera vez → `sendRecord("parcial")` (lead "Incompleto").
4. En el envío final → `sendRecord("nuevo")` y **email vía FormSubmit**
   (`https://formsubmit.co/ajax/noxtuacreative@gmail.com`): subject
   `Nuevo formulario de {empresa} ({ref})`, `_captcha=false`, `_template=table`,
   un campo por clave (arrays unidos con ", "), sin `privacidad`.
5. Errores de red se capturan y no rompen el flujo (el guardado local siempre queda).

## 5. Panel interno (`src/components/panel/`)

### 5.1 `PanelView.tsx`

- **Gate**: si `nx_auth !== true` → tarjeta con input PIN y botón "Entrar". Clave
  `noxtua2026` (configurable). Enter o click intentan desbloquear; error muestra
  "Esa clave no es correcta. Probá de nuevo." y anima (sacudida). Al autenticar,
  persiste en `nx_auth`.
- **App-bar**: brand "Panel interno", botones "Actualizar" (recarga leads) y "Salir"
  (borra `nx_auth`).
- **Tabs**: "Formularios recibidos" y "Checklist de incorporación".

### 5.2 `LeadsTab.tsx`

- **KPIs**: Total recibidos (acento), Este mes, Sin contactar, Con reunión, Convertidos.
- **Búsqueda** (empresa/nombre/email/rubro/ref) + **filtros**: Todos / Nuevos /
  Contactados / Con reunión / Clientes / Incompletos.
- **Tabla**: Empresa-Contacto, Servicios (hasta2 + "+N"), Pauta, Estado (`tag`), Recibido
  (fecha es-AR día+mes+hora).
- **Estado vacío** (sin botón demo) con nota de almacenamiento.
- **Export CSV** → `noxtua-diagnosticos-{YYYY-MM-DD}.csv`.
- Fila → `LeadDrawer`.

### 5.3 `LeadDrawer.tsx`

- Scrim + panel deslizante. Head: empresa, `{ref}, recibido el {fecha}`.
- Secciones: Contacto (persona, rol, email/teléfono/sitio como links, cómo nos conoció),
  Negocio (rubro, descripción, competencia, cliente ideal), Interés (servicios, otro,
  objetivos), Situación actual (plataformas, pauta actual, quién lo maneja, frustración),
  Comercial (inversión, horizonte, involucramiento, restricciones, reunión, preferencia
  horaria), Operativo (accesos, materiales, comentarios).
- Footer: botones de estado (todos salvo `parcial`) + eliminar. Cambios persisten.

### 5.4 `OnboardingTab.tsx`

- Cliente en curso (input) + % completo + "Reiniciar".
- 5 fases colapsables; cada item con checkbox, tag `Crítico`/`Cliente` cuando
  corresponde y descripción opcional. Barras de progreso por fase y total.
- Estado guardado en `nx_check` (`{ cliente, done: { "pi-ii": bool } }`).

## 6. Estilos

Nuevo `src/app.css` (importado desde `src/main.tsx`), port de las reglas del original:
`.app`, `.app__bar`, `.app__progress`, `.steps-rail`, `.step`, `.fieldset`,
`.field`, `.field__err`, `.opts`, `.opt`, `.pill`, `.budget` (slider con `--pct`),
`.done`, `.summary`, `.schedule`, `.gate`, `.tabs`, `.tbl`, `.tag`, `.kpi`,
`.panel__tools`, `.panel__search`, `.filter-btn`, `.drawer`, `.check-phase`,
`.check-list`, `.check-item`, `.toast`, `.req`.

Reusan variables del tema navy/dorado. Se **descartan**: estilos del agendador propio,
pestaña Config y datos demo. Se quita el switcher de tema (ya decidido en la migración).

## 7. Motion (Framer Motion)

Lenguaje común: curva `[0.22,1,0.36,1]`, duraciones 0.45–0.7s, stagger 0.06–0.08s.
`useReducedMotion()` desactiva todo (render directo, sin animar). Solo
`opacity`/`transform` (sin layout con mutaciones costosas salvo casos puntuales con
`layoutId`).

### Brief
- Transición entre pasos: `AnimatePresence mode="wait"`; adelante `x:36→0` + fade,
  atrás `x:-36→0`. Al cambiar, scroll arriba + foco al título.
- Campos del paso: contenedor con `staggerChildren0.07`; cada control fadeUp 14px.
- Steps rail: indicador con `layoutId="step-pill"` que se desliza detrás del paso activo;
  check de "done" con scale-in.
- Nav inferior: `whileHover`/`whileTap`; barra de progreso con spring (stiffness90).
- Budget slider: relleno con spring; banda/nota con fade al cambiar.
- DoneView: check con `pathLength 0→1`, filas del resumen en stagger, slot Calendly/
  fallback con scale-in.

### Panel
- Gate: tarjeta con fadeUp; PIN incorrecto → sacudida (`x` keyframes,0.4s).
- Tabs: subrayado con `layoutId`; paneles con `AnimatePresence mode="wait"` (fade).
- Tabla de leads: filas con fadeUp en stagger al cargar/filtrar; remoción con
  `AnimatePresence`.
- Drawer: spring `x:100%→0` (stiffness300/damping30), scrim con fade, contenido en
  stagger.
- Checklist: fases como acordeón con `height:auto` (AnimatePresence), checks con
  scale-in, barras con spring.

## 8. Verificación

- `npm run build` (tsc + vite build) sin errores.
- Manual: completar el form (validaciones por paso, tope3 objetivos, borrador que
  retoma, envío que guarda lead + borra borrador), ver el resumen final, entrar al
  panel con la clave, ver el lead, cambiar estado, exportar CSV, checklist con
  progreso, y navegar `#/` ⇄ `#/brief` ⇄ `#/panel` con el hash.
- Probar con `prefers-reduced-motion` activo: nada anima.

## 9. No incluido (explícito)

- Agendador propio de día/hora (solo slot Calendly opcional con fallback).
- Pestaña Config del panel ni datos demo.
- Backend propio / sincronización remota de leads (queda `formsubmit` para email y
  localStorage para el panel; el campo `endpoints.leads` no se usa por ahora).
