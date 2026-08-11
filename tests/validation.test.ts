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
