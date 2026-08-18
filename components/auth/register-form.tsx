"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const oauthProviders = [
  { provider: "google", label: "Google", icon: "/google.svg" },
  { provider: "github", label: "GitHub", icon: "/github.svg" },
  { provider: "linkedin", label: "LinkedIn", icon: "/linkedin.svg" },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAccount, setExistingAccount] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  async function handleOAuthLogin(provider: (typeof oauthProviders)[number]["provider"]) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=%2Fdashboard`,
      },
    });

    if (error) {
      toast.error("Connexion impossible avec ce fournisseur.");
    }
  }

  async function onSubmit(values: RegisterInput) {
    setIsSubmitting(true);
    setExistingAccount(false);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          display_name: values.displayName || undefined,
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      const message = error.message.toLowerCase();
      const duplicate =
        message.includes("already") ||
        message.includes("exists") ||
        message.includes("registered") ||
        message.includes("déjà") ||
        message.includes("existe");

      if (duplicate) {
        setExistingAccount(true);
        toast.error("Un compte existe déjà avec cette adresse e-mail. Connectez-vous.");
        return;
      }

      toast.error(error.message || "Impossible de créer le compte.");
      return;
    }

    if (data.user && !data.session) {
      toast.success(
        "Compte créé. Vérifiez votre e-mail pour confirmer votre inscription."
      );
      router.push(`/email-confirmation?email=${encodeURIComponent(values.email)}`);
      return;
    }

    toast.success("Compte créé avec succès");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>Créez un compte pour commencer le suivi.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {oauthProviders.map(({ provider, label, icon }) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className="liquid-glass flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin(provider)}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {icon && (
                  <img src={icon} alt={label} className="h-full w-full object-contain" />
                )}
              </span>
              {label}
            </Button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {existingAccount && (
          <div className="mb-4 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
            Un compte existe déjà avec cette adresse e-mail. Cliquez sur <Link href="/login" className="font-semibold underline">Se connecter</Link> pour accéder à votre espace.
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2  flex flex-col gap-1">
            <Label htmlFor="displayName">Nom d&apos;affichage (facultatif)</Label>
            <Input 
              id="displayName" 
              autoComplete="name" {...form.register("displayName")}
              className="liquid-glass"
              aria-invalid={!!form.formState.errors.displayName}
              aria-describedby="displayName-error"
            />
            <p id="displayName-error" className="text-sm text-destructive" role="alert">
              {form.formState.errors.displayName?.message}
            </p>
          </div>

          <div className="space-y-2  flex flex-col gap-1">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              aria-describedby="email-error"
              className="liquid-glass"
              required
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2  flex flex-col gap-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
              className="liquid-glass"
              required
              aria-describedby="password-error"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-9  flex flex-col gap-1">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
              aria-describedby="confirmPassword-error"
              className="liquid-glass"
              required
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="liquid-glass " disabled={isSubmitting}>
            {isSubmitting ? "Création…" : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#00bc7d] underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
