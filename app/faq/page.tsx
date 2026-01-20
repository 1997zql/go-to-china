const faqs = [
  {
    q: "How does it work?",
    a: "Answer five quick questions and we generate a personalized China itinerary. You can preview the first three chapters before unlocking the full PDF plan.",
  },
  {
    q: "What do I get after payment?",
    a: "You unlock all chapters of your itinerary and can download the PDF from the results page.",
  },
  {
    q: "Do you store my personal data?",
    a: "We store only your planner answers in sessionStorage and a paid flag in localStorage. We do not collect passport or ID details.",
  },
  {
    q: "Can I edit my answers?",
    a: "Yes. Use the Edit answers link on the results page to update your trip preferences.",
  },
  {
    q: "Is it a subscription?",
    a: "No. It is a one-time payment for a single itinerary download.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are available within 7 days if the PDF has not been downloaded.",
  },
  {
    q: "Does the plan include bookings or visas?",
    a: "No. The plan is informational and you are responsible for bookings, visas, and safety checks.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="card">
          <h1 className="text-3xl font-semibold">FAQ</h1>
          <p className="mt-3 text-sm text-slate-600">
            Quick answers to common questions about Go to China.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-700">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-slate-800">
                  {item.q}
                </summary>
                <p className="mt-2 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
