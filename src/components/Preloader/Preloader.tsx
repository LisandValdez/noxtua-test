import { useEffect, useState } from "react";
import "./Preloader.css";

interface PreloaderProps {
  /** Callback fired when fade-out animation completes */
  onComplete?: () => void;
}


export function Preloader({ onComplete }: PreloaderProps) {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  
  // Tiempo fijo de 3 segundos
  const DISPLAY_TIME = 2500;

  // Efecto para detectar carga completa
  useEffect(() => {
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
        onComplete?.();
      }, DISPLAY_TIME);
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [onComplete]);

  return (
    <div
      className={`preloader ${shouldFadeOut ? "preloader--hidden" : ""}`}
      role="status"
      aria-label="Cargando página"
      aria-busy={!shouldFadeOut}
    >
      {/* Fondo con nebulosa */}
      <div className="preloader__background" aria-hidden="true" />

      {/* Partículas doradas flotantes */}
      <div className="preloader__particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="preloader__particle" />
        ))}
      </div>

      {/* Anillos 3D concéntricos */}
      <div className="preloader__ring-container" aria-hidden="true">
        <div className="preloader__ring" />
        <div className="preloader__ring-inner" />
      </div>

      {/* Logo centrado con efectos 3D */}
      <div className="preloader__logo-wrapper">
        <img
          className="preloader__logo"
          src="/assets/Logo blanco VERTICAL.png"
          alt=""
          aria-hidden="true"
          width="1081"
          height="1081"
          decoding="async"
        />
        <div className="preloader__logo-glow" aria-hidden="true" />
      </div>
    </div>
  );
}