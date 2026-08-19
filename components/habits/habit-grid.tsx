"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleHabitEntry } from "@/lib/actions/habit-entries";
import {
  formatDisplayDate,
  getMonthLabels,
  getYearDates,
  isFutureDate,
} from "@/lib/dates/habit-calendar";
import { getNextStatus, getStatusLabel } from "@/types/habit";
import type { HabitEntryStatus } from "@/types/database";
import { cn } from "../../lib/utils.ts";
import { Spinner } from "@/components/ui/spinner";
import { PhysicalGlassButton } from "../ui/PhysicalGlassButton.tsx";

interface HabitGridProps {
  habitId: string;
  year: number;
  timezone: string;
  initialEntries: Record<string, HabitEntryStatus>;
}

function getCellClasses(status: HabitEntryStatus | null, disabled: boolean): string {
  if (disabled) {
    return "bg-muted/40 cursor-not-allowed opacity-50 border-transparent";
  }

  switch (status) {
    case "positive":
      return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 border-transparent";
    case "negative":
      return "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 border-transparent";
    default:
      return "bg-muted hover:bg-muted-foreground/20 border border-muted-foreground/20";
  }
}

export function HabitGrid({ habitId, year, timezone, initialEntries }: HabitGridProps) {
  const dates = useMemo(() => getYearDates(year), [year]);
  const monthLabels = useMemo(() => getMonthLabels(year), [year]);
  const [entries, setEntries] = useState(initialEntries);
  const [pendingDates, setPendingDates] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const inFlight = useRef<Set<string>>(new Set());

  const handleToggle = useCallback(
    (date: string) => {
      if (isFutureDate(date, timezone)) return;
      if (inFlight.current.has(date)) return;

      inFlight.current.add(date);
      setPendingDates((prev) => new Set(prev).add(date));

      const previousStatus = entries[date] ?? null;
      const optimisticStatus = getNextStatus(previousStatus);

      setEntries((prev) => {
        const next = { ...prev };
        if (optimisticStatus === null) {
          delete next[date];
        } else {
          next[date] = optimisticStatus;
        }
        return next;
      });

      startTransition(async () => {
        const result = await toggleHabitEntry({ habitId, date, year });

        inFlight.current.delete(date);
        setPendingDates((prev) => {
          const next = new Set(prev);
          next.delete(date);
          return next;
        });

        if (!result.success) {
          setEntries((prev) => {
            const next = { ...prev };
            if (previousStatus === null) {
              delete next[date];
            } else {
              next[date] = previousStatus;
            }
            return next;
          });
          toast.error(result.error);
          return;
        }

        setEntries((prev) => {
          const next = { ...prev };
          if (result.data.status === null) {
            delete next[date];
          } else {
            next[date] = result.data.status;
          }
          return next;
        });
      });
    },
    [entries, habitId, timezone, year]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground" role="list" aria-label="Légende">
        <span className="flex items-center gap-1.5" role="listitem">
          <span className="h-3 w-3 rounded-sm bg-muted" aria-hidden="true" />
          Gris : non renseigné
        </span>
        <span className="flex items-center gap-1.5" role="listitem">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" aria-hidden="true" />
          Vert : validation positive
        </span>
        <span className="flex items-center gap-1.5" role="listitem">
          <span className="h-3 w-3 rounded-sm bg-red-500" aria-hidden="true" />
          Rouge : validation négative
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[220px]">
          <div className="mb-2 grid grid-cols-12 gap-1 text-[10px] text-muted-foreground">
            {monthLabels.map(({ month, label }) => (
              <span key={`${month}-${label}`} className="truncate text-center">
                {label}
              </span>
            ))}
          </div>

          <div
            className="grid auto-cols-max grid-flow-col gap-[3px]"
            role="grid"
            aria-label={`Grille de suivi ${year}`}
          >
            {Array.from({ length: Math.ceil(dates.length / 7) }, (_, weekIndex) => {
              const weekDates = dates.slice(weekIndex * 7, weekIndex * 7 + 7);

              return (
                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-[3px]">
                  {weekDates.map((date) => {
                    const status = entries[date] ?? null;
                    const isFuture = isFutureDate(date, timezone);
                    const isPending = pendingDates.has(date);
                    const label = `${formatDisplayDate(date)}, ${getStatusLabel(status)}`;

                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={isFuture || isPending}
                        title={label}
                        aria-label={label}
                        aria-pressed={status !== null}
                        onClick={() => handleToggle(date)}
                        className={cn(
                          "h-3 w-3 min-h-3 min-w-3 rounded-[3px] border border-transparent transition-all duration-400 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
                          getCellClasses(status, isFuture),
                          isPending && "opacity-50"
                        ) + "liquid-glass"}
                      >
                        {isPending && (
                          <span className="sr-only">Enregistrement en cours</span>
                        )}
                      </button>
                      /* LIQUID GLASS CELL EFFECT LAG BEACAUSE MORE RENDERING
                      
                      <button
                        key={date}
                        type="button"
                        disabled={isFuture || isPending}
                        title={label}
                        aria-label={label}
                        aria-pressed={status !== null}
                        onClick={() => handleToggle(date)}
                        className={cn(
                          "liquid-glass-cell h-3 w-3 min-h-3 min-w-3 rounded-[3px] border border-transparent transition-all duration-400 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
                          getCellClasses(status, isFuture),
                          isPending && "opacity-70"
                        )}
                      >
                        {isPending && (
                          <span className="sr-only">Enregistrement en cours</span>
                        )}
                      </button>
                       */
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {pendingDates.size > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner className="h-3 w-3" />
          Enregistrement…
        </div>
      )}
    </div>
  );
}







{/* 
  Exemple d'application de Hook PhysicalGlassButton pour les cellules de la grille, mais cela peut être plus lourd à rendre et moins performant que le simple bouton avec effet de verre liquide.
    <PhysicalGlassButton
    key={date}
    type="button"
    disabled={isFuture || isPending}
    onClick={() => handleToggle(date)}
    className={cn(
      "glass-cell h-3 w-3 min-h-3 min-w-3 rounded-[3px] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
      getCellClasses(status, isFuture),
      isPending && "opacity-70"
    )}
    // Tu peux passer title / aria-* si besoin via des props supplémentaires du wrapper
  >
    {isPending && <span className="sr-only">Enregistrement en cours</span>}
  </PhysicalGlassButton> 
  */}
