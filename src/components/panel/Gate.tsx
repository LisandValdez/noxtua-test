import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";

/* Clave del panel interno. La verificación manual de la Task 14 usa este valor. */
export const GATE_KEY = "noxtua2026";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const reduce = useReducedMotion();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  /* Contador de intentos fallidos: fuerza a re-animar el shake aunque el error
     se repita consecutivamente (cambia levemente la amplitud). */
  const [attempt, setAttempt] = useState(0);

  const tryOpen = () => {
    if (pin === GATE_KEY) {
      setErr(false);
      onUnlock();
    } else {
      setErr(true);
      setAttempt((a) => a + 1);
      setPin("");
    }
  };

  const amp = 6 + (attempt % 3) * 2;

  return (
    <div className="gate">
      <motion.div
        className="gate__card"
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={
          reduce
            ? undefined
            : err
              ? { opacity: 1, y: 0, x: [0, -amp, amp, -amp * 0.8, amp * 0.8, 0] }
              : { opacity: 1, y: 0, x: 0 }
        }
        transition={reduce ? undefined : err ? { duration: 0.4, ease: "easeOut" } : { duration: 0.45, ease: EASE }}
      >
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
        {err && (
          <span className="gate__err show" role="alert">
            Esa clave no es correcta. Probá de nuevo.
          </span>
        )}
        <button type="button" className="btn btn--primary btn--block" onClick={tryOpen}>
          <Lock aria-hidden="true" />
          Entrar
        </button>
      </motion.div>
    </div>
  );
}
