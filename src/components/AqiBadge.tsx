import type { AqiBand, AqiReading } from "../lib/schema";

const BAND_STYLES: Record<AqiBand, string> = {
  Good: "bg-emerald-50 text-emerald-900 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-900 border-amber-200",
  "Unhealthy-Sensitive": "bg-orange-50 text-orange-900 border-orange-200",
  Unhealthy: "bg-rose-50 text-rose-900 border-rose-200",
  "Very Unhealthy": "bg-purple-50 text-purple-900 border-purple-200",
  Hazardous: "bg-red-100 text-red-950 border-red-300",
};

export function AqiBadge({ reading }: { reading: AqiReading }) {
  return (
    <div className={`rounded-xl border p-4 ${BAND_STYLES[reading.band]}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-3xl font-semibold tabular-nums">{reading.aqi}</span>
          <span className="text-sm font-semibold">{reading.band}</span>
        </div>
        <span className="text-xs font-medium opacity-80">{reading.city}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs opacity-85">
        <span>US AQI</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">
          PM2.5: {reading.pm25 !== null ? `${reading.pm25} µg/m³` : "N/A"}
        </span>
        <span aria-hidden="true">·</span>
        <span>{reading.source === "open-meteo" ? "Open-Meteo live" : "Manual input"}</span>
      </div>
    </div>
  );
}
