import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS, NAV_LINKS_MOBILE, NAV_CTA } from "../data/content";

/** Marca con marca de agua de respaldo si el isotipo no carga. */
function Brand({ sub = true }: { sub?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <a className="brand" href="#main" aria-label="NOXTUA, ir al inicio">
      <span className="brand__mark">
        {failed ? "N" : (
          <img
            src="/assets/NOXTUA isotipo JPG-100.jpg"
            alt=""
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span>
        <span className="brand__name">NOXTUA</span>
        {sub && <span className="brand__sub">Marca, web y pauta</span>}
      </span>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) {
          progressRef.current.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
        }
        let cur = "";
        document.querySelectorAll("main section[id]").forEach((s) => {
          if (s.getBoundingClientRect().top <= 140) cur = s.id;
        });
        setActive(cur);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    return () => document.body.classList.remove("is-locked");
  }, [open]);

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav__inner">
          <Brand />

          {/* Píldora central */}
          <nav className="nav__pill" aria-label="Principal">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                className={`nav__link${active === l.href.slice(1) ? " active" : ""}`}
                href={l.href}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a className="btn btn--primary btn--sm nav__cta" href="#/brief">
            {NAV_CTA}
            <ArrowRight aria-hidden="true" />
          </a>

          <button
            className={`nav__toggle${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="navMobile"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`nav__mobile${open ? " open" : ""}`} id="navMobile">
        {NAV_LINKS_MOBILE.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
            <i>{l.num}</i>
          </a>
        ))}
        <a className="btn btn--primary btn--lg" href="#/brief" onClick={() => setOpen(false)}>
          {NAV_CTA}
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </>
  );
}
