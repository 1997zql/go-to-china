"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGtcState } from "@/hooks/useGtcState";

export default function SuccessPage() {
  const router = useRouter();
  const { markUnlocked } = useGtcState();

  useEffect(() => {
    markUnlocked();
    const timer = setTimeout(() => {
      router.replace("/result?paid=1");
    }, 800);
    return () => clearTimeout(timer);
  }, [markUnlocked, router]);

  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="card text-center">
          <h1 className="text-2xl font-semibold">Payment successful</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your plan is now unlocked. Redirecting to your itinerary…
          </p>
          <div className="mt-6">
            <Link href="/result?paid=1" className="btn-primary">
              Go to my plan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
