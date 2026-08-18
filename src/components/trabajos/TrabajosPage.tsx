import { motion } from "framer-motion";
import { TRABAJO_HEAD, TRABAJOS } from "../../data/content";
import { Nav } from "../Nav";
import { Footer } from "../Footer";
import { Fab } from "../Fab";
import { Reveal } from "../Reveal";
import { WorkCard, WorkInviteCard } from "./WorkCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Página índice #/trabajos: todos los proyectos en grilla. */
export function TrabajosPage() {
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <section className="section trabajos-hero">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h1 className="h-xxl">Todos los proyectos</h1>
              <p className="lead">{TRABAJO_HEAD.lead}</p>
            </motion.div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="work-grid">
              {TRABAJOS.map((w, i) => (
                <Reveal key={w.slug} direction="scale" delay={i * 0.11}>
                  <WorkCard trabajo={w} />
                </Reveal>
              ))}
              <Reveal direction="scale" delay={TRABAJOS.length * 0.11}>
                <WorkInviteCard />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Fab />
    </>
  );
}
