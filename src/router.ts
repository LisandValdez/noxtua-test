import { useEffect, useState } from "react";

export type Route = "/" | "/brief" | "/panel";

export function getRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith("#/brief")) return "/brief";
  if (h.startsWith("#/panel")) return "/panel";
  return "/";
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(getRoute);
  useEffect(() => {
    const on = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
