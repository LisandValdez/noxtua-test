# NOXTUA — Diagnóstico (brief + panel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar el formulario de diagnóstico de 6 pasos (con envío a email y guardado local) y el panel interno (leads + checklist) a React 18 + TS + Vite, con Framer Motion en todo el sitio.

**Architecture:** Enfoque A aprobado — capa de datos compartida (`storage`/`leads`/`types`/`briefOptions`/`checklist`) que el brief escribe y el panel lee; mini router por hash (`#/`, `#/brief`, `#/panel`) sin dependencias; vistas por feature bajo `src/components/brief/` y `src/components/panel/`; estilos del form en `src/app.css`.

**Tech Stack:** React 18 + TypeScript strict + Vite 5, Framer Motion 11, lucide-react, `vitest` (solo dev, para la capa de datos). Sin backend: FormSubmit para email, `localStorage` para leads/draft/auth/checklist.

**Spec:** `docs/superpowers/specs/2026-08-11-noxtua-brief-panel-design.md`

## Global Constraints

- **Copy 1:1**: todo texto (formulario, checklist, errores, toasts) se copia verbatim desde `index 1.html` (FORM_DATA ~líneas 2716-2765, CHECKLIST ~2770-2825, validate ~3416, renderDone ~3603). No reformular ni resumir. Las cadenas de error se sacan de `validate()` del original.
- **Tema**: solo variables de `src/index.css` (navy/dorado). No Tailwind.
- **Sin deps nuevas de runtime**: Framer Motion y lucide-react ya están. `vitest` solo como devDependency para pruebas de lógica pura.
- **Reduced motion**: `useReducedMotion()` desactiva animaciones (render directo). Animaciones solo en `opacity`/`transform`.
- **Hash router propio**: sin react-router.
- **Comportamiento heredado**: al salir del paso2 se guarda lead `parcial` (una sola vez por sesión); el envío final guarda `nuevo` y manda el email.
- **`formsubmit`**: `https://formsubmit.co/ajax/noxtuacreative@gmail.com`; email solo en el envío definitivo; nunca se aborta el flujo si el fetch falla (el guardado local siempre queda).
- **Panel**: clave `noxtua2026`; estado persistido en `nx_auth`. Sin pestaña Config, sin datos demo, sin agendador propio (slot Calendly con fallback).
- **Commits**: uno por tarea, en `main`, mensajes en inglés con `Co-Authored-By: Claude <noreply@anthropic.com>`.

---

### Task 1: Añadir vitest y script de test

**Files:**
- Modify: `package.json` (devDependencies + scripts)
- Create: `tests/README.md` (opcional, nota de dónde vive cada test)

**Interfaces:**
- Consumes: nada.
- Produces: `npm test` → `vitest run` (entorno node, sin jsdom).

- [ ] **Step 1: Instalar vitest**

```bash
npm i -D vitest@^2.1.9
```

- [ ] **Step 2: Agregar script de test**

En `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Verificar**

Run: `npm test`
Expected: `No test files found` (o "No test suite found") y exit code 0/1 sin crash. Con eso, `vitest` está operativo.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest for data-layer tests"
```

---

### Task 2: `src/data/storage.ts` — Store tolerante a fallos

**Files:**
- Create: `src/data/storage.ts`
- Test: `tests/storage.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `export const KEYS = { leads: "nx_leads", draft: "nx_draft", check: "nx_check", auth: "nx_auth" } as const;`
  - `export type Backend = Pick<Storage, "getItem" | "setItem" | "removeItem">;`
  - `export function createStore(backend: Backend): { get<T>(key: string, fallback: T): T; set(key: string, value: unknown): boolean; del(key: string): void }`
  - `export const Store = createStore(defaultBackend())` — usa `localStorage` si existe, si no una `Map` en memoria.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { createStore, type Backend } from "../src/data/storage";

function fakeBackend(): Backend {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
  };
}

describe("createStore", () => {
  let store: ReturnType<typeof createStore>;
  beforeEach(() => { store = createStore(fakeBackend()); });

  it("devuelve el fallback cuando no hay dato", () => {
    expect(store.get("x", [])).toEqual([]);
  });
  it("guarda y recupera JSON", () => {
    store.set("x", { a: 1 });
    expect(store.get("x", null)).toEqual({ a: 1 });
  });
  it("tolera JSON corrupto", () => {
    store.set("x", "{{no json");
    expect(store.get("x", "fb")).toBe("fb");
  });
  it("borra una clave", () => {
    store.set("x", 1);
    store.del("x");
    expect(store.get("x", null)).toBeNull();
  });
});
```

- [ ] **Step 2: Correr el test y ver que falla**

Run: `npx vitest run tests/storage.test.ts`
Expected: FAIL (module `../src/data/storage` no existe).

- [ ] **Step 3: Implementación mínima**

```ts
export const KEYS = { leads: "nx_leads", draft: "nx_draft", check: "nx_check", auth: "nx_auth" } as const;

export type Backend = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createStore(backend: Backend) {
  return {
    get<T>(key: string, fallback: T): T {
      try {
        const raw = backend.getItem(key);
        if (raw == null) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    set(key: string, value: unknown): boolean {
      try {
        backend.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    del(key: string): void {
      try {
        backend.removeItem(key);
      } catch {
        /* noop */
      }
    },
  };
}

function defaultBackend(): Backend {
  try {
    if (typeof localStorage !== "undefined" && localStorage) return localStorage;
  } catch {
    /* noop */
  }
  const mem = new Map<string, string>();
  return {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => void mem.set(k, v),
    removeItem: (k) => void mem.delete(k),
  };
}

export const Store = createStore(defaultBackend());
```

- [ ] **Step 4: Correr el test y ver que pasa**

Run: `npx vitest run tests/storage.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/storage.ts tests/storage.test.ts
git commit -m "feat: tolerant storage layer over localStorage"
```

---

