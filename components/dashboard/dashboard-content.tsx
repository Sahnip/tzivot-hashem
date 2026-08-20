
"use client";

import { useEffect, useState } from "react";
import {
  Edit3,
  Move,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import type {
  Habit,
  HabitEntryStatus,
  Profile,
} from "@/types/database";

import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";

import {
  deleteHabit,
  reorderHabits,
} from "@/lib/actions/habits";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { LiquidGlassWrapper } from "../ui/LiquidGlassWrapper";
import { LiquidGlassSurface } from "../ui/LiquidGlassSurface";

interface DashboardContentProps {
  habits: Habit[];
  entriesByHabit: Record<
    string,
    Record<string, HabitEntryStatus>
  >;
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

  const [selectedYear, setSelectedYear] =
    useState(year);

  const [localHabits, setLocalHabits] =
    useState<Habit[]>(habits);

  const [editMode, setEditMode] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  const [draggingId, setDraggingId] =
    useState<string | null>(null);

  const [overId, setOverId] =
    useState<string | null>(null);

  useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

  /*
   * ============================================================
   * YEAR
   * ============================================================
   */

  function handleYearChange(newYear: number) {
    setSelectedYear(newYear);

    const url = new URL(
      window.location.href
    );

    url.searchParams.set(
      "year",
      String(newYear)
    );

    window.history.replaceState(
      {},
      "",
      url.toString()
    );

    window.location.reload();
  }

  /*
   * ============================================================
   * ORDER
   * ============================================================
   */

  async function persistOrder(
    nextHabits: Habit[]
  ) {
    const ids = nextHabits.map(
      (habit) => habit.id
    );

    await reorderHabits(ids);
  }

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);

    await Promise.all(
      ids.map((id) =>
        deleteHabit({ id })
      )
    );

    setLocalHabits((prev) =>
      prev.filter(
        (habit) =>
          !selectedIds.has(habit.id)
      )
    );

    setSelectedIds(new Set());
  }

  /*
   * ============================================================
   * SELECT
   * ============================================================
   */

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /*
   * ============================================================
   * DRAG & DROP
   * ============================================================
   */

  function onDragStart(
    event: React.DragEvent,
    id: string
  ) {
    setDraggingId(id);

    event.dataTransfer.setData(
      "text/plain",
      id
    );

    event.dataTransfer.effectAllowed =
      "move";
  }

  function onDragOver(
    event: React.DragEvent,
    id: string
  ) {
    event.preventDefault();

    if (id === draggingId) return;

    setOverId(id);
  }

  async function onDrop(
    event: React.DragEvent,
    id: string
  ) {
    event.preventDefault();

    const draggedId =
      draggingId ??
      event.dataTransfer.getData(
        "text/plain"
      );

    if (!draggedId) return;

    const fromIndex =
      localHabits.findIndex(
        (habit) =>
          habit.id === draggedId
      );

    const toIndex =
      localHabits.findIndex(
        (habit) => habit.id === id
      );

    if (
      fromIndex === -1 ||
      toIndex === -1
    ) {
      return;
    }

    const nextHabits = [
      ...localHabits,
    ];

    const [moved] =
      nextHabits.splice(
        fromIndex,
        1
      );

    nextHabits.splice(
      toIndex,
      0,
      moved
    );

    setLocalHabits(nextHabits);

    setDraggingId(null);
    setOverId(null);

    await persistOrder(nextHabits);
  }

  function onDragEnd() {
    setDraggingId(null);
    setOverId(null);
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main
      className=" "
    >
      <div
        className="
          mx-auto
        "
      >

        {/* ======================================================
            HEADER
        ======================================================= */}

        {/* <LiquidGlassWrapper
          className="
            rounded-2xl
            p-3
            sm:p-4
            lg:rounded-xl
            lg:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* TITRE */}

            {/* <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                Mes habitudes
              </h1>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                  font-thin
                  sm:text-sm
                "
              >
                Cliquez sur une case :
                vert → rouge → vide
              </p>
            </div> */}

            {/* ACTIONS */}

            {/* <div
              className="
                grid
                w-full
                grid-cols-1
                gap-2
                sm:grid-cols-2
                lg:flex
                lg:w-auto
                lg:flex-wrap
                lg:justify-end
              "
            > */}

              {/* ANNÉE */}

              {/* <div
                className="
                  liquid-glass
                  flex
                  h-11
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  sm:col-span-2
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                <label
                  htmlFor="year-select"
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Année
                </label>

                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) =>
                    handleYearChange(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="
                    h-9
                    cursor-pointer
                    border-0
                    bg-transparent
                    px-2
                    text-sm
                    font-medium
                    outline-none
                  "
                >
                  {availableYears.map(
                    (y) => (
                      <option
                        key={y}
                        value={y}
                      >
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div> */}

              {/* AJOUTER */}

              {/* <Button
                onClick={() =>
                  setCreateOpen(true)
                }
                className="
                  liquid-glass

                  w-full
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                <Plus className="mr-2 h-4 w-4" />

                Ajouter une habitude
              </Button> */}

              {/* MODIFIER */}

              {/* <Button
                variant={
                  editMode
                    ? "secondary"
                    : "ghost"
                }
                onClick={() =>
                  setEditMode(
                    (value) => !value
                  )
                }
                className="
                  liquid-glass
                  h-11
                  w-full
                  rounded-xl
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                {editMode ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Terminer
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </div>
        </LiquidGlassWrapper> */}

        <div
          className="
            rounded-2xl
            p-3
            sm:p-4
            lg:rounded-xl
            lg:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* TITRE */}

            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                Mes habitudes
              </h1>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                  font-thin
                  sm:text-sm
                "
              >
                Cliquez sur une case :
                vert → rouge → vide
              </p>
            </div>

            {/* ACTIONS */}

            <div
              className="
                grid
                w-full
                grid-cols-1
                gap-2
                sm:grid-cols-2
                lg:flex
                lg:w-auto
                lg:flex-wrap
                lg:justify-end
              "
            >

              {/* ANNÉE */}

              <div
                className="
                  liquid-glass
                  flex
                  h-11
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  sm:col-span-2
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                <label
                  htmlFor="year-select"
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Année
                </label>

                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) =>
                    handleYearChange(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="
                    h-9
                    cursor-pointer
                    border-0
                    bg-transparent
                    px-2
                    text-sm
                    font-medium
                    outline-none
                  "
                >
                  {availableYears.map(
                    (y) => (
                      <option
                        key={y}
                        value={y}
                      >
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* AJOUTER */}

              <Button
                onClick={() =>
                  setCreateOpen(true)
                }
                className="
                  liquid-glass

                  w-full
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                <Plus className="mr-2 h-4 w-4" />

                Ajouter une habitude
              </Button>

              {/* MODIFIER */}

              <Button
                variant={
                  editMode
                    ? "secondary"
                    : "ghost"
                }
                onClick={() =>
                  setEditMode(
                    (value) => !value
                  )
                }
                className="
                  liquid-glass
                  h-11
                  w-full
                  rounded-xl
                  lg:h-10
                  lg:w-auto
                  lg:rounded-md
                "
              >
                {editMode ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Terminer
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ======================================================
            CONTENU
            Aucun background ici.
            Aucun LiquidGlassSurface global.
        ======================================================= */}

        <div
          className="
            mt-4
            w-full
            min-w-0
            sm:mt-5
            lg:mt-6
          "
        >

          {/* ====================================================
              EMPTY
          ===================================================== */}

          {localHabits.length === 0 ? (
            <Card>
              <CardContent
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-4
                  py-14
                  text-center
                  sm:py-16
                "
              >
                <p
                  className="
                    mb-5
                    text-sm
                    text-muted-foreground
                  "
                >
                  Vous n&apos;avez pas encore
                  d&apos;habitude.
                </p>

                <Button
                  onClick={() =>
                    setCreateOpen(true)
                  }
                  className="
                    h-11
                    w-full
                    sm:w-auto
                  "
                >
                  Créer ma première
                  habitude
                </Button>
              </CardContent>
            </Card>
          ) : (

            /*
             * ==================================================
             * LISTE NATURELLE
             *
             * Aucun background.
             * Aucun border.
             * Aucun glass.
             * ==================================================
             */

            <div
              className="
                w-full
                min-w-0
                space-y-4
                sm:space-y-5
                lg:space-y-6
              "
            >

              {/* =================================================
                  TOOLBAR MODE EDITION
              ================================================== */}

              {editMode && (
                <div
                  className="
                    flex
                    flex-col
                    liquid-glass-parent
                    gap-3
                    rounded-xl
                    border
                    bg-muted/30
                    p-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Move
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-muted-foreground
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-muted-foreground
                        sm:text-sm
                      "
                    >
                      Glissez-déposez pour
                      réordonner
                    </span>
                  </div>

                  <Button
                    variant="destructive"
                    disabled={
                      selectedIds.size === 0
                    }
                    onClick={
                      handleBulkDelete
                    }
                    className="
                      liquid-glass
                      physical-glass
                      h-10
                      w-full
                      sm:w-auto
                    "
                  >
                    <Trash2 className="mr-2 h-4 w-4" />

                    Supprimer
                    {selectedIds.size >
                    0
                      ? ` (${selectedIds.size})`
                      : ""}
                  </Button>
                </div>
              )}

              {/* =================================================
                  HABITUDES
              ================================================== */}

              {localHabits.map(
                (habit) => (
                  <div
                    key={habit.id}
                    draggable={editMode}
                    onDragStart={(event) =>
                      onDragStart(
                        event,
                        habit.id
                      )
                    }
                    onDragOver={(event) =>
                      onDragOver(
                        event,
                        habit.id
                      )
                    }
                    onDrop={(event) =>
                      onDrop(
                        event,
                        habit.id
                      )
                    }
                    onDragEnd={
                      onDragEnd
                    }
                    className={[
                      "w-full min-w-0",
                      "transition-all",
                      editMode
                        ? "cursor-grab active:cursor-grabbing"
                        : "",
                      overId === habit.id
                        ? "rounded-2xl ring-2 ring-primary/70 ring-offset-2"
                        : "",
                    ].join(" ")}
                  >

                    {/* =================================================
                        LIQUID GLASS PAR HABITUDE
                    ================================================== */}

                    <LiquidGlassSurface
                      className="
                        w-full
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        p-3
                        sm:p-4
                        lg:p-5
                        
                      "
                    >

                      {/* =============================================
                          HEADER DE L'HABITUDE

                          CETTE PARTIE NE SCROLLE PAS.
                      ============================================== */}

                      <div
                        className="
                          w-full
                          min-w-0
                        "
                      >

                        {/* MODE EDITION */}

                        {editMode && (
                          <div
                            className="
                              mb-3
                              flex
                              min-h-11
                              items-center
                              gap-3
                              rounded-xl
                              bg-muted/30
                              px-3
                            "
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.has(
                                habit.id
                              )}
                              onChange={() =>
                                toggleSelect(
                                  habit.id
                                )
                              }
                              className="
                                h-5
                                w-5
                                shrink-0
                                cursor-pointer
                                accent-primary
                              "
                            />

                            <Move
                              className="
                                h-4
                                w-4
                                shrink-0
                                text-muted-foreground
                              "
                            />

                            <span
                              className="
                                truncate
                                text-xs
                                text-muted-foreground
                                sm:text-sm
                              "
                            >
                              Déplacer cette
                              habitude
                            </span>
                          </div>
                        )}

                        {/* =============================================
                            IMPORTANT :

                            HabitCard doit idéalement séparer :

                            1. header de l'habitude
                            2. calendrier

                            Le wrapper ci-dessous empêche le scroll
                            de remonter jusqu'au header.
                        ============================================== */}

                        <div
                          className="
                            w-full
                            min-w-0
                          "
                        >

                          {/* ===========================================
                              ZONE CALENDRIER UNIQUEMENT

                              Le overflow-x-auto est ICI.
                              Rien au-dessus ne défile.
                          ============================================ */}

                          <div
                            className="
                              w-full
                              min-w-0
                              scrollbar-thin
                              touch-pan-x
                              scrollbar-thumb-rounded-full
                              scrollbar-track-rounded-full
                              scrollbar-thumb-muted/50
                              scrollbar-track-muted/20
                              scrollbar-thumb-hover-muted/70

                            "
                          >
                            <div
                              className="

                              "
                            >
                              <HabitCard
                                habit={habit}
                                year={
                                  selectedYear
                                }
                                timezone={
                                  profile.timezone
                                }
                                entries={
                                  entriesByHabit[
                                    habit.id
                                  ] ?? {}
                                }
                                onUpdate={() =>
                                  undefined
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </LiquidGlassSurface>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          DIALOG
      ========================================================= */}

      <HabitFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </main>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { Edit3, Move, Plus, Trash2 } from "lucide-react";
// import type { Habit, HabitEntryStatus, Profile } from "@/types/database";
// import { HabitCard } from "@/components/habits/habit-card";
// import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
// import { deleteHabit, reorderHabits } from "@/lib/actions/habits";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { LiquidGlassWrapper } from "../ui/LiquidGlassWrapper";
// import { LiquidGlassSurface } from "../ui/LiquidGlassSurface";

// interface DashboardContentProps {
//   habits: Habit[];
//   entriesByHabit: Record<string, Record<string, HabitEntryStatus>>;
//   profile: Profile;
//   year: number;
//   availableYears: number[];
// }

// export function DashboardContent({
//   habits,
//   entriesByHabit,
//   profile,
//   year,
//   availableYears,
// }: DashboardContentProps) {
//   const [createOpen, setCreateOpen] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(year);
//   const [localHabits, setLocalHabits] = useState<Habit[]>(habits);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [draggingId, setDraggingId] = useState<string | null>(null);
//   const [overId, setOverId] = useState<string | null>(null);

//   useEffect(() => setLocalHabits(habits), [habits]);

//   function handleYearChange(newYear: number) {
//     setSelectedYear(newYear);
//     const url = new URL(window.location.href);
//     url.searchParams.set("year", String(newYear));
//     window.history.replaceState({}, "", url.toString());
//     window.location.reload();
//   }

//   async function persistOrder(nextHabits: Habit[]) {
//     const ids = nextHabits.map((habit) => habit.id);
//     await reorderHabits(ids);
//   }

//   async function handleBulkDelete() {
//     if (selectedIds.size === 0) return;

//     const ids = Array.from(selectedIds);
//     await Promise.all(ids.map((id) => deleteHabit({ id })));
//     setLocalHabits((prev) => prev.filter((habit) => !selectedIds.has(habit.id)));
//     setSelectedIds(new Set());
//   }

//   function toggleSelect(id: string) {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   }

//   function onDragStart(event: React.DragEvent, id: string) {
//     setDraggingId(id);
//     event.dataTransfer.setData("text/plain", id);
//     event.dataTransfer.effectAllowed = "move";
//   }

//   function onDragOver(event: React.DragEvent, id: string) {
//     event.preventDefault();
//     if (id === draggingId) return;
//     setOverId(id);
//   }

//   async function onDrop(event: React.DragEvent, id: string) {
//     event.preventDefault();

//     const draggedId = draggingId ?? event.dataTransfer.getData("text/plain");
//     if (!draggedId) return;

//     const fromIndex = localHabits.findIndex((habit) => habit.id === draggedId);
//     const toIndex = localHabits.findIndex((habit) => habit.id === id);
//     if (fromIndex === -1 || toIndex === -1) return;

//     const nextHabits = [...localHabits];
//     const [moved] = nextHabits.splice(fromIndex, 1);
//     nextHabits.splice(toIndex, 0, moved);

//     setLocalHabits(nextHabits);
//     setDraggingId(null);
//     setOverId(null);
//     await persistOrder(nextHabits);
//   }

//   function onDragEnd() {
//     setDraggingId(null);
//     setOverId(null);
//   }



// // ...

// return (
//   <div className="space-y-6">
//     {/* HEADER avec effet liquid glass global qui suit la souris */}
//     <LiquidGlassWrapper className="flex flex-col gap-4 rounded-md p-4 sm:flex-row sm:items-center sm:justify-between">
//       <div>
//         <h1 className="text-4xl font-bold tracking-tight">Mes habitudes</h1>
//         <p className="text-sm text-muted-foreground">
//           Cliquez sur une case : vert → rouge → vide
//         </p>
//       </div>

//       <div className="flex flex-wrap items-center gap-2">
//         <div className="glass flex items-start gap-1 sm:flex-row sm:items-center">
//           <label htmlFor="year-select" className="text-sm text-muted-foreground">
//             Année
//           </label>
//           <select
//             id="year-select"
//             value={selectedYear}
//             onChange={(e) => handleYearChange(Number(e.target.value))}
//             className="h-10 rounded-md border-input cursor-pointer bg-background px-3 text-sm focus-visible:outline-none  border-0 "
//           >
//             {availableYears.map((y) => (
//               <option key={y} value={y}>
//                 {y}
//               </option>
//             ))}
//           </select>
//         </div>

//         <Button onClick={() => setCreateOpen(true)} className="glass cursor-pointer">
//           <Plus className="h-4 w-4" aria-hidden="true" />
//           Ajouter une habitude
//         </Button>

//         <Button
//           variant={editMode ? "secondary" : "ghost"}
//           onClick={() => setEditMode((value) => !value)}
//           className="glass cursor-pointer"
//         >
//           <Edit3 className="mr-2 h-4 w-4" />
//           {editMode ? "Quitter le mode édition" : "Modifier l'ordre / actions"}
//         </Button>
//       </div>
//     </LiquidGlassWrapper>

//     {/* CONTENU DE LA PAGE (inchangé) */}
//     {localHabits.length === 0 ? (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//           <p className="mb-4 text-muted-foreground">
//             Vous n&apos;avez pas encore d&apos;habitude.
//           </p>
//           <Button onClick={() => setCreateOpen(true)}>
//             Créer ma première habitude
//           </Button>
//         </CardContent>
//       </Card>
//     ) : (
//       <div className="space-y-6">
//         {editMode 
//           ? 
//         (
//           // <div className="flex items-center gap-2">
//           //   <Button variant="destructive" onClick={handleBulkDelete} className="glass cursor-pointer">
//           //     <Trash2 className="mr-2 h-4 w-4" />
//           //     Supprimer la sélection
//           //   </Button>
//           //   <div className="glass text-sm text-muted-foreground">
//           //     Glissez-déposez pour réordonner
//           //   </div>
//           // </div>
//           <LiquidGlassSurface className="space-y-6 p-4">

//             {/* CONTENU */}
//             {localHabits.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//                   <p className="mb-4 text-muted-foreground">
//                     Vous n&apos;avez pas encore d&apos;habitude.
//                   </p>
//                   <Button onClick={() => setCreateOpen(true)} className="glass">
//                     Créer ma première habitude
//                   </Button>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-6">
//                 {editMode && (
//                   <div className="flex items-center gap-2">
//                     <Button variant="destructive" onClick={handleBulkDelete} className="glass cursor-pointer">
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Supprimer la sélection
//                     </Button>
//                     <div className="text-sm text-muted-foreground">
//                       Glissez-déposez pour réordonner
//                     </div>
//                   </div>
//                 )}

//                 {localHabits.map((habit) => (
//                   <div
//                     key={habit.id}
//                     draggable={editMode}
//                     onDragStart={(event) => onDragStart(event, habit.id)}
//                     onDragOver={(event) => onDragOver(event, habit.id)}
//                     onDrop={(event) => onDrop(event, habit.id)}
//                     onDragEnd={onDragEnd}
//                     className={[
//                       "rounded-md transition-all",
//                       editMode ? "cursor-grab active:cursor-grabbing" : "",
//                       overId === habit.id ? "ring-2 ring-primary/70 ring-offset-2" : "",
//                     ].join(" ")}
//                   >
//                     {editMode && (
//                       <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">
//                         <input
//                           type="checkbox"
//                           checked={selectedIds.has(habit.id)}
//                           onChange={() => toggleSelect(habit.id)}
//                           className="cursor-pointer"
//                         />
//                         <Move className="h-4 w-4" />
//                         <span>Déplacer cette habitude</span>
//                       </div>
//                     )}

//                     <HabitCard
//                       habit={habit}
//                       year={selectedYear}
//                       timezone={profile.timezone}
//                       entries={entriesByHabit[habit.id] ?? {}}
//                       onUpdate={() => undefined}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             <HabitFormDialog open={createOpen} onOpenChange={setCreateOpen} />
//           </LiquidGlassSurface>
//         )
//           :
//         (
//           localHabits.map((habit) => (
//           <div
//             key={habit.id}
//             draggable={editMode}
//             onDragStart={(event) => onDragStart(event, habit.id)}
//             onDragOver={(event) => onDragOver(event, habit.id)}
//             onDrop={(event) => onDrop(event, habit.id)}
//             onDragEnd={onDragEnd}
//             className={[
//               "rounded-md transition-all",
//               editMode ? "cursor-grab active:cursor-grabbing" : "",
//               overId === habit.id ? "ring-2 ring-primary/70 ring-offset-2" : "",
//             ].join(" ")}
//           >
//             {editMode && (
//               <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">
//                 <input
//                   type="checkbox"
//                   checked={selectedIds.has(habit.id)}
//                   onChange={() => toggleSelect(habit.id)}
//                   className="cursor-pointer"
//                 />
//                 <Move className="h-4 w-4" />
//                 <span>Déplacer cette habitude</span>
//               </div>
//             )}

//             <HabitCard
//               habit={habit}
//               year={selectedYear}
//               timezone={profile.timezone}
//               entries={entriesByHabit[habit.id] ?? {}}
//               onUpdate={() => undefined}
//             />
//           </div>
//         ))
//       )

//         }
//       </div>
//     )}

//     <HabitFormDialog open={createOpen} onOpenChange={setCreateOpen} />
//   </div>
// );





























  // return (
  //   <div className="space-y-6">
  //     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  //       <div>
  //         <h1 className="text-4xl font-bold tracking-tight">Mes habitudes</h1>
  //         <p className="text-sm text-muted-foreground">
  //           Cliquez sur une case : vert → rouge → vide
  //         </p>
  //       </div>
  //       <div className="flex flex-wrap items-center gap-2">
  //         <label htmlFor="year-select" className="text-sm text-muted-foreground">
  //           Année
  //         </label>
  //         <select
  //           id="year-select"
  //           value={selectedYear}
  //           onChange={(e) => handleYearChange(Number(e.target.value))}
  //           className="h-10 rounded-md border border-input cursor-pointer bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  //         >
  //           {availableYears.map((y) => (
  //             <option key={y} value={y}>
  //               {y}
  //             </option>
  //           ))}
  //         </select>
  //         <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
  //           <Plus className="h-4 w-4" aria-hidden="true" />
  //           Ajouter une habitude
  //         </Button>
  //         <Button variant={editMode ? "secondary" : "ghost"} onClick={() => setEditMode((value) => !value)} className="cursor-pointer">
  //           <Edit3 className="mr-2 h-4 w-4" />
  //           {editMode ? "Quitter le mode édition" : "Modifier l'ordre / actions"}
  //         </Button>
  //       </div>
  //     </div>

  //     {localHabits.length === 0 ? (
  //       <Card>
  //         <CardContent className="flex flex-col items-center justify-center py-16 text-center">
  //           <p className="mb-4 text-muted-foreground">
  //             Vous n&apos;avez pas encore d&apos;habitude.
  //           </p>
  //           <Button onClick={() => setCreateOpen(true)}>
  //             Créer ma première habitude
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     ) : (
  //       <div className="space-y-6">
  //         {editMode && (
  //           <div className="flex items-center gap-2">
  //             <Button variant="destructive" onClick={handleBulkDelete} className="cursor-pointer">
  //               <Trash2 className="mr-2 h-4 w-4" />
  //               Supprimer la sélection
  //             </Button>
  //             <div className="text-sm text-muted-foreground">Glissez-déposez pour réordonner</div>
  //           </div>
  //         )}

  //         {localHabits.map((habit) => (
  //           <div
  //             key={habit.id}
  //             draggable={editMode}
  //             onDragStart={(event) => onDragStart(event, habit.id)}
  //             onDragOver={(event) => onDragOver(event, habit.id)}
  //             onDrop={(event) => onDrop(event, habit.id)}
  //             onDragEnd={onDragEnd}
  //             className={[
  //               "rounded-md transition-all",
  //               editMode ? "cursor-grab active:cursor-grabbing" : "",
  //               overId === habit.id ? "ring-2 ring-primary/70 ring-offset-2" : "",
  //             ].join(" ")}
  //           >
  //             {editMode && (
  //               <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">
  //                 <input
  //                   type="checkbox"
  //                   checked={selectedIds.has(habit.id)}
  //                   onChange={() => toggleSelect(habit.id)}
  //                   className="cursor-pointer"
  //                 />
  //                 <Move className="h-4 w-4" />
  //                 <span>Déplacer cette habitude</span>
  //               </div>
  //             )}

  //             <HabitCard
  //               habit={habit}
  //               year={selectedYear}
  //               timezone={profile.timezone}
  //               entries={entriesByHabit[habit.id] ?? {}}
  //               onUpdate={() => undefined}
  //             />
  //           </div>
  //         ))}
  //       </div>
  //     )}

  //     <HabitFormDialog open={createOpen} onOpenChange={setCreateOpen} />
  //   </div>
  // );
// }
