import { Link, useLocation } from 'react-router-dom'

/**
 * Shows "Back to Dashboard" when not on the dashboard. Renders nothing on /.
 */
export function BackButton() {
  const location = useLocation()
  if (location.pathname === '/') return null

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 -mt-1"
    >
      <span aria-hidden>←</span>
      Back to Dashboard
    </Link>
  )
}
