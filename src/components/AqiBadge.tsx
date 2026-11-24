import type { AqiBand, AqiReading } from "../lib/schema";

const BAND_ORDER: AqiBand[] = ["Good", "Moderate", "Unhealthy-Sensitive", "Unhealthy", "Very Unhealthy", "Hazardous"];
const BAND_META: Record<AqiBand, { card: string; bar: string; range: string }> = {
  Good: { card: "bg-emerald-50 text-emerald-950 border-emerald-200", bar: "bg-emerald-600", range: "0–50" },
  Moderate: { card: "bg-amber-50 text-amber-950 border-amber-200", bar: "bg-amber-500", range: "51–100" },
  "Unhealthy-Sensitive": { card: "bg-orange-50 text-orange-950 border-orange-200", bar: "bg-orange-600", range: "101–150" },
  Unhealthy: { card: "bg-rose-50 text-rose-950 border-rose-200", bar: "bg-rose-600", range: "151–200" },
  "Very Unhealthy": { card: "bg-rose-100 text-rose-950 border-rose-300", bar: "bg-rose-800", range: "201–300" },
  Hazardous: { card: "bg-red-950 text-red-50 border-red-900", bar: "bg-red-500", range: "301+" },
};

export function AqiBadge({ reading }: { reading: AqiReading }) {
  const activeIdx = BAND_ORDER.indexOf(reading.band);
  const style = BAND_META[reading.band];
  return (
    <section aria-label="Current air quality reading" className={`rounded-xl border p-5 ${style.card}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums">{reading.aqi}</span>
          <div>
            <p className="text-base font-semibold leading-tight">{reading.band}</p>
            <p className="text-xs opacity-80">US AQI scale · {style.range}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold">{reading.city}</p>
          <p className="text-xs opacity-80 font-mono tabular-nums">
            PM2.5 {reading.pm25 !== null ? `${reading.pm25} µg/m³` : "N/A"} · {reading.source === "open-meteo" ? "Open-Meteo live" : "Manual input"}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-6 gap-1.5" aria-hidden="true">
        {BAND_ORDER.map((band, idx) => (
          <div key={band} className={`h-1.5 rounded-sm ${idx <= activeIdx ? style.bar : "bg-current opacity-15"}`} />
        ))}
      </div>
    </section>
  );
}
