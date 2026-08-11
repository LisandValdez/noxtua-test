import { Check } from "lucide-react";
import { CALENDLY, PRESUPUESTO } from "../../data/briefOptions";
import { CONTACTO, WA_DEFAULT_MSG } from "../../data/content";
import type { LeadRecord } from "../../data/types";

/** Filas del resumen — 1:1 de renderDone() del original (index 1.html, líneas 3609-3618). */
function summaryRows(rec: LeadRecord): [string, string][] {
  const d = rec.data;
  return [
    ["Empresa", d.empresa],
    ["Contacto", [d.nombre, d.email].filter(Boolean).join(", ")],
    ["Rubro", d.rubro],
    ["Servicios de interés", d.servicios.join(", ") || d.servicios_otro || ""],
    ["Objetivos", d.objetivos.join(", ")],
    ["Inversión en pauta", PRESUPUESTO[d.presupuesto]?.txt ?? ""],
    ["Horizonte", d.plazo],
    ["Próximo paso", "Elegí el horario de la llamada acá abajo"],
  ];
}

export function DoneView({ rec, onRestart }: { rec: LeadRecord; onRestart: () => void }) {
  const first = (rec.data.nombre || "").trim().split(" ")[0] || "che";
  const waHref = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;

  return (
    <div className="step active">
      <div className="done">
        <div className="done__icon">
          <Check aria-hidden="true" />
        </div>
        <h2>
          Ya lo tenemos, <span className="grad-text">{first}</span>.
        </h2>
        <p>Antes de la reunión vamos a leer todo lo que nos contaste y revisar tu presencia digital, así el encuentro arranca desde acá.</p>

        <dl className="summary">
          <div className="summary__head">
            <span>Resumen de tu diagnóstico</span>
            <span>{rec.ref}</span>
          </div>
          {summaryRows(rec).map(([k, v]) => (
            <div className="summary__row" key={k}>
              <dt>{k}</dt>
              <dd>{v || "Sin completar"}</dd>
            </div>
          ))}
        </dl>

        <div className="schedule">
          <h3>Último paso: elegí el día de la llamada</h3>
          <p>Treinta minutos por videollamada, con tu caso ya leído de nuestro lado.</p>
          {CALENDLY ? (
            <div className="schedule__embed">
              <iframe src={CALENDLY} title="Agendar reunión" loading="lazy" />
            </div>
          ) : (
            <>
              <p className="body-muted" style={{ marginBottom: 18 }}>
                Te contactamos para coordinar la llamada
              </p>
              <a className="btn btn--ghost btn--sm" href={waHref} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </>
          )}
        </div>

        <div className="mt-m" style={{ display: "flex", gap: 11, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="btn btn--ghost btn--sm" href="#/">
            Volver al sitio
          </a>
          <button type="button" className="btn btn--quiet btn--sm" onClick={onRestart}>
            Enviar otro formulario
          </button>
        </div>
      </div>
    </div>
  );
}
