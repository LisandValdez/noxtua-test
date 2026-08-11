import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CALENDLY, PRESUPUESTO } from "../../data/briefOptions";
import { CONTACTO, WA_DEFAULT_MSG } from "../../data/content";
import type { LeadRecord } from "../../data/types";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduce = useReducedMotion();
  const first = (rec.data.nombre || "").trim().split(" ")[0] || "che";
  const waHref = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;

  const rowsContainer = reduce
    ? undefined
    : { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } };
  const rowItem = reduce
    ? undefined
    : {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      };

  return (
    <div className="step active">
      <div className="done">
        <motion.div
          className="done__icon"
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={reduce ? undefined : { scale: 1, opacity: 1 }}
          transition={reduce ? undefined : { duration: 0.45, ease: EASE }}
        >
          {reduce ? (
            <Check aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <motion.path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </svg>
          )}
        </motion.div>
        <h2>
          Ya lo tenemos, <span className="grad-text">{first}</span>.
        </h2>
        <p>Antes de la reunión vamos a leer todo lo que nos contaste y revisar tu presencia digital, así el encuentro arranca desde acá.</p>

        <motion.dl
          className="summary"
          variants={reduce ? undefined : rowsContainer}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
        >
          <div className="summary__head">
            <span>Resumen de tu diagnóstico</span>
            <span>{rec.ref}</span>
          </div>
          {summaryRows(rec).map(([k, v]) => (
            <motion.div className="summary__row" key={k} variants={reduce ? undefined : rowItem}>
              <dt>{k}</dt>
              <dd>{v || "Sin completar"}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div
          className="schedule"
          initial={reduce ? false : { scale: 0.96, opacity: 0 }}
          animate={reduce ? undefined : { scale: 1, opacity: 1 }}
          transition={reduce ? undefined : { duration: 0.5, ease: EASE, delay: 0.3 }}
        >
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
        </motion.div>

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
