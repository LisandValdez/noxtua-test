import { BarChart3, Camera, Code, Palette, Search, Target, type LucideIcon } from "lucide-react";
import { SERVICIOS, SERVICIOS_HEAD, type ServicioIco } from "../data/content";
import { Reveal } from "./Reveal";

const ICONS: Record<ServicioIco, LucideIcon> = {
  target: Target,
  camera: Camera,
  palette: Palette,
  code: Code,
  search: Search,
  chart: BarChart3,
};

export function Servicios() {
  return (
    <section className="section" id="servicios">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-xl">{SERVICIOS_HEAD.h2}</h2>
          <p className="lead">{SERVICIOS_HEAD.lead}</p>
        </Reveal>

        <div className="svc-grid">
          {SERVICIOS.map((s, i) => {
            const Icon = ICONS[s.ico];
            return (
              <Reveal key={s.t} direction="scale" delay={i * 0.07} className="card svc">
                <span className="card__top-line" aria-hidden="true" />
                <div className="svc__icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <div className="svc__tags">
                  {s.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
