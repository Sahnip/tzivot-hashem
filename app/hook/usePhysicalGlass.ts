"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function usePhysicalGlass() {
  const [isHover, setIsHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const releaseTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const clearReleaseTimer = useCallback(() => {
    if (releaseTimerRef.current) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  }, []);

  const release = useCallback(() => {
    clearReleaseTimer();
    setIsPressed(false);
    setIsReleasing(true);

    releaseTimerRef.current = window.setTimeout(() => {
      setIsReleasing(false);
      releaseTimerRef.current = null;
    }, 320);
  }, [clearReleaseTimer]);

  const onPointerEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setIsHover(false);

    if (isPressed) {
      release();
    }
  }, [isPressed, release]);

  const onPointerDown = useCallback(() => {
    clearReleaseTimer();
    setIsPressed(true);
    setIsReleasing(false);
  }, [clearReleaseTimer]);

  const onPointerUp = useCallback(() => {
    release();
  }, [release]);

  useEffect(() => {
    const onWindowPointerUp = () => {
      if (isPressed) {
        release();
      }
    };

    window.addEventListener("pointerup", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", onWindowPointerUp);
      clearReleaseTimer();
    };
  }, [clearReleaseTimer, isPressed, release]);

  const getClass = (baseClass = "") => {
    return [
      baseClass,
      "physical-glass",
      isHover && !isPressed ? "hover-squeeze" : "",
      isPressed ? "pressed" : "",
      isReleasing ? "releasing" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    getClass,
  };
}