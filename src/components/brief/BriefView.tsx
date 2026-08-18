import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert } from "lucide-react";
import { briefReducer, type BriefState } from "./briefReducer";
import { STEPS, type Control } from "./steps";
import { BudgetSlider, Field, OptionCard, Pill, StepHeader } from "./controls";
import { DoneView } from "./DoneView";
import { buildRecord } from "./submit";
import { STEP_NAMES } from "../../data/briefOptions";
import { EMPTY_LEAD, type LeadData, type LeadRecord } from "../../data/types";
import { KEYS, Store } from "../../data/storage";
import { makeRef } from "../../data/leads";
import { validateStep } from "../../data/validation";

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

/* Ids canónicos 1:1 de los inputs del sitio original (index 1.html): cada control
   del brief usa el mismo id que su homólogo del HTML de origen. */
const FIELD_IDS: Partial<Record<keyof LeadData, string>> = {
  servicios_otro: "f_svc_other",
  empresa: "f_empresa",
  rubro: "f_rubro",
  nombre: "f_nombre",
  email: "f_email",
  sitio: "f_sitio",
  cargo: "f_cargo",
  descripcion: "f_descripcion",
  quien_marketing: "f_quien",
  frustracion: "f_frustra",
  cliente_ideal: "f_cliente",
  competencia: "f_competencia",
  restricciones: "f_no",
  telefono: "f_tel",
  como_conociste: "f_como",
  extra: "f_extra",
};

/** Restaura el borrador guardado (nx_draft). Tipado explícito porque
 *  `Store.get(KEYS.draft, null)` infiere T = null bajo TS strict. */
