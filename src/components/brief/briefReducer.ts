import { EMPTY_LEAD, type LeadData } from "../../data/types";
import { validateStep } from "../../data/validation";

export type BriefState = {
  step: number;
  values: LeadData;
  errors: Partial<Record<keyof LeadData, string>>;
};

export type BriefAction =
  | { type: "SET"; key: keyof LeadData; value: LeadData[keyof LeadData] }
  | { type: "TOGGLE"; key: "servicios" | "plataformas" | "objetivos" | "accesos" | "materiales"; value: string }
  | { type: "GO"; step: number }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: BriefState };

const MULTI_MAX = 3;

export function briefReducer(state: BriefState, action: BriefAction): BriefState {
  switch (action.type) {
    case "SET":
      return { ...state, values: { ...state.values, [action.key]: action.value } };
    case "TOGGLE": {
      const arr = state.values[action.key] as unknown as string[];
      const has = arr.includes(action.value);
      let next: string[];
      if (has) next = arr.filter((v) => v !== action.value);
      else if (action.key === "objetivos" && arr.length >= MULTI_MAX) next = arr;
      else next = [...arr, action.value];
      return { ...state, values: { ...state.values, [action.key]: next } };
    }
    case "GO": {
      const errs = validateStep(state.step, state.values);
      if (Object.keys(errs).length > 0) return { ...state, errors: errs };
      return { ...state, step: action.step, errors: {} };
    }
    case "RESTART":
      return { step: 1, values: EMPTY_LEAD, errors: {} };
    case "HYDRATE":
      return { ...action.state, errors: {} };
    default:
      return state;
  }
}
