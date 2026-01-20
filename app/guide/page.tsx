import type { Metadata } from "next";
import Link from "next/link";
import GuideClient from "./GuideClient";

export const metadata: Metadata = {
  title: "Essential Guide for Traveling to China | Go to China",
  description: "Payments, internet, transportation, safety, etiquette and more.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <header className="print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-tight">Go to China</Link>
          <nav className="space-x-6 text-sm font-medium">
            <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900">How it works</Link>
            <Link href="/#sample" className="text-slate-600 hover:text-slate-900">Sample</Link>
            <span className="text-slate-900">Guide</span>
            <Link href="/#pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="card">
          <h1 className="text-4xl sm:text-5xl font-semibold">Essential guide for traveling to China</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Practical tips you can use before and during your trip.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/plan" className="btn-primary">Generate my trip</Link>
            <Link href="/result" className="btn-outline">View sample</Link>
          </div>
        </section>

        <section className="mt-8">
          <GuideClient />
        </section>

        <section className="mt-10">
          <div className="card flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Ready to generate your day-by-day plan?</h2>
              <p className="mt-2 text-sm text-slate-600">Answer five quick questions and get your personalized itinerary.</p>
            </div>
            <Link href="/plan" className="btn-primary">Generate my trip</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
