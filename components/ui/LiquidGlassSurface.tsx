"use client";

import * as React from "react";




export interface LiquidGlassSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const LiquidGlassSurface = React.forwardRef<
  HTMLDivElement,
  LiquidGlassSurfaceProps
>(({ children, className = "", onMouseMove, ...props }, forwardedRef) => {
  const internalRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = internalRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    element.style.setProperty("--x", `${x}px`);
    element.style.setProperty("--y", `${y}px`);

    // Permet également à un éventuel onMouseMove
    // passé depuis Card ou un autre composant de fonctionner.
    onMouseMove?.(e);
  };

  return (
    <div
      ref={(element) => {
        internalRef.current = element;

        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else if (forwardedRef) {
          forwardedRef.current = element;
        }
      }}
      onMouseMove={handleMouseMove}
      className={`liquid-glass-surface ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

LiquidGlassSurface.displayName = "LiquidGlassSurface";


// // LiquidGlassSurface.tsx
// "use client";

// import { useRef, MouseEvent } from "react";

// export function LiquidGlassSurface({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   const ref = useRef<HTMLDivElement | null>(null);

//   const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
//     if (!ref.current) return;
//     const rect = ref.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ref.current.style.setProperty("--x", `${x}px`);
//     ref.current.style.setProperty("--y", `${y}px`);
//   };

//   return (
//     <div
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       className={`liquid-glass-surface ${className}`}
//     >
//       {children}
//     </div>
//   );
// }