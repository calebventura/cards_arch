import { useState } from 'react';

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Safe: silently falls back to initialValue on parse errors or SSR.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const next = typeof value === 'function' ? value(storedValue) : value;
      setStoredValue(next);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.warn('[useLocalStorage] Could not persist value:', err);
    }
  };

  return [storedValue, setValue];
}
