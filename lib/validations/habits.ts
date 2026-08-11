import { z } from "zod";
import { HABIT_COLORS } from "@/types/habit";

const habitColorValues = HABIT_COLORS.map((c) => c.value) as [string, ...string[]];

export const habitNameSchema = z
  .string()
  .trim()
  .min(1, "Le nom est obligatoire")
  .max(100, "Le nom ne peut pas dépasser 100 caractères");

export const createHabitSchema = z.object({
  name: habitNameSchema,
  color: z.enum(habitColorValues).optional().nullable(),
});

export const updateHabitSchema = z.object({
  id: z.string().uuid("Identifiant d'habitude invalide"),
  name: habitNameSchema,
  color: z.enum(habitColorValues).optional().nullable(),
});

export const deleteHabitSchema = z.object({
  id: z.string().uuid("Identifiant d'habitude invalide"),
});

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (format attendu : AAAA-MM-JJ)");

export const yearSchema = z
  .number()
  .int()
  .min(2000, "Année invalide")
  .max(2100, "Année invalide");

export const toggleEntrySchema = z.object({
  habitId: z.string().uuid("Identifiant d'habitude invalide"),
  date: dateSchema,
  year: yearSchema,
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type ToggleEntryInput = z.infer<typeof toggleEntrySchema>;
