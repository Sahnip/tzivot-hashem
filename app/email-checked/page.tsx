"use client";

import Link from "next/link";
import { MailCheck, ArrowRight, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



export default function EmailCheckedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "votre adresse e-mail";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4 py-8">
      <Card className="w-full max-w-2xl border-primary/20 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="liquid-glass mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Vérifiez votre boîte mail</CardTitle>
            <CardDescription className="text-base">
              Votre compte a bien été validé. <span className="font-medium text-foreground">{email}</span>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            <div className="liquid-glassmb-2 flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Étape suivante
            </div>
            Vous pouvez accéder avotre espace personnel.
          </div>


          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="liquid-glass">
              <Link href="/">Accéder au dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
