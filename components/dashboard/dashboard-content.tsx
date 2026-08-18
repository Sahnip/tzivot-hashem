"use client";

import { useEffect, useState } from "react";
import { Edit3, Move, Plus, Trash2 } from "lucide-react";
import type { Habit, HabitEntryStatus, Profile } from "@/types/database";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { deleteHabit, reorderHabits } from "@/lib/actions/habits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardContentProps {
  habits: Habit[];
  entriesByHabit: Record<string, Record<string, HabitEntryStatus>>;
  profile: Profile;
  year: number;
  availableYears: number[];
}

export function DashboardContent({
  habits,
  entriesByHabit,
  profile,
  year,
  availableYears,
}: DashboardContentProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => setLocalHabits(habits), [habits]);

  function handleYearChange(newYear: number) {
    setSelectedYear(newYear);
    const url = new URL(window.location.href);
    url.searchParams.set("year", String(newYear));
    window.history.replaceState({}, "", url.toString());
    window.location.reload();
  }

  async function persistOrder(nextHabits: Habit[]) {
    const ids = nextHabits.map((habit) => habit.id);
    await reorderHabits(ids);
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => deleteHabit({ id })));
    setLocalHabits((prev) => prev.filter((habit) => !selectedIds.has(habit.id)));
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onDragStart(event: React.DragEvent, id: string) {
    setDraggingId(id);
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(event: React.DragEvent, id: string) {
    event.preventDefault();
    if (id === draggingId) return;
    setOverId(id);
  }

  async function onDrop(event: React.DragEvent, id: string) {
    event.preventDefault();

    const draggedId = draggingId ?? event.dataTransfer.getData("text/plain");
    if (!draggedId) return;

    const fromIndex = localHabits.findIndex((habit) => habit.id === draggedId);
    const toIndex = localHabits.findIndex((habit) => habit.id === id);
    if (fromIndex === -1 || toIndex === -1) return;

    const nextHabits = [...localHabits];
    const [moved] = nextHabits.splice(fromIndex, 1);
    nextHabits.splice(toIndex, 0, moved);

    setLocalHabits(nextHabits);
    setDraggingId(null);
    setOverId(null);
    await persistOrder(nextHabits);
  }

  function onDragEnd() {
    setDraggingId(null);
    setOverId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes habitudes</h1>
          <p className="text-sm text-muted-foreground">
            Année civile · Cliquez sur une case : vert → rouge → vide
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="year-select" className="text-sm text-muted-foreground">
            Année
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="h-10 rounded-md border border-input cursor-pointer bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une habitude
          </Button>
          <Button variant={editMode ? "secondary" : "ghost"} onClick={() => setEditMode((value) => !value)} className="cursor-pointer">
            <Edit3 className="mr-2 h-4 w-4" />
            {editMode ? "Quitter le mode édition" : "Modifier l'ordre / actions"}
          </Button>
        </div>
      </div>

      {localHabits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="mb-4 text-muted-foreground">
              Vous n&apos;avez pas encore d&apos;habitude.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              Créer ma première habitude
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {editMode && (
            <div className="flex items-center gap-2">
              <Button variant="destructive" onClick={handleBulkDelete} className="cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer la sélection
              </Button>
              <div className="text-sm text-muted-foreground">Glissez-déposez pour réordonner</div>
            </div>
          )}

          {localHabits.map((habit) => (
            <div
              key={habit.id}
              draggable={editMode}
              onDragStart={(event) => onDragStart(event, habit.id)}
              onDragOver={(event) => onDragOver(event, habit.id)}
              onDrop={(event) => onDrop(event, habit.id)}
              onDragEnd={onDragEnd}
              className={[
                "rounded-md transition-all",
                editMode ? "cursor-grab active:cursor-grabbing" : "",
                overId === habit.id ? "ring-2 ring-primary/70 ring-offset-2" : "",
              ].join(" ")}
            >
              {editMode && (
                <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(habit.id)}
                    onChange={() => toggleSelect(habit.id)}
                    className="cursor-pointer"
                  />
                  <Move className="h-4 w-4" />
                  <span>Déplacer cette habitude</span>
                </div>
              )}

              <HabitCard
                habit={habit}
                year={selectedYear}
                timezone={profile.timezone}
                entries={entriesByHabit[habit.id] ?? {}}
                onUpdate={() => undefined}
              />
            </div>
          ))}
        </div>
      )}

      <HabitFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
