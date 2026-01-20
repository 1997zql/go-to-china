import Link from "next/link";
import SampleCards from "./components/SampleCards";
import GuideCards from "./components/GuideCards";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <header className="print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight">Go to China</div>
          <nav className="space-x-6 text-sm font-medium">
            <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900">How it works</Link>
            <Link href="/#sample" className="text-slate-600 hover:text-slate-900">Sample</Link>
            <Link href="/#pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative grid gap-8 lg:grid-cols-2 items-center">
          {/* decorative subtle map silhouette background (aria-hidden) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none opacity-20 sm:opacity-50"
            style={{
              backgroundImage: `
                radial-gradient(360px 220px at 8% 18%, rgba(159,29,34,0.06), transparent 30%),
                radial-gradient(420px 260px at 78% 72%, rgba(212,175,55,0.06), transparent 28%),
                radial-gradient(220px 140px at 50% 40%, rgba(159,29,34,0.04), transparent 30%),
                linear-gradient(180deg, transparent 20%, rgba(159,29,34,0.02) 60%)
              `,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transform: 'translateY(-8px) rotate(-2deg)'
            }}
          />

          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold">Plan your China trip in minutes.</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">Answer 5 quick questions. Get a personalized itinerary with practical day-by-day guidance.</p>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <Link href="/plan" className="btn-primary">Generate my trip</Link>
                <a href="#sample" className="btn-outline">View sample</a>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span>Takes less than 2 minutes.</span>
                <Link href="/guide" className="text-slate-600 hover:text-slate-900">Read essential guide →</Link>
              </div>
            </div>
          </div>

          <div>
            <div className="card h-64 flex items-start p-6 flex-col justify-between relative">
              <div className="h-32 w-full rounded-lg bg-[linear-gradient(90deg,rgba(251,233,233,0.85),rgba(255,246,240,0.85))]" />
              <div className="w-full mt-4 space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
              </div>

              {/* decorative gold city lights (aria-hidden) */}
              <div aria-hidden="true" className="pointer-events-none">
                <div className="absolute" style={{left: '14%', top: '20%'}}>
                  <div className="rounded-full bg-[#D4AF37]" style={{width:6, height:6, opacity:0.85, boxShadow:'0 0 0 6px rgba(212,175,55,0.08)', animation: 'glow 5.8s ease-in-out infinite', animationDelay: '0s'}} />
                </div>
                <div className="absolute" style={{left: '42%', top: '30%'}}>
                  <div className="rounded-full bg-[#D4AF37]" style={{width:6, height:6, opacity:0.85, boxShadow:'0 0 0 6px rgba(212,175,55,0.08)', animation: 'glow 5.2s ease-in-out infinite', animationDelay: '0.9s'}} />
                </div>
                <div className="absolute" style={{left: '70%', top: '38%'}}>
                  <div className="rounded-full bg-[#D4AF37]" style={{width:5, height:5, opacity:0.85, boxShadow:'0 0 0 6px rgba(212,175,55,0.08)', animation: 'glow 4.6s ease-in-out infinite', animationDelay: '1.6s'}} />
                </div>
                <div className="absolute" style={{left: '76%', top: '72%'}}>
                  <div className="rounded-full bg-[#D4AF37]" style={{width:5, height:5, opacity:0.85, boxShadow:'0 0 0 6px rgba(212,175,55,0.08)', animation: 'glow 5.6s ease-in-out infinite', animationDelay: '1.1s'}} />
                </div>
              </div>

              {/* keyframes for gentle breathing animation */}
              <style>{`
                @keyframes glow {
                  0% { transform: scale(1); opacity: 0.85; box-shadow: 0 0 0 6px rgba(212,175,55,0.08); }
                  50% { transform: scale(1.18); opacity: 0.5; box-shadow: 0 0 0 10px rgba(212,175,55,0.04); }
                  100% { transform: scale(1); opacity: 0.85; box-shadow: 0 0 0 6px rgba(212,175,55,0.08); }
                }
                @media (max-width: 640px) {
                  .card div[aria-hidden] { opacity: 0.25 !important; }
                }
              `}</style>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/plan" className="card text-center cursor-pointer transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              <div className="mx-auto" style={{width:40, height:40, borderRadius:9999, backgroundColor:'rgba(159,29,34,0.92)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 0 2px rgba(212,175,55,0.12)'}}>
                <span style={{color:'#fff', fontWeight:600}}>1</span>
              </div>
              <h3 className="mt-3 font-semibold">Answer 5 questions</h3>
              <p className="mt-2 text-sm muted">Tell us your trip length, style and interests.</p>
            </Link>

            <Link href="/#sample" className="card text-center cursor-pointer transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              <div className="mx-auto" style={{width:40, height:40, borderRadius:9999, backgroundColor:'rgba(159,29,34,0.92)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 0 2px rgba(212,175,55,0.12)'}}>
                <span style={{color:'#fff', fontWeight:600}}>2</span>
              </div>
              <h3 className="mt-3 font-semibold">Preview 3 chapters</h3>
              <p className="mt-2 text-sm muted">See the first three chapters before unlocking.</p>
            </Link>

            <Link href="/#pricing" className="card text-center cursor-pointer transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              <div className="mx-auto" style={{width:40, height:40, borderRadius:9999, backgroundColor:'rgba(159,29,34,0.92)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 0 2px rgba(212,175,55,0.12)'}}>
                <span style={{color:'#fff', fontWeight:600}}>3</span>
              </div>
              <h3 className="mt-3 font-semibold">Unlock & download PDF</h3>
              <p className="mt-2 text-sm muted">Unlock full plan and export as PDF.</p>
            </Link>
          </div>
        </section>

        <section id="sample" className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Sample</h2>
          <div className="mb-4 text-sm text-slate-600">Here’s what you’ll get (preview).</div>
          <SampleCards />
        </section>

        <section id="pricing" className="mt-12">
          <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
          <div className="mb-4 text-sm text-slate-600">One-time payment · No subscription · Instant download.</div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="card text-center">
              <div className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#7A5B00]" style={{background: "rgba(212,175,55,0.18)"}}>
                Most popular
              </div>
              <div className="text-xl font-semibold">$9</div>
              <div className="mt-2 muted">Unlock PDF</div>
            </div>
            <div className="card text-center">
              <div className="text-xl font-semibold">$19</div>
              <div className="mt-2 muted">Plus: extra local tips</div>
              <div className="mt-1 text-xs text-slate-500">Includes bonus recommendations.</div>
            </div>
            <div className="card text-center">
              <div className="text-xl font-semibold">$39</div>
              <div className="mt-2 muted">Pro: priority support + upgrades</div>
              <div className="mt-1 text-xs text-slate-500">Includes bonus recommendations.</div>
            </div>
          </div>
        </section>

        <section id="essential-guide" className="mt-12">
          <h2 className="text-2xl font-semibold mb-2">Essential guide for traveling to China</h2>
          <div className="mb-4 text-sm text-slate-600">Practical tips you can use before and during your trip.</div>
          <GuideCards />
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
          © 2026 Go to China — Crafted for travelers
          <div className="mt-2 text-[11px] text-slate-400">
            <a href="/privacy" className="hover:text-slate-600">Privacy</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="hover:text-slate-600">Terms</a>
            <span className="mx-2">·</span>
            <a href="/faq" className="hover:text-slate-600">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
