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
