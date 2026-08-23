"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next") ?? "/dashboard";
    const supabase = createClient('https://zahnipxgetpltctuuvgp.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');

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
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
const supabase = createClient('https://zahnipxgetpltctuuvgp.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}