import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getHabitEntriesForYear } from "@/lib/actions/habit-entries";
import { getHabits } from "@/lib/actions/habits";
import { getProfile } from "@/lib/actions/profile";
import { getTodayInTimezone } from "@/lib/dates/habit-calendar";
import type { HabitEntryStatus } from "@/types/database";

interface HabitsPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function HabitsPage({ searchParams }: HabitsPageProps) {
  const params = await searchParams;
  const profileResult = await getProfile();

  if (!profileResult.success) {
    redirect("/login");
  }

  const habitsResult = await getHabits();
  if (!habitsResult.success) {
    redirect("/login");
  }

  const today = getTodayInTimezone(profileResult.data.timezone);
  const currentYear = new Date(today).getFullYear();
  const year = params.year ? Number(params.year) : currentYear;
  const selectedYear = Number.isFinite(year) ? year : currentYear;
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const entriesByHabit: Record<string, Record<string, HabitEntryStatus>> = {};

  await Promise.all(
    habitsResult.data.map(async (habit) => {
      const entriesResult = await getHabitEntriesForYear(habit.id, selectedYear);
      entriesByHabit[habit.id] = entriesResult.success ? entriesResult.data : {};
    })
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <DashboardContent
          habits={habitsResult.data}
          entriesByHabit={entriesByHabit}
          profile={profileResult.data}
          year={selectedYear}
          availableYears={availableYears}
        />
      </main>
    </>
  );
}
