export type ConnectionGoalStatus = "active" | "completed";

export type ConnectionGoal = {
  id: string;
  title: string;
  description?: string;
  status: ConnectionGoalStatus;
  createdAt: string;
};

export type Connection = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  goals: ConnectionGoal[];
};

export type PillarIconKind =
  | "espiritual"
  | "financeiro"
  | "carreira"
  | "criatividade"
  | "lazer"
  | "proposito"
  | "fisico"
  | "mental"
  | "relacionamentos"
  | "desenvolvimento"
  | "saude";

const ICON_KINDS: PillarIconKind[] = [
  "espiritual",
  "financeiro",
  "carreira",
  "criatividade",
  "lazer",
  "proposito",
  "fisico",
  "mental",
  "relacionamentos",
  "desenvolvimento",
  "saude",
];

export function parseConnectionIconKind(icon?: string): PillarIconKind {
  if (icon && (ICON_KINDS as readonly string[]).includes(icon)) {
    return icon as PillarIconKind;
  }
  return "desenvolvimento";
}
