import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    // <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"> */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 ">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-22 w-22 "
            />
            <div className="flex flex-col">
              <span>Armée du Roi</span>
              <span className="text-[10px] text-muted-foreground">Machiah est devant toi</span>
            </div>
          </Link>
          {/* <nav className="hidden items-center gap-4 sm:flex" aria-label="Navigation principale"> */}
          <nav className="glass-nav px-6 py-4" aria-label="Navigation principale">
            <Link
              href="/dashboard"
              // className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              className="
                  liquid-glass
                  physical-glass
                  h-11
                  w-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-foreground
                  hover:text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  focus:ring-offset-background
                  dark:hover:text-foreground
                  gap-2
                  flex
                  items-center
                  justify-center
                "
              // aria-current={pathname === "/dashboard" ? "page" : undefined}
                
            >
              <LayoutDashboard aria-hidden="true" />
              Tableau de bord
            </Link>
            <Link
              href="/profile"
              // className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              className="
                  liquid-glass
                  h-11
                  w-full
                  rounded-xl
                  py-2
                  text-sm
                  justify-center
                  gap-2
                  flex
                  items-center
              "
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
            {/* <span className="hidden sm:inline">Déconnexion</span> */}
            <span className="hidden sm:inline">Déconnexion</span>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
