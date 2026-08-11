import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TRABAJOS } from "../../data/content";
import { Nav } from "../Nav";
import { Footer } from "../Footer";
import { Fab } from "../Fab";
import { Reveal } from "../Reveal";
import { WorkMedia } from "./WorkCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Estado para un slug que no existe en TRABAJOS. */
function NotFound() {
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <section className="section trabajos-hero">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <span className="eyebrow">Trabajo</span>
              <h1 className="h-xxl">Ese proyecto no existe</h1>
              <p className="lead">Puede que haya cambiado de nombre o que la dirección esté incompleta.</p>
              <div className="trabajos-hero__actions">
                <a className="btn btn--primary btn--lg" href="#/trabajos">
                  Ver todos los trabajos
                  <ArrowRight aria-hidden="true" />
                </a>
                <a className="btn btn--ghost btn--lg" href="#/">
                  Volver al inicio
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <Fab />
    </>
  );
}

/** Página de detalle #/trabajos/<slug>: imágenes, descripción y detalles. */
export function WorkPage({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const entrance = reduce ? false : { opacity: 0, y: 26 };
  /* Al cambiar de trabajo (prev/next) la ruta sigue siendo /trabajos y el router no
     dispara scroll; App remonta esta página con key={slug}, y este effect sube al tope. */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const idx = TRABAJOS.findIndex((w) => w.slug === slug);
  if (idx === -1) return <NotFound />;

  const w = TRABAJOS[idx];
  const prev = TRABAJOS[(idx - 1 + TRABAJOS.length) % TRABAJOS.length];
  const next = TRABAJOS[(idx + 1) % TRABAJOS.length];

  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <section className="section trabajos-hero">
          <div className="container">
            <motion.div initial={entrance} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <a className="work-back" href="#/trabajos">
                <ArrowLeft aria-hidden="true" />
                Todos los trabajos
              </a>
              <span className="eyebrow">{w.cat}</span>
              <h1 className="h-xxl">{w.t}</h1>
              <p className="lead">{w.d}</p>
            </motion.div>
          </div>
        </section>

        <section className="section trabajos-detalle">
          <div className="container">
            <dl className="trabajos-meta">
              <div className="trabajos-meta__row">
                <dt>Cliente</dt>
                <dd>{w.cliente}</dd>
              </div>
              <div className="trabajos-meta__row">
                <dt>Año</dt>
                <dd>{w.año}</dd>
              </div>
              <div className="trabajos-meta__row">
                <dt>Servicios</dt>
                <dd className="trabajos-meta__chips">
                  {w.servicios.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="trabajos-alcance">{w.alcance}</p>
          </div>
        </section>

        <section className="section trabajos-galeria">
          <div className="container">
            {w.imgs.map((src, i) => (
              <Reveal
                key={src}
                direction="up"
                delay={(i % 2) * 0.1}
                className={`galeria__item${i === 0 ? " galeria__item--lead" : ""}`}
              >
                <figure>
                  <WorkMedia src={src} fallback="Sistema visual" alt={`${w.t} — pieza ${i + 1} de ${w.imgs.length}`} />
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <nav className="work-nav" aria-label="Navegación entre proyectos">
              <a className="work-nav__item" href={`#/trabajos/${prev.slug}`}>
                <ArrowLeft aria-hidden="true" />
                <span className="work-nav__meta">Anterior</span>
                <span className="work-nav__title">{prev.t}</span>
              </a>
              <a className="btn btn--primary btn--lg" href="#/brief">
                Empezar el tuyo
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="work-nav__item work-nav__item--next" href={`#/trabajos/${next.slug}`}>
                <span className="work-nav__meta">Siguiente</span>
                <span className="work-nav__title">{next.t}</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
      <Fab />
    </>
  );
}