### Task 3: `src/data/types.ts`, `briefOptions.ts`, `checklist.ts`

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/briefOptions.ts`
- Create: `src/data/checklist.ts`

**Interfaces:**
- Consumes: `KEYS` (Task 2, no usado aquí aún).
- Produces:
  - `types.ts`:
    - `export type Estado = "parcial" | "nuevo" | "contactado" | "reunion" | "cliente" | "perdido";`
    - `export const ESTADOS: Record<Estado, string> = { parcial: "Incompleto", nuevo: "Nuevo", contactado: "Contactado", reunion: "Con reunión", cliente: "Cliente", perdido: "Descartado" };`
    - `export type LeadData = { servicios: string[]; servicios_otro: string; empresa: string; rubro: string; nombre: string; email: string; sitio: string; cargo: string; descripcion: string; plataformas: string[]; pauta_actual: string; quien_marketing: string; frustracion: string; objetivos: string[]; cliente_ideal: string; competencia: string; presupuesto: number; plazo: string; involucramiento: string; restricciones: string; accesos: string[]; materiales: string[]; telefono: string; como_conociste: string; cuando: string; extra: string; privacidad: boolean };`
    - `export const EMPTY_LEAD: LeadData = { servicios: [], servicios_otro: "", empresa: "", rubro: "", nombre: "", email: "", sitio: "", cargo: "", descripcion: "", plataformas: [], pauta_actual: "", quien_marketing: "", frustracion: "", objetivos: [], cliente_ideal: "", competencia: "", presupuesto: 0, plazo: "", involucramiento: "", restricciones: "", accesos: [], materiales: [], telefono: "", como_conociste: "", cuando: "", extra: "", privacidad: false };`
    - `export type LeadRecord = { ref: string; estado: Estado; creado: string; actualizado: string; origen: string; data: LeadData };`
  - `briefOptions.ts` (copy1:1 desde `index 1.html` líneas 2716-2765):
    - `export const STEP_NAMES = ["Servicios", "Tu negocio", "Situación", "Objetivos", "Presupuesto", "Cierre"];`
    - `export type Opt = { i?: string; t: string; d?: string };`
    - `export const FORM = { servicios: Opt[], plataformas: string[], adsStatus: Opt[], objetivos: Opt[], plazo: Opt[], involucramiento: Opt[], accesos: string[], materiales: string[], cuando: Opt[] };`
    - `export const PRESUPUESTO: { txt: string; band: string; note: string }[]` — las 11 bandas de `CONFIG.presupuesto` (línea ~2580), copiadas1:1.
    - `export const CALENDLY = "";`
  - `checklist.ts`: `export type CheckItem = { t: string; d?: string; tag?: "crit" | "cliente" }; export type CheckPhase = { ico: string; t: string; sub: string; items: CheckItem[] }; export const CHECKLIST: CheckPhase[]` — copy1:1 desde líneas 2770-2825.

- [ ] **Step 1: Copiar `FORM_DATA` y `CHECKLIST` al nuevo módulo**

Leer `index 1.html` líneas 2716-2825 y portar los arrays verbatim a `briefOptions.ts` y `checklist.ts` con los tipos de arriba. El ícono `i` es un emoji: tipar como `string`.

- [ ] **Step 2: Verificar copy y tipos**

Run: `npm run build`
Expected: PASS. Además comparar contra el original que cada `t`/`d`/`band`/`note` sea idéntico (sin reformular).

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts src/data/briefOptions.ts src/data/checklist.ts
git commit -m "feat: port brief form data and checklist 1:1"
```

---

### Task 4: `src/data/validation.ts` — reglas por paso

**Files:**
- Create: `src/data/validation.ts`
- Test: `tests/validation.test.ts`

**Interfaces:**
- Consumes: `LeadData` (Task 3).
- Produces:
  - `export function isEmail(v: string): boolean`
  - `export function validateStep(step: number, values: LeadData): Partial<Record<keyof LeadData, string>>`

**Reglas (copy de errores desde `validate()` del original, línea 3416):**
- paso1: `servicios.length === 0 && servicios_otro.trim() === ""` → error en `servicios` ("Elegí al menos un servicio…" — copiar texto exacto).
- paso2: `empresa`/`rubro`/`nombre` con `trim().length <= 1`; `email` no válido → error en cada campo.
- paso4: `objetivos.length === 0` → error en `objetivos`.
- paso6: `!privacidad` → error en `privacidad`.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { describe, expect, it } from "vitest";
import { isEmail, validateStep } from "../src/data/validation";
import { EMPTY_LEAD } from "../src/data/types";

describe("isEmail", () => {
  it("acepta emails válidos", () => {
    expect(isEmail("hola@noxtua.com")).toBe(true);
    expect(isEmail("a.b+tag@sub.do.com.ar")).toBe(true);
  });
  it("rechaza inválidos", () => {
    expect(isEmail("")).toBe(false);
    expect(isEmail("hola@")).toBe(false);
    expect(isEmail("hola@no")).toBe(false);
    expect(isEmail("hola noxtua.com")).toBe(false);
  });
});

