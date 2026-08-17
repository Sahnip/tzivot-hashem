"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next") ?? "/dashboard";
    const supabase = createClient();

    async function finalizeAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/login");
        return;
      }

      router.replace(next);
    }

    void finalizeAuth();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <p className="text-lg font-medium">Connexion en cours…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Nous vous redirigeons vers votre espace.
        </p>
      </div>
    </main>
  );
}
