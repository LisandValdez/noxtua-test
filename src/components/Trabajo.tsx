import { ArrowRight } from "lucide-react";
import { TRABAJO_HEAD, TRABAJOS } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./trabajos/WorkCard";

/** Carrusel de trabajos con desplazamiento lateral continuo. */
export function Trabajo() {
  return (
    <section className="section" id="trabajo">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-xl">{TRABAJO_HEAD.h2}</h2>
          <p className="lead">{TRABAJO_HEAD.lead}</p>
          <a className="works-carousel__all" href="#/trabajos">
            Ver todos los trabajos
            <ArrowRight aria-hidden="true" />
          </a>
        </Reveal>

        <div className="works-carousel" aria-label="Trabajos recientes">
          <div className="works-carousel__viewport">
            <div className="works-carousel__track">
              {[0, 1].map((copy) => (
                <div
                  className="works-carousel__group"
                  key={copy}
                  aria-hidden={copy === 1 || undefined}
                >
                  {TRABAJOS.map((w) => (
                    <div className="works-carousel__cell" key={`${copy}-${w.slug}`}>
                      <WorkCard trabajo={w} focusable={copy === 0} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
