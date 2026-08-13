"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import {
  createHabitSchema,
  deleteHabitSchema,
  updateHabitSchema,
} from "@/lib/validations/habits";
import type { ActionResult, Habit } from "@/types/database";

function mapSupabaseError(error: { message: string; code?: string }): string {
  if (error.code === "23505") {
    return "Une habitude avec ce nom existe déjà.";
  }
  return "Une erreur est survenue. Veuillez réessayer.";
}

export async function createHabit(
  input: unknown
): Promise<ActionResult<Habit>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = createHabitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  // set position to max(position)+1 for the user
  const { data: posData } = await supabase
    .from("habits")
    .select("position")
    .eq("user_id", user.id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPos = posData && typeof (posData as any).position === "number" ? (posData as any).position + 1 : 1;

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      color: parsed.data.color ?? "emerald",
      position: nextPos,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: mapSupabaseError(error) };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, data };
}

export async function updateHabit(
  input: unknown
): Promise<ActionResult<Habit>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = updateHabitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habits")
    .update({
      name: parsed.data.name,
      color: parsed.data.color ?? "emerald",
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error ? mapSupabaseError(error) : "Habitude introuvable.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, data };
}

export async function deleteHabit(
  input: unknown
): Promise<ActionResult<void>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = deleteHabitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: mapSupabaseError(error) };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, data: undefined };
}

export async function getHabits(): Promise<ActionResult<Habit[]>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Non authentifié" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: "Impossible de charger les habitudes." };
  }

  return { success: true, data: data ?? [] };
}

export async function reorderHabits(input: unknown): Promise<ActionResult<void>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Session expirée." };

  if (!Array.isArray(input)) return { success: false, error: "Données invalides" };
  const ids = input as string[];

  const supabase = await createClient();

  // perform updates in a transaction-like loop
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const { error } = await supabase
      .from("habits")
      .update({ position: i + 1 })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: "Impossible de réordonner les habitudes." };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, data: undefined };
}

export async function getHabitById(
  id: string
): Promise<ActionResult<Habit>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Non authentifié" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return { success: false, error: "Habitude introuvable." };
  }

  return { success: true, data };
}
