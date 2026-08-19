// PhysicalGlassButton.tsx
"use client";

import { ReactNode, MouseEventHandler } from "react";
import { usePhysicalGlass } from "../../app/hook/usePhysicalGlass.ts";
import { cn } from "../../lib/utils.ts"; // ou ton utilitaire de fusion de classes

type PhysicalGlassButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function PhysicalGlassButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
}: PhysicalGlassButtonProps) {
  const {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    getClass,
  } = usePhysicalGlass();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={cn(getClass(className), disabled && "opacity-60")}
    >
      {children}
    </button>
  );
}