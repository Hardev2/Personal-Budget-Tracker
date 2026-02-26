import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: '⌂' },
  { to: '/allowance', label: 'Allowance', icon: '💰' },
  { to: '/planner', label: 'Planner', icon: '📋' },
  { to: '/expenses', label: 'Expenses', icon: '📝' },
  { to: '/savings', label: 'Savings', icon: '🏦' },
]

/**
 * Fixed bottom navigation on mobile only. Gives quick access without opening the burger menu.
 */
export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 safe-area-b"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-stretch">
        {links.map(({ to, label, icon }) => {
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
      </div>
    </nav>
  )
}
