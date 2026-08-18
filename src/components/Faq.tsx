import { useState } from "react";
import { FAQ, FAQ_HEAD } from "../data/content";
import { Reveal } from "./Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section" id="faq">
      <div className="container">
        <Reveal className="section-head center">
          <h2 className="h-xl">{FAQ_HEAD.h2}</h2>
        </Reveal>

        <div className="faq">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05} className={`faq__item${isOpen ? " open" : ""}`}>
                <button
                  className="faq__q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                >
                  <span>{f.q}</span>
                  <i aria-hidden="true" />
                </button>
                <div className="faq__a" id={`faq-a-${i}`}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
