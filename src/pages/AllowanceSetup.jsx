import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS, DEFAULT_ALLOWANCE } from '../utils/storage'

export function AllowanceSetup() {
  const [allowance, setAllowance] = useLocalStorage(STORAGE_KEYS.ALLOWANCE, DEFAULT_ALLOWANCE)
  const [amount, setAmount] = useState(allowance.amount?.toString() ?? '')
  const [startDate, setStartDate] = useState(allowance.startDate ?? DEFAULT_ALLOWANCE.startDate)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num < 0) return
    setAllowance({ amount: num, startDate })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Allowance Setup</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
        Set your monthly allowance and the start date of your budget period. You can edit these anytime.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Monthly allowance
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Start date of allowance
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="touch-target w-full rounded-lg bg-indigo-600 text-white py-2.5 px-4 font-medium hover:bg-indigo-700 transition-colors min-h-[44px]"
        >
          Save
        </button>
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">Allowance saved to LocalStorage.</p>
        )}
      </form>
    </div>
  )
}
