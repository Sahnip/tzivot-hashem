import type { HabitEntryStatus, HabitStatus } from "@/types/database";

export function getNextStatus(currentStatus: HabitStatus): HabitStatus {
  if (currentStatus === null) return "positive";
  if (currentStatus === "positive") return "negative";
  return null;
}

export function getStatusLabel(status: HabitStatus): string {
  switch (status) {
    case "positive":
      return "validation positive";
    case "negative":
      return "validation négative";
    default:
      return "non renseigné";
  }
}

export function isValidEntryStatus(value: string): value is HabitEntryStatus {
  return value === "positive" || value === "negative";
}

export const HABIT_COLORS = [
  { value: "emerald", label: "Vert", className: "bg-emerald-500" },
  { value: "blue", label: "Bleu", className: "bg-blue-500" },
  { value: "violet", label: "Violet", className: "bg-violet-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
  { value: "rose", label: "Rose", className: "bg-rose-500" },
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number]["value"];