function hydrateDraft(): BriefState {
  const draft = Store.get<{ step: number; values: LeadData } | null>(KEYS.draft, null);
  return { step: draft?.step ?? 1, values: draft?.values ?? EMPTY_LEAD, errors: {} };
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function BriefView({ onSubmit, onPartial }: { onSubmit: (rec: LeadRecord) => void; onPartial: (rec: LeadRecord) => void }) {
  const [state, dispatch] = useReducer(briefReducer, undefined, hydrateDraft);
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [done, setDone] = useState<LeadRecord | null>(null);
  const ref = useRef(makeRef()); // ref persistente de la sesión
  const sentPartial = useRef(false); // el parcial se guarda UNA sola vez por sesión
  const reduce = useReducedMotion();

  const step = STEPS[state.step - 1];

  /* Stagger de controles — con reduced-motion los variantes quedan off y cada
     fieldset se renderiza en su estado final. */
  const staggerContainer = reduce
    ? undefined
    : { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } };
  const itemVariants = reduce
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };

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
    /* Guardado parcial: una vez por sesión, al salir del paso 2 y solo si valida
       (el original validaba el paso antes de guardar). Un paso inválido no consume
       el parcial de la sesión. */
    if (state.step === 2 && !sentPartial.current && Object.keys(validateStep(2, state.values)).length === 0) {
      sentPartial.current = true;
      onPartial(buildRecord(ref.current, "parcial", state.values, location.hostname));
    }
    if (state.step === 6) {
      /* El paso 6 valida antes de enviar (privacidad); GO frena con los errores. */
      if (Object.keys(validateStep(6, state.values)).length > 0) {
        dispatch({ type: "GO", step: state.step + 1 });
        return;
      }
      const rec = buildRecord(ref.current, "nuevo", state.values, location.hostname);
      onSubmit(rec);
      setDone(rec);
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

  /* "Enviar otro formulario" (DoneView): RESTART + ref nuevo + parcial limpio. */
  const restart = () => {
    ref.current = makeRef();
    sentPartial.current = false;
    setSaved(false);
    setDone(null);
    Store.del(KEYS.draft);
    dispatch({ type: "RESTART" });
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
    const wrap = { variants: itemVariants };
    switch (c.kind) {
      case "opt-multi":
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <div className={`opts${c.col2 ? " opts--2" : " opts--3"}`}>
              {c.options.map((o) => (
                <OptionCard
                  key={o.t}
                  i={o.i}
                  t={o.t}
                  d={o.d}
                  name={c.key}
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
          <motion.div className="fieldset" key={i} {...wrap}>
            <div className="opts opts--3">
              {c.options.map((o) => (
                <OptionCard
                  key={o.t}
                  radio
                  t={o.t}
                  d={o.d}
                  name={c.key}
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
          <motion.div className="fieldset" key={i} {...wrap}>
            <div className="opts opts--pills">
              {c.options.map((o) => (
                <Pill key={o} t={o} checked={state.values[c.key].includes(o)} onChange={() => dispatch({ type: "TOGGLE", key: c.key, value: o })} />
              ))}
            </div>
            {groupErr(c.key)}
          </motion.div>
        );
      case "input": {
        const id = FIELD_IDS[c.key] ?? c.key;
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <Field id={id} label={c.label} error={state.errors[c.key]}>
              <input
                id={id}
                type="text"
                value={String(state.values[c.key])}
                placeholder={c.placeholder}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              />
            </Field>
          </motion.div>
        );
      }
      case "textarea": {
        const id = FIELD_IDS[c.key] ?? c.key;
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <Field id={id} label={c.label} error={state.errors[c.key]}>
              <textarea
                id={id}
                value={String(state.values[c.key])}
                placeholder={c.placeholder}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              />
            </Field>
          </motion.div>
        );
      }
      case "select": {
        const id = FIELD_IDS[c.key] ?? c.key;
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <Field id={id} label={c.label} error={state.errors[c.key]}>
              <select
                id={id}
                value={String(state.values[c.key])}
                onChange={(e) => dispatch({ type: "SET", key: c.key, value: e.target.value })}
              >
                <option value="">Seleccioná una opción</option>
                {c.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </motion.div>
        );
      }
      case "check":
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <label
              className={`opt opt--radio${state.values.privacidad ? " is-on" : ""}`}
              style={{ alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={state.values.privacidad}
                onChange={() => dispatch({ type: "SET", key: "privacidad", value: !state.values.privacidad })}
              />
              <span className="opt__box">
                <Check aria-hidden="true" />
              </span>
              <span className="opt__txt">
                <b>Autorizo a NOXTUA a contactarme por email o WhatsApp</b>
                <span>Solo para responder esta consulta. Podés pedir la baja cuando quieras.</span>
              </span>
            </label>
            {groupErr("privacidad")}
          </motion.div>
        );
      case "slider":
        return (
          <motion.div className="fieldset" key={i} {...wrap}>
            <BudgetSlider value={state.values.presupuesto} onChange={(v) => dispatch({ type: "SET", key: "presupuesto", value: v })} />
          </motion.div>
        );
    }
  };

  const stepContent = (
    <>
      <StepHeader step={state.step} title={STEP_HEADS[state.step - 1].title} subtitle={STEP_HEADS[state.step - 1].subtitle} />
      <motion.div
        variants={staggerContainer}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
      >
        {step.controls.map((c, i) => renderControl(c, i))}
      </motion.div>
    </>
  );

  const progressPct = ((done ? 6 : state.step - 1) / 6) * 100;

  return (
    <div className="app">
      <header className="app__bar">
        <div className="app__bar-in">
          <a className="app__exit" href="#/">
            <ArrowLeft aria-hidden="true" />
            Volver al sitio
          </a>
          <a className="brand" href="#/" aria-label="NOXTUA, ir al inicio">
            <img
              src="/assets/NOXTUA Logotipo horizontal negativo.png"
              alt="NOXTUA"
              className="brand__logo"
            />
          </a>
          <span className={`app__save${saved ? " show" : ""}`}>
            <b />
            Guardado
          </span>
        </div>
        <div className="app__progress">
          {reduce ? (
            <i style={{ width: `${progressPct}%` }} />
          ) : (
            <motion.i
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 24 }}
            />
          )}
        </div>
      </header>

      <div className="app__body">
        <div className="app__wrap">
          {done ? (
            <DoneView rec={done} onRestart={restart} />
          ) : (
            <>
              <div className="steps-rail" role="tablist" aria-label="Pasos del diagnóstico">
                {STEP_NAMES.map((name, i) => {
                  const n = i + 1;
                  const isCurrent = state.step === n;
                  const isDone = n < state.step;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      className={`steps-rail__item${isCurrent ? " current" : ""}${isDone ? " done" : ""}`}
                      onClick={() => goTo(n)}
                    >
                      <b>
                        {isDone ? (
                          reduce ? (
                            <Check size={12} aria-hidden="true" />
                          ) : (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 28 }}
                              style={{ display: "grid", placeItems: "center" }}
                            >
                              <Check size={12} aria-hidden="true" />
                            </motion.span>
                          )
                        ) : (
                          n
                        )}
                      </b>
                      {name}
                      {isCurrent &&
                        (reduce ? (
                          <span className="steps-rail__pill" aria-hidden="true" />
                        ) : (
                          <motion.span layoutId="step-pill" className="steps-rail__pill" aria-hidden="true" />
                        ))}
                    </button>
                  );
                })}
              </div>

              {reduce ? (
                <div className="step active">{stepContent}</div>
              ) : (
                <div className="step active">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={state.step}
                      initial={{ opacity: 0, x: dir === 1 ? 36 : -36 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: dir === 1 ? -36 : 36 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      {stepContent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!done && (
        <nav className="app__nav">
          <div className="app__nav-in">
            <span className="app__count">Paso {state.step} de 6</span>
            <div className="app__nav-actions">
              <motion.button
                type="button"
                className="btn btn--ghost"
                onClick={prev}
                style={{ visibility: state.step === 1 ? "hidden" : "visible" }}
                {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } })}
              >
                <ArrowLeft aria-hidden="true" />
                Atrás
              </motion.button>
              <motion.button
                type="button"
                className="btn btn--primary"
                onClick={next}
                {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } })}
              >
                {state.step === 6 ? "Enviar diagnóstico" : "Continuar"}
                {state.step === 6 ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </motion.button>
            </div>
          </div>
        </nav>
      )}

      {reduce ? (
        toast && (
          <div className="toast show">
            <Check aria-hidden="true" />
            {toast}
          </div>
        )
      ) : (
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              className="toast"
              initial={{ x: "-50%", y: 80, opacity: 0 }}
              animate={{ x: "-50%", y: 0, opacity: 1 }}
              exit={{ x: "-50%", y: 80, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Check aria-hidden="true" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
