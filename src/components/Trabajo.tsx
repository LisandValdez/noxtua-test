import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { TRABAJO_HEAD, TRABAJOS, WORK_INVITE } from "../data/content";
import { Reveal } from "./Reveal";

function WorkMedia({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="work__ph">{fallback}</div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  );
}

export function Trabajo() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);

  const project = openIdx !== null ? TRABAJOS[openIdx] : null;

  useEffect(() => {
    if (openIdx === null) return;
    setSlide(0);
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setSlide((s) => (s + 1) % project!.imgs.length);
      if (e.key === "ArrowLeft") setSlide((s) => (s - 1 + project!.imgs.length) % project!.imgs.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, project]);

  return (
    <section className="section" id="trabajo">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{TRABAJO_HEAD.eyebrow}</span>
          <h2 className="h-xl">{TRABAJO_HEAD.h2}</h2>
          <p className="lead">{TRABAJO_HEAD.lead}</p>
        </Reveal>

        <div className="work-grid">
          {TRABAJOS.map((w, i) => (
            <Reveal key={w.t} direction="scale" delay={i * 0.11}>
              <button
                className="work"
                onClick={() => setOpenIdx(i)}
                aria-label={`Ver proyecto: ${w.t}`}
                style={{ width: "100%" }}
              >
                <div className="work__media">
                  <span className="work__count">{w.imgs.length} piezas</span>
                  <WorkMedia src={w.imgs[0]} fallback="Sistema visual" alt="" />
                </div>
                <div className="work__body">
                  <span className="work__cat">{w.cat}</span>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                  <span className="work__link">
                    Ver el proyecto
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}

          <Reveal direction="scale" delay={TRABAJOS.length * 0.11}>
            <a className="work" href="#/brief" style={{ display: "block" }}>
              <div className="work__media">
                <div className="work__ph" style={{ flexDirection: "column" }}>
                  <span style={{ fontSize: "2.4rem", color: "var(--accent)", opacity: 0.5, letterSpacing: 0 }}>
                    {WORK_INVITE.phPlus}
                  </span>
                  {WORK_INVITE.ph}
                </div>
              </div>
              <div className="work__body">
                <span className="work__cat">{WORK_INVITE.cat}</span>
                <h3>{WORK_INVITE.h3}</h3>
                <p>{WORK_INVITE.p}</p>
                <span className="work__link">
                  {WORK_INVITE.link}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Visor de portafolio */}
      <AnimatePresence>
        {project && (
          <motion.div
            className="viewer"
            role="dialog"
            aria-modal="true"
            aria-label="Visor de proyecto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="viewer__bar">
              <div className="viewer__meta">
                <span>{project.cat}</span>
                <strong>{project.t}</strong>
              </div>
              <div className="viewer__tools">
                <button
                  className="icon-btn"
                  onClick={() => setSlide((s) => (s - 1 + project.imgs.length) % project.imgs.length)}
                  aria-label="Anterior"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <span className="viewer__counter">
                  {slide + 1} / {project.imgs.length}
                </span>
                <button
                  className="icon-btn"
                  onClick={() => setSlide((s) => (s + 1) % project.imgs.length)}
                  aria-label="Siguiente"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
                <button className="icon-btn" onClick={() => setOpenIdx(null)} aria-label="Cerrar">
                  <X aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="viewer__stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  className="viewer__slide"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <WorkMedia src={project.imgs[slide]} fallback="Sistema visual" alt={`${project.t} — pieza ${slide + 1}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="viewer__dots" aria-hidden="true">
              {project.imgs.map((_, i) => (
                <span key={i} className={`viewer__dot${i === slide ? " on" : ""}`} />
              ))}
            </div>

            <div className="viewer__hint">Deslizá o usá las flechas para recorrer, ESC para salir</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
