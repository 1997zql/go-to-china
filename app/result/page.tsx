"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GTC_KEYS, readSession, writeSession } from "@/lib/gtcStorage";
import { useGtcState } from "@/hooks/useGtcState";

type PlanInputs = {
  days: number;
  style: string;
  interests: string[];
  budget: string;
  firstTime: string;
};

type PlanOutput = {
  summary: string;
  chapters: { title: string; content: string }[];
};

type DayBlock = {
  title: string;
  weather?: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  food?: string;
  transport?: string;
  tip?: string;
};

function parseDayBlocks(content: string): DayBlock[] {
  const blocks = content
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const [titleLine, ...rest] = lines;
    const result: DayBlock = { title: titleLine || "Day plan" };

    for (const line of rest) {
      const lower = line.toLowerCase();
      if (lower.startsWith("weather:")) result.weather = line.slice(8).trim();
      else if (lower.startsWith("morning:")) result.morning = line.slice(8).trim();
      else if (lower.startsWith("afternoon:")) result.afternoon = line.slice(10).trim();
      else if (lower.startsWith("evening:")) result.evening = line.slice(8).trim();
      else if (lower.startsWith("food:")) result.food = line.slice(5).trim();
      else if (lower.startsWith("transport:")) result.transport = line.slice(10).trim();
      else if (lower.startsWith("local tip:")) result.tip = line.slice(10).trim();
      else if (lower.startsWith("tip:")) result.tip = line.slice(4).trim();
    }

    return result;
  });
}

