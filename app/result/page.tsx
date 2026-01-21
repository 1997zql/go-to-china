import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
      <ResultClient />
    </Suspense>
  );
}
