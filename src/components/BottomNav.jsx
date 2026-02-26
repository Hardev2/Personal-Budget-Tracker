import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: '⌂' },
  { to: '/allowance', label: 'Allowance', icon: '💰' },
  { to: '/planner', label: 'Planner', icon: '📋' },
]

const overflowLinks = [
  { to: '/expenses', label: 'Expenses', icon: '📝' },
  { to: '/savings', label: 'Savings', icon: '🏦' },
]

export function BottomNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 safe-area-b"
      aria-label="Main navigation"
    >
      <div className="relative flex justify-around items-stretch">
        {primaryLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 min-h-[56px] py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>{icon}</span>
              <span className="mt-0.5">{label}</span>
            </Link>
          )
        })}

        {/* \"More\" item: shows extra navigation in a small popup when space feels tight */}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          className={`flex flex-col items-center justify-center flex-1 min-h-[56px] py-1.5 text-xs font-medium transition-colors ${
            moreOpen
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
          aria-haspopup="menu"
          aria-expanded={moreOpen}
        >
          <span className="text-lg leading-none" aria-hidden>⋯</span>
          <span className="mt-0.5">More</span>
        </button>

        {moreOpen && (
          <div className="absolute bottom-full mb-1 left-0 right-0 px-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
              {overflowLinks.map(({ to, label, icon }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden>{icon}</span>
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
