import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert } from "lucide-react";
import { briefReducer, type BriefState } from "./briefReducer";
import { STEPS, type Control } from "./steps";
import { BudgetSlider, Field, OptionCard, Pill, StepHeader } from "./controls";
import { STEP_NAMES } from "../../data/briefOptions";
import { EMPTY_LEAD, type LeadData } from "../../data/types";
import { KEYS, Store } from "../../data/storage";
import { makeRef } from "../../data/leads";

/* Copy de cabeceras de paso: 1:1 de index 1.html (líneas 2085-2268). */
const STEP_HEADS: { title: string; subtitle: string }[] = [
  {
    title: "¿En qué querés que te ayudemos?",
    subtitle: "Marcá todo lo que te interese, aunque todavía no estés seguro: lo importante es que lleguemos a la reunión sabiendo de qué hablar.",
  },
  {
    title: "Contanos quién sos y qué hacés.",
    subtitle: "Con esto ya podemos empezar a investigar tu rubro y tu competencia antes de que nos juntemos.",
  },
  {
    title: "Tu presencia digital hoy",
    subtitle: "Queremos entender desde dónde partimos, porque eso define en qué nos enfocamos primero.",
  },
  {
    title: "Tus objetivos y tu cliente ideal",
    subtitle: "Para que cada acción tenga sentido necesitamos saber adónde querés llegar y a quién le hablás.",
  },
  {
    title: "Presupuesto y expectativas",
    subtitle: "Es confidencial y nos permite proponerte algo alcanzable, porque la estrategia se adapta al presupuesto disponible.",
  },
  {
    title: "Accesos, materiales y detalles finales",
    subtitle: "Si no sabés cómo dar un acceso, no importa: te guiamos en la reunión, compartiendo pantalla, paso a paso.",
  },
];

/* Opciones de "¿Cómo nos conociste?" — 1:1 de index 1.html (líneas 2290-2297).
   Task 9 las unifica con FORM; acá se renderizan para que el select ya funcione. */
const COMO_CONOCISTE = ["Recomendación de alguien", "Instagram", "LinkedIn", "Google", "Facebook", "Un evento o charla", "Otro"];

/** Restaura el borrador guardado (nx_draft). Tipado explícito porque
 *  `Store.get(KEYS.draft, null)` infiere T = null bajo TS strict. */
