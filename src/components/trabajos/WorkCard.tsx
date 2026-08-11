import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { WORK_INVITE } from "../../data/content";
import type { Trabajo } from "../../data/content";

/** Imagen con fallback al placeholder de la marca (clase .work__ph). */
export function WorkMedia({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="work__ph">{fallback}</div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  );
}

type CardProps = {
  /** false = card duplicada en el carrusel (no enfocable, oculta a SR). */
  focusable?: boolean;
};

const tab = (focusable: boolean | undefined) => (focusable === false ? -1 : undefined);

/** Card de un trabajo real → su página de detalle. */
export function WorkCard({ trabajo, focusable }: { trabajo: Trabajo } & CardProps) {
  return (
    <a
      className="work"
      href={`#/trabajos/${trabajo.slug}`}
      aria-label={`Ver proyecto: ${trabajo.t}`}
      tabIndex={tab(focusable)}
      style={{ display: "block", width: "100%" }}
    >
      <div className="work__media">
        <span className="work__count">{trabajo.imgs.length} piezas</span>
        <WorkMedia src={trabajo.imgs[0]} fallback="Sistema visual" alt="" />
      </div>
      <div className="work__body">
        <span className="work__cat">{trabajo.cat}</span>
        <h3>{trabajo.t}</h3>
        <p>{trabajo.d}</p>
        <span className="work__link">
          Ver el proyecto
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

/** Card CTA "Acá va tu marca" → el brief. */
export function WorkInviteCard({ focusable }: CardProps) {
  return (
    <a
      className="work"
      href="#/brief"
      tabIndex={tab(focusable)}
      style={{ display: "block", width: "100%" }}
    >
      <div className="work__media">
        <div className="work__ph" style={{ flexDirection: "column" }}>
          <span style={{ fontSize: "2.4rem", color: "var(--accent)", opacity: 0.5, letterSpacing: 0 }}>
            {WORK_INVITE.phPlus}
          </span>
          {WORK_INVITE.ph}
        </div>
      </div>
      <div className="work__body">
        <span className="work__cat">{WORK_INVITE.cat}</span>
        <h3>{WORK_INVITE.h3}</h3>
        <p>{WORK_INVITE.p}</p>
        <span className="work__link">
          {WORK_INVITE.link}
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
