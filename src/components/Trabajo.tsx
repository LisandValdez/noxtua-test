import { ArrowRight } from "lucide-react";
import { TRABAJO_HEAD, TRABAJOS } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard, WorkInviteCard } from "./trabajos/WorkCard";

/** Carrusel marquee lento de trabajos. El track duplica su contenido en dos
 *  mitades idénticas para un loop sin salto; la segunda copia es decorativa
 *  (aria-hidden y no enfocable). Con reduced-motion el track vuelve a grilla. */
export function Trabajo() {
  return (
    <section className="section" id="trabajo">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{TRABAJO_HEAD.eyebrow}</span>
          <h2 className="h-xl">{TRABAJO_HEAD.h2}</h2>
          <p className="lead">{TRABAJO_HEAD.lead}</p>
          <a className="works-carousel__all" href="#/trabajos">
            Ver todos los trabajos
            <ArrowRight aria-hidden="true" />
          </a>
        </Reveal>
      </div>

      <div className="works-carousel">
        <div className="works-carousel__track">
          {[0, 1].map((copy) => (
            <div className="works-carousel__group" key={copy} aria-hidden={copy === 1 || undefined}>
              {TRABAJOS.map((w) => (
                <div className="works-carousel__cell" key={w.slug}>
                  <WorkCard trabajo={w} focusable={copy === 0} />
                </div>
              ))}
              <div className="works-carousel__cell">
                <WorkInviteCard focusable={copy === 0} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
