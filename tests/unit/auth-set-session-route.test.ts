import { describe, expect, it, vi } from "vitest";

const setAllMock = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn((_url: string, _key: string, { cookies }: any) => ({
    auth: {
      setSession: async ({ access_token, refresh_token }: { access_token: string; refresh_token: string }) => {
        setAllMock({ access_token, refresh_token });
        cookies.setAll([
          { name: "sb-access-token", value: access_token, options: { path: "/", httpOnly: true, sameSite: "lax" } },
          { name: "sb-refresh-token", value: refresh_token, options: { path: "/", httpOnly: true, sameSite: "lax" } },
        ]);
        return { data: { session: { access_token, refresh_token } }, error: null };
      },
    },
  })),
}));

import { POST } from "@/app/api/auth/set-session/route";

describe("POST /api/auth/set-session", () => {
  it("returns the session cookies in the response so the browser keeps the auth session", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: "access-token",
          refresh_token: "refresh-token",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie") ?? "").toContain("sb-access-token=");
    expect(response.headers.get("set-cookie") ?? "").toContain("sb-refresh-token=");
    expect(setAllMock).toHaveBeenCalledWith({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
  });
});
