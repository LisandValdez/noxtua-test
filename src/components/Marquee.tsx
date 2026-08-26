import { MARQUEE_LOGOS } from "../data/content";

/** Marquesina de logos de clientes. El track se duplica para un loop sin salto. */
export function Marquee() {
  // Logos verticales conocidos (ratio height/width > 1.15)
  const verticalLogos = new Set([
    "Blacl panthers vertical.png",
    "Casa malbec.png",
    "Hiden Stays.png",
    "Rox tatoo.png",
  ]);

  const items = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS];
  return (
    <div className="marquee" aria-label="Marcas que confían en nosotros">
      <div className="marquee__track">
        {items.map((logo, i) => {
          const isVertical = verticalLogos.has(logo);
          return (
            <span key={i} className="marquee__item">
              <img
                src={`/assets/LOGOS CLIENTES/${logo}`}
                alt={logo.replace(/\.[^.]+$/, "").replace(/_/g, " ")}
                style={isVertical ? { aspectRatio: "auto" } : undefined}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
