
"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { deleteHabit } from "@/lib/actions/habits";

import {
  computeHabitStats,
  getYearDates,
} from "@/lib/dates/habit-calendar";

import type {
  Habit,
  HabitEntryStatus,
} from "@/types/database";

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

interface HabitCardProps {
  habit: Habit;
  year: number;
  timezone: string;
  entries: Record<
    string,
    HabitEntryStatus
  >;
  onUpdate?: () => void;
}

export function HabitCard({
  habit,
  year,
  timezone,
  entries,
  onUpdate,
}: HabitCardProps) {
  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const dates = getYearDates(year);

  const stats = computeHabitStats(
    dates,
    entries,
    timezone
  );

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async function handleDelete() {
    setIsDeleting(true);

    const result = await deleteHabit({
      id: habit.id,
    });

    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      "Habitude supprimée"
    );

    setDeleteOpen(false);

    onUpdate?.();
  }

  return (
    <>
      {/*
       * ========================================================
       * HABIT CARD
       *
       * Le LiquidGlassSurface est maintenant fourni par
       * DashboardContent.
       *
       * HabitCard reste volontairement "transparent".
       * ========================================================
       */}

      <div
        className="
          w-full
          min-w-0
        "
      >

        {/* ======================================================
            HEADER DE L'HABITUDE

            Cette zone NE défile PAS horizontalement.
        ======================================================= */}

        <div
          className="
            flex
            w-full
            min-w-0
            items-start
            justify-between
            gap-3
            pb-3
            sm:gap-4
            sm:pb-4
          "
        >

          {/* ====================================================
              NOM + STATISTIQUES
          ===================================================== */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <h2
              className="
                truncate
                text-base
                font-semibold
                tracking-tight
                sm:text-lg
              "
            >
              {habit.name}
            </h2>

            <p
              className="
                mt-1
                text-[11px]
                leading-relaxed
                text-muted-foreground
                font-thin
                sm:text-xs
                md:text-sm
              "
            >
              <span className="font-medium">
                {stats.positiveRate}%
              </span>{" "}
              positif
              <span className="mx-1.5 opacity-40">
                ·
              </span>

              <span>
                {stats.positiveCount} vert
              </span>

              <span className="mx-1.5 opacity-40">
                ·
              </span>

              <span>
                {stats.negativeCount} rouge
              </span>

              <span className="mx-1.5 opacity-40">
                ·
              </span>

              <span>
                {stats.blankCount} non renseigné
              </span>
            </p>
          </div>

          {/* ====================================================
              ACTIONS

              Elles restent FIXES sur mobile.
          ===================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            {/* EDIT */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setEditOpen(true)
              }
              aria-label={`Modifier ${habit.name}`}
              className="
                liquid-glass
                h-9
                w-9
                cursor-pointer
                rounded-lg
                sm:h-10
                sm:w-10
              "
            >
              <Pencil
                className="
                  h-4
                  w-4
                "
              />
            </Button>

            {/* DELETE */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setDeleteOpen(true)
              }
              aria-label={`Supprimer ${habit.name}`}
              className="
                liquid-glass
                h-9
                w-9
                cursor-pointer
                rounded-lg
                sm:h-10
                sm:w-10
              "
            >
              <Trash2
                className="
                  h-4
                  w-4
                  text-destructive
                "
              />
            </Button>
          </div>
        </div>

        {/* ======================================================
            CALENDRIER

            IMPORTANT :
            Le scroll horizontal est UNIQUEMENT ici.
        ======================================================= */}

        <div
          className="
            relative
            w-full
            min-w-0
          "
        >

          {/* ====================================================
              INDICATEUR MOBILE
          ===================================================== */}

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              text-[10px]
              text-muted-foreground
              sm:hidden
            "
          >
            <span>
              Calendrier
            </span>

            <span className="opacity-70">
              ← Glissez horizontalement →
            </span>
          </div>

          {/* ====================================================
              SCROLL CONTAINER

              C'est le SEUL élément horizontalement scrollable.
          ===================================================== */}

          <div
            className="
              w-full
              min-w-0
              overflow-x-auto
              overflow-y-hidden
              overscroll-x-contain
              touch-pan-x
              scrollbar-thin
              scrollbar-thumb-muted-foreground/30
              scrollbar-track-transparent
            "
          >
            <div
              className="
                w-max
                min-w-full
              "
            >
              <HabitGrid
                habitId={habit.id}
                year={year}
                timezone={timezone}
                initialEntries={entries}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          EDIT DIALOG
      ========================================================= */}

      <HabitFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        habit={habit}
        onSuccess={onUpdate}
      />

      {/* ========================================================
          DELETE DIALOG
      ========================================================= */}

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <DialogContent
          className="
            w-[calc(100%-2rem)]
            max-w-md
            rounded-2xl
          "
        >
          <DialogHeader>
            <DialogTitle>
              Supprimer l&apos;habitude
            </DialogTitle>

            <DialogDescription>
              Êtes-vous sûr de vouloir
              supprimer « {habit.name} » ?
              Toutes les validations associées
              seront également supprimées.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter
            className="
              flex-col-reverse
              gap-2
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              variant="outline"
              onClick={() =>
                setDeleteOpen(false)
              }
              className="
                w-full
                sm:w-auto
              "
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="
                w-full
                sm:w-auto
              "
            >
              {isDeleting
                ? "Suppression…"
                : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}












// "use client";

// import { useState } from "react";
// import { Pencil, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { deleteHabit } from "@/lib/actions/habits";
// import { computeHabitStats, getYearDates } from "@/lib/dates/habit-calendar";
// import type { Habit, HabitEntryStatus } from "@/types/database";
// import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
// import { HabitGrid } from "@/components/habits/habit-grid";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface HabitCardProps {
//   habit: Habit;
//   year: number;
//   timezone: string;
//   entries: Record<string, HabitEntryStatus>;
//   onUpdate?: () => void;
// }

// export function HabitCard({ habit, year, timezone, entries, onUpdate }: HabitCardProps) {
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const dates = getYearDates(year);
//   const stats = computeHabitStats(dates, entries, timezone);

//   async function handleDelete() {
//     setIsDeleting(true);
//     const result = await deleteHabit({ id: habit.id });
//     setIsDeleting(false);

//     if (!result.success) {
//       toast.error(result.error);
//       return;
//     }

//     toast.success("Habitude supprimée");
//     setDeleteOpen(false);
//     onUpdate?.();
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
//           <div>
//             <CardTitle className="text-lg">{habit.name}</CardTitle>
//             <p className="mt-1 text-sm text-muted-foreground">
//               {stats.positiveRate}% positif · {stats.positiveCount} vert ·{" "}
//               {stats.negativeCount} rouge · {stats.blankCount} non renseigné
//             </p>
//           </div>
//           <div className="flex shrink-0 gap-1">
//             <Button
//               variant="ghost"
//               // size="icon"
//               onClick={() => setEditOpen(true)}
//               aria-label={`Modifier ${habit.name}`}
//               className="glass cursor-pointer"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               // size="icon"
//               onClick={() => setDeleteOpen(true)}
//               aria-label={`Supprimer ${habit.name}`}
//               className="glass cursor-pointer"
//             >
//               <Trash2 className="h-4 w-4 text-destructive" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <HabitGrid
//             habitId={habit.id}
//             year={year}
//             timezone={timezone}
//             initialEntries={entries}
//           />
//         </CardContent>
//       </Card>

//       <HabitFormDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         habit={habit}
//         onSuccess={onUpdate}
//       />

//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Supprimer l&apos;habitude</DialogTitle>
//             <DialogDescription>
//               Êtes-vous sûr de vouloir supprimer « {habit.name} » ? Toutes les
//               validations associées seront également supprimées. Cette action est
//               irréversible.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteOpen(false)}>
//               Annuler
//             </Button>
//             <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
//               {isDeleting ? "Suppression…" : "Supprimer"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
