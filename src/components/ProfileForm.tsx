import { AdviseInput } from "../lib/schema";

interface ProfileFormProps {
  value: AdviseInput;
  loading: boolean;
  onChange: (next: AdviseInput) => void;
  onSubmit: () => void;
}

type Sensitivity = AdviseInput["sensitivities"][number];
const SENSITIVITIES: [Sensitivity, string][] = [["none", "None"], ["asthma", "Asthma"], ["children", "Children"], ["elderly", "Elderly"], ["pregnancy", "Pregnancy"]];
const COMMUTES: [AdviseInput["commute"], string][] = [["two-wheeler", "Two-wheeler"], ["walk", "Walk"], ["bike", "Bicycle"], ["bus", "Bus / Metro"], ["car", "Car"], ["work-from-home", "Work from home"]];
const VENTS: [AdviseInput["home"]["ventilation"], string][] = [["windows", "Windows"], ["ac", "AC"], ["both", "Both"], ["poor", "Poor / closed"]];
const FUELS: [AdviseInput["home"]["cookingFuel"], string][] = [["lpg", "LPG gas"], ["induction", "Induction"], ["biomass", "Biomass / wood"], ["other", "Other"]];
const fieldCls = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none";

export function ProfileForm({ value, loading, onChange, onSubmit }: ProfileFormProps) {
  function toggleSensitivity(item: Sensitivity) {
    if (item === "none") return onChange({ ...value, sensitivities: ["none"] });
    const rest = value.sensitivities.filter((s) => s !== "none");
    const next = rest.includes(item) ? rest.filter((s) => s !== item) : [...rest, item];
    onChange({ ...value, sensitivities: next.length > 0 ? next : ["none"] });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Your Location & Profile</h2>
        <p className="mt-0.5 text-xs text-slate-500">Enter a city for live AQI or set a manual AQI override.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block text-sm"><span className="font-medium text-slate-700">City</span>
          <input type="text" value={value.city ?? ""} onChange={(e) => onChange({ ...value, city: e.target.value })} placeholder="e.g. New Delhi, Mumbai, London" className={fieldCls} />
        </label>
        <label className="block text-sm"><span className="font-medium text-slate-700">Manual AQI (optional)</span>
          <input type="number" min={0} max={1000} value={value.manualAqi ?? ""} onChange={(e) => onChange({ ...value, manualAqi: e.target.value === "" ? undefined : Number(e.target.value) })} placeholder="Leave blank for live AQI" className={`${fieldCls} font-mono tabular-nums`} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm"><span className="font-medium text-slate-700">Commute</span>
          <select value={value.commute} onChange={(e) => onChange({ ...value, commute: e.target.value as AdviseInput["commute"] })} className={fieldCls}>
            {COMMUTES.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
        <label className="block text-sm"><span className="font-medium text-slate-700">Outdoor hrs/day</span>
          <input type="number" min={0} max={24} step={0.5} value={value.outdoorHours ?? ""} onChange={(e) => onChange({ ...value, outdoorHours: e.target.value === "" ? undefined : Number(e.target.value) })} className={`${fieldCls} font-mono tabular-nums`} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm"><span className="font-medium text-slate-700">Ventilation</span>
          <select value={value.home.ventilation} onChange={(e) => onChange({ ...value, home: { ...value.home, ventilation: e.target.value as AdviseInput["home"]["ventilation"] } })} className={fieldCls}>
            {VENTS.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
        <label className="block text-sm"><span className="font-medium text-slate-700">Cooking fuel</span>
          <select value={value.home.cookingFuel} onChange={(e) => onChange({ ...value, home: { ...value.home, cookingFuel: e.target.value as AdviseInput["home"]["cookingFuel"] } })} className={fieldCls}>
            {FUELS.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
        </label>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
        <input type="checkbox" checked={value.home.nearBusyRoad} onChange={(e) => onChange({ ...value, home: { ...value.home, nearBusyRoad: e.target.checked } })} className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600" />
        <span>Home is near a busy road or construction</span>
      </label>
      <div>
        <span className="block text-sm font-medium text-slate-700">Household sensitivities</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {SENSITIVITIES.map(([id, label]) => (
            <button key={id} type="button" onClick={() => toggleSensitivity(id)} className={`min-h-[36px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${value.sensitivities.includes(id) ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="min-h-[44px] w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Generating tailored plan..." : "Get Air Quality Plan"}
      </button>
    </form>
  );
}
