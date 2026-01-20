"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGtcState } from "@/hooks/useGtcState";

export default function CheckoutPage() {
  const router = useRouter();
  const { markUnlocked, resetAll } = useGtcState();

  function onConfirm() {
    // TODO: Replace with real payment flow (Stripe checkout) and unlock on success.
    markUnlocked();
    router.push("/result");
  }

  function onReset() {
    const confirmed = window.confirm("Reset all local plan data?");
    if (!confirmed) return;
    resetAll();
    router.push("/");
  }

  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 text-sm text-slate-600">
          <Link href="/result" className="hover:text-slate-900">← Back to plan</Link>
        </div>

        <div className="card">
          <h1 className="text-3xl font-semibold">Unlock full plan ($9)</h1>
          <p className="mt-3 text-sm text-slate-600">
            Beta: no real payment. Click confirm to unlock.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={onConfirm} className="btn-primary">
              Confirm unlock
            </button>
            <Link href="/result" className="btn-outline">
              Return to plan
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            For testing: reset clears all gtc_* local data.
          </div>
          <button onClick={onReset} className="mt-2 text-xs text-slate-500 hover:text-slate-700">
            Reset (dev)
          </button>
        </div>
      </main>
    </div>
  );
}
