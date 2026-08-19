"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createHabit, updateHabit } from "@/lib/actions/habits";
import {
  createHabitSchema,
  updateHabitSchema,
  type CreateHabitInput,
  type UpdateHabitInput,
} from "@/lib/validations/habits";
import { HABIT_COLORS } from "@/types/habit";
import type { Habit } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LiquidGlassSurface } from "../ui/LiquidGlassSurface";


interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSuccess?: () => void;
}

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
  onSuccess,
}: HabitFormDialogProps) {
  const isEditing = !!habit;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateHabitInput | UpdateHabitInput>({
    resolver: zodResolver(isEditing ? updateHabitSchema : createHabitSchema),
    defaultValues: {
      name: habit?.name ?? "",
      color: (habit?.color as CreateHabitInput["color"]) ?? "emerald",
      ...(isEditing && habit ? { id: habit.id } : {}),
    },
  });

  async function onSubmit(values: CreateHabitInput | UpdateHabitInput) {
    setIsSubmitting(true);
    const result = isEditing
      ? await updateHabit(values as UpdateHabitInput)
      : await createHabit(values);

    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Habitude modifiée" : "Habitude créée");
    onOpenChange(false);
    form.reset();
    onSuccess?.();
  }

  const selectedColor = form.watch("color");

  return (
    <div className="liquid-glass-parent">
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier l'habitude" : "Nouvelle habitude"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifiez le nom ou la couleur de votre habitude."
                : "Créez une habitude à suivre sur l'année."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4  flex flex-col gap-1">
            <div className="space-y-2 flex flex-col gap-1">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Ex : Lire 20 minutes"
                {...form.register("name")}
                aria-invalid={!!form.formState.errors.name}
                aria-describedby="name-error"
                disabled={isSubmitting}
                className="liquid-glass"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <fieldset className="space-y-2 ">
              <legend className="text-sm font-medium">Couleur</legend>
              <div className="flex flex-wrap gap-2">
                {HABIT_COLORS.map((color) => (
                  <label key={color.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={color.value}
                      className="sr-only"
                      {...form.register("color")}
                    />
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full ring-offset-background transition-all",
                        color.className,
                        selectedColor === color.value
                          ? "ring-2 ring-ring ring-offset-2"
                          : "opacity-70 hover:opacity-100"
                      )}
                      title={color.label}
                      aria-label={color.label}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="liquid-glass">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="liquid-glass">
                {isSubmitting ? "Enregistrement…" : isEditing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    
    
  );
}
