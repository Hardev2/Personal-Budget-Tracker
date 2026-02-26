/**
 * LocalStorage keys used by the app.
 * Initialize safely when keys are missing.
 */

export const STORAGE_KEYS = {
  ALLOWANCE: 'allowanceData',
  EXPENSES: 'expenses',
  PLANNER: 'plannerItems',
}

/**
 * Get parsed data from localStorage or default.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = window.localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}

/**
 * Save data to localStorage.
 * @param {string} key
 * @param {*} value
 */
export function setToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('setToStorage failed', e)
  }
}

/**
 * Default allowance shape when none is set.
 */
export const DEFAULT_ALLOWANCE = {
  amount: 0,
  startDate: new Date().toISOString().slice(0, 10),
}

/**
 * Get allowance data, initializing if empty.
 */
export function getAllowanceData() {
  const data = getFromStorage(STORAGE_KEYS.ALLOWANCE, null)
  if (!data || typeof data.amount !== 'number') {
    return { ...DEFAULT_ALLOWANCE }
  }
  return {
    amount: data.amount,
    startDate: data.startDate || DEFAULT_ALLOWANCE.startDate,
  }
}

/**
 * Get expenses array, initializing if empty.
 */
export function getExpenses() {
  const data = getFromStorage(STORAGE_KEYS.EXPENSES, null)
  if (!Array.isArray(data)) return []
  return data
}
