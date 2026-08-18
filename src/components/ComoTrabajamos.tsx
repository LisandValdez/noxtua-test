import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Clock } from "lucide-react";
import { RAIL, RAIL_HEAD } from "../data/content";
import { Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Entrada escalonada por paso; el `custom` lleva el índice para el delay. */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.12 },
  }),
};

/** Sección "Cómo trabajamos": los 5 pasos en timeline con relleno animado. */
export function ComoTrabajamos() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { amount: 0.35, once: true });
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (inView) setLit(true);
  }, [inView]);
  /* reduced-motion: línea completa de una, sin animación. */
  const fill = reduce || lit ? "100%" : "0%";

  return (
    <section className="section" id="comotrabajamos">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-xl">{RAIL_HEAD.h2}</h2>
          <p className="lead">{RAIL_HEAD.lead}</p>
        </Reveal>

        <div className="steps" ref={trackRef} style={{ "--steps-fill": fill } as CSSProperties}>
          <ol className="steps__track">
            {RAIL.steps.map((s, i) => (
              <motion.li
                key={s.num}
                className="steps__item"
                custom={i}
                variants={itemVariants}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              >
                <span className="steps__num" aria-hidden="true">
                  {s.num}
                </span>
                <span className="steps__label">{s.label}</span>
                <span className="steps__meta">{s.meta}</span>
              </motion.li>
            ))}
          </ol>
          <div className="steps__foot">
            <Clock aria-hidden="true" />
            {RAIL.foot}
          </div>
        </div>
      </div>
    </section>
  );
}
