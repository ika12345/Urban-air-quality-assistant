import { useState } from "react";
import { AqiBadge } from "../components/AqiBadge";
import { ImpactCard } from "../components/ImpactCard";
import { IndoorHacksCard } from "../components/IndoorHacksCard";
import { ProfileForm } from "../components/ProfileForm";
import { RoutineCard } from "../components/RoutineCard";
import type { AdviseApiResponse, AdviseInput } from "../lib/schema";

const DEFAULT_INPUT: AdviseInput = {
  city: "New Delhi",
  manualAqi: undefined,
  commute: "two-wheeler",
  home: { ventilation: "windows", cookingFuel: "lpg", nearBusyRoad: true },
  sensitivities: ["asthma"],
  outdoorHours: 2,
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading air quality plan">
      <div className="h-24 rounded-xl border border-slate-200 bg-slate-200/70" />
      <div className="h-44 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="h-44 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="h-4 w-44 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Page() {
  const [input, setInput] = useState<AdviseInput>(DEFAULT_INPUT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdviseApiResponse | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as AdviseApiResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate air quality advice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">Urban Air Quality Assistant</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
          Tailored outdoor timing, low-cost indoor air quality hacks, and low-emission swaps grounded in live US AQI.
        </p>
      </header>
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <ProfileForm value={input} loading={loading} onChange={setInput} onSubmit={handleSubmit} />
        <div className="space-y-4">
          {loading && <LoadingSkeleton />}
          {!loading && error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
              <h2 className="text-sm font-semibold">Could not generate plan</h2>
              <p className="mt-1 text-sm">{error}</p>
              <button type="button" onClick={handleSubmit} className="mt-3 rounded-lg bg-rose-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-900">Retry</button>
            </div>
          )}
          {!loading && !error && !result && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              <h2 className="text-base font-semibold text-slate-900">Ready when you are</h2>
              <p className="mt-1.5 text-sm leading-relaxed">
                Click <span className="font-medium text-slate-900">Get Air Quality Plan</span> to fetch live AQI for{" "}
                <span className="font-medium text-slate-900">{input.city || "your location"}</span> and generate tailored guidance.
              </p>
            </div>
          )}
          {!loading && !error && result && (
            <div className="space-y-4">
              <AqiBadge reading={result.reading} />
              <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">{result.plan.summary}</p>
              <RoutineCard items={result.plan.outdoorRoutine} />
              <IndoorHacksCard items={result.plan.indoorHacks} />
              <ImpactCard swaps={result.plan.lowEmissionSwaps} healthNote={result.plan.healthNote} disclaimer={result.plan.disclaimer} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
