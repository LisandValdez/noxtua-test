import { useState } from "react";
import { ArrowLeft, ClipboardCheck, LogOut, Users } from "lucide-react";
import { Gate } from "./Gate";
import { LeadsTab } from "./LeadsTab";
import { OnboardingTab } from "./OnboardingTab";
import { loadLeads } from "../../data/leads";
import { CHECKLIST } from "../../data/checklist";
import { KEYS, Store } from "../../data/storage";

type Tab = "leads" | "onboarding";

export function PanelView() {
  const [authed, setAuthed] = useState(() => Store.get<string>(KEYS.auth, "0") === "1");
  const [tab, setTab] = useState<Tab>("leads");

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

  if (!authed) return <Gate onUnlock={unlock} />;

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
        </div>
      </header>

      <div className="app__body">
        <div className="app__wrap">
          <div className="panel__bar">
            <h1 className="h-md" style={{ margin: 0 }}>
              Panel interno
            </h1>
            <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
              <LogOut aria-hidden="true" />
              Salir
            </button>
          </div>

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
            </button>
          </nav>

          {tab === "leads" ? <LeadsTab /> : <OnboardingTab />}
        </div>
      </div>
    </div>
  );
}
