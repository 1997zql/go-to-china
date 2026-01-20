"use client";

import React, { useState } from "react";
import Modal from "./Modal";

const samples = [
  {
    id: "shanghai-2d",
    title: "Day-by-day excerpt (Shanghai · 2 days)",
    preview:
      "Day 1: The Bund sunrise → Yu Garden → Nanjing Road → Huangpu River night cruise\nDay 2: French Concession walk → Tianzifang → Local brunch → Jing’an Temple → Skyline viewpoint",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          A compact two-day Shanghai plan that balances classic landmarks with
          relaxed neighborhoods. Expect short metro hops, plenty of street-level
          wandering, and a night skyline view.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>
            Day 1: Bund sunrise photos, a quick garden stroll at Yu Garden, then
            a casual lunch nearby. Late afternoon on Nanjing Road before a
            Huangpu River night cruise.
          </li>
          <li>
            Day 2: Slow walk through the French Concession, coffee and snacks in
            Tianzifang, local brunch, then Jing’an Temple and a skyline viewpoint
            near dusk.
          </li>
        </ul>
        <p>
          Local tips: Go to the Bund before 8am for softer light and fewer
          crowds. Metro Line 10 connects Yu Garden and Tianzifang quickly.
          Reserve the river cruise before 6pm for the best time slot.
        </p>
      </div>
    ),
  },
  {
    id: "beijing-3d",
    title: "City highlights preview (Beijing · 3 days)",
    preview:
      "Day 1: Tiananmen Square → Forbidden City → Jingshan Park\nDay 2: Mutianyu Great Wall → local village lunch → evening hutong stroll\nDay 3: Temple of Heaven → Panjiayuan Market → Peking duck",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          This preview shows how the plan blends major sites with a realistic
          pace. It keeps travel time efficient and builds in time for rest and
          local food.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>
            Day 1: Tiananmen Square and the Forbidden City, then climb Jingshan
            Park for a panoramic view.
          </li>
          <li>
            Day 2: Mutianyu Great Wall with a cable car option, a village lunch,
            and a sunset walk through nearby hutongs.
          </li>
          <li>
            Day 3: Temple of Heaven in the morning, Panjiayuan Market for
            browsing, and classic Peking duck for dinner.
          </li>
        </ul>
        <p>
          Local tips: Book the Forbidden City entry in advance. Mutianyu is less
          crowded than Badaling. For hutongs, stick to a short loop around
          Houhai or Nanluoguxiang for easy navigation.
        </p>
      </div>
    ),
  },
];

export default function SampleCards() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = samples.find((item) => item.id === activeId);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {samples.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className="card text-left transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
          >
            <h3 className="font-semibold">{item.title}</h3>
            <div className="mt-2 text-sm text-slate-600 whitespace-pre-line">
              {item.preview}
            </div>
            <div className="mt-3 text-xs text-slate-500">Click to expand</div>
          </button>
        ))}
      </div>

      <Modal
        open={Boolean(active)}
        title={active?.title || ""}
        onClose={() => setActiveId(null)}
      >
        {active?.body}
      </Modal>
    </>
  );
}
