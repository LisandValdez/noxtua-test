/* ============================================================
   NOXTUA. Tipos del formulario de brief y de los leads
   Derivado del plan de migración (no del archivo original).
   ============================================================ */

export type Estado = "parcial" | "nuevo" | "contactado" | "reunion" | "cliente" | "perdido";

export const ESTADOS: Record<Estado, string> = {
  parcial: "Incompleto",
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion: "Con reunión",
  cliente: "Cliente",
  perdido: "Descartado",
};

export type LeadData = {
  servicios: string[];
  servicios_otro: string;
  empresa: string;
  rubro: string;
  nombre: string;
  email: string;
  sitio: string;
  cargo: string;
  descripcion: string;
  plataformas: string[];
  pauta_actual: string;
  quien_marketing: string;
  frustracion: string;
  objetivos: string[];
  cliente_ideal: string;
  competencia: string;
  presupuesto: number;
  plazo: string;
  involucramiento: string;
  restricciones: string;
  accesos: string[];
  materiales: string[];
  telefono: string;
  como_conociste: string;
  cuando: string;
  extra: string;
  privacidad: boolean;
};

export const EMPTY_LEAD: LeadData = {
  servicios: [],
  servicios_otro: "",
  empresa: "",
  rubro: "",
  nombre: "",
  email: "",
  sitio: "",
  cargo: "",
  descripcion: "",
  plataformas: [],
  pauta_actual: "",
  quien_marketing: "",
  frustracion: "",
  objetivos: [],
  cliente_ideal: "",
  competencia: "",
  presupuesto: 0,
  plazo: "",
  involucramiento: "",
  restricciones: "",
  accesos: [],
  materiales: [],
  telefono: "",
  como_conociste: "",
  cuando: "",
  extra: "",
  privacidad: false,
};

export type LeadRecord = {
  ref: string;
  estado: Estado;
  creado: string;
  actualizado: string;
  origen: string;
  data: LeadData;
};
