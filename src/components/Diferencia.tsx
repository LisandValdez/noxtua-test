import { Check } from "lucide-react";
import { DIFERENCIA } from "../data/content";
import { Reveal } from "./Reveal";

export function Diferencia() {
  return (
    <section className="section" id="diferencia">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{DIFERENCIA.eyebrow}</span>
          <h2 className="h-xl">{DIFERENCIA.h2}</h2>
          <p className="lead">{DIFERENCIA.lead}</p>
        </Reveal>

        <div className="compare">
          <Reveal direction="left" className="compare__col compare__col--bad">
            <span className="compare__tag">{DIFERENCIA.badTag}</span>
            <h3>{DIFERENCIA.badH3}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".94rem", lineHeight: 1.68, marginBottom: 16 }}>
              {DIFERENCIA.badP1}
            </p>
            <p style={{ color: "var(--muted)", fontSize: ".94rem", lineHeight: 1.68 }}>
              {DIFERENCIA.badP2}
            </p>
          </Reveal>

          <Reveal direction="right" delay={0.12} className="compare__col compare__col--good">
            <span className="compare__tag">{DIFERENCIA.goodTag}</span>
            <h3>{DIFERENCIA.goodH3}</h3>
            <ul>
              {DIFERENCIA.goodItems.map((item) => (
                <li key={item}>
                  <i>
                    <Check size={12} strokeWidth={3} />
                  </i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
