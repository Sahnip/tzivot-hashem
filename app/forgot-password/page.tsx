"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez renseigner votre adresse e-mail.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Impossible d’envoyer le lien de réinitialisation.");
      return;
    }

    setSent(true);
    toast.success("Un e-mail de sécurité a été envoyé.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez l’adresse e-mail associée à votre compte pour recevoir un lien sécurisé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:text-emerald-100">
                Un e-mail de sécurité a bien été envoyé à <span className="font-semibold">{email}</span>.
                Ouvrez le message puis cliquez sur le lien pour créer un nouveau mot de passe.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/login">Retour à la connexion</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/register">Créer un compte</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="space-y-2 flex flex-col gap-1">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@example.com"
                  autoComplete="email"
                  className="liquid-glass"
                />
              </div>

            <div className="text-xs font- font-light text-muted-foreground m-2 mb-12">
                Après avoir cliqué sur le bouton ci-dessous, vous recevrez un e-mail contenant un lien sécurisé pour réinitialiser votre mot de passe.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="submit" className="liquid-glass w-full sm:max-w-4/6" disabled={isSubmitting}>
                {isSubmitting ? "Envoi…" : "Envoyer le lien de sécurité"}
              </Button>

              <Button asChild variant="ghost" className="liquid-glass sm:max-w-4/6">
                <Link href="/login">Annuler</Link>
              </Button>
            </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
