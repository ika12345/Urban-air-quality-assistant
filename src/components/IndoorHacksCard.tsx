import type { AdviseOutput } from "../lib/schema";

export function IndoorHacksCard({ items }: { items: AdviseOutput["indoorHacks"] }) {
  return (
    <section id="indoor" className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-900">Indoor Air Quality Hacks</h3>
        <span className="text-xs font-mono tabular-nums text-stone-500">{items.length} steps</span>
      </div>
      <ol className="mt-4 divide-y divide-stone-100">
        {items.map((item, idx) => (
          <li key={idx} className="py-3.5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs font-medium tabular-nums text-stone-400">0{idx + 1}</span>
                <p className="text-sm font-semibold text-stone-900">{item.hack}</p>
              </div>
              <span className="text-xs font-medium capitalize text-stone-500">{item.cost} cost</span>
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
