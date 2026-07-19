interface AmbientGlowProps {
  color?: 'blue' | 'violet' | 'cyan'
  className?: string
  size?: number
}

export default function AmbientGlow({ color = 'blue', className = '', size = 500 }: AmbientGlowProps) {
  const colorMap = {
    blue: 'rgba(4,120,87,0.15)',
    violet: 'rgba(212,175,55,0.12)',
    cyan: 'rgba(169,120,79,0.10)',
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
