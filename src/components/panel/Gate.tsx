import { useState } from "react";
import { Lock } from "lucide-react";

/* Clave del panel interno. La verificación manual de la Task 14 usa este valor. */
export const GATE_KEY = "noxtua2026";

export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const tryOpen = () => {
    if (pin === GATE_KEY) {
      setErr(false);
      onUnlock();
    } else {
      setErr(true);
      setPin("");
    }
  };

  return (
    <div className="gate">
      <div className="gate__card">
        <span className="eyebrow no-rule">Acceso restringido</span>
        <h2>Panel de NOXTUA</h2>
        <p className="body-muted">Ingresá la clave del equipo para ver los diagnósticos.</p>
        <div className={`field${err ? " err" : ""}`}>
          <label htmlFor="gate-pin">Clave del equipo</label>
          <input
            id="gate-pin"
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErr(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && tryOpen()}
            autoFocus
            autoComplete="off"
            placeholder="••••••••"
          />
        </div>
        {err && <span className="gate__err show">Código incorrecto</span>}
        <button type="button" className="btn btn--primary btn--block" onClick={tryOpen}>
          <Lock aria-hidden="true" />
          Ingresar
        </button>
      </div>
    </div>
  );
}
