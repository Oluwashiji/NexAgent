import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all cursor-pointer ${className}`}
    >
      {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
    </button>
  )
}