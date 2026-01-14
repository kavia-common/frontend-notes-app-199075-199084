import { useEffect, useState } from "react";

/**
 * Safely parse JSON; returns fallback on any error.
 */
function safeParse(value, fallback) {
  try {
    if (value == null) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    const raw = window.localStorage.getItem(key);
    const parsed = safeParse(raw, initialValue);

    // Ensure array/object primitives are preserved; if someone stored something invalid, fall back.
    if (parsed === null || parsed === undefined) return initialValue;
    return parsed;
  });

  useEffect(() => {
    // Persist any updates (avoid throwing for circular structures by keeping notes plain).
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Intentionally no-op; storage may be full or blocked.
    }
  }, [key, state]);

  return [state, setState];
}
