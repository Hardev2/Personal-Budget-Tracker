/**
 * Budget calculation utilities.
 * All functions work on allowance + expenses; no side effects.
 */

/**
 * Get start and end of current allowance month (based on startDate).
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @returns {{ start: Date, end: Date }}
 */
export function getAllowanceMonthRange(startDate) {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)
  end.setDate(0) // last day of month
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * Filter expenses to current allowance month.
 * @param {Array<{ date: string }>} expenses
 * @param {string} startDate
 * @returns {Array}
 */
export function getExpensesInCurrentMonth(expenses, startDate) {
  const { start, end } = getAllowanceMonthRange(startDate)
  return expenses.filter((e) => {
    const d = new Date(e.date)
    return d >= start && d <= end
  })
}

/**
 * Total expenses (optionally filtered list).
 * @param {Array<{ amount: number }>} expenses
 * @returns {number}
 */
export function getTotalExpenses(expenses) {
  return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

/**
 * Remaining balance: allowance - total spent this month.
 */
export function getRemainingBalance(allowanceAmount, expensesInMonth) {
  const total = getTotalExpenses(expensesInMonth)
  return Math.max(0, (Number(allowanceAmount) || 0) - total)
}

/**
 * Remaining days in current allowance month (from today).
 * @param {string} startDate
 * @returns {number}
 */
export function getRemainingDays(startDate) {
  const { end } = getAllowanceMonthRange(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDay = new Date(end)
  endDay.setHours(0, 0, 0, 0)
  const diff = Math.ceil((endDay - today) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff + 1) // include today
}

/**
 * Daily budget suggestion: remaining balance / remaining days.
 */
export function getDailyBudgetSuggestion(remainingBalance, remainingDays) {
  if (remainingDays <= 0) return 0
  return remainingBalance / remainingDays
}

/**
 * Total spent per category.
 * @param {Array<{ category: string, amount: number }>} expenses
 * @returns {Record<string, number>}
 */
export function getTotalPerCategory(expenses) {
  const byCategory = {}
  expenses.forEach((e) => {
    const cat = e.category || 'Others'
    byCategory[cat] = (byCategory[cat] || 0) + (Number(e.amount) || 0)
  })
  return byCategory
}

/**
 * Percentage of allowance spent.
 * @param {number} totalSpent
 * @param {number} allowanceAmount
 * @returns {number} 0-100
 */
export function getPercentageSpent(totalSpent, allowanceAmount) {
  if (!allowanceAmount || allowanceAmount <= 0) return 0
  return Math.min(100, (totalSpent / allowanceAmount) * 100)
}

/**
 * Number of days in the current allowance month (for planner).
 * @param {string} startDate - ISO date string
 * @returns {number}
 */
export function getDaysInAllowanceMonth(startDate) {
  const { start, end } = getAllowanceMonthRange(startDate)
  const oneDay = 1000 * 60 * 60 * 24
  return Math.round((end - start) / oneDay) + 1
}
