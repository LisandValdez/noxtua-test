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
