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
      <div className="h-28 rounded-xl border border-stone-200 bg-stone-200/70" />
      <div className="h-44 rounded-xl border border-stone-200 bg-white p-6 space-y-3">
        <div className="h-4 w-48 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-100" />
        <div className="h-3 w-5/6 rounded bg-stone-100" />
      </div>
      <div className="h-44 rounded-xl border border-stone-200 bg-white p-6 space-y-3">
        <div className="h-4 w-44 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-100" />
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:inline-block focus:rounded-md focus:bg-teal-800 focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-white">
        Skip to content
      </a>

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <span className="font-display text-lg font-bold tracking-tight text-stone-950 whitespace-nowrap shrink-0">
          Urban Air Quality Assistant
        </span>
        <nav aria-label="Plan sections" className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#routine" className="hover:text-stone-950 hover:underline underline-offset-4 whitespace-nowrap shrink-0">Outdoor Routine</a>
          <a href="#indoor" className="hover:text-stone-950 hover:underline underline-offset-4 whitespace-nowrap shrink-0">Indoor Hacks</a>
          <a href="#swaps" className="hover:text-stone-950 hover:underline underline-offset-4 whitespace-nowrap shrink-0">Low-Emission Swaps</a>
        </nav>
        <button type="button" onClick={handleSubmit} disabled={loading} className="min-h-[40px] rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-teal-900 active:translate-y-px disabled:opacity-60 whitespace-nowrap shrink-0">
          {loading ? "Checking..." : "Check Live AQI"}
        </button>
      </header>

      <section data-enter className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl text-balance">
          Daily air quality guidance tailored to how you commute and live.
        </h1>
        <p className="mt-2.5 text-base leading-relaxed text-stone-600">
          Live US AQI and PM2.5 readings from Open-Meteo paired with your home ventilation, cooking fuel, and sensitivity profile.
        </p>
      </section>

      <main id="main-content" className="grid grid-cols-1 gap-6 lg:grid-cols-[370px_1fr] lg:items-start">
        <ProfileForm value={input} loading={loading} onChange={setInput} onSubmit={handleSubmit} />

        <div className="space-y-4">
          {loading && <LoadingSkeleton />}

          {!loading && error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-950">
              <h2 className="text-sm font-semibold">Could not generate plan</h2>
              <p className="mt-1 text-sm leading-relaxed">{error}</p>
              <button type="button" onClick={handleSubmit} className="mt-3 min-h-[40px] rounded-lg bg-rose-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-900">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-stone-950">What your plan includes</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Pre-loaded for <span className="font-medium text-stone-900">{input.city || "your location"}</span> so you can run a live check in one click.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-stone-100 pt-4">
                <div>
                  <p className="font-mono text-xs text-stone-400">01</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">Outdoor timing</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">Commute windows and mask fit matched to US AQI band.</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-stone-400">02</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">Indoor hacks</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">Free and low-cost airflow steps for your cooking fuel.</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-stone-400">03</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">Clear why</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">Every action explains its exposure benefit directly.</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <div data-enter className="space-y-4">
              <AqiBadge reading={result.reading} />
              <p className="rounded-xl border border-stone-200 bg-white p-5 text-sm leading-relaxed text-stone-700">{result.plan.summary}</p>
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
