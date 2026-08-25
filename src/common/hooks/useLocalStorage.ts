import { useCallback, useEffect, useState } from 'react';

/**
 * Persist a state value in localStorage. Falls back gracefully if storage is unavailable
 * (e.g. SSR or private browsing).
 */
export function useLocalStorage<T = string>(
  key: string,
  initialValue?: T,
): [T | undefined, (_value: T | undefined | ((_prev: T | undefined) => T)) => void] {
  const readValue = useCallback((): T | undefined => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T | undefined>(readValue);

  const setStoredValue = useCallback(
    (next: T | undefined | ((_prev: T | undefined) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function'
            ? (next as (_prev: T | undefined) => T)(prev)
            : next;
        if (typeof window !== 'undefined') {
          try {
            if (resolved === undefined) {
              window.localStorage.removeItem(key);
            } else {
              window.localStorage.setItem(key, JSON.stringify(resolved));
            }
          } catch {
            // ignore quota / privacy errors
          }
        }
        return resolved;
      });
    },
    [key],
  );

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setStoredValue];
}
