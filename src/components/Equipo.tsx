import { useState } from "react";
import { Linkedin } from "lucide-react";
import { EQUIPO, EQUIPO_HEAD } from "../data/content";
import { Reveal } from "./Reveal";

function MemberAvatar({ name, img }: { name: string; img: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="member__ph">
      {!failed && <img src={img} alt="" loading="lazy" onError={() => setFailed(true)} />}
      {failed && <i>{initials}</i>}
    </div>
  );
}

export function Equipo() {
  return (
    <section className="section" id="equipo">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-xl">{EQUIPO_HEAD.h2}</h2>
          <p className="lead">{EQUIPO_HEAD.lead}</p>
        </Reveal>

        <div className="team-grid">
          {EQUIPO.map((m, i) => (
            <Reveal key={m.n} direction="scale" delay={i * 0.09} className="card member">
              <span className="card__top-line" aria-hidden="true" />
              <MemberAvatar name={m.n} img={m.img} />
              <h3>{m.n}</h3>
              <p className="member__role">{m.r}</p>
              <p className="member__desc">{m.d}</p>
              <a
                className="member__in"
                href={m.in}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${m.n}`}
              >
                <Linkedin aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
