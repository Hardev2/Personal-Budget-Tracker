import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'

/**
 * Single savings entry: amount put away, date, optional note.
 * @typedef {{ id: string, amount: number, date: string, note: string }} SavingsEntry
 */

function getTotalSaved(entries) {
  if (!Array.isArray(entries)) return 0
  return entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

export function SavingsPage() {
  const [entries, setEntries] = useLocalStorage(STORAGE_KEYS.SAVINGS, [])
  const [goal, setGoal] = useLocalStorage(STORAGE_KEYS.SAVINGS_GOAL, 0)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  const totalSaved = getTotalSaved(entries)
  const goalAmount = Number(goal) || 0
  const progressPercent = goalAmount > 0 ? Math.min(100, (totalSaved / goalAmount) * 100) : 0

  const resetForm = () => {
    setAmount('')
    setDate(new Date().toISOString().slice(0, 10))
    setNote('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return
    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId ? { ...entry, amount: num, date, note: note.trim() } : entry
        )
      )
    } else {
      setEntries((prev) => [
        ...prev,
        { id: crypto.randomUUID(), amount: num, date, note: note.trim() },
      ])
    }
    resetForm()
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setAmount(entry.amount.toString())
    setDate(entry.date)
    setNote(entry.note || '')
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this savings entry?')) {
      setEntries((prev) => prev.filter((e) => e.id !== id))
      if (editingId === id) resetForm()
    }
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Savings</h1>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="touch-target w-full sm:w-auto rounded-lg bg-emerald-600 text-white py-2.5 px-4 font-medium hover:bg-emerald-700 min-h-[44px]"
        >
          {showForm ? 'Cancel' : 'Add savings'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-white dark:bg-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total saved</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-2xl">
            ₱{totalSaved.toFixed(2)}
          </p>
        </div>
        {goalAmount > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-white dark:bg-slate-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              ₱{goalAmount.toFixed(2)}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {progressPercent.toFixed(0)}% reached
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          Savings goal (optional)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Set a target to track progress.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={goalAmount === 0 ? '' : goalAmount}
            onChange={(e) => {
              const v = e.target.value
              setGoal(v === '' ? 0 : (parseFloat(v) || 0))
            }}
            placeholder="0"
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
          />
          <span className="flex items-center text-slate-500 dark:text-slate-400">₱</span>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">
            {editingId ? 'Edit entry' : 'New savings entry'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount (₱)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. From allowance"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="touch-target flex-1 rounded-lg bg-emerald-600 text-white py-2.5 px-4 font-medium hover:bg-emerald-700 min-h-[44px]"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="touch-target rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 overflow-hidden">
        <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">Savings history</h2>
        {sortedEntries.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-4">
            No savings entries yet. Add one above to start tracking.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedEntries.map((entry) => (
              <li key={entry.id} className="py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      +₱{Number(entry.amount).toFixed(2)}
                    </span>
                    {entry.note && (
                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                        — {entry.note}
                      </span>
                    )}
                    <span className="block text-sm text-slate-500 dark:text-slate-400">
                      {entry.date}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(entry)}
                      className="touch-target min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="touch-target min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
