import { Circle } from "lucide-react";
import { MARQUEE_CLAIMS } from "../data/content";

/** Marquesina de confianza. El track se duplica para un loop sin salto. */
export function Marquee() {
  const items = [...MARQUEE_CLAIMS, ...MARQUEE_CLAIMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((c, i) => (
          <span key={i} className="marquee__item">
            <Circle fill="currentColor" strokeWidth={0} />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
