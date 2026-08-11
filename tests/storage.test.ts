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
  let backend: Backend;
  beforeEach(() => { backend = fakeBackend(); store = createStore(backend); });

  it("devuelve el fallback cuando no hay dato", () => {
    expect(store.get("x", [])).toEqual([]);
  });
  it("guarda y recupera JSON", () => {
    store.set("x", { a: 1 });
    expect(store.get("x", null)).toEqual({ a: 1 });
  });
  it("tolera JSON corrupto", () => {
    backend.setItem("x", "{{no json");
    expect(store.get("x", "fb")).toBe("fb");
  });
  it("borra una clave", () => {
    store.set("x", 1);
    store.del("x");
    expect(store.get("x", null)).toBeNull();
  });
});
