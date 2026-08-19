// components/ui/LiquidDistortionDefs.tsx
export function LiquidDistortionDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      className="absolute pointer-events-none"
    >
      <defs>
        <filter
          id="liquid-distortion"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.028"
            numOctaves="2"
            seed="7"
            result="noise"
          />

          <feGaussianBlur
            in="noise"
            stdDeviation="1.5"
            result="smooth-noise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="smooth-noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}