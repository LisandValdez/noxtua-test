import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HERO } from "../data/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
});

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";

  /* El video del hero se reproduce en todos los viewports; con reduced-motion se
     muestra la imagen estática (.hero__media-bg). */
  const showVideo = !reduce;

  return (
    <section className="hero" id="main">
      {/* Capa 1 · fondo */}
      {showVideo ? (
        <motion.div
          className="hero__media"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          aria-hidden="true"
        >
          <video
            className="hero__video"
            src="/assets/hero-loop-poster.mp4"
            poster="/assets/hero-loop-poster.png"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </motion.div>
      ) : (
        <div className="hero__media" aria-hidden="true">
          <div className="hero__media-bg" />
        </div>
      )}

      {/* Capa 2 · velo de legibilidad */}
      <div className="hero__overlay" aria-hidden="true" />

      {/* Capa 3 · contenido */}
      <div className="container">
        <div className="hero__grid">
          <div>
            <motion.div className="hero__badge" variants={fadeUp(0)} initial={initial} animate="visible">
              <b>{HERO.badgeKicker}</b> {HERO.badge}
            </motion.div>

            <motion.h1
              className="h-xxl"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
              }}
              initial={initial}
              animate="visible"
            >
              {HERO.h1.map((line, i) => (
                <motion.span key={i} className="split-line" variants={{ hidden: {}, visible: {} }}>
                  <motion.span
                    variants={{
                      hidden: { y: "115%" },
                      visible: { y: 0, transition: { duration: 0.8, ease: EASE } },
                    }}
                  >
                    {line}
                    {i === HERO.h1.length - 1 && <em className="serif-em">{HERO.h1Em}</em>}
                  </motion.span>
                </motion.span>
              ))}
            </motion.h1>

            <motion.p className="lead hero__sub" variants={fadeUp(0.18)} initial={initial} animate="visible">
              {HERO.subBefore}
              <strong style={{ color: "var(--text)", fontWeight: 500 }}>{HERO.subStrong}</strong>
              {HERO.subAfter}
            </motion.p>

            <motion.div className="hero__actions" variants={fadeUp(0.28)} initial={initial} animate="visible">
              <a className="btn btn--primary btn--lg" href="#/brief">
                {HERO.primaryCta}
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="btn btn--ghost btn--lg" href="#trabajo">
                {HERO.ghostCta}
              </a>
            </motion.div>

            <motion.p className="hero__note" variants={fadeUp(0.34)} initial={initial} animate="visible">
              <CheckCircle2 aria-hidden="true" />
              {HERO.note}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
