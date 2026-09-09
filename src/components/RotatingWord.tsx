import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RotatingWordProps {
  words: readonly string[];
  /** Milisegundos que cada palabra permanece visible antes de rotar. */
  dwell?: number;
  /** Duración del cross-fade en milisegundos. */
  duration?: number;
  className?: string;
}

/**
 * Palabra rotativa con cross-fade suave (fade out hacia arriba + fade in desde abajo).
 * Reserva el ancho de la palabra más larga con un spacer invisible para evitar
 * layout shift en el resto del texto al cambiar de palabra.
 */
export function RotatingWord({
  words,
  dwell = 4000,
  duration = 500,
  className = "",
}: RotatingWordProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Ciclo de rotación. Si reduced-motion o hay una sola palabra, no rota.
  useEffect(() => {
    if (reduce || words.length <= 1) return;

    const advance = () => setIndex((i) => (i + 1) % words.length);
    const id = window.setInterval(advance, dwell + duration);
    return () => window.clearInterval(id);
  }, [reduce, words, dwell, duration]);

  const current = words[index % words.length];
  // Palabra más larga: fija el ancho del contenedor (spacer invisible).
  const reserved = [...words].sort((a, b) => b.length - a.length)[0];

  const fade = {
    duration: duration / 1000,
    ease: EASE,
  };

  return (
    <span className={`rotating-word ${className}`}>
      {/* Spacer invisible que reserva el ancho/altura real (evita layout shift) */}
      <span className="rotating-word__spacer" aria-hidden="true">
        {reserved}
      </span>

      {/* Texto visible para screen readers (lee el valor actual, sin spam de aria-live) */}
      <span className="sr-only">{current}</span>

      <AnimatePresence initial={false}>
        <motion.span
          key={current}
          className="rotating-word__current"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -14 }}
          transition={fade}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}