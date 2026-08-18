import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TRABAJO_HEAD, TRABAJOS } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./trabajos/WorkCard";

/** Carrusel de trabajos con botones de desplazamiento lateral. */
export function Trabajo() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cell = track.querySelector<HTMLElement>(".works-carousel__cell");
    const step = (cell?.offsetWidth ?? 420) + 56;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
      </div>

      <div className="works-carousel">
        <button
          className="works-carousel__btn works-carousel__btn--prev"
          type="button"
          aria-label="Desplazar carrusel a la izquierda"
          onClick={() => scrollBy(-1)}
        >
          <ArrowLeft aria-hidden="true" />
        </button>

        <div className="works-carousel__viewport">
          <div className="works-carousel__track" ref={trackRef}>
            {TRABAJOS.map((w) => (
              <div className="works-carousel__cell" key={w.slug}>
                <WorkCard trabajo={w} focusable />
              </div>
            ))}
          </div>
        </div>

        <button
          className="works-carousel__btn works-carousel__btn--next"
          type="button"
          aria-label="Desplazar carrusel a la derecha"
          onClick={() => scrollBy(1)}
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
