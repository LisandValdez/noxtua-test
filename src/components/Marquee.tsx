import { MARQUEE_LOGOS } from "../data/content";

/** Marquesina de logos de clientes. El track se duplica para un loop sin salto. */
export function Marquee() {
  const items = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS];
  return (
    <div className="marquee" aria-label="Marcas que confían en nosotros">
      <div className="marquee__track">
        {items.map((logo, i) => (
          <span key={i} className="marquee__item">
            <img src={`/assets/LOGOS CLIENTES/${logo}`} alt={logo.replace(/\.[^.]+$/, "").replace(/_/g, " ")} />
          </span>
        ))}
      </div>
    </div>
  );
}
