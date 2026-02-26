import { useState } from 'react'
import { ExpenseForm } from './ExpenseForm'

/**
 * List of expenses with edit/delete. Expects expenses for current month or all.
 */
export function ExpenseList({ expenses, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)

  const handleUpdate = (updated) => {
    onUpdate(updated)
    setEditingId(null)
  }

  if (expenses.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400 py-4">No expenses yet. Add one above.</p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {expenses
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((exp) => (
          <li key={exp.id} className="py-3">
            {editingId === exp.id ? (
              <ExpenseForm
                expense={exp}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {exp.category}
                  </span>
                  {exp.description && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1 sm:ml-2">
                      — {exp.description}
                    </span>
                  )}
                  <span className="block text-sm text-slate-500 dark:text-slate-400">{exp.date}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                    ₱{Number(exp.amount).toFixed(2)}
                  </span>
                  <span className="flex gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(exp.id)}
                      className="touch-target min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(exp.id)}
                      className="touch-target min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
    </ul>
  )
}
