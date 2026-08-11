import { CONTACTO_CARDS } from "../data/content";
import { Reveal } from "./Reveal";

export function Contacto() {
  return (
    <section className="section" id="contacto" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="contact-grid">
          {CONTACTO_CARDS.map((c, i) => {
            const inner = (
              <>
                <span>{c.span}</span>
                <strong>{c.strong}</strong>
                <em>{c.em}</em>
              </>
            );
            return c.href ? (
              <Reveal key={c.span} delay={i * 0.08}>
                <a
                  className="contact-card"
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {inner}
                </a>
              </Reveal>
            ) : (
              <Reveal key={c.span} delay={i * 0.08}>
                <div className="contact-card">{inner}</div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
