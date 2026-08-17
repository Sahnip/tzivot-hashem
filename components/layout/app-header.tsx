import Link from "next/link";
import { LayoutDashboard, LogOut, Target, User } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>1% du monde</span>
          </Link>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Navigation principale">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Tableau de bord
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              Profil
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton variant="ghost" size="sm">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Déconnexion</span>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
