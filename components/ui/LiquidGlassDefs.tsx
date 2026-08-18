export function LiquidGlassDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{
        position: "absolute",
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter
          id="liquid-glass-refraction"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025 0.04"
            numOctaves="2"
            seed="18"
            result="noise"
          />

          <feGaussianBlur
            in="noise"
            stdDeviation="3"
            result="softNoise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="B"
            result="refracted"
          />

          <feGaussianBlur
            in="refracted"
            stdDeviation="0.35"
            result="softRefracted"
          />

          <feColorMatrix
            in="softRefracted"
            type="saturate"
            values="1.18"
            result="saturated"
          />

          <feBlend
            in="saturated"
            in2="SourceGraphic"
            mode="screen"
          />
        </filter>
      </defs>
    </svg>
  );
}