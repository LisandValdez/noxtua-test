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

export default function App() {
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
