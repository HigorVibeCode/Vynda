import type { Connection } from "../types/domain";

export function getConnectionProgressPercent(connection: Connection): number {
  const total = connection.goals.length;
  if (total === 0) {
    return 0;
  }
  const done = connection.goals.filter((g) => g.status === "completed").length;
  return (done / total) * 100;
}