function hydrateDraft(): BriefState {
  const draft = Store.get<{ step: number; values: LeadData } | null>(KEYS.draft, null);
  return { step: draft?.step ?? 1, values: draft?.values ?? EMPTY_LEAD, errors: {} };
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function BriefView({ onSubmit, onPartial }: { onSubmit: () => void; onPartial: () => void }) {
  const [state, dispatch] = useReducer(briefReducer, undefined, hydrateDraft);
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const ref = useRef(makeRef()); // ref persistente de la sesión

  const step = STEPS[state.step - 1];

  /* Toast de reanudación si había un borrador guardado. */
  useEffect(() => {
    if (Store.get<{ step: number; values: LeadData } | null>(KEYS.draft, null)) {
      setToast("Retomamos donde lo dejaste");
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, []);

  /* Autoguardado con debounce 500ms (solo si no es el paso final). */
  useEffect(() => {
    const t = setTimeout(() => {
      if (state.step < 6 && Store.set(KEYS.draft, { step: state.step, values: state.values })) setSaved(true);
    }, 500);
    return () => clearTimeout(t);
  }, [state.values, state.step]);

  /* Retroceder navega sin validar (como goStep(n, "back") del original); GO siempre
   * valida el paso actual y bloquearía volver desde un paso incompleto. Se reusa
   * HYDRATE porque es la única acción que mueve de paso sin correr validateStep. */
  const backTo = (n: number) => dispatch({ type: "HYDRATE", state: { step: n, values: state.values, errors: {} } });

  const next = () => {
    if (state.step === 2) onPartial();
    if (state.step === 6) {
      onSubmit();
      return;
    }
    setDir(1);
    dispatch({ type: "GO", step: state.step + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prev = () => {
    if (state.step <= 1) return;
    setDir(-1);
    backTo(state.step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (n: number) => {
    if (n === state.step) return;
    if (n < state.step) {
      setDir(-1);
      backTo(n);
    } else {
      setDir(1);
      dispatch({ type: "GO", step: n });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Error visible del grupo de opciones (1:1 del texto de validateStep). */
  const groupErr = (key: keyof LeadData) =>
    state.errors[key] ? (
      <span className="field__err mt-s" style={{ display: "flex" }}>
        <CircleAlert aria-hidden="true" />
        {state.errors[key]}
      </span>
    ) : null;

  const renderControl = (c: Control, i: number) => {
    const field = {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45, delay: i * 0.05, ease: "easeOut" as const },
    };
    switch (c.kind) {
      case "opt-multi":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <div className={`opts${c.col2 ? " opts--2" : " opts--3"}`}>
              {c.options.map((o) => (
                <OptionCard
                  key={o.t}
                  i={o.i}
                  t={o.t}
                  d={o.d}
                  checked={state.values[c.key].includes(o.t)}
                  onChange={() => dispatch({ type: "TOGGLE", key: c.key, value: o.t })}
                />
              ))}
            </div>
            {groupErr(c.key)}
          </motion.div>
        );
      case "opt-radio":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <div className="opts opts--3">
              {c.options.map((o) => (
                <OptionCard
                  key={o.t}
                  radio
                  t={o.t}
                  d={o.d}
                  checked={state.values[c.key] === o.t}
                  onChange={() => dispatch({ type: "SET", key: c.key, value: o.t })}
                />
              ))}
            </div>
            {groupErr(c.key)}
          </motion.div>
        );
      case "pills":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <div className="opts opts--pills">
              {c.options.map((o) => (
                <Pill key={o} t={o} checked={state.values[c.key].includes(o)} onChange={() => dispatch({ type: "TOGGLE", key: c.key, value: o })} />
              ))}
            </div>
            {groupErr(c.key)}
          </motion.div>
        );
      case "input":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <Field label={c.label} error={state.errors[c.key]}>
              <input
                type="text"
                value={String(state.values[c.key])}
                placeholder={c.placeholder}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              />
            </Field>
          </motion.div>
        );
      case "textarea":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <Field label={c.label} error={state.errors[c.key]}>
              <textarea
                value={String(state.values[c.key])}
                placeholder={c.placeholder}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              />
            </Field>
          </motion.div>
        );
      case "select":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <Field label={c.label} error={state.errors[c.key]}>
              <select
                value={String(state.values[c.key])}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              >
                <option value="">Seleccioná una opción</option>
                {COMO_CONOCISTE.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </motion.div>
        );
      case "slider":
        return (
          <motion.div className="fieldset" key={i} {...field}>
            <BudgetSlider value={state.values.presupuesto} onChange={(v) => dispatch({ type: "SET", key: "presupuesto", value: v })} />
          </motion.div>
        );
    }
  };

  return (
    <div className="app">
      <header className="app__bar">
        <div className="app__bar-in">
          <a className="app__exit" href="#/">
            <ArrowLeft aria-hidden="true" />
            Volver al sitio
          </a>
          <a className="brand" href="#/" aria-label="NOXTUA, ir al inicio">
            <span className="brand__name">NOXTUA</span>
          </a>
          <span className={`app__save${saved ? " show" : ""}`}>
            <b />
            Guardado
          </span>
        </div>
        <div className="app__progress">
          <i style={{ width: `${((state.step - 1) / 6) * 100}%` }} />
        </div>
      </header>

      <div className="app__body">
        <div className="app__wrap">
          <div className="steps-rail" role="tablist" aria-label="Pasos del diagnóstico">
            {STEP_NAMES.map((name, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  type="button"
                  role="tab"
                  aria-selected={state.step === n}
                  className={`steps-rail__item${state.step === n ? " current" : ""}${n < state.step ? " done" : ""}`}
                  onClick={() => goTo(n)}
                >
                  <b>{n}</b>
                  {name}
                </button>
              );
            })}
          </div>

          <div className="step active">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.step}
                initial={{ opacity: 0, y: dir === 1 ? 26 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir === 1 ? -20 : 26 }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                <StepHeader step={state.step} title={STEP_HEADS[state.step - 1].title} subtitle={STEP_HEADS[state.step - 1].subtitle} />
                {step.controls.map((c, i) => renderControl(c, i))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <nav className="app__nav">
        <div className="app__nav-in">
          <span className="app__count">Paso {state.step} de 6</span>
          <div className="app__nav-actions">
            <button type="button" className="btn btn--ghost" onClick={prev} style={{ visibility: state.step === 1 ? "hidden" : "visible" }}>
              <ArrowLeft aria-hidden="true" />
              Atrás
            </button>
            <button type="button" className="btn btn--primary" onClick={next}>
              {state.step === 6 ? "Enviar diagnóstico" : "Continuar"}
              {state.step === 6 ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {toast && (
        <div className="toast show">
          <Check aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
