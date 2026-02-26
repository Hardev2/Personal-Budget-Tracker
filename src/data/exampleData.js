/**
 * Example data for demo or initial load.
 * Use in browser console or add a "Load example" button that calls:
 *   setAllowance(EXAMPLE_ALLOWANCE)
 *   setExpenses(EXAMPLE_EXPENSES)
 */

export const EXAMPLE_ALLOWANCE = {
  amount: 5000,
  startDate: new Date().toISOString().slice(0, 10),
}

export const EXAMPLE_EXPENSES = [
  { id: '1', amount: 150, category: 'Food', description: 'Lunch', date: new Date().toISOString().slice(0, 10) },
  { id: '2', amount: 50, category: 'Transportation', description: 'Jeepney', date: new Date().toISOString().slice(0, 10) },
  { id: '3', amount: 200, category: 'School', description: 'Photocopy', date: new Date().toISOString().slice(0, 10) },
  { id: '4', amount: 80, category: 'Entertainment', description: 'Snacks', date: new Date().toISOString().slice(0, 10) },
  { id: '5', amount: 120, category: 'Food', description: 'Dinner', date: new Date().toISOString().slice(0, 10) },
]