export default function ResultPage() {
  const router = useRouter();
  const { state, hydrated, markGenerated, resetAll } = useGtcState();
  const [inputs, setInputs] = useState<PlanInputs | null>(null);
  const [planOutput, setPlanOutput] = useState<PlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const hasRequested = useRef(false);

  useEffect(() => {
    // read session inputs
    try {
      const raw = readSession(GTC_KEYS.inputs);
      if (raw) {
        const p = JSON.parse(raw);
        const normalized: PlanInputs = {
          days: Number(p.days) || 7,
          style: p.style || "Balanced",
          interests: Array.isArray(p.interests) ? p.interests : [],
          budget: p.budget || "Mid",
          firstTime: p.firstTime || "Yes",
        };
        setInputs(normalized);
      }
    } catch (e) {
      // ignore
    }

    // read cached output
    try {
      const cached = readSession(GTC_KEYS.output);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.chapters?.length) {
          setPlanOutput(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!inputs || planOutput || hasRequested.current) return;
    hasRequested.current = true;
    setIsLoading(true);
    setErrorMessage(null);
    setShowProgress(true);

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        days: inputs.days,
        style: inputs.style,
        interests: inputs.interests,
        budget: inputs.budget,
        firstTime: inputs.firstTime,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          if (data?.error) {
            throw new Error(data.error);
          }
          throw new Error("Failed to generate plan. Please try again.");
        }
        return data;
      })
      .then((data: PlanOutput) => {
        setPlanOutput(data);
        writeSession(GTC_KEYS.output, JSON.stringify(data));
        markGenerated();
      })
      .catch((err: Error) => {
        // Show the real error from the API so we can debug (model not found / 401 / 429 / timeout, etc.)
        hasRequested.current = false;
        const msg = err?.message || "Failed to generate plan. Please try again.";
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputs, planOutput, markGenerated]);

  function onResetConfirm() {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm("Reset payment status for this device?");
    if (confirmed) {
      resetAll();
      router.push("/");
    }
  }

  function onDownload() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  const chapters = useMemo(() => {
    if (!planOutput) return [];
    return planOutput.chapters || [];
  }, [planOutput]);
  const isUnlocked = state === "unlocked";
  const hasLockedChapters = !isUnlocked && chapters.length > 3;
  // Show unlock bar as long as we have locked chapters and not unlocked.
  // (Some state transitions can be missed after refactors / hydration.)    
  const showUnlockBar = hasLockedChapters;

  useEffect(() => {
    if (!chapters.length) return;
    setOpenChapters((prev) => {
      if (Object.keys(prev).length) return prev;
      const initial: Record<number, boolean> = {};
      chapters.forEach((_, idx) => {
        initial[idx] = idx < 3;
      });
      return initial;
    });
  }, [chapters]);

  useEffect(() => {
    if (!hydrated || !planOutput) return;
    if (state === "idle") {
      markGenerated();
    }
  }, [hydrated, planOutput, state, markGenerated]);

  useEffect(() => {
    if (!showProgress) return;

    let progressTimer: ReturnType<typeof setInterval> | null = null;
    let stageTimer: ReturnType<typeof setInterval> | null = null;

    if (isLoading) {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const bump = 1 + Math.floor(Math.random() * 3);
          return Math.min(90, prev + bump);
        });
      }, 160);

      stageTimer = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % 5);
      }, 1200);
    } else {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
        setStageIndex(0);
      }, 600);
      return () => clearTimeout(hideTimer);
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (stageTimer) clearInterval(stageTimer);
    };
  }, [isLoading, showProgress]);
  if (!inputs) {
    return (
      <div className="min-h-screen text-slate-800 antialiased">
        <header className="print:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">Go to China</Link>
            <nav className="text-sm">
              <Link href="/plan" className="text-slate-600 hover:text-slate-900">Edit answers</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="card">
            <h1 className="text-2xl font-semibold">No plan yet</h1>
            <p className="mt-3 text-sm text-slate-600">Please answer a few questions to generate your trip plan.</p>
            <div className="mt-6">
              <Link href="/plan" className="btn-primary">Go to planner</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const overview =
    planOutput?.summary ||
    `A ${inputs.days}-day ${inputs.style.toLowerCase()} trip focused on ${
      inputs.interests.length ? inputs.interests.join(", ") : "general experiences"
    }. Budget: ${inputs.budget}. ${
      inputs.firstTime === "Yes" ? "Includes first-timer tips." : ""
    }`;

  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <header className="print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">Go to China</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/plan" className="text-slate-600 hover:text-slate-900">Edit answers</Link>
            <button onClick={onResetConfirm} className="text-xs text-slate-400 hover:text-slate-600">Reset (dev)</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {showProgress && (
          <div className={`mb-6 transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"}`}>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, rgba(159,29,34,0.9), rgba(212,175,55,0.75))",
                  transition: "width 160ms ease-out",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">Usually 10–20 seconds</div>
            <div className="mt-1 text-sm text-slate-700">
              {[
                "Planning route & cities…",
                "Adding day-by-day itinerary…",
                "Choosing local tips…",
                "Packing essentials…",
                "Finishing touches…",
              ][stageIndex]}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.days} days</div>
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.style}</div>
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.budget}</div>
          </div>
          <div className="print:hidden">
            {isUnlocked ? (
              <div className="flex items-center gap-3">
                <button onClick={onDownload} className="btn-primary">Download PDF</button>
                <div className="text-xs text-slate-500">Print or save as PDF</div>
              </div>
            ) : null}
          </div>
        </div>

        <section className="mb-6">
          <h1 className="text-2xl font-semibold">Your China trip plan</h1>
          <p className="mt-2 text-sm text-slate-600">{overview}</p>
        </section>

        <section id="chapters" className="space-y-6" data-print-content>
          {isLoading && (
            <div className="space-y-4">
              <div className="text-sm text-slate-600">Generating your personalized plan...</div>
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="card animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-5/6 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="card">
              <div className="text-sm text-slate-700">{errorMessage}</div>
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            chapters.map((ch, idx) => {
              const locked = idx >= 3 && !isUnlocked; // chapters 4-6 locked when not paid
              const icons = ["🗺️", "📅", "⭐", "🚄", "💳", "🧧"];
              const dayBlocks = idx === 1 ? parseDayBlocks(ch.content) : [];
              const paragraphs =
                idx !== 1
                  ? ch.content
                      .split(/\n\n+/)
                      .flatMap((para) => para.split(/\n+/))
                      .map((para) => para.trim())
                      .filter(Boolean)
                  : [];

              const isOpen = !!openChapters[idx];
              const shouldBlur = locked && isOpen;

              return (
                <article key={ch.title} className="relative card">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl gold-text">{icons[idx] || "📌"}</div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenChapters((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="flex w-full items-center justify-between text-left"
                      >
                        <h2 className="text-lg font-semibold">{`${idx + 1}. ${ch.title}`}</h2>
                        <span className="text-sm text-slate-500">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="relative mt-3">
                          <div
                            className={`text-sm ${
                              shouldBlur ? "pointer-events-none select-none blur-sm" : "text-slate-700"
                            }`}
                          >
                          {idx === 1 ? (
                            <div className="space-y-4">
                              {dayBlocks.map((day, i) => (
                                <div
                                  key={`${day.title}-${i}`}
                                  className="rounded-xl border border-slate-100 p-4"
                                  style={{ background: "#fffdfa" }}
                                >
                                  <div className="text-base font-semibold text-slate-900">{day.title}</div>
                                  {day.weather && (
                                    <div className="mt-1 text-xs text-slate-500">🌤 Weather: {day.weather}</div>
                                  )}

                                  <div className="mt-3 rounded-lg border border-slate-100 p-3" style={{background:"#fff6e6"}}>
                                    <div
                                      className="h-28 rounded-lg"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, rgba(159,29,34,0.14), rgba(212,175,55,0.18))",
                                        position: "relative",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          right: 10,
                                          top: 10,
                                          width: 48,
                                          height: 32,
                                          borderRadius: 6,
                                          background: "rgba(255,255,255,0.7)",
                                          boxShadow: "0 6px 12px rgba(31,41,55,0.08)",
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: "absolute",
                                          right: 64,
                                          bottom: 10,
                                          width: 64,
                                          height: 40,
                                          borderRadius: 8,
                                          background: "rgba(255,255,255,0.8)",
                                          boxShadow: "0 8px 16px rgba(31,41,55,0.08)",
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                                    {day.morning && <div><span className="font-semibold text-slate-900">Morning:</span> {day.morning}</div>}
                                    {day.afternoon && <div><span className="font-semibold text-slate-900">Afternoon:</span> {day.afternoon}</div>}
                                    {day.evening && <div><span className="font-semibold text-slate-900">Evening:</span> {day.evening}</div>}
                                    {day.food && <div>🍜 <span className="font-semibold text-slate-900">Food:</span> {day.food}</div>}
                                    {day.transport && <div>🚇 <span className="font-semibold text-slate-900">Transport:</span> {day.transport}</div>}
                                    {day.tip && <div>⭐ <span className="font-semibold text-slate-900">Local tip:</span> {day.tip}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            paragraphs.map((para, i) => (
                              <p key={i} className="mt-0 mb-2">
                                {para}
                              </p>
                            ))
                          )}
                          </div>
                          {shouldBlur && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-2xl bg-white/80 px-6 py-4 text-center shadow-lg">
                                <div className="mb-2 text-sm font-medium text-slate-800">Unlock full plan to view this chapter</div>
                                <Link href="/checkout" className="btn-primary">
                                  Unlock full plan ($9)
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </article>
              );
            })}
        </section>
      </main>

      {showUnlockBar && (
        <div className="print:hidden fixed bottom-4 left-0 right-0 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-lg">
              <div>
                <div className="text-sm font-semibold text-slate-900">Unlock full plan to view chapters 4–6</div>
                <div className="text-xs text-slate-500">Preview first. Pay only if you like the plan.</div>
              </div>
              <Link href="/checkout" className="btn-primary">
                Unlock full plan ($9)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
