"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GTC_KEYS, readSession, writeSession } from "@/lib/gtcStorage";
import { useGtcState } from "@/hooks/useGtcState";
import { GUIDE_TIPS } from "@/lib/guideTips";
import PaywallModal from "@/app/components/PaywallModal";
import { PAYWALL_VARIANT } from "@/lib/experiment";

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
  city?: string;
  weather?: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  food?: string;
  transport?: string;
  tip?: string;
  imageQuery?: string;
};

type DaySection = {
  label: string;
  text: string;
};

type DayTip = {
  icon: string;
  label: string;
  text: string;
};

function DayImage({
  city,
  title,
  onClick,
}: {
  city: string;
  title: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const sources = useMemo(() => {
    const query = normalizeCityQuery(city);
    return [
      `https://source.unsplash.com/1200x600/?${encodeURIComponent(query)}`,
      `https://picsum.photos/seed/${encodeURIComponent(query)}/1200/600`,
    ];
  }, [city]);

  const src = sources[Math.min(attempt, sources.length - 1)];

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setAttempt(0);
  }, [city]);

  useEffect(() => {
    if (loaded) return;
    const timeout = window.setTimeout(() => {
      setAttempt((prev) => {
        const next = prev + 1;
        if (next >= sources.length) {
          setFailed(true);
          return prev;
        }
        return next;
      });
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [loaded, sources.length]);

  return (
    <div className="relative">
      {!loaded && !failed && (
        <div className="h-40 md:h-56 w-full rounded-xl bg-slate-200 animate-pulse" />
      )}
      {!failed ? (
        <img
          src={src}
          alt={title}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setAttempt((prev) => {
              const next = prev + 1;
              if (next >= sources.length) {
                setFailed(true);
                return prev;
              }
              return next;
            });
          }}
          onClick={onClick}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`h-40 md:h-56 w-full rounded-xl object-cover cursor-pointer transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div
          onClick={onClick}
          className="h-40 md:h-56 w-full rounded-xl cursor-pointer flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,246,230,0.9), rgba(255,240,240,0.9))",
          }}
        >
          <div className="text-lg font-semibold text-slate-800">{title}</div>
        </div>
      )}
    </div>
  );
}

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
    const titleCity = titleLine?.split("—")[1] || titleLine?.split("-")[1];
    if (titleCity) result.city = titleCity.trim();

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
      else if (lower.startsWith("image query:")) result.imageQuery = line.slice(12).trim();
    }

    return result;
  });
}

function splitTextPreview(text: string, ratio = 0.4) {
  const trimmed = text.trim();
  if (!trimmed) return { preview: "", rest: "" };
  const sentenceMatch = trimmed.match(/^[^.!?]+[.!?]/);
  if (sentenceMatch && sentenceMatch[0].length >= Math.floor(trimmed.length * 0.25)) {
    const preview = sentenceMatch[0].trim();
    const rest = trimmed.slice(preview.length).trim();
    return { preview, rest };
  }
  const cut = Math.max(20, Math.floor(trimmed.length * ratio));
  const preview = trimmed.slice(0, cut).trim();
  const rest = trimmed.slice(cut).trim();
  return { preview, rest };
}

function splitDayContent(day: DayBlock) {
  const preview: DaySection[] = [];
  const locked: DaySection[] = [];

  if (day.morning) {
    preview.push({ label: "Morning", text: day.morning });
  }

  if (day.afternoon) {
    const split = splitTextPreview(day.afternoon);
    if (split.preview) preview.push({ label: "Afternoon", text: split.preview });
    if (split.rest) locked.push({ label: "Afternoon", text: split.rest });
  }

  if (day.evening) {
    const split = splitTextPreview(day.evening);
    if (split.preview) preview.push({ label: "Evening", text: split.preview });
    if (split.rest) locked.push({ label: "Evening", text: split.rest });
  }

  if (day.food) locked.push({ label: "Food", text: day.food });
  if (day.transport) locked.push({ label: "Transport", text: day.transport });
  if (day.tip) locked.push({ label: "Local tip", text: day.tip });

  if (!locked.length) {
    locked.push({ label: "More details", text: "Detailed recommendations are available after unlock." });
  }

  return { preview, locked };
}

function buildDailyTips(dayIndex: number): DayTip[] {
  const payments = GUIDE_TIPS.payments.bullets[dayIndex % GUIDE_TIPS.payments.bullets.length];
  const internet = GUIDE_TIPS.vpn.bullets[dayIndex % GUIDE_TIPS.vpn.bullets.length];
  const transport = GUIDE_TIPS.transport.bullets[dayIndex % GUIDE_TIPS.transport.bullets.length];
  const tips: DayTip[] = [
    { icon: "💳", label: "Payments", text: payments },
    { icon: "🌐", label: "Internet", text: internet },
    { icon: "🚆", label: "Transport", text: transport },
  ];
  if (dayIndex % 2 === 0) {
    const safety = GUIDE_TIPS.safety.bullets[dayIndex % GUIDE_TIPS.safety.bullets.length];
    tips.push({ icon: "🛡️", label: "Safety", text: safety });
  }
  return tips;
}

function normalizeCityQuery(city: string) {
  const safeCity = city && city.trim().length > 0 ? city : "china";
  const cleaned = safeCity.replace(/^day\s*\d+\s*[–-]\s*/i, "").trim();
  return `${cleaned || "china"} travel`;
}

export default function ResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, hydrated, markGenerated, markUnlocked, resetAll } = useGtcState();
  const [inputs, setInputs] = useState<PlanInputs | null>(null);
  const [planOutput, setPlanOutput] = useState<PlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [paywallOpen, setPaywallOpen] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);

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
    const paid = searchParams?.get("paid");
    if (paid === "1") {
      markUnlocked();
    }
  }, [searchParams, markUnlocked]);

  const startGeneration = useCallback(
    (mode: "auto" | "retry") => {
      if (!inputs) return;
      if (inFlightRef.current) return;
      if (mode === "auto" && planOutput) return;

      inFlightRef.current = true;
      setIsLoading(true);
      setErrorMessage(null);
      setShowProgress(true);
      setProgress(0);
      setStageIndex(0);

      const controller = new AbortController();
      abortRef.current = controller;

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
        signal: controller.signal,
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
        .catch((err: Error & { name?: string }) => {
          if (err?.name === "AbortError") {
            setErrorMessage("Canceled. You can retry.");
            return;
          }
          setErrorMessage(
            err?.message ===
              "Missing OPENAI_API_KEY. Please create a .env.local file with your key."
              ? err.message
              : "Failed to generate plan. Please try again."
          );
        })
        .finally(() => {
          setIsLoading(false);
          inFlightRef.current = false;
          abortRef.current = null;
        });
    },
    [inputs, planOutput, markGenerated]
  );

  useEffect(() => {
    if (!inputs || planOutput) return;
    startGeneration("auto");
  }, [inputs, planOutput, startGeneration]);

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

  function onCancelGeneration() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }

  function onRetryGeneration() {
    setPlanOutput(null);
    startGeneration("retry");
  }

  function onOpenUnlockModal() {
    setPaywallOpen(true);
  }

  async function unlock() {
    setPaywallOpen(false);
    try {
      const response = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          successUrl: "http://localhost:3000/success?src=creem",
          cancelUrl: "http://localhost:3000/result?canceled=1",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.checkoutUrl) {
        const details = data?.details ? ` (${data.details})` : "";
        const message = `${data?.message || "Checkout unavailable."}${details}`;
        setErrorMessage(message);
        if (typeof window !== "undefined") {
          window.alert(message);
        }
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setErrorMessage("Checkout unavailable. Please try again.");
    }
  }

  function onOpenMap(query: string) {
    if (typeof window === "undefined") return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const chapters = useMemo(() => {
    if (!planOutput) return [];
    return planOutput.chapters || [];
  }, [planOutput]);
  const isUnlocked = state === "unlocked";
  const hasLockedChapters = !isUnlocked && chapters.length > 3;
  const showUnlockBar = state === "generated" && hasLockedChapters;

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
    } else if (!errorMessage) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
        setStageIndex(0);
      }, 600);
      return () => clearTimeout(hideTimer);
    } else {
      setProgress(100);
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (stageTimer) clearInterval(stageTimer);
    };
  }, [isLoading, showProgress, errorMessage]);
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

  const guideTopics = Object.entries(GUIDE_TIPS);

  const fallbackTitles = [
    "Trip Overview",
    "Day-by-day Itinerary",
    "Must-book List",
    "Transportation",
    "Payments & Essential Apps",
    "Safety & Cultural Tips",
  ];
  const tocTitles = chapters.length ? chapters.map((ch) => ch.title) : fallbackTitles;

  function scrollToChapter(index: number) {
    if (typeof window === "undefined") return;
    const el = document.getElementById(`chapter-${index + 1}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            <div className="mt-3 flex items-center gap-3 text-xs">
              {isLoading && (
                <button
                  type="button"
                  onClick={onCancelGeneration}
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
              {!isLoading && errorMessage && (
                <button
                  type="button"
                  onClick={onRetryGeneration}
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.days} days</div>
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.style}</div>
            <div className="text-sm px-3 py-1 rounded-full" style={{background:'#fff6e6', color:'var(--text-primary)'}}>{inputs.budget}</div>
            {isUnlocked && (
              <div className="text-xs text-slate-500">Unlocked</div>
            )}
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

        <div className="mb-6 print:hidden">
          <div className="card flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Not sure where to start?</div>
              <div className="mt-1 text-sm text-slate-600">
                Read the essential guide (payments, VPN, transport, safety).
              </div>
            </div>
            <Link href="/guide" className="btn-outline">Open guide</Link>
          </div>
        </div>

        {guideTopics.length > 0 && (
          <div className="mb-6 print:hidden">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Quick essentials for China</div>
                  <div className="mt-1 text-xs text-slate-500">Short tips tailored to your trip.</div>
                </div>
                <Link href="/guide" className="text-xs text-slate-500 hover:text-slate-700">Read full guide</Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {guideTopics.map(([key, topic]) => {
                  const bullets = isUnlocked ? topic.bullets : topic.bullets.slice(0, 2);
                  return (
                    <div key={key} className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900">{topic.title}</div>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                        {bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            if (!navigator?.clipboard?.writeText) return;
                            navigator.clipboard.writeText(
                              `${topic.title}\n${topic.bullets.map((b) => `- ${b}`).join("\n")}`
                            );
                          }}
                          className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:border-slate-300 hover:text-slate-800"
                        >
                          Copy
                        </button>
                        <Link href="/guide" className="text-[10px] text-slate-500 hover:text-slate-700">
                          Read full guide
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <section className="mb-6">
          <div className="card">
            <div className="text-sm font-semibold text-slate-900">Contents</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {tocTitles.map((title, idx) => {
                const locked = idx >= 3 && !isUnlocked;
                return (
                  <button
                    key={`${title}-${idx}`}
                    type="button"
                    onClick={() => scrollToChapter(idx)}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-left hover:border-slate-200 hover:bg-slate-50"
                  >
                    <span>{`${idx + 1}. ${title}`}</span>
                    {locked && (
                      <span className="rounded-full bg-[#fff6e6] px-2 py-0.5 text-[10px] font-semibold text-[#7A5B00]">
                        Locked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
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
              const locked = false;
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

              return (
                <article key={ch.title} id={`chapter-${idx + 1}`} className="relative card scroll-mt-24">
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
                        <div className="mt-3 text-sm text-slate-700">
                        {idx === 1 ? (
                          <div className="space-y-4">
                            {dayBlocks.map((day, i) => {
                              const dayTips = buildDailyTips(i);
                              const split = splitDayContent(day);
                              return (
                                <div
                                  key={`${day.title}-${i}`}
                                  className="rounded-xl border border-slate-100 p-4"
                                  style={{ background: "#fffdfa" }}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-base font-semibold text-slate-900">{day.title}</div>
                                    <button
                                      type="button"
                                      onClick={() => onOpenMap(day.title)}
                                      className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                    >
                                      Open map
                                    </button>
                                  </div>
                                  {day.weather && (
                                    <div className="mt-1 text-xs text-slate-500">🌤 Weather: {day.weather}</div>
                                  )}

                                  <div className="mt-3">
                                    <DayImage
                                      city={day.city || day.title}
                                      title={day.city || day.title}
                                      onClick={() => onOpenMap(day.imageQuery || day.title)}
                                    />
                                  </div>

                                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                                    {split.preview.map((section) => (
                                      <div key={`${section.label}-${section.text}`}>
                                        <span className="font-semibold text-slate-900">{section.label}:</span>{" "}
                                        {section.text}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-4 rounded-lg border border-slate-100 px-3 py-2" style={{ background: "rgba(255,246,230,0.8)" }}>
                                    <div className="text-xs font-semibold text-slate-700">Quick tips for today</div>
                                    <div className="mt-2 grid gap-2 text-xs text-slate-700">
                                      {dayTips.map((tip) => (
                                        <div key={tip.text} className="flex items-start gap-2">
                                          <span>{tip.icon}</span>
                                          <span><span className="font-semibold">{tip.label}:</span> {tip.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {!isUnlocked && (
                                    <div className="relative mt-4">
                                      <div className="rounded-lg border border-slate-100 p-3 blur-sm">
                                        {split.locked.map((section) => (
                                          <div key={`${section.label}-${section.text}`} className="mb-2 text-sm text-slate-700">
                                            <span className="font-semibold text-slate-900">{section.label}:</span>{" "}
                                            {section.text}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="rounded-2xl bg-white/80 px-6 py-4 text-center shadow-lg">
                                          <div className="mb-2 text-sm font-medium text-slate-800">Unlock full plan ($9) to see more</div>
                                          <button onClick={onOpenUnlockModal} className="btn-primary">
                                            Unlock full plan ($9)
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {isUnlocked && (
                                    <div className="mt-4 rounded-lg border border-slate-100 p-3">
                                      {split.locked.map((section) => (
                                        <div key={`${section.label}-${section.text}`} className="mb-2 text-sm text-slate-700">
                                          <span className="font-semibold text-slate-900">{section.label}:</span>{" "}
                                          {section.text}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                            <>
                              {paragraphs.map((para, i) => (
                                <p key={i} className="mt-0 mb-2">
                                  {para}
                                </p>
                              ))}
                              {idx === 4 && isUnlocked && (
                                <div className="mt-4 rounded-xl border border-slate-100 bg-white px-4 py-3">
                                  <div className="text-sm font-semibold text-slate-900">From the essential guide:</div>
                                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                    {["payments", "vpn", "transport"].map((key) => {
                                      const topic = GUIDE_TIPS[key as keyof typeof GUIDE_TIPS];
                                      return (
                                        <div key={key}>
                                          <div className="text-xs font-semibold text-slate-700">{topic.title}</div>
                                          <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-slate-600">
                                            {topic.bullets.map((b) => (
                                              <li key={b}>{b}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
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

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUnlock={unlock}
        variant={PAYWALL_VARIANT}
      />

      {showUnlockBar && (
        <div className="print:hidden fixed bottom-4 left-0 right-0 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-lg">
              <div>
                <div className="text-sm font-semibold text-slate-900">Unlock full plan to view chapters 4–6</div>
                <div className="text-xs text-slate-500">Preview first. Pay only if you like the plan.</div>
              </div>
              <button onClick={onOpenUnlockModal} className="btn-primary">
                Unlock full plan ($9)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
