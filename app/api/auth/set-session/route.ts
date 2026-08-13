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
  const body = await request.json();

  // Create a mutable NextResponse to collect cookies set by Supabase helper
  let res = NextResponse.next();
  const cookiesSet: string[] = [];

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
            // NextResponse exposes a cookies helper
            res.cookies.set(name, value, options);
            cookiesSet.push(name);
          });
        },
      },
    }
  );

  // Set the session using tokens from the client
  try {
    await supabase.auth.setSession({
      access_token: body.access_token,
      refresh_token: body.refresh_token,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }

  // Return which cookie names were set for debugging (no token values)
  return NextResponse.json({ success: true, cookies: cookiesSet }, { status: 200 });
}
