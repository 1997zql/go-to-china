"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GTC_KEYS, writeSession } from "@/lib/gtcStorage";

export default function Page() {
  const router = useRouter();

  const [days, setDays] = useState<string>("7");
  const [style, setStyle] = useState<string>("Balanced");
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("Mid");
  const [firstTime, setFirstTime] = useState<string>("Yes");

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      days: Number(days),
      style,
      interests,
      budget,
      firstTime,
    } as const;

    try {
      writeSession(GTC_KEYS.inputs, JSON.stringify(payload));
    } catch (err) {
      // ignore
    }

    router.push(`/result`);
  }

  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-4 text-sm" style={{color: 'var(--gold)'}}>Step 1 of 1</div>

        <div className="mb-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Back to home</Link>
        </div>

        <header className="text-center mb-6">
          <h1 className="text-3xl font-semibold">Build your China itinerary</h1>
          <p className="mt-2 text-sm text-slate-600">Answer 5 questions to generate your plan.</p>
        </header>

        <form onSubmit={onSubmit} className="card">
          <div className="space-y-6">
            {/* Trip length */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Trip length (days)</label>
              <p className="text-xs muted">Choose how many days you'll spend in China</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {['3','5','7','10','14'].map((d) => (
                  <button key={d} type="button" onClick={() => setDays(d)} className={`px-3 py-1.5 rounded-full text-sm ${days===d? 'bg-[#9F1D22] text-white border border-[#9F1D22]':'bg-white border border-[#9F1D22] text-[#9F1D22]'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel style */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Travel style</label>
              <p className="text-xs muted">Pick the pace you prefer</p>
              <div className="mt-3 flex gap-2">
                {['Relaxed','Balanced','Packed'].map((s) => (
                  <button key={s} type="button" onClick={() => setStyle(s)} aria-pressed={style===s} className={`px-3 py-1.5 rounded-full text-sm ${style===s? 'bg-[#9F1D22] text-white border border-[#9F1D22]':'bg-white border border-[#9F1D22] text-[#9F1D22]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Interests</label>
              <p className="text-xs muted">Select up to 4 interests</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {['History','Nature','Food','City'].map((it) => (
                  <button key={it} type="button" onClick={() => toggleInterest(it)} className={`px-3 py-1.5 rounded-full text-sm ${interests.includes(it)? 'bg-[#9F1D22] text-white border border-[#9F1D22]':'bg-white border border-[#9F1D22] text-[#9F1D22]'}`}>
                    {it}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Budget</label>
              <p className="text-xs muted">Helps tailor accommodation & dining suggestions</p>
              <div className="mt-3 flex gap-2">
                {['Budget','Mid','Luxury'].map((b) => (
                  <button key={b} type="button" onClick={() => setBudget(b)} className={`px-3 py-1.5 rounded-full text-sm ${budget===b? 'bg-[#9F1D22] text-white border border-[#9F1D22]':'bg-white border border-[#9F1D22] text-[#9F1D22]'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* First time */}
            <div>
              <label className="block text-sm font-medium text-slate-700">First time in China?</label>
              <p className="text-xs muted">Helpful tips for first-time visitors</p>
              <div className="mt-3 flex gap-2">
                {['Yes','No'].map((v) => (
                  <button key={v} type="button" onClick={() => setFirstTime(v)} className={`px-3 py-1.5 rounded-full text-sm ${firstTime===v? 'bg-[#9F1D22] text-white border border-[#9F1D22]':'bg-white border border-[#9F1D22] text-[#9F1D22]'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn-primary">Generate plan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
