import { useState, type ReactNode } from "react";
import { ArrowLeft, ClipboardCheck, LogOut, Users } from "lucide-react";
import { Gate } from "./Gate";
import { loadLeads } from "../../data/leads";
import { CHECKLIST } from "../../data/checklist";
import { KEYS, Store } from "../../data/storage";

type Tab = "leads" | "onboarding";

export function PanelView() {
  const [authed, setAuthed] = useState(() => Store.get<string>(KEYS.auth, "0") === "1");
  const [tab, setTab] = useState<Tab>("leads");

  /* Contadores de las pestañas. El de Onboarding es un placeholder:
     la Task 12 construye el checklist y ahí reflejará el progreso guardado. */
  const leadsCount = loadLeads().length;
  const onboardingCount = CHECKLIST.reduce((n, phase) => n + phase.items.length, 0);

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

          {tab === "leads" ? (
            <LeadsPlaceholder />
          ) : (
            <OnboardingPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
}

/* Paneles placeholder: la Task 11 reemplaza el de Leads y la Task 12 el de Onboarding. */
function PanelPlaceholder({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div
      className="tab-panel on"
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "rgba(var(--c-s1), 0.4)",
        padding: "clamp(40px, 7vw, 88px)",
        textAlign: "center",
      }}
    >
      <div style={{ color: "var(--accent)", marginBottom: 16 }}>{icon}</div>
      <h2 className="h-md" style={{ marginBottom: 8 }}>
        {title}
      </h2>
      <p className="body-muted" style={{ margin: 0, maxWidth: "52ch", marginInline: "auto" }}>
        {copy}
      </p>
    </div>
  );
}

function LeadsPlaceholder() {
  return (
    <PanelPlaceholder
      icon={<Users size={38} aria-hidden="true" />}
      title="Sección de leads"
      copy="Acá vas a ver los formularios recibidos, con estado, filtros y exportación a CSV. Próximamente."
    />
  );
}

function OnboardingPlaceholder() {
  return (
    <PanelPlaceholder
      icon={<ClipboardCheck size={38} aria-hidden="true" />}
      title="Checklist de incorporación"
      copy="El checklist interno con las etapas y los pasos del proceso de onboarding. Próximamente."
    />
  );
}
