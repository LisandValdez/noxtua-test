import { useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { CHECKLIST } from "../../data/checklist";
import { KEYS, Store } from "../../data/storage";

/* ============================================================
   OnboardingTab — Checklist interno de incorporación.
   Persiste en `nx_check` (KEYS.check) con el formato:
     { cliente: string; done: Record<string, boolean> }
   `done` usa claves "pi-{i}-{j}" (i = índice de fase, j = índice
   de item), según el plan de la Task 12. Cada cambio se persiste
   vía Store.set; "Reiniciar" limpia `done` (conserva el cliente).
   ============================================================ */

type CheckState = { cliente: string; done: Record<string, boolean> };

const keyOf = (i: number, j: number) => `pi-${i}-${j}`;

const TAG_LABEL = { crit: "Crítico", cliente: "Cliente" } as const;

export function OnboardingTab() {
  /* Estado inicial desde el store, tolerante a formatos viejos/malformados. */
  const [state, setState] = useState<CheckState>(() => {
    const stored = Store.get<Partial<CheckState>>(KEYS.check, {});
    return {
      cliente: typeof stored.cliente === "string" ? stored.cliente : "",
      done: stored.done ?? {},
    };
  });
  /* Fases abiertas (acordeón). La primera arranca abierta. */
  const [open, setOpen] = useState<Record<number, boolean>>(() => ({ 0: true }));

  const persist = (next: CheckState) => {
    setState(next);
    Store.set(KEYS.check, next);
  };

  const total = CHECKLIST.reduce((n, p) => n + p.items.length, 0);
  const doneCount = CHECKLIST.reduce((n, p, i) => n + p.items.filter((_, j) => state.done[keyOf(i, j)]).length, 0);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const toggle = (i: number, j: number) => {
    const k = keyOf(i, j);
    persist({ ...state, done: { ...state.done, [k]: !state.done[k] } });
  };

  const reset = () => persist({ ...state, done: {} });

  return (
    <div className="tab-panel on">
      <div className="panel__tools">
        <input
          className="panel__search"
          type="text"
          placeholder="Cliente en curso"
          aria-label="Cliente en curso"
          value={state.cliente}
          onChange={(e) => persist({ ...state, cliente: e.target.value })}
        />
        <span className="check-phase__cnt" style={{ minWidth: "auto" }}>
          {doneCount}/{total} · {pct}% completo
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={reset} aria-label="Reiniciar checklist">
          <RotateCcw aria-hidden="true" />
          Reiniciar
        </button>
      </div>

      <div
        className="bar"
        style={{ marginBottom: 20 }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso total del checklist"
      >
        <i style={{ width: `${pct}%` }} />
      </div>

      {CHECKLIST.map((phase, i) => {
        const isOpen = !!open[i];
        const done = phase.items.filter((_, j) => state.done[keyOf(i, j)]).length;
        const phasePct = phase.items.length ? Math.round((done / phase.items.length) * 100) : 0;
        return (
          <section className={`check-phase${isOpen ? " open" : ""}`} key={phase.t}>
            <button
              type="button"
              className="check-phase__head"
              aria-expanded={isOpen}
              aria-controls={`check-list-${i}`}
              onClick={() => setOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
            >
              <span className="check-phase__ico" aria-hidden="true">
                {phase.ico}
              </span>
              <span className="check-phase__meta">
                <b>{phase.t}</b>
                <span>{phase.sub}</span>
              </span>
              <span className="check-phase__bar">
                <i style={{ width: `${phasePct}%` }} />
              </span>
              <span className="check-phase__cnt">
                {done}/{phase.items.length}
              </span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  color: "var(--muted-2)",
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform var(--t-fast) var(--ease)",
                }}
              />
            </button>
            <div className="check-phase__body" id={`check-list-${i}`}>
              <div>
                <div className="check-list">
                  {phase.items.map((item, j) => {
                    const checked = !!state.done[keyOf(i, j)];
                    return (
                      <label className={`check-item${checked ? " is-on" : ""}`} key={keyOf(i, j)}>
                        <input type="checkbox" checked={checked} onChange={() => toggle(i, j)} />
                        <span className="check-item__box">
                          <Check aria-hidden="true" />
                        </span>
                        <span className="check-item__txt">
                          <b>
                            {item.t}
                            {item.tag && <em className={item.tag === "crit" ? "crit" : "cli"}>{TAG_LABEL[item.tag]}</em>}
                          </b>
                          {item.d && <span>{item.d}</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
