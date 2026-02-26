import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { getDaysInAllowanceMonth } from '../utils/calculations'

/**
 * Planner item: e.g. "Meals" ₱50 × 3/day, "Transpo" ₱15 × 1/day.
 * @typedef {{ id: string, name: string, amountPerUnit: number, timesPerDay: number }} PlannerItem
 */

function getPlannedPerDay(items) {
  if (!Array.isArray(items) || items.length === 0) return 0
  return items.reduce((sum, item) => {
    const amount = Number(item.amountPerUnit) || 0
    const times = Math.max(0, Math.floor(Number(item.timesPerDay) || 0))
    return sum + amount * times
  }, 0)
}

export function PlannerPage() {
  const [allowance] = useLocalStorage(STORAGE_KEYS.ALLOWANCE, {
    amount: 0,
    startDate: new Date().toISOString().slice(0, 10),
  })
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.PLANNER, [])
  const [name, setName] = useState('')
  const [amountPerUnit, setAmountPerUnit] = useState('')
  const [timesPerDay, setTimesPerDay] = useState('1')

  const plannedPerDay = getPlannedPerDay(items)
  const daysInMonth = getDaysInAllowanceMonth(allowance.startDate)
  const plannedPerMonth = plannedPerDay * daysInMonth
  const allowanceAmount = Number(allowance.amount) || 0
  const exceedsAllowance = allowanceAmount > 0 && plannedPerMonth > allowanceAmount
  const suggestedDaily = daysInMonth > 0 ? allowanceAmount / daysInMonth : 0

  const handleAdd = (e) => {
    e.preventDefault()
    const amount = parseFloat(amountPerUnit)
    const times = Math.max(0, Math.floor(parseFloat(timesPerDay) || 0))
    if (!name.trim() || isNaN(amount) || amount < 0 || times < 0) return
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        amountPerUnit: amount,
        timesPerDay: times,
      },
    ])
    setName('')
    setAmountPerUnit('')
    setTimesPerDay('1')
  }

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Budget Planner
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Plan your daily budget (e.g. ₱50 per meal × 3 meals, ₱15 transpo × 1). We&apos;ll warn you if
          the total would exceed your monthly allowance.
        </p>
      </div>

      {allowanceAmount <= 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Set your monthly allowance first to see warnings. Go to <strong>Allowance</strong> to set
            it.
          </p>
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          Add planned item
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="planner-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name (e.g. Meals, Transpo)
            </label>
            <input
              id="planner-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meals"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="planner-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount per unit (₱)
            </label>
            <input
              id="planner-amount"
              type="number"
              min="0"
              step="0.01"
              value={amountPerUnit}
              onChange={(e) => setAmountPerUnit(e.target.value)}
              placeholder="50"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="planner-times" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Times per day
            </label>
            <input
              id="planner-times"
              type="number"
              min="0"
              step="1"
              value={timesPerDay}
              onChange={(e) => setTimesPerDay(e.target.value)}
              placeholder="3"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="touch-target w-full rounded-lg bg-indigo-600 py-2.5 px-4 font-medium text-white hover:bg-indigo-700 min-h-[44px]"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          Summary
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 p-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Planned per day</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              ₱{plannedPerDay.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 p-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Planned this month ({daysInMonth} days)
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              ₱{plannedPerMonth.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 p-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Your allowance</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              ₱{allowanceAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {allowanceAmount > 0 && exceedsAllowance && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="font-medium text-red-800 dark:text-red-200">Warning</p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Your planned budget for this month is <strong>₱{plannedPerMonth.toFixed(2)}</strong>,
              which exceeds your allowance of <strong>₱{allowanceAmount.toFixed(2)}</strong>. Reduce
              daily plans or increase allowance.
            </p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              To stay within your allowance over {daysInMonth} days, aim for about{' '}
              <strong>₱{suggestedDaily.toFixed(2)}</strong> per day (your plan is ₱
              {plannedPerDay.toFixed(2)}/day).
            </p>
          </div>
        )}

        {allowanceAmount > 0 && plannedPerMonth > 0 && !exceedsAllowance && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              Your plan (₱{plannedPerMonth.toFixed(2)} this month) is within your allowance (₱
              {allowanceAmount.toFixed(2)}).
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          Planned items
        </h2>
        {items.length === 0 ? (
          <p className="mt-3 text-slate-500 dark:text-slate-400">No items yet. Add one above.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item) => {
              const perDay = (Number(item.amountPerUnit) || 0) * (Math.max(0, Math.floor(Number(item.timesPerDay) || 0)))
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400">
                      ₱{Number(item.amountPerUnit).toFixed(2)} × {item.timesPerDay}/day
                      {perDay > 0 && (
                        <span className="ml-1">= ₱{perDay.toFixed(2)}/day</span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="touch-target self-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 min-h-[44px] sm:self-center"
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
