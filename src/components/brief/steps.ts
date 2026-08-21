import { FORM } from "../../data/briefOptions";
import type { LeadData } from "../../data/types";

export type Control =
  | { kind: "opt-multi"; key: "servicios" | "objetivos"; options: typeof FORM.servicios; col2?: boolean }
  | { kind: "opt-radio"; key: "pauta_actual" | "plazo" | "involucramiento" | "cuando"; options: { t: string; d?: string }[]; subtitulo?: string }
  | { kind: "pills"; key: "plataformas" | "accesos" | "materiales"; options: string[] }
  | { kind: "input" | "textarea"; key: keyof LeadData; label?: string; placeholder?: string }
  | { kind: "select"; key: keyof LeadData; label?: string; placeholder?: string; options: string[] }
  | { kind: "check"; key: "privacidad" }
  | { kind: "slider" };

export type StepConfig = { id: number; controls: Control[] };

/* Opciones de "¿Cómo nos conociste?" — 1:1 de index 1.html (líneas 2290-2297). */
export const COMO_CONOCISTE = ["Recomendación de alguien", "Instagram", "LinkedIn", "Google", "Facebook", "Un evento o charla", "Otro"];

export const STEPS: StepConfig[] = [
  {
    id: 1,
    controls: [
      { kind: "opt-multi", key: "servicios", options: FORM.servicios, col2: true },
      input("servicios_otro", "¿Hay algo que no está en la lista?", "Escribilo acá y lo miramos igual"),
    ],
  },
  { id: 2, controls: [input("empresa", "Nombre de tu empresa o emprendimiento", "Ej.: Panadería Sol"), input("rubro", "Rubro o industria", "Ej.: Alimentos"), input("nombre", "Tu nombre", "Ej.: Juana"), input("email", "Tu email", "Ej.: j@sol.com"), input("sitio", "Sitio web (opcional)", "https://…"), input("cargo", "Tu rol (opcional)", "Ej.: fundadora"), { kind: "textarea", key: "descripcion", label: "Contanos en dos o tres líneas qué hace tu negocio", placeholder: "A qué se dedica, hace cuánto, tamaño…" }] },
  { id: 3, controls: [{ kind: "pills", key: "plataformas", options: FORM.plataformas }, { kind: "opt-radio", key: "pauta_actual", options: FORM.adsStatus }, input("quien_marketing", "¿Quién se encarga hoy del marketing?", "Ej.: nadie / un freelance / yo"), { kind: "textarea", key: "frustracion", label: "¿Qué es lo que más te frustra hoy?", placeholder: "Gastamos y no vemos resultados…" }] },
  { id: 4, controls: [{ kind: "opt-multi", key: "objetivos", options: FORM.objetivos, col2: true }, { kind: "textarea", key: "cliente_ideal", label: "Describí a tu cliente ideal", placeholder: "Edad, dónde vive, qué le preocupa, qué busca, cómo decide comprar." }, input("competencia", "¿Quiénes son tus principales competidores?", "Marcas o negocios que hacen algo parecido a lo tuyo")] },
  { id: 5, controls: [{ kind: "slider" }, { kind: "opt-radio", key: "plazo", options: FORM.plazo, subtitulo: "¿Cuánto tiempo querés invertir?" }, { kind: "opt-radio", key: "involucramiento", options: FORM.involucramiento, subtitulo: "¿Cuánto involucrado querés estar?" }, input("restricciones", "¿Hay algo que NO deberíamos hacer? (opcional)", "")] },
  {
    id: 6,
    controls: [
      { kind: "pills", key: "accesos", options: FORM.accesos },
      { kind: "pills", key: "materiales", options: FORM.materiales },
      input("telefono", "Tu teléfono (opcional)", "Para coordinar la llamada"),
      { kind: "select", key: "como_conociste", label: "¿Cómo nos conociste?", options: COMO_CONOCISTE },
      { kind: "opt-radio", key: "cuando", options: FORM.cuando },
      { kind: "textarea", key: "extra", label: "Algo más que quieras contarnos (opcional)", placeholder: "" },
      { kind: "check", key: "privacidad" },
    ],
  },
];

function input(key: keyof LeadData, label: string, placeholder: string): Control {
  return { kind: "input", key, label, placeholder };
}
