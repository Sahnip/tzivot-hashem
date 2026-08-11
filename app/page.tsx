import Link from "next/link";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Target className="h-12 w-12 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">HabitTrack</h1>
        <p className="mb-8 text-muted-foreground">
          Suivez vos habitudes quotidiennes avec une grille annuelle simple, claire et
          sécurisée.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/register">Commencer gratuitement</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