describe("validateStep", () => {
  it("paso 1: exige un servicio u otro", () => {
    expect(validateStep(1, EMPTY_LEAD).servicios).toBeTruthy();
    expect(validateStep(1, { ...EMPTY_LEAD, servicios_otro: "Podcasting" })).toEqual({});
    expect(validateStep(1, { ...EMPTY_LEAD, servicios: ["Meta Ads"] })).toEqual({});
  });
  it("paso 2: exige empresa, rubro, nombre y email", () => {
    const e = validateStep(2, EMPTY_LEAD);
    expect(e.empresa).toBeTruthy();
    expect(e.rubro).toBeTruthy();
    expect(e.nombre).toBeTruthy();
    expect(e.email).toBeTruthy();
    const ok = validateStep(2, { ...EMPTY_LEAD, empresa: "Panadería Sol", rubro: "Alimentos", nombre: "Juana", email: "j@sol.com" });
    expect(ok).toEqual({});
  });
  it("paso 4: exige al menos un objetivo", () => {
    expect(validateStep(4, EMPTY_LEAD).objetivos).toBeTruthy();
    expect(validateStep(4, { ...EMPTY_LEAD, objetivos: ["Escalar"] })).toEqual({});
  });
  it("paso 6: exige privacidad", () => {
    expect(validateStep(6, EMPTY_LEAD).privacidad).toBeTruthy();
    expect(validateStep(6, { ...EMPTY_LEAD, privacidad: true })).toEqual({});
  });
  it("pasos sin reglas no reportan errores", () => {
    expect(validateStep(3, EMPTY_LEAD)).toEqual({});
    expect(validateStep(5, EMPTY_LEAD)).toEqual({});
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run tests/validation.test.ts`
Expected: FAIL (module `../src/data/validation` no existe).

- [ ] **Step 3: Implementación**

```ts
import type { LeadData } from "./types";

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function validateStep(step: number, values: LeadData): Partial<Record<keyof LeadData, string>> {
  const e: Partial<Record<keyof LeadData, string>> = {};
  if (step === 1 && values.servicios.length === 0 && values.servicios_otro.trim() === "") {
    e.servicios = "Elegí al menos un servicio o contanos cuál necesitás en \"otro\".";
  }
  if (step === 2) {
    if (values.empresa.trim().length <= 1) e.empresa = "Escribí el nombre de tu empresa o emprendimiento.";
    if (values.rubro.trim().length <= 1) e.rubro = "Contanos a qué se dedica tu negocio.";
    if (values.nombre.trim().length <= 1) e.nombre = "Escribí tu nombre.";
    if (!isEmail(values.email)) e.email = "Revisá el formato del email.";
  }
  if (step === 4 && values.objetivos.length === 0) e.objetivos = "Elegí al menos un objetivo para poder priorizar.";
  if (step === 6 && !values.privacidad) e.privacidad = "Necesitamos tu confirmación para continuar.";
  return e;
}
```

> Nota: comparar las cadenas de error con `validate()` del original (línea 3416) y usar el texto exacto que aparezca ahí; el texto de arriba es la forma canónica a menos que el original difiera.

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run tests/validation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/validation.ts tests/validation.test.ts
git commit -m "feat: per-step brief validation rules"
```

---

### Task 5: `src/data/leads.ts` — CRUD + CSV

**Files:**
- Create: `src/data/leads.ts`
- Test: `tests/leads.test.ts`

**Interfaces:**
- Consumes: `Store`, `KEYS` (Task 2), `Estado`, `LeadRecord`, `ESTADOS` (Task 3).
- Produces:
  - `export function makeRef(now?: Date): string` → `NX-{AAMMDD}-{XXXX}` (XXXX = 4 chars alfanuméricos upper).
  - `export function loadLeads(): LeadRecord[]`
  - `export function upsertLead(rec: LeadRecord): void` — inserta al inicio si el `ref` no existe; si existe, reemplaza y actualiza `actualizado`.
  - `export function setEstado(ref: string, estado: Estado): void`
  - `export function removeLead(ref: string): void`
  - `export function exportCSV(leads: LeadRecord[]): string` — BOM `﻿`, headers fijos `ref,estado,recibido,empresa,rubro,nombre,email,telefono,servicios,objetivos,pauta_actual,presupuesto,cuando`, arrays unidos con `" | "`, campos con `,`/`"`/newline entre comillas dobles escapadas.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { exportCSV, loadLeads, makeRef, removeLead, setEstado, upsertLead } from "../src/data/leads";
import { Store, KEYS } from "../src/data/storage";
import type { LeadData, LeadRecord } from "../src/data/types";
import { EMPTY_LEAD } from "../src/data/types";

const data: LeadData = { ...EMPTY_LEAD, empresa: "Panadería, Sol & Cía", nombre: "Juana", email: "j@sol.com", servicios: ["Meta Ads", "SEO"], presupuesto: 4 };

function rec(ref: string, estado: LeadRecord["estado"] = "nuevo"): LeadRecord {
  return { ref, estado, creado: "2026-08-11T12:00:00.000Z", actualizado: "2026-08-11T12:00:00.000Z", origen: "localhost", data };
}

describe("makeRef", () => {
  it("tiene formato NX-AAMMDD-XXXX", () => {
    const ref = makeRef(new Date("2026-08-11T12:00:00Z"));
    expect(ref).toMatch(/^NX-260811-[A-Z0-9]{4}$/);
  });
});

describe("leads CRUD", () => {
  beforeEach(() => { Store.del(KEYS.leads); });

  it("upsert agrega al inicio", () => {
    upsertLead(rec("NX-260811-AAAA"));
    upsertLead(rec("NX-260811-BBBB"));
    expect(loadLeads().map((l) => l.ref)).toEqual(["NX-260811-BBBB", "NX-260811-AAAA"]);
  });
  it("upsert actualiza por ref", () => {
    upsertLead(rec("NX-260811-AAAA"));
    upsertLead({ ...rec("NX-260811-AAAA"), data: { ...data, empresa: "Otra" } });
    expect(loadLeads()).toHaveLength(1);
    expect(loadLeads()[0].data.empresa).toBe("Otra");
  });
  it("setEstado cambia estado y mantiene lista", () => {
    upsertLead(rec("NX-260811-AAAA"));
    setEstado("NX-260811-AAAA", "cliente");
    expect(loadLeads()[0].estado).toBe("cliente");
  });
  it("removeLead borra por ref", () => {
    upsertLead(rec("NX-260811-AAAA"));
    upsertLead(rec("NX-260811-BBBB"));
    removeLead("NX-260811-AAAA");
    expect(loadLeads().map((l) => l.ref)).toEqual(["NX-260811-BBBB"]);
  });
});

describe("exportCSV", () => {
  it("incluye BOM y headers", () => {
    const csv = exportCSV([rec("NX-260811-AAAA")]);
    expect(csv.startsWith("﻿ref,estado,recibido")).toBe(true);
  });
  it("escapa comas y comillas", () => {
    const csv = exportCSV([rec("NX-260811-AAAA")]);
    expect(csv).toContain('"Panadería, Sol & Cía"');
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run tests/leads.test.ts`
Expected: FAIL (module `../src/data/leads` no existe).

- [ ] **Step 3: Implementación**

```ts
import { KEYS, Store } from "./storage";
import { ESTADOS, type Estado, type LeadRecord } from "./types";

export function makeRef(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const ymd = `${p(now.getFullYear() % 100)}${p(now.getMonth() + 1)}${p(now.getDate())}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `NX-${ymd}-${rnd}`;
}

export function loadLeads(): LeadRecord[] {
  return Store.get(KEYS.leads, []);
}

function save(list: LeadRecord[]): void {
  Store.set(KEYS.leads, list);
}

export function upsertLead(rec: LeadRecord): void {
  const list = loadLeads();
  const i = list.findIndex((l) => l.ref === rec.ref);
  if (i >= 0) list[i] = { ...rec, actualizado: new Date().toISOString() };
  else list.unshift(rec);
  save(list);
}

export function setEstado(ref: string, estado: Estado): void {
  const list = loadLeads();
  const i = list.findIndex((l) => l.ref === ref);
  if (i >= 0) {
    list[i] = { ...list[i], estado, actualizado: new Date().toISOString() };
    save(list);
  }
}

export function removeLead(ref: string): void {
  save(loadLeads().filter((l) => l.ref !== ref));
}

export function exportCSV(leads: LeadRecord[]): string {
  const esc = (v: unknown): string => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ["ref", "estado", "recibido", "empresa", "rubro", "nombre", "email", "telefono", "servicios", "objetivos", "pauta_actual", "presupuesto", "cuando"];
  const rows = leads.map((l) =>
    [l.ref, ESTADOS[l.estado], l.creado, l.data.empresa, l.data.rubro, l.data.nombre, l.data.email, l.data.telefono, l.data.servicios.join(" | "), l.data.objetivos.join(" | "), l.data.pauta_actual, String(l.data.presupuesto), l.data.cuando].map(esc).join(",")
  );
  return "﻿" + [head.join(","), ...rows].join("\n");
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run tests/leads.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/leads.ts tests/leads.test.ts
git commit -m "feat: lead CRUD and CSV export"
```

---

### Task 6: `src/router.ts` — hash router

**Files:**
- Create: `src/router.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `export type Route = "/" | "/brief" | "/panel";`
  - `export function getRoute(): Route` — lee `location.hash` (`#/brief`, `#/panel`, else `/`).
  - `export function useHashRoute(): Route` — `useState(getRoute)` + `hashchange` listener; al cambiar, `window.scrollTo(0, 0)`.

- [ ] **Step 1: Implementar**

```ts
import { useEffect, useState } from "react";

export type Route = "/" | "/brief" | "/panel";

export function getRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith("#/brief")) return "/brief";
  if (h.startsWith("#/panel")) return "/panel";
  return "/";
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(getRoute);
  useEffect(() => {
    const on = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: PASS (hook tipado; sin UI todavía, no cambia el comportamiento).

- [ ] **Step 3: Commit**

```bash
git add src/router.ts
git commit -m "feat: minimal hash router"
```

---

### Task 7: `src/app.css` — estilos de app, brief y panel

**Files:**
- Create: `src/app.css`
- Modify: `src/main.tsx` (`import "./app.css";` después de `./index.css`)

**Interfaces:**
- Consumes: variables de `src/index.css`.
- Produces: clases `.app`, `.app__bar`, `.app__progress`, `.steps-rail`, `.step`, `.step__head`, `.step__kicker`, `.fieldset`, `.fieldset__legend`, `.fieldset__hint`, `.field`, `.field__err`, `.req`, `.opts`, `.opts--2`, `.opt`, `.opt__ico`, `.opt__txt`, `.pill`, `.budget`, `.budget__top`, `.budget__track`, `.budget__fill` (usa `--pct`), `.budget__note`, `.callout`, `.toast`, `.done`, `.done__icon`, `.summary`, `.schedule`, `.gate`, `.gate__card`, `.tabs`, `.tab`, `.tab-panel`, `.panel__bar`, `.panel__tools`, `.panel__search`, `.filter-btn`, `.kpi-grid`, `.kpi`, `.tbl-wrap`, `.tbl`, `.tag`, `.tag--parcial|nuevo|contactado|reunion|cliente|perdido`, `.drawer`, `.drawer__scrim`, `.drawer__panel`, `.drawer__sec`, `.check-phase`, `.check-list`, `.check-item`, `.bar`.

- [ ] **Step 1: Portar los estilos**

Copiar de los bloques `<style>` de `index 1.html` (líneas 39-1652) las reglas de app/brief/panel (buscar selectores de la lista de arriba) adaptando variables al tema (`--accent`, `--s1`, etc.). Descartar: estilos del loader, tema-sw, agendador propio, pestaña Config, datos demo. Mantener el slider de presupuesto con `--pct` (fill animable vía Framer Motion en Task 12).

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: PASS (CSS compila). Los estilos no se ven todavía (no hay markup).

- [ ] **Step 3: Commit**

```bash
git add src/app.css src/main.tsx
git commit -m "feat: app/brief/panel styles"
```

---

### Task 8: Reducer del brief + contenedor `BriefView`

**Files:**
- Create: `src/components/brief/briefReducer.ts`
- Create: `src/components/brief/controls.tsx` (`OptionCard`, `Pill`, `Field`, `BudgetSlider`, `StepHeader`)
- Create: `src/components/brief/steps.ts` (config declarativa de los 6 pasos)
- Create: `src/components/brief/BriefView.tsx` (app-bar, steps-rail, paso activo, nav inferior, toast, autoguardado)

**Interfaces:**
- Consumes: `LeadData`, `EMPTY_LEAD` (Task 3), `validateStep` (Task 4), `STEP_NAMES`/`FORM`/`PRESUPUESTO`/`CALENDLY` (Task 3), `Store`/`KEYS` (Task 2), clases de `app.css` (Task 7).
- Produces:
  - `briefReducer.ts`:
    - `export type BriefState = { step: number; values: LeadData; errors: Partial<Record<keyof LeadData, string>> };`
    - `export type BriefAction = { type: "SET"; key: keyof LeadData; value: LeadData[keyof LeadData] } | { type: "TOGGLE"; key: "servicios" | "plataformas" | "objetivos" | "accesos" | "materiales"; value: string } | { type: "GO"; step: number } | { type: "RESTART" } | { type: "HYDRATE"; state: BriefState };`
    - `export function briefReducer(state: BriefState, action: BriefAction): BriefState` — `TOGGLE` en `objetivos` respeta tope de 3 (ignora si ya tiene 3 y el valor no está); `GO` valida el paso previo al avanzar (`validateStep`) y puebla `errors`.
  - `steps.ts`: `export const STEPS = [...]` — por paso: `{ id, fields: { kind: "opt-multi" | "opt-radio" | "pills" | "input" | "textarea" | "select" | "slider"; ... }[] }` (ver Step 3).
  - `BriefView.tsx`: `export function BriefView()` — renderiza la vista completa del formulario (ruta `#/brief`). Expone estado para `DoneView` vía prop `onDone(rec)` no — el submit se maneja en Task 9; aquí `BriefView` recibe `onSubmit` y `onPartial` como props.

- [ ] **Step 1: Escribir tests del reducer**

```ts
import { describe, expect, it } from "vitest";
import { briefReducer, type BriefState } from "../src/components/brief/briefReducer";
import { EMPTY_LEAD } from "../src/data/types";

const base: BriefState = { step: 1, values: EMPTY_LEAD, errors: {} };

describe("briefReducer", () => {
  it("SET actualiza un campo", () => {
    const s = briefReducer(base, { type: "SET", key: "empresa", value: "Panadería Sol" });
    expect(s.values.empresa).toBe("Panadería Sol");
  });
  it("TOGGLE agrega y quita de arrays", () => {
    const a = briefReducer(base, { type: "TOGGLE", key: "servicios", value: "SEO" });
    expect(a.values.servicios).toEqual(["SEO"]);
    const b = briefReducer(a, { type: "TOGGLE", key: "servicios", value: "SEO" });
    expect(b.values.servicios).toEqual([]);
  });
  it("TOGGLE en objetivos respeta el tope de 3", () => {
    let s = base;
    for (const v of ["A", "B", "C"]) s = briefReducer(s, { type: "TOGGLE", key: "objetivos", value: v });
    const r = briefReducer(s, { type: "TOGGLE", key: "objetivos", value: "D" });
    expect(r.values.objetivos).toEqual(["A", "B", "C"]);
  });
  it("GO avanza validando y setea errores si falla", () => {
    const r = briefReducer(base, { type: "GO", step: 2 });
    expect(r.step).toBe(1);
    expect(r.errors.servicios).toBeTruthy();
    const ok = briefReducer({ ...base, values: { ...EMPTY_LEAD, servicios: ["SEO"] } }, { type: "GO", step: 2 });
    expect(ok.step).toBe(2);
  });
  it("RESTART vuelve al paso 1 con valores vacíos", () => {
    const s = briefReducer({ step: 6, values: { ...EMPTY_LEAD, empresa: "X" }, errors: {} }, { type: "RESTART" });
    expect(s.step).toBe(1);
    expect(s.values).toEqual(EMPTY_LEAD);
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run tests/briefReducer.test.ts`
Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementar reducer y `steps.ts`**

`briefReducer.ts`:
```ts
import { EMPTY_LEAD, type LeadData } from "../../data/types";
import { validateStep } from "../../data/validation";

export type BriefState = {
  step: number;
  values: LeadData;
  errors: Partial<Record<keyof LeadData, string>>;
};

export type BriefAction =
  | { type: "SET"; key: keyof LeadData; value: LeadData[keyof LeadData] }
  | { type: "TOGGLE"; key: "servicios" | "plataformas" | "objetivos" | "accesos" | "materiales"; value: string }
  | { type: "GO"; step: number }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: BriefState };

const MULTI_MAX = 3;

export function briefReducer(state: BriefState, action: BriefAction): BriefState {
  switch (action.type) {
    case "SET":
      return { ...state, values: { ...state.values, [action.key]: action.value } };
    case "TOGGLE": {
      const arr = state.values[action.key] as unknown as string[];
      const has = arr.includes(action.value);
      let next: string[];
      if (has) next = arr.filter((v) => v !== action.value);
      else if (action.key === "objetivos" && arr.length >= MULTI_MAX) next = arr;
      else next = [...arr, action.value];
      return { ...state, values: { ...state.values, [action.key]: next } };
    }
    case "GO": {
      const errs = validateStep(state.step, state.values);
      if (Object.keys(errs).length > 0) return { ...state, errors: errs };
      return { ...state, step: action.step, errors: {} };
    }
    case "RESTART":
      return { step: 1, values: EMPTY_LEAD, errors: {} };
    case "HYDRATE":
      return { ...action.state, errors: {} };
    default:
      return state;
  }
}
```

`steps.ts` (config; el copy de opciones viene de `FORM`):
```ts
import { FORM } from "../../data/briefOptions";
import type { BriefAction } from "./briefReducer";
import type { LeadData } from "../../data/types";

export type Control =
  | { kind: "opt-multi"; key: "servicios"; options: typeof FORM.servicios; col2?: boolean }
  | { kind: "opt-radio"; key: "pauta_actual" | "plazo" | "involucramiento" | "cuando"; options: { t: string; d?: string }[] }
  | { kind: "pills"; key: "plataformas" | "accesos" | "materiales"; options: string[] }
  | { kind: "input" | "textarea" | "select"; key: keyof LeadData; label?: string; placeholder?: string }
  | { kind: "slider" };

export type StepConfig = { id: number; controls: Control[] };
export const STEPS: StepConfig[] = [
  { id: 1, controls: [{ kind: "opt-multi", key: "servicios", options: FORM.servicios, col2: true }] },
  { id: 2, controls: [input("empresa", "Nombre de tu empresa o emprendimiento", "Ej.: Panadería Sol"), input("rubro", "Rubro o industria", "Ej.: Alimentos"), input("nombre", "Tu nombre", "Ej.: Juana"), input("email", "Tu email", "Ej.: j@sol.com"), input("sitio", "Sitio web (opcional)", "https://…"), input("cargo", "Tu rol (opcional)", "Ej.: fundadora"), { kind: "textarea", key: "descripcion", label: "Contanos en dos o tres líneas qué hace tu negocio", placeholder: "A qué se dedica, hace cuánto, tamaño…" }] },
  { id: 3, controls: [{ kind: "pills", key: "plataformas", options: FORM.plataformas }, { kind: "opt-radio", key: "pauta_actual", options: FORM.adsStatus }, input("quien_marketing", "¿Quién se encarga hoy del marketing?", "Ej.: nadie / un freelance / yo"), { kind: "textarea", key: "frustracion", label: "¿Qué es lo que más te frustra hoy?", placeholder: "Gastamos y no vemos resultados…" }] },
  { id: 4, controls: [{ kind: "opt-multi", key: "objetivos", options: FORM.objetivos, col2: true }, { kind: "textarea", key: "cliente_ideal", label: "Describí a tu cliente ideal", placeholder: "Edad, dónde vive, qué le preocupa, qué busca, cómo decide comprar." }, input("competencia", "¿Quiénes son tus principales competidores?", "Marcas o negocios que hacen algo parecido a lo tuyo")] },
  { id: 5, controls: [{ kind: "slider" }, { kind: "opt-radio", key: "plazo", options: FORM.plazo }, { kind: "opt-radio", key: "involucramiento", options: FORM.involucramiento }, input("restricciones", "¿Hay algo que NO deberíamos hacer? (opcional)", "")] },
  { id: 6, controls: [{ kind: "pills", key: "accesos", options: FORM.accesos }, { kind: "pills", key: "materiales", options: FORM.materiales }, input("telefono", "Tu teléfono (opcional)", "Para coordinar la llamada"), { kind: "select", key: "como_conociste", label: "¿Cómo nos conociste?" }, { kind: "opt-radio", key: "cuando", options: FORM.cuando }, { kind: "textarea", key: "extra", label: "Algo más que quieras contarnos (opcional)", placeholder: "" }] },
];

function input(key: keyof LeadData, label: string, placeholder: string): Control {
  return { kind: "input", key, label, placeholder };
}
```

> `select` (cómo conociste) y `textarea`/`input` se completan en Task 9; aquí ya quedan tipados en `steps.ts`.

- [ ] **Step 4: Implementar `controls.tsx`**

Componentes: `StepHeader` (kicker "Paso X de 6", título, subtítulo), `OptionCard` (checkbox/radio con emoji `i`, `t`, `d`), `Pill`, `Field` (label, control, `<span className="field__err">` visible si hay error), `BudgetSlider` (input range 0-10 + `PRESUPUESTO[i]` para `txt`/`band`/`note`, setea `style={{ "--pct": pct } as React.CSSProperties}`). Cada control se envuelve en `motion.div` con variantes de entrada (Task 12 las completa).

- [ ] **Step 5: Implementar `BriefView.tsx`**

Estructura mínima:
```tsx
export function BriefView({ onSubmit, onPartial }: { onSubmit: () => void; onPartial: () => void }) {
  const [state, dispatch] = useReducer(briefReducer, undefined, hydrateDraft);
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef(makeRef()); // ref persistente de la sesión

  // Autoguardado con debounce 500ms (solo si no es el paso final)
  useEffect(() => {
    const t = setTimeout(() => { if (state.step < 6) Store.set(KEYS.draft, { step: state.step, values: state.values }); }, 500);
    return () => clearTimeout(t);
  }, [state.values, state.step]);

  const next = () => {
    if (state.step === 2) onPartial();
    if (state.step === 6) { onSubmit(); return; }
    dispatch({ type: "GO", step: state.step + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ...
}
```
Render: `.app` > `.app__bar` (botón "Volver al sitio" → `#/`, brand NOXTUA, indicador "Guardado" cuando hubo autoguardado) > `.steps-rail` (6 botones desde `STEP_NAMES`, estados `current`/`done`, click permite `GO` hacia atrás o revalidar hacia adelante) > `.step` activo (`AnimatePresence mode="wait"` con slide adelante/atrás según dirección) > nav inferior (`briefPrev` oculto en paso1, botón `Continuar` → `Enviar diagnóstico` en paso6, contador "Paso X de 6", barra de progreso `(step-1)/6*100`).

Cargar el borrador: `hydrateDraft()` = `{ step: (Store.get(KEYS.draft, null)?.step ?? 1), values: (Store.get(KEYS.draft, null)?.values ?? EMPTY_LEAD), errors: {} }`. Si había borrador, mostrar toast "Retomamos donde lo dejaste". Si `step === 6`, no autoguardar.

- [ ] **Step 6: Verificar**

Run: `npm run build` (debe pasar). Luego `npm run dev` → abrir `/#/brief` y completar pasos1-2: navegación, validación de errores, tope de objetivos, y confirmar en DevTools que `nx_draft` se actualiza.

- [ ] **Step 7: Commit**

```bash
git add src/components/brief/
git commit -m "feat: brief form reducer, controls and container"
```

---

### Task 9: Envío + `DoneView` + pantalla final

**Files:**
- Create: `src/components/brief/submit.ts`
- Create: `src/components/brief/DoneView.tsx`
- Modify: `src/App.tsx` (montar `BriefView` en `#/brief` y pasar `onSubmit`/`onPartial`)

**Interfaces:**
- Consumes: `makeRef`/`upsertLead` (Task 5), `LeadRecord`/`LeadData`/`Estado` (Task 3), `Store`/`KEYS` (Task 2), `CALENDLY` (Task 3), `CONTACTO`/`WA_DEFAULT_MSG` de `content.ts`.
- Produces:
  - `submit.ts`:
    - `export function buildRecord(ref: string, estado: Estado, data: LeadData, origen: string): LeadRecord`
    - `export function savePartial(rec: LeadRecord): void` — `upsertLead` con estado `parcial`.
    - `export async function submitFinal(rec: LeadRecord): Promise<boolean>` — upsert `nuevo` + POST FormSubmit (subject `Nuevo formulario de {empresa} ({ref})`, `_captcha=false`, `_template=table`, un campo por clave, arrays con ", "); devuelve si el fetch fue `ok` (nunca lanza).
  - `DoneView.tsx`: `export function DoneView({ rec }: { rec: LeadRecord })` — resumen + slot Calendly/fallback + acciones.

- [ ] **Step 1: Implementar `submit.ts`**

```ts
import { upsertLead } from "../../data/leads";
import { type Estado, type LeadData, type LeadRecord } from "../../data/types";

const FORMSUBMIT = "https://formsubmit.co/ajax/noxtuacreative@gmail.com";

export function buildRecord(ref: string, estado: Estado, data: LeadData, origen: string): LeadRecord {
  const now = new Date().toISOString();
  return { ref, estado, creado: now, actualizado: now, origen, data };
}

export function savePartial(rec: LeadRecord): void {
  upsertLead(rec);
}

export async function submitFinal(rec: LeadRecord): Promise<boolean> {
  upsertLead(rec);
  const body = new FormData();
  body.set("_subject", `Nuevo formulario de ${rec.data.empresa} (${rec.ref})`);
  body.set("_captcha", "false");
  body.set("_template", "table");
  const fields: Record<string, string> = {
    Empresa: rec.data.empresa, Rubro: rec.data.rubro, Nombre: rec.data.nombre,
    Email: rec.data.email, Teléfono: rec.data.telefono,
    Servicios: rec.data.servicios.join(", "), "Otro servicio": rec.data.servicios_otro,
    Objetivos: rec.data.objetivos.join(", "), "Pauta actual": rec.data.pauta_actual,
    Plataformas: rec.data.plataformas.join(", "), Presupuesto: String(rec.data.presupuesto),
    Plazo: rec.data.plazo, Involucramiento: rec.data.involucramiento,
    Restricciones: rec.data.restricciones, Accesos: rec.data.accesos.join(", "),
    Materiales: rec.data.materiales.join(", "), "Cliente ideal": rec.data.cliente_ideal,
    Competencia: rec.data.competencia, "Cómo nos conoció": rec.data.como_conociste,
    "Preferencia de llamada": rec.data.cuando, Extra: rec.data.extra,
    Frustración: rec.data.frustracion, "Quién lo maneja": rec.data.quien_marketing,
  };
  Object.entries(fields).forEach(([k, v]) => body.set(k, v));
  try {
    const res = await fetch(FORMSUBMIT, { method: "POST", body, headers: { Accept: "application/json" } });
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Implementar `DoneView.tsx`**

`rec.data` → filas de resumen (Empresa, Contacto, Rubro, Servicios de interés, Objetivos, Inversión en pauta, Horizonte, Próximo paso → "Elegí el horario de la llamada acá abajo"). Check animado (Task 12). Slot: `CALENDLY` no vacío → `<iframe src={CALENDLY}>`; si no → fallback con nota "Te contactamos para coordinar la llamada" + `<a href={wa(rec.data.telefono)}>` "Escribir por WhatsApp" usando `CONTACTO.whatsapp` de `content.ts`. Botones: "Volver al sitio" (`#/`) y "Enviar otro formulario" (dispatch `RESTART` + `Store.del(KEYS.draft)`).

- [ ] **Step 3: Conectar en `App.tsx`**

`App.tsx` pasa a tener:
```tsx
const route = useHashRoute();
if (route === "/brief") return <BriefView onSubmit={handleFinal} onPartial={handlePartial} />;
if (route === "/panel") return <PanelView />; // PanelView llega en Task 10; mientras, placeholder "Panel en construcción"
```
Donde `handlePartial`/`handleFinal` guardan/limpian: usar el `ref` y `state.values` del `BriefView` (ver Step 4). El `onSubmit` final: `submitFinal(buildRecord(ref, "nuevo", values, location.hostname))`, `Store.del(KEYS.draft)`, setear el `rec` para mostrar `DoneView` dentro de `BriefView`.

**Ajuste a `BriefView`**: manejar internamente el estado `done: LeadRecord | null`. Cuando `done`, renderizar `DoneView` en lugar del formulario (tras `AnimatePresence mode="wait"`). `onPartial` se invoca en `next()` del paso2 → `savePartial(buildRecord(ref, "parcial", values, hostname))` solo la primera vez (flag `sentPartial` en un ref). Limpiar `sentPartial` y regenerar `ref` en "Enviar otro formulario".

- [ ] **Step 4: Verificar**

Run: `npm run build` → PASS. Luego `npm run dev`, completar el form hasta el final: validar que `nx_leads` tiene el lead, el borrador se borró, el resumen muestra los datos, y que FormSubmit recibe el POST (red estática: con `Accept: application/json` y sin CORS issue desde dev; si no hay red, el flujo no rompe).

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/submit.ts src/components/brief/DoneView.tsx src/App.tsx
git commit -m "feat: brief submission and done screen"
```

---

### Task 10: Panel — gate, tabs y `PanelView`

**Files:**
- Create: `src/components/panel/PanelView.tsx`
- Create: `src/components/panel/Gate.tsx`

**Interfaces:**
- Consumes: `Store`/`KEYS` (Task 2), `ESTADOS` (Task 3), `loadLeads` (Task 5), clases de `app.css` (Task 7).
- Produces:
  - `Gate.tsx`: `export function Gate({ onUnlock }: { onUnlock: () => void })` — input PIN (clave `noxtua2026`), Enter o botón "Entrar"; error → mensaje + animación de sacudida (Task 12); al acertar llama `onUnlock`.
  - `PanelView.tsx`: `export function PanelView()` — si `Store.get(KEYS.auth) !== true` → `Gate` con `onUnlock` que setea `nx_auth=true`; si autenticado → app-bar ("Panel interno", "Actualizar" → re-lee leads, "Salir" → `Store.del(KEYS.auth)`) + tabs (`Formularios recibidos` / `Checklist de incorporación`) + `LeadsTab`/`OnboardingTab`.

- [ ] **Step 1: Implementar `Gate.tsx`**

```tsx
export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const tryOpen = () => {
    if (pin === "noxtua2026") { setErr(false); onUnlock(); }
    else { setErr(true); setPin(""); }
  };
  return (
    <div className="gate">
      <div className="gate__card">
        <span className="eyebrow no-rule">Acceso restringido</span>
        <h2>Panel de NOXTUA</h2>
        <p className="body-muted">Ingresá la clave del equipo para ver los diagnósticos.</p>
        <input className="field" type="password" value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === "Enter" && tryOpen()} autoFocus aria-label="Clave" />
        {err && <span className="field__err">Esa clave no es correcta. Probá de nuevo.</span>}
        <button className="btn btn--primary btn--block" onClick={tryOpen}>Entrar</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implementar `PanelView.tsx`**

Estado `authed` inicializado con `Store.get(KEYS.auth, false)`. Si `!authed` → `Gate`. Si no → bar + tabs (estado `tab: "leads" | "check"`), renderizando `LeadsTab` o `OnboardingTab` (Task 11). La barra "Salir" hace `Store.del(KEYS.auth)` y `setAuthed(false)`.

- [ ] **Step 3: Verificar**

Run: `npm run build` → PASS. En dev, `/#/panel`: PIN incorrecto muestra error; clave correcta entra; "Salir" vuelve al gate (recargar confirma persistencia en `nx_auth`).

- [ ] **Step 4: Commit**

```bash
git add src/components/panel/
git commit -m "feat: panel gate and tab shell"
```

---

### Task 11: `LeadsTab` + `LeadDrawer`

**Files:**
- Create: `src/components/panel/LeadsTab.tsx`
- Create: `src/components/panel/LeadDrawer.tsx`

**Interfaces:**
- Consumes: `loadLeads`/`setEstado`/`removeLead`/`exportCSV` (Task 5), `ESTADOS` (Task 3), `CONTACTO` de `content.ts`, clases de `app.css` (Task 7).
- Produces:
  - `LeadsTab.tsx`: `export function LeadsTab()` — KPIs, búsqueda, filtros, tabla, estado vacío, botón Export.
  - `LeadDrawer.tsx`: `export function LeadDrawer({ lead, onClose, onChange }: { lead: LeadRecord; onClose: () => void; onChange: () => void })` — scrim + panel con secciones y footer de estado/eliminar.

- [ ] **Step 1: Implementar `LeadsTab.tsx`**

- KPIs: Total = `leads.length`; Este mes = creados con mes/año actual; Sin contactar = `nuevo`; Con reunión = `reunion`; Convertidos = `cliente`. Grid de `.kpi`.
- Búsqueda: input `.panel__search`; filtra por empresa/nombre/email/rubro/ref (case-insensitive).
- Filtros: botones `.filter-btn` Todos/Nuevos/Contactados/Con reunión/Clientes/Incompletos → filtran por `estado`.
- Tabla `.tbl`: columnas Empresa-Contacto, Servicios (`servicios.slice(0,2).join(", ")` + `+N` si hay más), Pauta (`pauta_actual`), Estado (`<span className={tag}>`), Recibido (fecha `es-AR`: `new Date(l.creado).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })` + hora). Fila es `<tr onClick>` → abre drawer.
- Estado vacío: si `leads.length === 0` → `.panel__empty` con "Todavía no recibimos ningún diagnóstico…" (copy acorde al original, 1:1 si existía; si el original no tenía, usar texto propio descriptivo).
- Export: botón que hace `downloadCSV(exportCSV(filtered))`:
```ts
function downloadCSV(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `noxtua-diagnosticos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
```
- Filas con `motion.tr` (entrada stagger — Task 12). Al cambiar filtro/búsqueda, re-aplica stagger con `key` del filtro.

- [ ] **Step 2: Implementar `LeadDrawer.tsx`**

- Scrim `.drawer__scrim` (click → `onClose`) + panel `.drawer__panel` (desliza con spring — Task 12).
- Head: `<strong>{empresa}</strong>` + `{ref}, recibido el {fecha completa es-AR}`.
- Secciones y campos (copy de `data`): Contacto (nombre, cargo, email→`mailto:`, teléfono→`tel:`, sitio→link, cómo nos conoció), Negocio (rubro, descripción, competencia, cliente ideal), Interés (servicios + otro, objetivos), Situación (plataformas, pauta actual, quién lo maneja, frustración), Comercial (inversión `PRESUPUESTO[presupuesto].txt`, plazo, involucramiento, restricciones, preferencia `cuando`), Operativo (accesos, materiales, extra).
- Footer: botones por cada estado salvo `parcial` (`.btn` + clase según estado; al click → `setEstado(ref, k)` + `onChange` + feedback), y botón "Eliminar" (confirm → `removeLead` + `onClose`).
- Esc/backdrop cierra.

- [ ] **Step 3: Verificar**

Run: `npm run build` → PASS. En dev con un lead previo (del Task 9): buscar, filtrar, abrir drawer, cambiar a "Cliente", eliminar, exportar CSV (abre descarga con headers + BOM).

- [ ] **Step 4: Commit**

```bash
git add src/components/panel/LeadsTab.tsx src/components/panel/LeadDrawer.tsx
git commit -m "feat: panel leads tab and drawer"
```

---

### Task 12: `OnboardingTab` — checklist de incorporación

**Files:**
- Create: `src/components/panel/OnboardingTab.tsx`

**Interfaces:**
- Consumes: `CHECKLIST` (Task 3), `Store`/`KEYS` (Task 2), clases de `app.css` (Task 7).
- Produces:
  - `OnboardingTab.tsx`: `export function OnboardingTab()` — cliente en curso, % completo, fases colapsables, barras, reiniciar. Estado `nx_check = { cliente: string; done: Record<string, boolean> }` con claves `"pi-{i}-{j}"` (i fase, j item).

- [ ] **Step 1: Implementar**

- Estado local inicializado con `Store.get(KEYS.check, { cliente: "", done: {} })`; cada cambio persiste vía `Store.set`.
- Header: input "Cliente en curso" + `<span>` % completo (`completados/total`) + botón "Reiniciar" (limpia `done`).
- Por cada fase de `CHECKLIST`: `.check-phase` con `ico`, `t`, `sub` + botón para colapsar; `.check-list` con items `.check-item` (checkbox → toggle `pi-{i}-{j}`, `tag` como `<span className="chip">Crítico|Cliente</span>` si existe, `d` como descripción opcional) + `.bar` por fase y una `.bar` total arriba.
- Collapse con `AnimatePresence` + altura animada (Task 12 lo completa con motion).

- [ ] **Step 2: Verificar**

Run: `npm run build` → PASS. En dev `/#/panel` → Checklist: tildar items, ver % y barras moverse, reiniciar, y confirmar persistencia tras recargar.

- [ ] **Step 3: Commit**

```bash
git add src/components/panel/OnboardingTab.tsx
git commit -m "feat: onboarding checklist tab"
```

---

### Task 13: Motion en todo (spec §7) + audit de reduced-motion

**Files:**
- Modify: `src/components/brief/BriefView.tsx`, `src/components/brief/controls.tsx`, `src/components/brief/DoneView.tsx`, `src/components/panel/PanelView.tsx`, `src/components/panel/Gate.tsx`, `src/components/panel/LeadsTab.tsx`, `src/components/panel/LeadDrawer.tsx`, `src/components/panel/OnboardingTab.tsx`, `src/components/App.tsx` (si hace falta)

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: animaciones listas y consistentes, con `useReducedMotion()` respetado en cada vista.

- [ ] **Step 1: Brief — transición de pasos**

En `BriefView`, envolver el paso activo en `AnimatePresence mode="wait"` con variantes `slideNext`/`slidePrev` (`x:36→0` adelante, `x:-36→0` atrás, `opacity`, `duration:0.45`, ease `[0.22,1,0.36,1]`). Guardar dirección en el reducer o en un ref. `useReducedMotion()` → sin motion.

- [ ] **Step 2: Brief — stagger de controles y rail**

- En `controls.tsx`, cada control envuelto en `motion.div` con `initial={{opacity:0, y:14}}` `whileInView`/`animate` `visible` y stagger del contenedor (`staggerChildren:0.07`).
- Steps rail: indicador `motion.span` con `layoutId="step-pill"` debajo del paso activo; checks de pasos `done` con scale-in.
- Nav inferior: botones con `whileHover={{ y: -2 }}` `whileTap={{ scale: 0.97 }}`; barra de progreso con `motion.div` y `animate={{ width: pct }}` (spring, stiffness90).

- [ ] **Step 3: Brief — slider, toast y done**

- `BudgetSlider`: relleno `.budget__fill` con `animate={{ width: pct }}`; `txt`/`band` con fade keyed por índice.
- Toast: `AnimatePresence` + `motion.div` (slide-up + fade).
- `DoneView`: check con `pathLength 0→1` (0.8s) en un `<svg>` propio; filas del resumen con stagger fadeUp; slot Calendly/fallback con `scale 0.96→1`.

- [ ] **Step 4: Panel — gate, tabs, tabla, drawer, checklist**

- `Gate`: tarjeta con fadeUp; PIN incorrecto → `animate={{ x: [0, -10, 10, -8, 8, 0] }}` `transition={{ duration: 0.4 }}` (keyed por `err`).
- `PanelView` tabs: subrayado `layoutId="tab-underline"`; paneles con `AnimatePresence mode="wait"` (fade).
- `LeadsTab`: filas con `motion.tr` fadeUp (stagger `i*0.03`, `key` por filtro para re-animar); remoción/estado vacío con `AnimatePresence`.
- `LeadDrawer`: panel con `animate={{ x: 0 }}` `initial={{ x: "100%" }}` `transition={{ type: "spring", stiffness: 300, damping: 30 }}`; scrim fade; secciones con stagger.
- `OnboardingTab`: acordeón con `AnimatePresence` + `motion.div` `animate={{ height: "auto" }}`/`initial={{ height: 0 }}`; checks scale-in; `.bar` con spring.

- [ ] **Step 5: Audit de `prefers-reduced-motion`**

Recorrer cada componente y verificar: si `useReducedMotion()` es `true`, los elementos se renderizan en su estado final sin animar (usar `initial={reduce ? false : ...}` o devolver `null` para wrappers de solo-animación). Sin `layout` mutaciones fuera de `layoutId`.

- [ ] **Step 6: Verificar**

Run: `npm run build` → PASS. En dev, con `prefers-reduced-motion: reduce` activo en DevTools: nada anima, todo visible y funcional.

- [ ] **Step 7: Commit**

```bash
git add src/components src/App.tsx
git commit -m "feat: framer-motion throughout brief and panel"
```

---

### Task 14: Build final + verificación manual completa

**Files:**
- Ninguno (verificación).

**Interfaces:**
- Consumes: todo el plan.

- [ ] **Step 1: Tests + build**

Run: `npm test` → todos PASS. `npm run build` → PASS sin warnings de TS.

- [ ] **Step 2: Recorrido manual (guion)**

Con `npm run dev`:
1. `#/` → sitio normal. CTA del nav y "Análisis sin costo" del footer → `#/brief`. "Acceso equipo" → `#/panel`.
2. `#/brief`: completar hasta el paso2 → salir a `#/` → volver → borrador retomado (toast). Completar todo: tope3 objetivos, errores por paso, envío guarda lead y borra borrador; resumen final con ref; fallback de coordinación (Calendly vacío).
3. `#/panel`: clave correcta/incorrecta; lead nuevo visible en KPIs y tabla; búsqueda y filtros; drawer → cambiar estado a "Cliente"; export CSV (BOM + comillas escapadas); Checklist: tildar, %, persistencia; Salir → gate.
4. Navegar `#/` ⇄ `#/brief` ⇄ `#/panel` con botón atrás del navegador (hashchange).
5. `prefers-reduced-motion: reduce` → nada anima, todo funcional.

- [ ] **Step 3: Commit final (si hubo cambios)**

```bash
git add -A
git commit -m "chore: final brief+panel verification"
```

---

## Self-Review

**Spec coverage:** §3.1 data layer → Tasks 2-5. §3.2 routing → Task 6. §3.1 briefOptions/checklist → Task 3. §4 brief form → Tasks 8-9. §4.4 envío → Task 9. §5 panel → Tasks 10-12. §6 estilos → Task 7. §7 motion → Task 13. §8 verificación → Task 14. §9 exclusiones → ninguna tarea las toca (consciente).

**Placeholders:** todas las funciones/tests tienen código concreto; el copy 1:1 se referencia al archivo fuente con rangos de línea exactos (la fuente es la autoridad; no se reformula en el plan).

**Type consistency:** `LeadData`/`LeadRecord`/`Estado`/`ESTADOS` definidos en Task 3 y usados igual en Tasks 4-11; `makeRef`/`upsertLead`/`setEstado`/`removeLead`/`exportCSV`/`loadLeads` de Task 5 idénticos en Tasks 9-11; `KEYS` de Task 2 en Tasks 8-12. `BriefAction`/`BriefState` de Task 8 usados en Task 8-9.
