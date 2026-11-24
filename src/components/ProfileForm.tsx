import type { AdviseInput } from "../lib/schema";

interface ProfileFormProps {
  value: AdviseInput;
  loading: boolean;
  onChange: (next: AdviseInput) => void;
  onSubmit: () => void;
}

type Sensitivity = AdviseInput["sensitivities"][number];
const CITY_PRESETS = ["New Delhi", "Mumbai", "Bengaluru", "London"] as const;
const SENSITIVITIES: [Sensitivity, string][] = [["none", "None"], ["asthma", "Asthma"], ["children", "Children"], ["elderly", "Elderly"], ["pregnancy", "Pregnancy"]];
const COMMUTES: [AdviseInput["commute"], string][] = [["two-wheeler", "Two-wheeler"], ["walk", "Walk"], ["bike", "Bicycle"], ["bus", "Bus / Metro"], ["car", "Car"], ["work-from-home", "Work from home"]];
const VENTS: [AdviseInput["home"]["ventilation"], string][] = [["windows", "Windows"], ["ac", "AC"], ["both", "Both"], ["poor", "Poor / closed"]];
const FUELS: [AdviseInput["home"]["cookingFuel"], string][] = [["lpg", "LPG gas"], ["induction", "Induction"], ["biomass", "Biomass / wood"], ["other", "Other"]];
const inputCls = "mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/20";

export function ProfileForm({ value, loading, onChange, onSubmit }: ProfileFormProps) {
  function toggleSensitivity(item: Sensitivity) {
    if (item === "none") return onChange({ ...value, sensitivities: ["none"] });
    const rest = value.sensitivities.filter((s) => s !== "none");
    const next = rest.includes(item) ? rest.filter((s) => s !== item) : [...rest, item];
    onChange({ ...value, sensitivities: next.length > 0 ? next : ["none"] });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5 rounded-xl border border-stone-200 bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Profile & Location</h2>
        <p className="mt-0.5 text-xs text-stone-500">Uses live Open-Meteo readings or your manual AQI.</p>
      </div>

      <div className="space-y-3 border-t border-stone-100 pt-4">
        <label className="block text-sm">
          <span className="font-medium text-stone-800">City</span>
          <input type="text" value={value.city ?? ""} onChange={(e) => onChange({ ...value, city: e.target.value })} placeholder="e.g. New Delhi, Mumbai, London" className={inputCls} />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CITY_PRESETS.map((city) => {
            const active = value.city?.trim().toLowerCase() === city.toLowerCase() && value.manualAqi === undefined;
            return (
              <button key={city} type="button" onClick={() => onChange({ ...value, city, manualAqi: undefined })} className={`min-h-[32px] rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${active ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"}`}>
                {city}
              </button>
            );
          })}
        </div>
        <label className="block text-sm">
          <span className="font-medium text-stone-800">Manual AQI override (optional)</span>
          <input type="number" min={0} max={1000} value={value.manualAqi ?? ""} onChange={(e) => onChange({ ...value, manualAqi: e.target.value === "" ? undefined : Number(e.target.value) })} placeholder="Leave blank for live AQI" className={`${inputCls} font-mono tabular-nums`} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
        <label className="block text-sm"><span className="font-medium text-stone-800">Commute</span>
          <select value={value.commute} onChange={(e) => onChange({ ...value, commute: e.target.value as AdviseInput["commute"] })} className={inputCls}>
            {COMMUTES.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
        <label className="block text-sm"><span className="font-medium text-stone-800">Outdoor hrs/day</span>
          <input type="number" min={0} max={24} step={0.5} value={value.outdoorHours ?? ""} onChange={(e) => onChange({ ...value, outdoorHours: e.target.value === "" ? undefined : Number(e.target.value) })} className={`${inputCls} font-mono tabular-nums`} />
        </label>
        <label className="block text-sm"><span className="font-medium text-stone-800">Ventilation</span>
          <select value={value.home.ventilation} onChange={(e) => onChange({ ...value, home: { ...value.home, ventilation: e.target.value as AdviseInput["home"]["ventilation"] } })} className={inputCls}>
            {VENTS.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
        <label className="block text-sm"><span className="font-medium text-stone-800">Cooking fuel</span>
          <select value={value.home.cookingFuel} onChange={(e) => onChange({ ...value, home: { ...value.home, cookingFuel: e.target.value as AdviseInput["home"]["cookingFuel"] } })} className={inputCls}>
            {FUELS.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-3 border-t border-stone-100 pt-4">
        <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-sm text-stone-700">
          <input type="checkbox" checked={value.home.nearBusyRoad} onChange={(e) => onChange({ ...value, home: { ...value.home, nearBusyRoad: e.target.checked } })} className="h-4 w-4 rounded border-stone-300 text-teal-700 focus:ring-teal-700" />
          <span>Home near busy road or construction</span>
        </label>
        <div>
          <span className="block text-sm font-medium text-stone-800">Household sensitivities</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SENSITIVITIES.map(([id, label]) => (
              <button key={id} type="button" onClick={() => toggleSensitivity(id)} className={`min-h-[40px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:translate-y-px whitespace-nowrap shrink-0 ${value.sensitivities.includes(id) ? "border-teal-800 bg-teal-800 text-white" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="min-h-[44px] w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:bg-teal-900 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Building air quality plan..." : "Build Air Quality Plan"}
      </button>
    </form>
  );
}
