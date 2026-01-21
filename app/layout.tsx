import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://go-to-china.com"),
  title: "Go to China — AI Trip Planner",
  description:
    "Answer 5 questions. Preview the first 3 chapters. Unlock the full plan to download a PDF itinerary for China.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Go to China — AI Trip Planner",
    description:
      "Answer 5 questions. Preview the first 3 chapters. Unlock the full plan to download a PDF itinerary for China.",
    type: "website",
    url: "/",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go to China — AI Trip Planner",
    description:
      "Answer 5 questions. Preview the first 3 chapters. Unlock the full plan to download a PDF itinerary for China.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="site-bg min-h-screen">
          <div className="mx-auto max-w-6xl px-4 py-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
