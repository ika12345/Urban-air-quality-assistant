import { AdviseOutput } from "../lib/schema";

export function RoutineCard({ items }: { items: AdviseOutput["outdoorRoutine"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">Tailored Outdoor Routine</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {items.map((item, idx) => (
          <li key={idx} className="py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold text-slate-900">{item.action}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{item.timing}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{item.impact} impact</span>
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
