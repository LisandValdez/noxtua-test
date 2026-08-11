import type { CSSProperties, ReactNode } from "react";
import { Check, CircleAlert } from "lucide-react";
import { PRESUPUESTO } from "../../data/briefOptions";

/** Cabecera de cada paso: kicker, título y subtítulo. */
export function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <header className="step__head">
      <span className="step__kicker">Paso {step} de 6</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}

/** Tarjeta seleccionable (checkbox por defecto, radio con `radio`). */
export function OptionCard({
  i,
  t,
  d,
  checked,
  radio = false,
  onChange,
}: {
  i?: string;
  t: string;
  d?: string;
  checked: boolean;
  radio?: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`opt${radio ? " opt--radio" : ""}${checked ? " is-on" : ""}`}>
      <input type={radio ? "radio" : "checkbox"} checked={checked} onChange={onChange} />
      <span className="opt__box">
        <Check aria-hidden="true" />
      </span>
      {i && <span className="opt__ico">{i}</span>}
      <span className="opt__txt">
        <b>{t}</b>
        {d && <span>{d}</span>}
      </span>
    </label>
  );
}

/** Píldora seleccionable (opción múltiple). */
export function Pill({ t, checked, onChange }: { t: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`pill${checked ? " is-on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{t}</span>
    </label>
  );
}

/** Campo de formulario: label, control y mensaje de error. */
export function Field({
  label,
  error,
  children,
  required = false,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className={`field${error ? " err" : ""}`}>
      {label && (
        <label>
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {error && (
        <span className="field__err">
          <CircleAlert aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}

/** Slider de presupuesto mensual de pauta (0-10 → PRESUPUESTO[i]). */
export function BudgetSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const max = PRESUPUESTO.length - 1;
  const v = Math.max(0, Math.min(max, value));
  const b = PRESUPUESTO[v];
  const pct = `${(v / max) * 100}%`;
  return (
    <div className="budget">
      <div className="budget__top">
        <span>{b.txt}</span>
        <small>por mes</small>
      </div>
      <div className="budget__band">{b.band}</div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={v}
        aria-label="Presupuesto mensual de pauta"
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": pct } as CSSProperties}
      />
      <div className="budget__scale">
        <span>Todavía no sé</span>
        <span>+5.000 USD</span>
      </div>
      <p className="budget__note">{b.note}</p>
    </div>
  );
}
