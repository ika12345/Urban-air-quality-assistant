import { AdviseOutput } from "../lib/schema";

interface ImpactCardProps {
  swaps: AdviseOutput["lowEmissionSwaps"];
  healthNote: string;
  disclaimer: string;
}

export function ImpactCard({ swaps, healthNote, disclaimer }: ImpactCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Low-Emission Swaps & Health Note</h3>
        <ul className="mt-3 divide-y divide-slate-100">
          {swaps.map((item, idx) => (
            <li key={idx} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-slate-900">{item.swap}</p>
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-medium text-slate-800">Why this helps: </span>
                {item.estimatedBenefit}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-slate-50 p-3.5 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Health note: </span>
        {healthNote}
      </div>

      <p className="text-xs text-slate-500">{disclaimer}</p>
    </section>
  );
}
