export const GTC_KEYS = {
  state: "gtc_state",
  inputs: "gtc_plan_inputs",
  output: "gtc_plan_output",
  paid: "gtc_paid",
} as const;

export function readLocal(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    return null;
  }
}

export function writeLocal(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    // ignore
  }
}

export function removeLocal(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    // ignore
  }
}

export function readSession(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch (err) {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch (err) {
    // ignore
  }
}

export function removeSession(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch (err) {
    // ignore
  }
}

export function clearGtcLocal() {
  if (typeof window === "undefined") return;
  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith("gtc_")) window.localStorage.removeItem(key);
    });
  } catch (err) {
    // ignore
  }
}

export function clearGtcSession() {
  if (typeof window === "undefined") return;
  try {
    Object.keys(window.sessionStorage).forEach((key) => {
      if (key.startsWith("gtc_")) window.sessionStorage.removeItem(key);
    });
  } catch (err) {
    // ignore
  }
}
