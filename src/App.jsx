import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { AllowanceSetup } from './pages/AllowanceSetup'
import { ExpensesPage } from './pages/ExpensesPage'
import { PlannerPage } from './pages/PlannerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="allowance" element={<AllowanceSetup />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
