import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function GlassCard({ children, className = '', hover = true, padding = 'lg' }: GlassCardProps) {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  return (
    <div
      className={cn(
        'glass-surface rounded-2xl shadow-card transition-all duration-300',
        paddingMap[padding],
        hover && 'glass-hover hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  )
}
