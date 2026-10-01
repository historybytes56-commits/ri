// SVG filter that warps whatever sits behind a glass layer, giving the
// "liquid" refraction. Render once near the app root.
function GlassFilter() {
  return (
    <svg className="glass-filter-defs" aria-hidden="true">
      <filter id="liquid-glass" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.008"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softNoise"
          scale="60"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}

export default GlassFilter
