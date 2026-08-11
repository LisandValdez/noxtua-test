import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Inbox } from "lucide-react";
import { exportCSV, loadLeads } from "../../data/leads";
import { PRESUPUESTO } from "../../data/briefOptions";
import { ESTADOS, type Estado, type LeadRecord } from "../../data/types";
import { LeadDrawer } from "./LeadDrawer";

type Filtro = "todos" | Estado;

/* Filtros de estado — 1:1 del markup original (data-filter + etiqueta). */
const FILTROS: { key: Filtro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "nuevo", label: "Nuevos" },
  { key: "contactado", label: "Contactados" },
  { key: "reunion", label: "Con reunión" },
  { key: "cliente", label: "Clientes" },
  { key: "parcial", label: "Incompletos" },
];

const ROW_EASE = "easeOut" as const;

/** Descarga el CSV exportado como Blob (BOM incluido por `exportCSV`). */
function downloadCSV(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `noxtua-diagnosticos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsTab() {
  const [leads, setLeads] = useState<LeadRecord[]>(() => loadLeads());
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [openRef, setOpenRef] = useState<string | null>(null);
  const reduce = useReducedMotion();

  /* Recarga la lista desde el store (lo usa el drawer tras cambiar estado/eliminar). */
  const reload = useCallback(() => setLeads(loadLeads()), []);
  const close = useCallback(() => setOpenRef(null), []);

  const filtered = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return leads.filter((l) => {
      if (filtro !== "todos" && l.estado !== filtro) return false;
      if (!q) return true;
      const d = l.data;
      return [d.empresa, d.nombre, d.email, d.rubro, l.ref].join(" ").toLowerCase().includes(q);
    });
  }, [leads, busqueda, filtro]);

  const openLead = useMemo(() => (openRef ? leads.find((l) => l.ref === openRef) ?? null : null), [leads, openRef]);

  const exportar = () => {
    if (filtered.length === 0) return;
    downloadCSV(exportCSV(filtered));
  };

  /* KPIs — 1:1 de renderLeads() (Total recibidos, Este mes, Sin contactar,
   * Con reunión, Convertidos). "Este mes" compara mes y año actuales. */
  const n = (e: Estado) => leads.filter((l) => l.estado === e).length;
  const now = new Date();
  const esteMes = leads.filter((l) => {
    const d = new Date(l.creado);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const kpis: [string, number, boolean?][] = [
    ["Total recibidos", leads.length, true],
    ["Este mes", esteMes],
    ["Sin contactar", n("nuevo")],
    ["Con reunión", n("reunion")],
    ["Convertidos", n("cliente")],
  ];

  return (
    <div className="tab-panel on">
      <div className="kpi-grid">
        {kpis.map(([t, v, accent]) => (
          <div className={`kpi${accent ? " kpi--accent" : ""}`} key={t}>
            <b>{v}</b>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className="panel__tools">
        <input
          className="panel__search"
          type="search"
          placeholder="Buscar por empresa, nombre, email o rubro"
          aria-label="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {FILTROS.map((f) => (
          <button
            type="button"
            key={f.key}
            className={`filter-btn${filtro === f.key ? " on" : ""}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </button>
        ))}
        <button type="button" className="btn btn--ghost btn--sm" onClick={exportar} aria-label="Exportar a CSV">
          <Download aria-hidden="true" />
          CSV
        </button>
      </div>

      {filtered.length ? (
        <div className="tbl-wrap">
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Empresa / Contacto</th>
                  <th>Servicios</th>
                  <th>Pauta</th>
                  <th>Estado</th>
                  <th>Recibido</th>
                </tr>
              </thead>
              {/* El key re-aplica el stagger al cambiar filtro o búsqueda. */}
              <motion.tbody
                key={`${filtro}|${busqueda}`}
                initial="hidden"
                animate="show"
                variants={reduce ? undefined : { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
              >
                {filtered.map((l) => {
                  const d = l.data;
                  const svc =
                    d.servicios.slice(0, 2).join(", ") +
                    (d.servicios.length > 2 ? ` +${d.servicios.length - 2}` : "");
                  return (
                    <motion.tr
                      key={l.ref}
                      onClick={() => setOpenRef(l.ref)}
                      variants={
                        reduce
                          ? undefined
                          : {
                              hidden: { opacity: 0, y: 8 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ROW_EASE } },
                            }
                      }
                    >
                      <td>
                        <b>{d.empresa || "Sin empresa"}</b>
                        <small>
                          {d.nombre || "Sin nombre"}, {d.email || "sin email"}
                        </small>
                      </td>
                      <td>
                        <small>{svc || "Sin datos"}</small>
                      </td>
                      <td>
                        <small>{PRESUPUESTO[d.presupuesto]?.txt ?? "Sin datos"}</small>
                      </td>
                      <td>
                        <span className={`tag tag--${l.estado}`}>{ESTADOS[l.estado] || l.estado}</span>
                      </td>
                      <td>
                        <small>
                          {new Date(l.creado).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty">
          <Inbox aria-hidden="true" style={{ display: "block" }} />
          <h3>Todavía no hay formularios recibidos</h3>
          <p>Cuando alguien complete el formulario del sitio aparece acá con todo su detalle y su estado de seguimiento.</p>
        </div>
      )}

      <AnimatePresence>{openLead && <LeadDrawer lead={openLead} onClose={close} onChange={reload} />}</AnimatePresence>
    </div>
  );
}
