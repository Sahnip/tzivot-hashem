import { NextResponse } from "next/server";
import {
  getHabitEntriesForYear,
  toggleHabitEntry,
} from "@/lib/actions/habit-entries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const habitId = searchParams.get("habitId");
  const year = Number(searchParams.get("year"));

  if (!habitId || !Number.isFinite(year)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const result = await getHabitEntriesForYear(habitId, year);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ data: result.data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await toggleHabitEntry(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data });
}
