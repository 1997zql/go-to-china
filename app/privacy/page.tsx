export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="card">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-600">
            This Privacy Policy explains how Go to China collects and uses
            information. We keep it short and clear for an MVP experience.
          </p>

          <section className="mt-6 space-y-4 text-sm text-slate-700">
            <div>
              <h2 className="text-lg font-semibold">What we collect</h2>
              <p className="mt-2">
                We collect the answers you enter into the trip planner. We also
                store payment status locally in your browser so you can unlock
                the full plan.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">What we do not collect</h2>
              <p className="mt-2">
                We do not collect passport or government ID information. We do
                not collect your email unless you provide it in the future for
                support or updates.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Cookies and local storage</h2>
              <p className="mt-2">
                We use browser storage only: <code>gtc_plan_inputs</code> is
                saved in <code>sessionStorage</code> and <code>gtc_paid</code> is
                saved in <code>localStorage</code>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Third-party services</h2>
              <p className="mt-2">
                We may use a payment provider in the future. The site is hosted
                on a third-party infrastructure provider. These services may
                process limited data required to operate the site.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="mt-2">Email: support@go-to-china.com</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Last updated</h2>
              <p className="mt-2">2026-01-01</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
