import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTA } from "../data/content";
import { Reveal } from "./Reveal";

export function Cta() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal direction="scale" className="cta">
          <span className="eyebrow no-rule" style={{ marginBottom: 20 }}>
            {CTA.eyebrow}
          </span>
          <h2 className="h-xl">{CTA.h2}</h2>
          <p className="lead">{CTA.lead}</p>
          <div className="cta__actions">
            <a className="btn btn--primary btn--lg" href="#/brief">
              {CTA.primary}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="btn btn--ghost btn--lg" href={CTA.ghostHref} target="_blank" rel="noopener noreferrer">
              {CTA.ghost}
            </a>
          </div>
          <div className="cta__micro">
            {CTA.micro.map((m) => (
              <span key={m}>
                <CheckCircle2 aria-hidden="true" />
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
