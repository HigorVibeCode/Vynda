import { PillarIconKind } from "../types/domain";

export const MAX_CONNECTIONS = 10;

export const CONNECTION_COLOR_PRESETS: string[] = [
  "#7B61FF",
  "#2EC4A0",
  "#FFB830",
  "#FF7A3D",
  "#38BDF8",
  "#E879F9",
  "#4ADE80",
  "#4F8FFF",
  "#FFD54A",
  "#A78BFA",
];

export type IconOption = { kind: PillarIconKind; label: string };

export const CONNECTION_ICON_OPTIONS: IconOption[] = [
  { kind: "saude", label: "Saúde" },
  { kind: "carreira", label: "Carreira" },
  { kind: "financeiro", label: "Finanças" },
  { kind: "relacionamentos", label: "Família" },
  { kind: "mental", label: "Estudos" },
  { kind: "espiritual", label: "Espiritual" },
  { kind: "fisico", label: "Corpo" },
  { kind: "criatividade", label: "Criativo" },
  { kind: "lazer", label: "Lazer" },
  { kind: "proposito", label: "Propósito" },
  { kind: "desenvolvimento", label: "Crescimento" },
];
