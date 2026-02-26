import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { getExpensesInCurrentMonth } from '../utils/calculations'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseList } from '../components/ExpenseList'

export function ExpensesPage() {
  const [allowance] = useLocalStorage(STORAGE_KEYS.ALLOWANCE, { amount: 0, startDate: new Date().toISOString().slice(0, 10) })
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEYS.EXPENSES, [])
  const [showForm, setShowForm] = useState(false)

  const expensesInMonth = getExpensesInCurrentMonth(expenses, allowance.startDate)

  const handleAdd = (exp) => {
    setExpenses((prev) => [...prev.filter((e) => e.id !== exp.id), exp])
    setShowForm(false)
  }

  const handleUpdate = (updated) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Expenses</h1>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="touch-target w-full sm:w-auto rounded-lg bg-indigo-600 text-white py-2.5 px-4 font-medium hover:bg-indigo-700 min-h-[44px]"
        >
          {showForm ? 'Cancel' : 'Add expense'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">New expense</h2>
          <ExpenseForm onSubmit={handleAdd} />
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 overflow-hidden">
        <h2 className="text-base font-semibold mb-2 sm:mb-3 sm:text-lg">This month&apos;s expenses</h2>
        <ExpenseList
          expenses={expensesInMonth}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
