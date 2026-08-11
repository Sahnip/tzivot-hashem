"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteHabit } from "@/lib/actions/habits";
import { computeHabitStats, getYearDates } from "@/lib/dates/habit-calendar";
import type { Habit, HabitEntryStatus } from "@/types/database";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { HabitGrid } from "@/components/habits/habit-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HabitCardProps {
  habit: Habit;
  year: number;
  timezone: string;
  entries: Record<string, HabitEntryStatus>;
  onUpdate?: () => void;
}

export function HabitCard({ habit, year, timezone, entries, onUpdate }: HabitCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dates = getYearDates(year);
  const stats = computeHabitStats(dates, entries, timezone);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteHabit({ id: habit.id });
    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Habitude supprimée");
    setDeleteOpen(false);
    onUpdate?.();
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">{habit.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.positiveRate}% positif · {stats.positiveCount} vert ·{" "}
              {stats.negativeCount} rouge · {stats.blankCount} non renseigné
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
              aria-label={`Modifier ${habit.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteOpen(true)}
              aria-label={`Supprimer ${habit.name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <HabitGrid
            habitId={habit.id}
            year={year}
            timezone={timezone}
            initialEntries={entries}
          />
        </CardContent>
      </Card>

      <HabitFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        habit={habit}
        onSuccess={onUpdate}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;habitude</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer « {habit.name} » ? Toutes les
              validations associées seront également supprimées. Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
