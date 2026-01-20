export default function TermsPage() {
  return (
    <div className="min-h-screen text-slate-800 antialiased">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="card">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-600">
            These Terms govern your use of Go to China. By using the service,
            you agree to the terms below.
          </p>

          <section className="mt-6 space-y-4 text-sm text-slate-700">
            <div>
              <h2 className="text-lg font-semibold">Informational use</h2>
              <p className="mt-2">
                The service provides travel suggestions for informational
                purposes only and does not constitute legal, medical, or
                professional advice.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Your responsibility</h2>
              <p className="mt-2">
                You are responsible for visas, bookings, travel documents, and
                personal safety. Always verify requirements and local guidance
                before you travel.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Refund policy</h2>
              <p className="mt-2">
                Refunds are available within 7 days of purchase if the PDF has
                not been downloaded.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Limitation of liability</h2>
              <p className="mt-2">
                To the maximum extent permitted by law, Go to China is not
                liable for any direct or indirect damages arising from your use
                of the service or reliance on the content.
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
