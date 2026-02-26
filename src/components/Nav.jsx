import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DarkModeToggle } from './DarkModeToggle'

export function Nav() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = (path) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
      location.pathname === path
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  const navLinks = (
    <>
      <Link to="/" className={linkClass('/')} onClick={() => setMenuOpen(false)}>
        Dashboard
      </Link>
      <Link to="/allowance" className={linkClass('/allowance')} onClick={() => setMenuOpen(false)}>
        Allowance
      </Link>
      <Link to="/expenses" className={linkClass('/expenses')} onClick={() => setMenuOpen(false)}>
        Expenses
      </Link>
    </>
  )

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between min-h-14">
          <Link to="/" className="font-semibold text-slate-900 dark:text-white shrink-0">
            Allowance Tracker
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks}
            <DarkModeToggle />
          </div>

          {/* Mobile: hamburger + dropdown */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <span className="text-lg" aria-hidden>✕</span>
              ) : (
                <span className="text-lg" aria-hidden>☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden py-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-0.5">
              {navLinks}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
