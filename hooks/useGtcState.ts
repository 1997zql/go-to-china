"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GTC_KEYS,
  readLocal,
  readSession,
  writeLocal,
  clearGtcLocal,
  clearGtcSession,
} from "@/lib/gtcStorage";

export type GtcState = "idle" | "generated" | "unlocked";

function normalizeState(value: string | null): GtcState | null {
  if (value === "idle" || value === "generated" || value === "unlocked") return value;
  return null;
}

export function useGtcState() {
  const [state, setState] = useState<GtcState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Local storage keeps unlock state across refresh; session storage gates plan availability.
    const storedState = normalizeState(readLocal(GTC_KEYS.state));
    const paid = readLocal(GTC_KEYS.paid);
    const hasOutput = Boolean(readSession(GTC_KEYS.output));

    let nextState: GtcState = "idle";
    if (paid === "true" || storedState === "unlocked") {
      nextState = "unlocked";
    } else if (hasOutput || storedState === "generated") {
      nextState = "generated";
    }

    setState(nextState);
    setHydrated(true);

    if (nextState !== storedState) {
      writeLocal(GTC_KEYS.state, nextState);
    }
  }, []);

  const markGenerated = useCallback(() => {
    setState((prev) => {
      if (prev === "unlocked") return prev;
      writeLocal(GTC_KEYS.state, "generated");
      return "generated";
    });
  }, []);

  const markUnlocked = useCallback(() => {
    writeLocal(GTC_KEYS.state, "unlocked");
    writeLocal(GTC_KEYS.paid, "true");
    setState("unlocked");
  }, []);

  const resetAll = useCallback(() => {
    clearGtcLocal();
    clearGtcSession();
    setState("idle");
  }, []);

  return {
    state,
    hydrated,
    markGenerated,
    markUnlocked,
    resetAll,
  };
}
