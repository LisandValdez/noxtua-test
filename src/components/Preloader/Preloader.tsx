import { useEffect, useState } from "react";
import "./Preloader.css";

interface PreloaderProps {
  /** Callback fired when fade-out animation completes */
  onComplete?: () => void;
}

/**
 * Preloader - Pantalla de carga completa con:
 * - Logo del búho centrado con animación de "respiración"
 * - Anillo de progreso doble (borde rotante + gradiente cónico)
 * - Resplandor ambiental detrás del logo
 * - Texto "Cargando..." con puntos suspensivos animados
 * - Fade-out suave al completar la carga (window.onload)
 * - Respeta prefers-reduced-motion
 * - Z-index 9999 para cubrir todo el contenido
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [ellipsis, setEllipsis] = useState(0);

  // Efecto para detectar carga completa de la página
  useEffect(() => {
    const handleLoad = () => {
      // Pequeño delay para que la animación sea visible al menos brevemente
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
        onComplete?.();
      }, 400);
      return () => clearTimeout(timer);
    };

    // Si el documento ya está listo (recargas rápidas), ejecutar inmediatamente
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [onComplete]);

  // Animación de puntos suspensivos para el texto "Cargando..."
  // Usa requestAnimationFrame para mejor performance que setInterval
  useEffect(() => {
    let frameId: number;
    let lastTick = 0;

    const animate = (now: number) => {
      // Cambiar cada ~600ms (3 estados en 1.8s)
      if (now - lastTick >= 600) {
        setEllipsis((prev) => (prev + 1) % 4);
        lastTick = now;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Textos para los 4 estados de los puntos suspensivos
  const ellipsisTexts = [
    "Cargando",
    "Cargando.",
    "Cargando..",
    "Cargando...",
  ];

  return (
    <div
      className={`preloader ${shouldFadeOut ? "preloader--hidden" : ""}`}
      role="status"
      aria-label="Cargando página"
      aria-busy={!shouldFadeOut}
    >
      {/* Resplandor ambiental detrás del logo */}
      <div className="preloader__glow" aria-hidden="true" />

      {/* Contenedor del anillo de progreso (centra el logo) */}
      <div className="preloader__ring-wrapper" aria-hidden="true">
        <div className="preloader__ring" aria-hidden="true" />
      </div>

      {/* Logo del búho */}
      <img
        className="preloader__logo"
        src="/assets/Logo blanco VERTICAL.png"
        alt=""
        aria-hidden="true"
        width="1081"
        height="1081"
        decoding="async"
      />

      {/* Texto de carga con puntos animados */}
      <p className="preloader__text" aria-live="polite" aria-atomic="true">
        {ellipsisTexts[ellipsis]}
      </p>
    </div>
  );
}