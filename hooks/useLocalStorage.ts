import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((value: T) => void)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return setStoredValue((old) => {
        const parsed = JSON.parse(item || JSON.stringify(initialValue))
        if (JSON.stringify(parsed) !== JSON.stringify(old)) {
          return parsed;
        } else {
          return old;
        }
      });
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      setStoredValue(initialValue);
    }
  }, [initialValue, key]);
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue as (value: T | ((value: T) => void)) => void];
}