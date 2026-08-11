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
import { PanelView } from "./components/panel/PanelView";
import { TrabajosPage } from "./components/trabajos/TrabajosPage";
import { WorkPage } from "./components/trabajos/WorkPage";
import { savePartial, submitFinal } from "./components/brief/submit";
import { getWorkSlug, useHashRoute } from "./router";
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

  if (route === "/panel") return <PanelView />;

  if (route === "/trabajos") {
    const slug = getWorkSlug();
    /* key={slug} remonta WorkPage al pasar de un trabajo a otro (prev/next), así su
       effect de scroll al tope se ejecuta aunque la ruta no cambie. */
    return slug ? <WorkPage key={slug} slug={slug} /> : <TrabajosPage />;
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
