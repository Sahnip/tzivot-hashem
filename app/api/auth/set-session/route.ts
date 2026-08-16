import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

async function parseCookies(header: string | null) {
  if (!header) return [] as Array<{ name: string; value: string }>;
  return header
    .split("; ")
    .filter(Boolean)
    .map((c) => {
      const idx = c.indexOf("=");
      const name = c.slice(0, idx);
      const value = c.slice(idx + 1);
      return { name, value: decodeURIComponent(value) };
    });
}

export async function POST(request: Request) {
  let body: Partial<{ access_token: string; refresh_token: string }> = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { access_token, refresh_token } = body;
  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { success: false, error: "Tokens de session manquants." },
      { status: 400 }
    );
  }

  const setCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookies(request.headers.get("cookie"));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }

  const response = NextResponse.json(
    { success: true, cookies: setCookies.map(({ name }) => name) },
    { status: 200 }
  );

  setCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as any);
  });

  return response;
}
