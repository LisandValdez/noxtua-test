import { ArrowLeft } from "lucide-react";
import { Ambient } from "./components/Ambient";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Diferencia } from "./components/Diferencia";
import { Servicios } from "./components/Servicios";
import { Metodo } from "./components/Metodo";
import { Planes } from "./components/Planes";
import { Trabajo } from "./components/Trabajo";
import { Equipo } from "./components/Equipo";
import { Faq } from "./components/Faq";
import { Cta } from "./components/Cta";
import { Contacto } from "./components/Contacto";
import { Footer } from "./components/Footer";
import { Fab } from "./components/Fab";
import { BriefView } from "./components/brief/BriefView";
import { savePartial, submitFinal } from "./components/brief/submit";
import { useHashRoute } from "./router";
import { KEYS, Store } from "./data/storage";
import type { LeadRecord } from "./data/types";

export default function App() {
  const route = useHashRoute();

  /* Contrato de envío (Task 9): BriefView arma el record y lo pasa acá. */
  const handlePartial = (rec: LeadRecord) => {
    savePartial(rec);
  };

  const handleFinal = (rec: LeadRecord) => {
    void submitFinal(rec); // fire-and-forget: guarda local + email; nunca rompe el flujo
    Store.del(KEYS.draft);
  };

  if (route === "/brief") return <BriefView onSubmit={handleFinal} onPartial={handlePartial} />;

  if (route === "/panel") {
    return (
      <div className="app">
        <header className="app__bar">
          <div className="app__bar-in">
            <a className="app__exit" href="#/">
              <ArrowLeft aria-hidden="true" />
              Volver al sitio
            </a>
            <a className="brand" href="#/" aria-label="NOXTUA, ir al inicio">
              <span className="brand__name">NOXTUA</span>
            </a>
          </div>
        </header>
        <div className="app__body">
          <div className="app__wrap" style={{ textAlign: "center" }}>
            <p style={{ marginTop: "clamp(48px, 10vw, 120px)", color: "var(--muted)", fontSize: "1.05rem" }}>
              Panel en construcción
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Ambient />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Diferencia />
        <Servicios />
        <Metodo />
        <Planes />
        <Trabajo />
        <Equipo />
        <Faq />
        <Cta />
        <Contacto />
      </main>
      <Footer />
      <Fab />
    </>
  );
}
