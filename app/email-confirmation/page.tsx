"use client";

import Link from "next/link";
import { MailCheck, ArrowRight, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const providers = [
  {
    name: "Gmail",
    href: "https://mail.google.com/mail/",
    accent: "bg-red-500",
    text: "G",
  },
  {
    name: "Outlook",
    href: "https://outlook.live.com/mail/0/",
    accent: "bg-blue-500",
    text: "O",
  },
  {
    name: "Yahoo Mail",
    href: "https://mail.yahoo.com/d/folders/1",
    accent: "bg-purple-600",
    text: "Y",
  },
  {
    name: "Orange",
    href: "https://mail.orange.fr/",
    accent: "bg-orange-500",
    text: "Or",
  },
];

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "votre adresse e-mail";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4 py-8">
      <Card className="w-full max-w-2xl border-primary/20 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Vérifiez votre boîte mail</CardTitle>
            <CardDescription className="text-base">
              Un e-mail de confirmation a été envoyé à <span className="font-medium text-foreground">{email}</span>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Étape suivante
            </div>
            Ouvrez votre messagerie, cliquez sur le lien de confirmation, puis revenez sur la page de connexion pour accéder à votre espace.
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Accéder à ma messagerie</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {providers.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border bg-background p-3 transition hover:border-primary hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${provider.accent} text-sm font-bold text-white`}>
                      {provider.text}
                    </div>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="liquid-glass">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
            <Button asChild className="liquid-glass">
              <Link href="/register">Créer un autre compte</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
