"use client";

import React, { useMemo, useState } from "react";
import { GUIDE_TIPS, GuideTopicKey } from "../../lib/guideTips";

type GuideItem = {
  key: GuideTopicKey;
  title: string;
  summary: string;
  bullets: string[];
};

const ORDER: GuideTopicKey[] = [
  "payments",
  "vpn",
  "transport",
  "safety",
  "culture",
  "sim",
  "apps",
];

export default function GuideClient() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const guideItems = useMemo<GuideItem[]>(() => {
    return ORDER.map((key) => {
      const item = GUIDE_TIPS[key];
      const summary = item.bullets.slice(0, 2).join(" ");
      return {
        key,
        title: item.title,
        summary,
        bullets: item.bullets,
      };
    });
  }, []);

  const copyText = useMemo(() => {
    return guideItems.map((item) => {
      const body = item.bullets.map((b) => `- ${b}`).join("\n");
      return `${item.title}\n${item.summary}\n${body}`;
    });
  }, [guideItems]);

  function handleCopy(index: number) {
    const text = copyText[index];
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
  }

  function handleSearch(query: string) {
    if (typeof window === "undefined") return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {guideItems.map((item, idx) => (
        <div key={item.key} className="card">
          <button
            type="button"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
            </div>
            <span className="mt-1 text-sm text-slate-500">
              {expanded === idx ? "−" : "+"}
            </span>
          </button>

          {expanded === idx && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(idx)}
                  className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:border-slate-300 hover:text-slate-800"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => handleSearch(`${item.title} China travel tips`)}
                  className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:border-slate-300 hover:text-slate-800"
                >
                  Open search
                </button>
              </div>
              <ul className="list-disc space-y-2 pl-4 text-sm text-slate-700">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
