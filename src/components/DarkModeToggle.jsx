import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_THEME_KEY = 'allowance-tracker-theme'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useLocalStorage(STORAGE_THEME_KEY, false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
