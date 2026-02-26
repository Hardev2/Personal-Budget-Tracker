import { useState, useCallback } from 'react'

/**
 * Custom hook for syncing state with LocalStorage.
 * Safely initializes from localStorage; falls back to initialValue if key is missing or invalid.
 * @param {string} key - LocalStorage key
 * @param {*} initialValue - Default value when key is empty
 * @returns {[*, function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      return JSON.parse(item)
    } catch (error) {
      console.warn(`useLocalStorage: error reading "${key}"`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`useLocalStorage: error writing "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
