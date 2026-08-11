import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

type RevealProps = {
  children?: ReactNode;
  /** Demora en segundos, replicando el --d original (180ms → 0.18). */
  delay?: number;
  direction?: RevealDirection;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function initialFor(direction: RevealDirection): { opacity: number; x?: number; y?: number; scale?: number } {
  switch (direction) {
    case "up":
      return { opacity: 0, y: 28 };
    case "down":
      return { opacity: 0, y: -28 };
    case "left":
      return { opacity: 0, x: -40 };
    case "right":
      return { opacity: 0, x: 40 };
    case "scale":
      return { opacity: 0, scale: 0.94 };
    case "fade":
    default:
      return { opacity: 0 };
  }
}

/** Wrapper de aparición en scroll (reemplaza a data-reveal / IntersectionObserver). */
export function Reveal({ children, delay = 0, direction = "up", className, style, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;

  const variants: Variants = {
    hidden: initialFor(direction),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
