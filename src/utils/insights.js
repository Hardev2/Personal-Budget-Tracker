/**
 * Smart insight engine (logic-based, no AI API).
 * Returns an array of insight messages based on allowance and expenses.
 */

import {
  getExpensesInCurrentMonth,
  getTotalExpenses,
  getTotalPerCategory,
  getRemainingBalance,
  getRemainingDays,
  getDailyBudgetSuggestion,
  getPercentageSpent,
} from './calculations'

const HIGH_SPENDING_THRESHOLD = 0.7 // 70% of daily budget considered "high"
const CONSECUTIVE_DAYS = 3

/**
 * Get all insights for the dashboard.
 * @param {{ amount: number, startDate: string }} allowance
 * @param {Array<{ amount: number, category: string, date: string }>} expenses
 * @returns {string[]} Array of insight messages
 */
export function getInsights(allowance, expenses) {
  const messages = []
  if (!allowance || allowance.amount <= 0) return messages

  const expensesInMonth = getExpensesInCurrentMonth(expenses, allowance.startDate)
  const totalSpent = getTotalExpenses(expensesInMonth)
  const remainingBalance = getRemainingBalance(allowance.amount, expensesInMonth)
  const remainingDays = getRemainingDays(allowance.startDate)
  const dailyBudget = getDailyBudgetSuggestion(remainingBalance, remainingDays)
  const percentSpent = getPercentageSpent(totalSpent, allowance.amount)
  const byCategory = getTotalPerCategory(expensesInMonth)

  // Highest spending category
  const categories = Object.entries(byCategory)
  if (categories.length > 0) {
    const [topCategory] = categories.sort((a, b) => b[1] - a[1])
    messages.push(`${topCategory[0]} is your highest spending category.`)
  }

  // Warn if spent more than 70% of allowance
  if (percentSpent >= 70) {
    messages.push(`You have already used ${Math.round(percentSpent)}% of your allowance.`)
  }

  // Today's expense vs daily budget
  const todayStr = new Date().toISOString().slice(0, 10)
  const todayExpenses = expensesInMonth.filter((e) => e.date === todayStr)
  const todaySpent = getTotalExpenses(todayExpenses)
  if (dailyBudget > 0 && todaySpent > dailyBudget) {
    messages.push("You are overspending compared to your daily budget.")
  }

  // 3 consecutive days of high spending
  if (hasConsecutiveHighSpendingDays(expensesInMonth, allowance.startDate, dailyBudget)) {
    messages.push("You have spent a lot for 3 days straight.")
  }

  return messages
}

/**
 * Check if there are 3 consecutive days where spending exceeded the threshold of daily budget.
 * Uses current month's daily average as fallback when remaining days is 0.
 */
function hasConsecutiveHighSpendingDays(expensesInMonth, startDate, dailyBudgetSuggestion) {
  const byDate = {}
  expensesInMonth.forEach((e) => {
    byDate[e.date] = (byDate[e.date] || 0) + (Number(e.amount) || 0)
  })

  const dates = Object.keys(byDate).sort()
  if (dates.length < CONSECUTIVE_DAYS) return false

  // Use daily budget; if 0 (e.g. last day), skip this check
  if (dailyBudgetSuggestion <= 0) return false
  const threshold = dailyBudgetSuggestion * HIGH_SPENDING_THRESHOLD

  for (let i = 0; i <= dates.length - CONSECUTIVE_DAYS; i++) {
    const slice = dates.slice(i, i + CONSECUTIVE_DAYS)
    const consecutive = slice.every((d, j) => {
      if (j === 0) return true
      const prev = new Date(slice[j - 1])
      const curr = new Date(d)
      prev.setDate(prev.getDate() + 1)
      return prev.getTime() === curr.getTime()
    })
    if (!consecutive) continue
    const allHigh = slice.every((d) => (byDate[d] || 0) >= threshold)
    if (allHigh) return true
  }
  return false
}
