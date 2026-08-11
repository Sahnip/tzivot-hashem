import { NextResponse } from "next/server";
import { createHabit, deleteHabit, getHabits, updateHabit } from "@/lib/actions/habits";

export async function GET() {
  const result = await getHabits();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ data: result.data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createHabit(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await updateHabit(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const result = await deleteHabit(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
