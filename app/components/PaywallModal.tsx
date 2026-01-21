"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { PaywallVariant } from "@/lib/experiment";

type PaywallModalProps = {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  variant?: PaywallVariant;
  initialStep?: 1 | 2;
};

const BENEFITS = [
  "Exact timing + backup options",
  "Map-ready stops + transport steps",
  "Payments/VPN tips applied to your days",
];

export default function PaywallModal({
  open,
  onClose,
  onUnlock,
  variant = "soft",
  initialStep = 1,
}: PaywallModalProps) {
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [showDetails, setShowDetails] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const primaryLabel = useMemo(() => {
    return variant === "strong" ? "Download full PDF ($9)" : "Unlock now ($9)";
  }, [variant]);

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setShowDetails(false);
  }, [open, initialStep]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const node = dialogRef.current;
      if (!node) return;
      const focusable = node.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (focusable.length) focusable[0].focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const timer = window.setTimeout(focusFirst, 0);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close paywall"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 ease-out translate-y-0 opacity-100"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 id="paywall-title" className="text-lg font-semibold text-slate-900">
              {step === 1 ? "Want the full detail?" : "Unlock more details"}
            </h3>
            <div className="mt-1 text-xs text-slate-500">
              {step === 1
                ? "Preview first. Only unlock if you like the plan."
                : "One-time unlock · Instant PDF download"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm text-slate-500 hover:text-slate-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 1 ? (
            <>
              <ul className="list-disc space-y-2 pl-4 text-sm text-slate-700">
                {BENEFITS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={onClose} className="btn-primary">
                  Keep previewing
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="btn-outline"
                >
                  Show unlock options
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <div className="text-2xl font-semibold text-slate-900">$9</div>
                <div className="mt-1 text-sm text-slate-600">
                  Unlock chapters 4–6 + full PDF
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  What’s included?
                </button>
                {showDetails && (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                    {BENEFITS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={onUnlock} className="btn-primary">
                  {primaryLabel}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline"
                >
                  Not now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
