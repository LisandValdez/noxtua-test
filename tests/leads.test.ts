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
