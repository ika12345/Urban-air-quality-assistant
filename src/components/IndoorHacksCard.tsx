import type { AdviseOutput } from "../lib/schema";

export function IndoorHacksCard({ items }: { items: AdviseOutput["indoorHacks"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">Indoor Air Quality Hacks</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {items.map((item, idx) => (
          <li key={idx} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.hack}</p>
              <span className="text-xs font-medium capitalize text-slate-500">{item.cost} cost</span>
            </div>
            <p className="mt-1.5 text-sm text-slate-600">
              <span className="font-medium text-slate-800">Why this helps: </span>
              {item.why}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
