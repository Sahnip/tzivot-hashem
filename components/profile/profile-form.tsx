"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updatePassword, updateProfile } from "@/lib/actions/profile";
import {
  profileSchema,
  updatePasswordSchema,
  type ProfileInput,
  type UpdatePasswordInput,
} from "@/lib/validations/auth";
import type { Profile } from "@/types/database";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";

const TIMEZONES = [
  "UTC",
  "Europe/Paris",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
];

interface ProfileFormProps {
  profile: Profile;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.display_name ?? "",
      timezone: profile.timezone,
    },
  });

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: ProfileInput) {
    setIsProfileSubmitting(true);
    const result = await updateProfile(values);
    setIsProfileSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Profil mis à jour");
  }

  async function onPasswordSubmit(values: UpdatePasswordInput) {
    setIsPasswordSubmitting(true);
    const result = await updatePassword(values);
    setIsPasswordSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Mot de passe mis à jour");
    passwordForm.reset();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" value={email} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Nom d&apos;affichage</Label>
              <Input id="displayName" {...profileForm.register("displayName")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <select
                id="timezone"
                {...profileForm.register("timezone")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={isProfileSubmitting}>
              {isProfileSubmitting ? "Enregistrement…" : "Enregistrer le profil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modifier le mot de passe</CardTitle>
          <CardDescription>Changez votre mot de passe de connexion.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Déconnexion</CardTitle>
          <CardDescription>Fermez votre session sur cet appareil.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignOutButton variant="outline">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Se déconnecter
          </SignOutButton>
        </CardContent>
      </Card>
    </div>
  );
}
