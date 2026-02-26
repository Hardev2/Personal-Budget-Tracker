import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getTotalPerCategory } from '../utils/calculations'

const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

/**
 * Pie chart for category breakdown of expenses.
 */
export function CategoryPieChart({ expenses }) {
  const byCategory = getTotalPerCategory(expenses)
  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
        No expense data for this month.
      </div>
    )
  }

  return (
    <div className="h-48 w-full sm:h-[280px]" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="65%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Amount']} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
