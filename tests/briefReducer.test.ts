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
