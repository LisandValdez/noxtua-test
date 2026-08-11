import { useEffect, useRef, useState } from "react";

export type Route = "/" | "/brief" | "/panel" | "/trabajos";

export function getRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith("#/brief")) return "/brief";
  if (h.startsWith("#/panel")) return "/panel";
  if (h.startsWith("#/trabajos")) return "/trabajos";
  return "/";
}

/** Slug de trabajo en #/trabajos/<slug>; null si no hay. */
export function getWorkSlug(): string | null {
  const m = window.location.hash.match(/^#\/trabajos\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(getRoute);
  /* Ruta previa en un ref: solo hacemos scroll al inicio cuando cambia la vista
     (#/ → #/brief). Un cambio de fragmento dentro de la misma vista (#/ → #servicios)
     resuelve a la misma ruta y deja que el navegador haga su scroll nativo al ancla. */
  const prevRoute = useRef<Route>(getRoute());
  useEffect(() => {
    const on = () => {
      const next = getRoute();
      setRoute(next);
      if (next !== prevRoute.current) window.scrollTo(0, 0);
      prevRoute.current = next;
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
