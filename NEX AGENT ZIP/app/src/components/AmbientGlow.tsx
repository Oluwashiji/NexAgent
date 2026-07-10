interface AmbientGlowProps {
  color?: 'blue' | 'violet' | 'cyan'
  className?: string
  size?: number
}

export default function AmbientGlow({ color = 'blue', className = '', size = 500 }: AmbientGlowProps) {
  const colorMap = {
    blue: 'rgba(59,130,246,0.15)',
    violet: 'rgba(139,92,246,0.12)',
    cyan: 'rgba(6,182,212,0.10)',
  }

  return (
    <div
      className={`pointer-events-none absolute rounded-full animate-pulse-glow ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
    />
  )
}
