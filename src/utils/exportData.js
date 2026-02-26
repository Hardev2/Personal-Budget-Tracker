/**
 * Export expenses to JSON file (download).
 * @param {Array} expenses
 */
export function exportExpensesToJson(expenses) {
  const data = {
    exportedAt: new Date().toISOString(),
    expenses: expenses || [],
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `allowance-expenses-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
