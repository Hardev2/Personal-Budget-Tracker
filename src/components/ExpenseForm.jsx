import { useState } from 'react'
import { EXPENSE_CATEGORIES } from '../utils/constants'

/**
 * Form to add or edit an expense.
 * @param {{ expense?: object, onSubmit: function, onCancel?: function }} props
 */
export function ExpenseForm({ expense, onSubmit, onCancel }) {
  const isEdit = Boolean(expense?.id)
  const [amount, setAmount] = useState(expense?.amount?.toString() ?? '')
  const [category, setCategory] = useState(expense?.category ?? 'Others')
  const [description, setDescription] = useState(expense?.description ?? '')
  const [date, setDate] = useState(expense?.date ?? new Date().toISOString().slice(0, 10))

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return
    onSubmit({
      id: expense?.id ?? crypto.randomUUID(),
      amount: num,
      category,
      description: description.trim(),
      date,
    })
    if (!isEdit) {
      setAmount('')
      setDescription('')
      setCategory('Others')
      setDate(new Date().toISOString().slice(0, 10))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
          placeholder="Optional"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
          required
        />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="submit"
          className="touch-target flex-1 rounded-lg bg-indigo-600 text-white py-2.5 px-4 font-medium hover:bg-indigo-700 min-h-[44px]"
        >
          {isEdit ? 'Update' : 'Add'} expense
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="touch-target rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
