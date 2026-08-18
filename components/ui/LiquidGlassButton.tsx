"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type LiquidGlassButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

export const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(function LiquidGlassButton(
  { className, onPointerMove, onPointerUp, onPointerCancel, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLButtonElement>(null);
  const [isReleasing, setIsReleasing] = useState(false);

  const getButton = () => {
    if (typeof forwardedRef === "function") {
      return localRef.current;
    }

    return forwardedRef?.current ?? localRef.current;
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    const button = getButton();
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      button.style.setProperty("--liquid-x", `${x}%`);
      button.style.setProperty("--liquid-y", `${y}%`);
    }

    onPointerMove?.(event);
  };

  const handleRelease = (
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    setIsReleasing(true);

    window.setTimeout(() => {
      setIsReleasing(false);
    }, 360);

    onPointerUp?.(event);
  };

  const handleCancel = (
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    setIsReleasing(false);
    onPointerCancel?.(event);
  };

  return (
    <button
      {...props}
      ref={(element) => {
        localRef.current = element;

        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else if (forwardedRef) {
          forwardedRef.current = element;
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handleRelease}
      onPointerCancel={handleCancel}
      className={cn(
        "liquid-glass",
        isReleasing && "is-releasing",
        className,
      )}
    />
  );
});