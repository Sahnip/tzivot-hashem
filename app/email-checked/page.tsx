"use client";

import Link from "next/link";
import { MailCheck, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";


  export default function EmailCheckedPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Récupère la session (après le redirect OAuth / inscription)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const displayEmail = email ?? "votre adresse e-mail";

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
              Vous avez un e-mail de confirmation dans votre boîte de réception :{" "}
              <span className="font-medium text-foreground">{displayEmail}</span>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Étape suivante
            </div>
            Vous pouvez accéder à votre espace personnel.
          </div> */}

          {/* Box de confirmation avec effet liquid glass + fond vert fumé */}
          <div
            className="liquid-glass
              pointer-events-none
              relative overflow-hidden
              mt-[34px]
              px-6 py-6
              rounded-[20px]
              border border-white/95
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_8px_24px_rgba(0,0,0,0.06)]
              bg-gradient-to-br from-white/82 to-[#f5f8f6]/30
            "
          >
            {/* Fond vert fumé pour “validation en cours” */}
            <div
              aria-hidden
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-br from-green-500/80 to-emerald-500/4
                blur-md
              "
            />

            <div className="relative z-10">
              <div className="confirmation-label mb-3 flex items-start gap-2 text-sm text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                ) : (
                  <Sparkles className="h-4 text-foreground" />
                )}
                <div className="flex-1">
                  <span className="font-medium  text-foreground">
                    {loading ? "Vérification en cours…" : "Étape suivante"}
                  </span>
                  <br />
                  {!loading && (
                    <>
                      {" "}
                      <span className="text-foreground">
                        Cliquez sur le bouton pour confirmer votre adresse e‑mail.
                      </span>
                    </>
                  )}
                </div>
              </div>

              
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="liquid-glass">
              <Link href="/https://mail.google.com/mail/" target="_blank" rel="noopener">
                Vérifier ma boîte mail
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}