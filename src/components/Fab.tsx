import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { FAB } from "../data/content";

/** Botón flotante de WhatsApp: aparece tras 520px de scroll. */
export function Fab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      className={`fab${show ? " show" : ""}`}
      href={FAB.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle aria-hidden="true" />
      <span>{FAB.label}</span>
    </a>
  );
}
