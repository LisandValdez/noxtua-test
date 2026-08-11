import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ClipboardCheck, LogOut, Users } from "lucide-react";
import { Gate } from "./Gate";
import { LeadsTab } from "./LeadsTab";
import { OnboardingTab } from "./OnboardingTab";
import { loadLeads } from "../../data/leads";
import { CHECKLIST } from "../../data/checklist";
import { KEYS, Store } from "../../data/storage";

type Tab = "leads" | "onboarding";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PanelView() {
  const [authed, setAuthed] = useState(() => Store.get<string>(KEYS.auth, "0") === "1");
  const [tab, setTab] = useState<Tab>("leads");
  const reduce = useReducedMotion();

  /* Contadores de las pestañas. El de Onboarding refleja el progreso
     guardado en el checklist: completados/total. */
  const leadsCount = loadLeads().length;
  const checkDone = Store.get<{ done?: Record<string, boolean> }>(KEYS.check, {}).done ?? {};
  const checkTotal = CHECKLIST.reduce((n, phase) => n + phase.items.length, 0);
  const checkCompleted = CHECKLIST.reduce(
    (n, phase, i) => n + phase.items.filter((_, j) => checkDone[`pi-${i}-${j}`]).length,
    0
  );
  const onboardingCount = `${checkCompleted}/${checkTotal}`;

  const unlock = () => {
    Store.set(KEYS.auth, "1");
    setAuthed(true);
  };

  const logout = () => {
    Store.del(KEYS.auth);
    setAuthed(false);
  };

  const underline = (active: boolean) =>
    active &&
    (reduce ? (
      <span className="tab-underline" aria-hidden="true" />
    ) : (
      <motion.span layoutId="tab-underline" className="tab-underline" aria-hidden="true" />
    ));

  const tabContent = reduce ? (
    tab === "leads" ? (
      <LeadsTab />
    ) : (
      <OnboardingTab />
    )
  ) : (
    <AnimatePresence mode="wait">
      {tab === "leads" ? (
        <motion.div
          key="leads"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <LeadsTab />
        </motion.div>
      ) : (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <OnboardingTab />
        </motion.div>
      )}
    </AnimatePresence>
  );

  const panel = (
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
        </div>
      </header>

      <div className="app__body">
        <div className="app__wrap">
          <motion.div
            className="panel__bar"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={reduce ? undefined : { duration: 0.4, ease: EASE }}
          >
            <h1 className="h-md" style={{ margin: 0 }}>
              Panel interno
            </h1>
            <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
              <LogOut aria-hidden="true" />
              Salir
            </button>
          </motion.div>

          <nav className="tabs" aria-label="Secciones del panel">
            <button
              type="button"
              className={`tab${tab === "leads" ? " on" : ""}`}
              onClick={() => setTab("leads")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Users size={16} aria-hidden="true" />
              Leads
              <span className="app__count">{leadsCount}</span>
              {underline(tab === "leads")}
            </button>
            <button
              type="button"
              className={`tab${tab === "onboarding" ? " on" : ""}`}
              onClick={() => setTab("onboarding")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <ClipboardCheck size={16} aria-hidden="true" />
              Onboarding
              <span className="app__count">{onboardingCount}</span>
              {underline(tab === "onboarding")}
            </button>
          </nav>

          {tabContent}
        </div>
      </div>
    </div>
  );

  if (reduce) return !authed ? <Gate onUnlock={unlock} /> : panel;

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <Gate onUnlock={unlock} />
        </motion.div>
      ) : (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {panel}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
