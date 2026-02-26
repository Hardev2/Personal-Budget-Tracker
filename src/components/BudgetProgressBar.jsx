import { getPercentageSpent } from '../utils/calculations'

/**
 * Progress bar showing how much of the allowance has been spent (0–100%).
 */
export function BudgetProgressBar({ totalSpent, allowanceAmount }) {
  const percent = getPercentageSpent(totalSpent, allowanceAmount)
  const isOver = percent > 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
        <span>Budget used</span>
        <span>{Math.round(Math.min(100, percent))}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver ? 'bg-red-500' : percent >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  )
}
