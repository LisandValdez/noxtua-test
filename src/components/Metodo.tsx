import { Info } from "lucide-react";
import { METODO, METODO_CALLOUT, METODO_HEAD } from "../data/content";
import { Reveal } from "./Reveal";

export function Metodo() {
  return (
    <section className="section" id="metodo">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{METODO_HEAD.eyebrow}</span>
          <h2 className="h-xl">{METODO_HEAD.h2}</h2>
          <p className="lead">{METODO_HEAD.lead}</p>
        </Reveal>

        <div className="method">
          {METODO.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.09} className="method__step">
              <span className="method__num">{m.n}</span>
              <h3>{m.t}</h3>
              <p>{m.d}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="callout mt-m" delay={0.1} style={{ maxWidth: 760 }}>
          <Info aria-hidden="true" />
          <span>
            <b>{METODO_CALLOUT.lead}</b>
            {METODO_CALLOUT.body}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
