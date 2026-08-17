"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const oauthProviders = [
  { provider: "google", label: "Google", icon: "G" },
  { provider: "github", label: "GitHub", icon: "GH" },
  { provider: "linkedin", label: "LinkedIn", icon: "in" },
] as const;

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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

  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("E-mail ou mot de passe incorrect.");
      return;
    }

    toast.success("Connexion réussie");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous pour suivre vos habitudes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {oauthProviders.map(({ provider, label, icon }) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin(provider)}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {icon}
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
