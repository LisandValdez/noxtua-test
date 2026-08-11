import { useState } from "react";
import { CONTACTO, FOOTER } from "../data/content";

export function Footer() {
  const [failed, setFailed] = useState(false);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
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
              </span>
            </a>
            <p>{FOOTER.brand}</p>
          </div>
          <div>
            <h4>{FOOTER.navTitle}</h4>
            <ul>
              {FOOTER.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{FOOTER.contactTitle}</h4>
            <ul>
              {FOOTER.contact.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.href}
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {FOOTER.bottom}
          </span>
          <span>{FOOTER.city}</span>
        </div>
      </div>
    </footer>
  );
}
