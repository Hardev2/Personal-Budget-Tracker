import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import {
  getExpensesInCurrentMonth,
  getTotalExpenses,
  getRemainingBalance,
  getRemainingDays,
  getDailyBudgetSuggestion,
  getPercentageSpent,
} from '../utils/calculations'
import { getInsights } from '../utils/insights'
import { exportExpensesToJson } from '../utils/exportData'
import { BudgetProgressBar } from '../components/BudgetProgressBar'
import { CategoryPieChart } from '../charts/CategoryPieChart'
import { SpendingLineChart } from '../charts/SpendingLineChart'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const [allowance] = useLocalStorage(STORAGE_KEYS.ALLOWANCE, {
    amount: 0,
    startDate: new Date().toISOString().slice(0, 10),
  })
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEYS.EXPENSES, [])

  const expensesInMonth = getExpensesInCurrentMonth(expenses, allowance.startDate)
  const totalSpent = getTotalExpenses(expensesInMonth)
  const remaining = getRemainingBalance(allowance.amount, expensesInMonth)
  const remainingDays = getRemainingDays(allowance.startDate)
  const dailyBudget = getDailyBudgetSuggestion(remaining, remainingDays)
  const percentSpent = getPercentageSpent(totalSpent, allowance.amount)
  const insights = getInsights(allowance, expenses)

  const handleResetMonth = () => {
    if (window.confirm('Reset month? This will clear all expenses. This cannot be undone.')) {
      setExpenses([])
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportExpensesToJson(expenses)}
            className="touch-target rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 min-w-0"
          >
            Export to JSON
          </button>
          <button
            type="button"
            onClick={handleResetMonth}
            className="touch-target rounded-lg border border-amber-300 dark:border-amber-700 px-4 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 min-w-0"
          >
            Reset month
          </button>
        </div>
      </div>

      {allowance.amount <= 0 && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-amber-800 dark:text-amber-200">
            Set your monthly allowance first.{' '}
            <Link to="/allowance" className="underline font-medium">Go to Allowance</Link>
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total allowance" value={allowance.amount} prefix="₱" />
        <Card title="Total spent" value={totalSpent} prefix="₱" />
        <Card title="Remaining balance" value={remaining} prefix="₱" />
        <Card title="Daily budget suggestion" value={dailyBudget} prefix="₱" sub={`${remainingDays} days left`} />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
        <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">Budget progress</h2>
        <BudgetProgressBar totalSpent={totalSpent} allowanceAmount={allowance.amount} />
      </div>

      {insights.length > 0 && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-3 sm:p-4">
          <h2 className="text-base font-semibold mb-2 text-indigo-900 dark:text-indigo-100 sm:text-lg">Insights</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-200 sm:text-base">
            {insights.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 min-h-0">
          <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">Spending by category</h2>
          <CategoryPieChart expenses={expensesInMonth} />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 min-h-0">
          <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">Spending over time</h2>
          <SpendingLineChart expenses={expensesInMonth} startDate={allowance.startDate} />
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, prefix = '', sub }) {
  const display = typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(2)) : value
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-white dark:bg-slate-800/50">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 sm:text-xl">
        {prefix}{display}
      </p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}
