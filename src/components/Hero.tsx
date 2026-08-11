import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { HERO, RAIL } from "../data/content";

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

  const railRef = useRef<HTMLElement>(null);
  const railInView = useInView(railRef, { amount: 0.25 });
  const litDone = useRef(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!railInView || litDone.current) return;
    litDone.current = true;
    const items = railRef.current?.querySelectorAll(".rail__item");
    items?.forEach((it, i) => {
      const t = reduce ? 0 : 260 + i * 240;
      setTimeout(() => it.classList.add("lit"), t);
    });
    if (listRef.current) {
      const t = reduce ? 0 : 320;
      setTimeout(() => listRef.current!.style.setProperty("--rail-fill", "100%"), t);
    }
  }, [railInView, reduce]);

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

          {/* Capa 5 · riel de pasos */}
          <motion.aside
            ref={railRef}
            className="rail"
            aria-label={RAIL.ariaLabel}
            variants={{
              hidden: { opacity: 0, x: 64 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE, delay: 0.2 } },
            }}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="rail__head">
              <span className="rail__title">{RAIL.title}</span>
              <span className="rail__live">
                <span className="rail__dot" />
                {RAIL.live}
              </span>
            </div>
            <ol className="rail__list" ref={listRef}>
              {RAIL.steps.map((s, i) => (
                <motion.li
                  key={s.num}
                  className="rail__item"
                  variants={fadeUp(i * 0.22)}
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="rail__node">{s.num}</span>
                  <span>
                    <span className="rail__label">{s.label}</span>
                    <span className="rail__meta">{s.meta}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
            <div className="rail__foot">
              <Clock aria-hidden="true" />
              {RAIL.foot}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
