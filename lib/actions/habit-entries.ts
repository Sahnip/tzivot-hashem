"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import {
  getTodayInTimezone,
  isDateInYear,
  isFutureDate,
  isValidCalendarDate,
} from "@/lib/dates/habit-calendar";
import { toggleEntrySchema } from "@/lib/validations/habits";
import { getNextStatus } from "@/types/habit";
import type {
  ActionResult,
  HabitEntryStatus,
} from "@/types/database";

export async function getHabitEntriesForYear(
  habitId: string,
  year: number
): Promise<ActionResult<Record<string, HabitEntryStatus>>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Non authentifié" };
  }

  const supabase = await createClient();

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .single();

  if (habitError || !habit) {
    return { success: false, error: "Habitude introuvable." };
  }

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data, error } = await supabase
    .from("habit_entries")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    return { success: false, error: "Impossible de charger les validations." };
  }

  const entries: Record<string, HabitEntryStatus> = {};
  data?.forEach((entry) => {
    entries[entry.date] = entry.status as HabitEntryStatus;
  });

  return { success: true, data: entries };
}

export async function toggleHabitEntry(
  input: unknown
): Promise<ActionResult<{ date: string; status: HabitEntryStatus | null }>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = toggleEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const { habitId, date, year } = parsed.data;

  if (!isValidCalendarDate(date) || !isDateInYear(date, year)) {
    return { success: false, error: "Date invalide pour l'année sélectionnée." };
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const timezone = profile?.timezone ?? "UTC";

  if (isFutureDate(date, timezone)) {
    return { success: false, error: "Les dates futures ne peuvent pas être modifiées." };
  }

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .single();

  if (habitError || !habit) {
    return { success: false, error: "Habitude introuvable." };
  }

  const { data: existing } = await supabase
    .from("habit_entries")
    .select("id, status")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  const currentStatus = existing?.status ?? null;
  const nextStatus = getNextStatus(currentStatus);

  if (nextStatus === null) {
    if (existing) {
      const { error } = await supabase
        .from("habit_entries")
        .delete()
        .eq("id", existing.id)
        .eq("user_id", user.id);

      if (error) {
        return { success: false, error: "Impossible de supprimer la validation." };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/habits");
    return { success: true, data: { date, status: null } };
  }

  if (existing) {
    const { error } = await supabase
      .from("habit_entries")
      .update({ status: nextStatus })
      .eq("id", existing.id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: "Impossible de mettre à jour la validation." };
    }
  } else {
    const { error } = await supabase.from("habit_entries").insert({
      habit_id: habitId,
      user_id: user.id,
      date,
      status: nextStatus,
    });

    if (error) {
      return { success: false, error: "Impossible d'enregistrer la validation." };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, data: { date, status: nextStatus } };
}

export async function getUserTimezone(): Promise<string> {
  const user = await getAuthenticatedUser();
  if (!user) return "UTC";

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  return data?.timezone ?? "UTC";
}

export async function getToday(): Promise<string> {
  const timezone = await getUserTimezone();
  return getTodayInTimezone(timezone);
}
