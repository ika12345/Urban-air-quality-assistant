import type { AdviseOutput } from "../lib/schema";

interface ImpactCardProps {
  swaps: AdviseOutput["lowEmissionSwaps"];
  healthNote: string;
  disclaimer: string;
}

export function ImpactCard({ swaps, healthNote, disclaimer }: ImpactCardProps) {
  return (
    <section id="swaps" className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-stone-900">Low-Emission Swaps</h3>
          <span className="text-xs font-mono tabular-nums text-stone-500">{swaps.length} swaps</span>
        </div>
        <ol className="mt-4 divide-y divide-stone-100">
          {swaps.map((item, idx) => (
            <li key={idx} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs font-medium tabular-nums text-stone-400">0{idx + 1}</span>
                <p className="text-sm font-semibold text-stone-900">{item.swap}</p>
              </div>
              <p className="mt-1.5 pl-6 text-sm leading-relaxed text-stone-700">
                <span className="font-medium text-stone-900">Why this helps: </span>{item.estimatedBenefit}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed text-stone-800">
        <span className="font-semibold text-stone-950">Health note: </span>{healthNote}
      </div>
      <p className="text-xs leading-relaxed text-stone-500">{disclaimer}</p>
    </section>
  );
}
