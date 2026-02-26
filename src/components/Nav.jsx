import { Link, useLocation } from 'react-router-dom'
import { DarkModeToggle } from './DarkModeToggle'

export function Nav() {
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between min-h-14">
          <Link to="/" className="font-semibold text-slate-900 dark:text-white shrink-0">
            Allowance Tracker
          </Link>

          {/* Desktop: nav links. Mobile: only theme toggle (bottom nav handles links) */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-0.5">
              <Link to="/" className={linkClass('/')}>Dashboard</Link>
              <Link to="/allowance" className={linkClass('/allowance')}>Allowance</Link>
              <Link to="/planner" className={linkClass('/planner')}>Planner</Link>
              <Link to="/expenses" className={linkClass('/expenses')}>Expenses</Link>
              <Link to="/savings" className={linkClass('/savings')}>Savings</Link>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
