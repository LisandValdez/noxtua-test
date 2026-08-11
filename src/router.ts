import { useEffect, useRef, useState } from "react";

export type Route = "/" | "/brief" | "/panel" | "/trabajos";

function routeFor(hash: string): Route {
  if (hash.startsWith("#/brief")) return "/brief";
  if (hash.startsWith("#/panel")) return "/panel";
  if (hash.startsWith("#/trabajos")) return "/trabajos";
  return "/";
}

export function getRoute(): Route {
  return routeFor(window.location.hash);
}

/** Slug de trabajo en #/trabajos/<slug>; null si no hay. */
export function getWorkSlug(): string | null {
  const m = window.location.hash.match(/^#\/trabajos\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function useHashRoute(): Route {
  /* Trackeamos el hash completo, no solo la ruta: navegar dentro de /trabajos
     (#/trabajos <-> #/trabajos/<slug>, o entre trabajos) mantiene la misma ruta
     y sin un re-render App nunca re-lee getWorkSlug() → los links de la grilla,
     "todos los trabajos" y prev/next quedan muertos. El scroll al inicio solo se
     dispara cuando cambia la vista (#/ → #/brief); un fragmento dentro de la misma
     vista (#/ → #servicios) resuelve a la misma ruta y el navegador hace su scroll
     nativo al ancla. */
  const [hash, setHash] = useState(() => window.location.hash);
  const prevRoute = useRef<Route>(routeFor(hash));
  useEffect(() => {
    const on = () => {
      const next = routeFor(window.location.hash);
      setHash(window.location.hash);
      if (next !== prevRoute.current) window.scrollTo(0, 0);
      prevRoute.current = next;
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return routeFor(hash);
}
