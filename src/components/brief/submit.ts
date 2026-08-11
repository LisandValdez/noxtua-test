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
