import { Check } from "lucide-react";
import { MONEDA, PLANES, PLANES_HEAD, PLANS_FOOT } from "../data/content";
import { Reveal } from "./Reveal";

export function Planes() {
  return (
    <section className="section" id="planes">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow no-rule">{PLANES_HEAD.eyebrow}</span>
          <h2 className="h-xl">{PLANES_HEAD.h2}</h2>
          <p className="lead" style={{ marginInline: "auto" }}>{PLANES_HEAD.lead}</p>
        </Reveal>

        <div className="plans">
          {PLANES.map((p, i) => (
            <Reveal
              key={p.nombre}
              direction="scale"
              delay={i * 0.11}
              className={`plan${p.destacado ? " plan--featured" : ""}`}
            >
              {p.flag && <span className="plan__flag">{p.flag}</span>}
              <h3 className="plan__name">{p.nombre}</h3>
              <p className="plan__for">{p.para}</p>
              <span className="plan__from">Desde</span>
              <div className="plan__price">
                <b className={p.destacado ? "grad-text" : ""}>
                  {MONEDA} {p.precio}
                </b>
                <span>{p.periodo}</span>
              </div>
              <p className="plan__note">{p.nota}</p>
              <ul>
                {p.items.map((it, j) => (
                  <li key={j}>
                    <Check aria-hidden="true" />
                    <span>
                      {it.lead ? (
                        <>
                          <b>{it.lead}</b>
                          {it.rest}
                        </>
                      ) : (
                        it.rest
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <a className={`btn ${p.destacado ? "btn--primary" : "btn--ghost"} btn--block`} href="#/brief">
                {p.cta}
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="plans-foot">
          <p>
            <strong style={{ color: "var(--text)" }}>{PLANS_FOOT.strong}</strong>
            {PLANS_FOOT.rest}
          </p>
          <a className="btn btn--ghost btn--sm" href="#/brief">
            {PLANS_FOOT.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
