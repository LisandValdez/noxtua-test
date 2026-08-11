import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
   El colapso del acordeón usa AnimatePresence + altura animada
   (gated por useReducedMotion); con reduce se renderiza directo.
   ============================================================ */

type CheckState = { cliente: string; done: Record<string, boolean> };

const keyOf = (i: number, j: number) => `pi-${i}-${j}`;

const TAG_LABEL = { crit: "Crítico", cliente: "Cliente" } as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const BAR_SPRING = { type: "spring", stiffness: 90, damping: 24 } as const;

export function OnboardingTab() {
  const reduce = useReducedMotion();
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

  /* Stagger de los ítems al abrir una fase (solo anima al montar el cuerpo). */
  const itemContainer = reduce ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
  const checkItem = reduce
    ? undefined
    : { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  const bar = (w: number) =>
    reduce ? (
      <i style={{ width: `${w}%` }} />
    ) : (
      <motion.i initial={false} animate={{ width: `${w}%` }} transition={BAR_SPRING} />
    );

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
        {bar(pct)}
      </div>

      {CHECKLIST.map((phase, i) => {
        const isOpen = !!open[i];
        const done = phase.items.filter((_, j) => state.done[keyOf(i, j)]).length;
        const phasePct = phase.items.length ? Math.round((done / phase.items.length) * 100) : 0;

        const items = (
          <motion.div
            className="check-list"
            variants={itemContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "visible"}
          >
            {phase.items.map((item, j) => {
              const checked = !!state.done[keyOf(i, j)];
              return (
                <motion.label
                  className={`check-item${checked ? " is-on" : ""}`}
                  key={keyOf(i, j)}
                  variants={reduce ? undefined : checkItem}
                  initial={reduce ? false : "hidden"}
                  animate={reduce ? undefined : "visible"}
                >
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
                </motion.label>
              );
            })}
          </motion.div>
        );

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
              <span className="check-phase__bar">{bar(phasePct)}</span>
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
            {reduce ? (
              isOpen && (
                <div className="check-phase__body" id={`check-list-${i}`}>
                  <div>{items}</div>
                </div>
              )
            ) : (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    className="check-phase__body"
                    id={`check-list-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <div>{items}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </section>
        );
      })}
    </div>
  );
}
