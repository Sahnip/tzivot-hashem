import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/login-form";

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockRefresh = vi.fn();
const mockFetch = vi.fn();

const mockSignInWithPassword = vi.fn();
const mockGetSession = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getSession: mockGetSession,
    },
  }),
}));

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockPush.mockReset();
    mockReplace.mockReset();
    mockRefresh.mockReset();
    mockSignInWithPassword.mockResolvedValue({ data: { session: null }, error: null });
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "access-token",
          refresh_token: "refresh-token",
        },
      },
    });
  });

  it("waits for the server session to be persisted before redirecting to the dashboard", async () => {
    let resolveFetch: (value: { status: number; ok: boolean }) => void;
    const fetchPromise = new Promise<{ status: number; ok: boolean }>((resolve) => {
      resolveFetch = resolve;
    });

    mockFetch.mockReturnValue(fetchPromise);
    global.fetch = mockFetch as typeof fetch;

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => expect(mockSignInWithPassword).toHaveBeenCalled());
    expect(mockPush).not.toHaveBeenCalled();

    resolveFetch!({ status: 200, ok: true });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("does not redirect when the auth session is missing after login", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    global.fetch = mockFetch as typeof fetch;

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getAllByRole("button", { name: /se connecter/i })[0]);

    await waitFor(() => expect(mockSignInWithPassword).toHaveBeenCalled());
    await waitFor(() => expect(mockFetch).not.toHaveBeenCalled());
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
