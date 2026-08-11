"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import {
  profileSchema,
  updatePasswordSchema,
} from "@/lib/validations/auth";
import type { ActionResult, Profile } from "@/types/database";

export async function getProfile(): Promise<ActionResult<Profile>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Non authentifié" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return { success: false, error: "Profil introuvable." };
  }

  return { success: true, data };
}

export async function updateProfile(
  input: unknown
): Promise<ActionResult<Profile>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName || null,
      timezone: parsed.data.timezone,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "Impossible de mettre à jour le profil." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function updatePassword(
  input: unknown
): Promise<ActionResult<void>> {
  const user = await getAuthenticatedUser();
  if (!user || !user.email) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Mot de passe actuel incorrect." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return { success: false, error: "Impossible de mettre à jour le mot de passe." };
  }

  return { success: true, data: undefined };
}

export async function signOut(): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: "Impossible de se déconnecter." };
  }

  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}
