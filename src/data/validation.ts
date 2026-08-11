/* ============================================================
   NOXTUA. Reglas de validación por paso del brief
   Textos de error copiados 1:1 de validate() (index.html, línea 3416)
   y de los spans .field__err del formulario original.
   ============================================================ */

import type { LeadData } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function validateStep(step: number, values: LeadData): Partial<Record<keyof LeadData, string>> {
  const e: Partial<Record<keyof LeadData, string>> = {};

  if (step === 1 && values.servicios.length === 0 && values.servicios_otro.trim() === "") {
    e.servicios = "Marcá al menos un servicio que te interese";
  }

  if (step === 2) {
    if (values.empresa.trim().length <= 1) e.empresa = "Necesitamos el nombre de tu empresa";
    if (values.rubro.trim().length <= 1) e.rubro = "Contanos a qué rubro pertenecés";
    if (values.nombre.trim().length <= 1) e.nombre = "¿Cómo te llamamos?";
    if (!isEmail(values.email)) e.email = "Ingresá un email válido";
  }

  if (step === 4 && values.objetivos.length === 0) {
    e.objetivos = "Elegí al menos un objetivo";
  }

  if (step === 6 && !values.privacidad) {
    e.privacidad = "Necesitamos tu autorización para poder responderte";
  }

  return e;
}
