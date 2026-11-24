import type { AdviseOutput } from "../lib/schema";

export function RoutineCard({ items }: { items: AdviseOutput["outdoorRoutine"] }) {
  return (
    <section id="routine" className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-900">Tailored Outdoor Routine</h3>
        <span className="text-xs font-mono tabular-nums text-stone-500">{items.length} actions</span>
      </div>
      <ol className="mt-4 divide-y divide-stone-100">
        {items.map((item, idx) => (
          <li key={idx} className="py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs font-medium tabular-nums text-stone-400">0{idx + 1}</span>
              <p className="text-sm font-semibold text-stone-900">{item.action}</p>
            </div>
            <div className="mt-1 pl-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span>{item.timing}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{item.impact} impact</span>
            </div>
            <p className="mt-1.5 pl-6 text-sm leading-relaxed text-stone-700">
              <span className="font-medium text-stone-900">Why this helps: </span>{item.why}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
