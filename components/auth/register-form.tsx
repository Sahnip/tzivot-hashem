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

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setIsSubmitting(true);
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
      toast.error(error.message || "Impossible de créer le compte.");
      return;
    }

    if (data.user && !data.session) {
      toast.success(
        "Compte créé. Vérifiez votre e-mail pour confirmer votre inscription."
      );
      router.push("/login");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom d&apos;affichage (facultatif)</Label>
            <Input id="displayName" autoComplete="name" {...form.register("displayName")} />
          </div>

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
              autoComplete="new-password"
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création…" : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
