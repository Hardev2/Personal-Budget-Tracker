import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Line chart: spending over time (daily totals for current month).
 */
export function SpendingLineChart({ expenses, startDate }) {
  const byDate = {}
  expenses.forEach((e) => {
    const d = e.date
    byDate[d] = (byDate[d] || 0) + (Number(e.amount) || 0)
  })

  const start = new Date(startDate)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)

  const points = []
  const curr = new Date(start)
  while (curr <= end) {
    const dateStr = curr.toISOString().slice(0, 10)
    points.push({
      date: dateStr,
      day: curr.getDate(),
      spent: byDate[dateStr] || 0,
    })
    curr.setDate(curr.getDate() + 1)
  }

  if (points.every((p) => p.spent === 0)) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
        No spending data for this month.
      </div>
    )
  }

  return (
    <div className="h-48 w-full sm:h-[280px]" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 5, right: 8, left: -8, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} tickMargin={4} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₱${v}`} width={40} />
          <Tooltip
            formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Spent']}
            labelFormatter={(_, payload) => payload[0]?.payload?.date}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="spent"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Spent"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
