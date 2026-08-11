import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Trash2, X } from "lucide-react";
import { removeLead, setEstado } from "../../data/leads";
import { PRESUPUESTO } from "../../data/briefOptions";
import { ESTADOS, type Estado, type LeadRecord } from "../../data/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINK_STYLE: CSSProperties = { color: "var(--accent)" };

/** Chips de una lista de opciones (1:1 del original: `<span class="chip">`). */
function chips(a: string[] | undefined): ReactNode {
  if (!a || a.length === 0) return null;
  return (
    <>
      {a.map((v) => (
        <span className="chip" key={v}>
          {v}
        </span>
      ))}
    </>
  );
}

/** Sección del drawer: título + filas (dt/dd). Las filas vacías se filtran
 *  y si no queda ninguna se muestra "Sin datos" (1:1 de `sec()` original). */
function Section({ title, rows }: { title: string; rows: [string, ReactNode][] }) {
  const filled = rows.filter(([, v]) => v);
  return (
    <div className="drawer__sec">
      <h4>{title}</h4>
      <dl>
        {filled.length ? (
          filled.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))
        ) : (
          <div>
            <dd>Sin datos</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export function LeadDrawer({ lead, onClose, onChange }: { lead: LeadRecord; onClose: () => void; onChange: () => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const d = lead.data;

  /* Bloquea el scroll del body y cierra con Escape mientras el drawer está abierto. */
  useEffect(() => {
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const changeEstado = (estado: Estado) => {
    setEstado(lead.ref, estado);
    onChange();
    setToast("Estado actualizado");
  };

  const eliminar = () => {
    if (window.confirm("¿Eliminar este registro?")) {
      removeLead(lead.ref);
      onChange();
      onClose();
    }
  };

  return (
    <motion.div
      className="drawer open"
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del diagnóstico"
      style={{ transition: "none" }}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="drawer__scrim"
        onClick={onClose}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="drawer__panel"
        variants={{
          hidden: reduce ? { opacity: 0 } : { x: 60, opacity: 0 },
          visible: reduce ? { opacity: 1 } : { x: 0, opacity: 1 },
        }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        <div className="drawer__head">
          <div>
            <h3>{d.empresa || "Sin empresa"}</h3>
            <span>
              {lead.ref}, recibido el {new Date(lead.creado).toLocaleString("es-AR")}
            </span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="drawer__body">
          <Section
            title="Contacto"
            rows={[
              ["Persona", d.nombre],
              ["Rol", d.cargo],
              [
                "Email",
                d.email ? (
                  <a href={`mailto:${d.email}`} style={LINK_STYLE}>
                    {d.email}
                  </a>
                ) : (
                  ""
                ),
              ],
              [
                "Teléfono",
                d.telefono ? (
                  <a
                    href={`https://wa.me/${d.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={LINK_STYLE}
                  >
                    {d.telefono}
                  </a>
                ) : (
                  ""
                ),
              ],
              [
                "Sitio",
                d.sitio ? (
                  <a
                    href={/^https?:/.test(d.sitio) ? d.sitio : `https://${d.sitio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={LINK_STYLE}
                  >
                    {d.sitio}
                  </a>
                ) : (
                  ""
                ),
              ],
              ["Cómo nos conoció", d.como_conociste],
            ]}
          />
          <Section
            title="Negocio"
            rows={[
              ["Rubro", d.rubro],
              ["Descripción", d.descripcion],
              ["Competencia", d.competencia],
              ["Cliente ideal", d.cliente_ideal],
            ]}
          />
          <Section
            title="Interés"
            rows={[
              ["Servicios", chips(d.servicios)],
              ["Otro", d.servicios_otro],
              ["Objetivos", chips(d.objetivos)],
            ]}
          />
          <Section
            title="Situación actual"
            rows={[
              ["Plataformas", chips(d.plataformas)],
              ["Pauta actual", d.pauta_actual],
              ["Quién lo maneja", d.quien_marketing],
              ["Principal frustración", d.frustracion],
            ]}
          />
          <Section
            title="Comercial"
            rows={[
              ["Inversión en pauta", PRESUPUESTO[d.presupuesto]?.txt ?? ""],
              ["Horizonte", d.plazo],
              ["Involucramiento", d.involucramiento],
              ["Restricciones", d.restricciones],
              ["Preferencia horaria", d.cuando],
            ]}
          />
          <Section
            title="Operativo"
            rows={[
              ["Accesos disponibles", chips(d.accesos)],
              ["Material de marca", chips(d.materiales)],
              ["Comentarios", d.extra],
            ]}
          />
        </div>

        <div className="drawer__foot">
          <span className="tiny body-muted" style={{ marginRight: "auto" }}>
            Estado
          </span>
          {(Object.keys(ESTADOS) as Estado[])
            .filter((k) => k !== "parcial")
            .map((k) => (
              <button
                type="button"
                key={k}
                className={`filter-btn${lead.estado === k ? " on" : ""}`}
                onClick={() => changeEstado(k)}
              >
                {ESTADOS[k]}
              </button>
            ))}
          <button type="button" className="icon-btn" onClick={eliminar} aria-label="Eliminar" title="Eliminar">
            <Trash2 aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {toast && (
        <div className="toast show">
          <Check aria-hidden="true" />
          {toast}
        </div>
      )}
    </motion.div>
  );
}
