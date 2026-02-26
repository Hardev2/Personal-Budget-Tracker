# Allowance Budget Tracker

A personal allowance budget tracker built with **React (Vite)**, **Tailwind CSS**, **Recharts**, and **LocalStorage** only — no backend or database.

## Features

- **Allowance setup**: Set monthly allowance and start date; edit anytime.
- **Expense management**: Add, edit, delete expenses (amount, category, description, date).
- **Automatic calculations**: Total spent, remaining balance, daily budget suggestion, total per category, percentage spent.
- **Smart insights**: Highest spending category, 70% allowance warning, daily budget overspend warning, 3 consecutive high-spending days.
- **Dashboard**: Summary cards, budget progress bar, pie chart (categories), line chart (spending over time).
- **Bonus**: Dark mode toggle, reset month, export expenses to JSON.

## Project structure

```
src/
  components/     # Layout, Nav, DarkModeToggle, ExpenseForm, ExpenseList, BudgetProgressBar
  pages/          # Dashboard, AllowanceSetup, ExpensesPage
  hooks/          # useLocalStorage
  utils/          # storage, calculations, insights, constants, exportData
  charts/         # CategoryPieChart, SpendingLineChart
  data/           # exampleData.js
  App.jsx
  main.jsx
  index.css
```

## LocalStorage keys

- `allowanceData`: `{ amount: number, startDate: "YYYY-MM-DD" }`
- `expenses`: array of `{ id, amount, category, description, date }`
- `allowance-tracker-theme`: `true` | `false` for dark mode

## Setup

1. **Install dependencies**

   ```bash
   cd C:\xampp\htdocs\allowance-budget-tracker
   npm install
   ```

2. **Run dev server**

   ```bash
   npm run dev
   ```

3. Open the URL shown (e.g. `http://localhost:5173`).

## Build

```bash
npm run build
```

Output is in `dist/`. You can serve it from XAMPP by pointing the document root to `dist` or copying `dist` contents into `htdocs`.

## Example data

To try the app with sample data, in the browser console run:

```js
localStorage.setItem('allowanceData', JSON.stringify({ amount: 5000, startDate: new Date().toISOString().slice(0, 10) }))
localStorage.setItem('expenses', JSON.stringify([
  { id: '1', amount: 150, category: 'Food', description: 'Lunch', date: new Date().toISOString().slice(0, 10) },
  { id: '2', amount: 50, category: 'Transportation', description: 'Jeepney', date: new Date().toISOString().slice(0, 10) },
]))
location.reload()
```

Or import `EXAMPLE_ALLOWANCE` and `EXAMPLE_EXPENSES` from `src/data/exampleData.js` and set them via your state/hooks in a "Load example" button.

## Tech stack

- React 18
- Vite 5
- React Router 6
- Tailwind CSS 3
- Recharts 2
- LocalStorage only

## License

MIT.
