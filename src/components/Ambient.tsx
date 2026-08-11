import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * Fondo ambiental fijo: retícula del sistema de marca, brillo y
 * marca de agua. Parallax suave con el puntero (solo si hay mouse).
 */
export function Ambient() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 50, damping: 22, mass: 0.6 });

  const gridX = useTransform(sx, (v) => v * -22);
  const gridY = useTransform(sy, (v) => v * -22);
  const glowX = useTransform(sx, (v) => -40 + v * 30);
  const glowY = useTransform(sy, (v) => -40 + v * 30);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div className="ambient" aria-hidden="true">
      <motion.div className="ambient__grid" style={{ x: gridX, y: gridY }} />
      <motion.div className="ambient__glow on" style={{ x: glowX, y: glowY }} />
      <img
        className="ambient__watermark"
        src="/assets/NOXTUA isotipo marca de agua N.png"
        alt=""
        draggable={false}
      />
      <div className="ambient__noise" />
      <div className="ambient__vignette" />
    </div>
  );
}
