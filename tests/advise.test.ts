import assert from "node:assert/strict";
import dotenv from "dotenv";
import { handleAdvise } from "../src/app/api/advise/route.ts";
import { classifyAqiBand, getAqiReading } from "../src/lib/aqi.ts";
import { AdviseInput, AdviseInputSchema, AdviseOutputSchema } from "../src/lib/schema.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

const SAMPLE_PROFILES: { name: string; input: AdviseInput }[] = [
  {
    name: "Delhi winter smog + two-wheeler + asthma (Hazardous manual AQI)",
    input: {
      city: "New Delhi",
      manualAqi: 325,
      commute: "two-wheeler",
      home: { ventilation: "windows", cookingFuel: "lpg", nearBusyRoad: true },
      sensitivities: ["asthma"],
      outdoorHours: 2,
    },
  },
  {
    name: "Bengaluru commute + biomass cooking + elderly & children (Moderate)",
    input: {
      city: "Bengaluru",
      manualAqi: 78,
      commute: "bus",
      home: { ventilation: "poor", cookingFuel: "biomass", nearBusyRoad: false },
      sensitivities: ["elderly", "children"],
      outdoorHours: 1.5,
    },
  },
  {
    name: "Live Open-Meteo lookup + walk commute + pregnancy",
    input: {
      city: "London",
      commute: "walk",
      home: { ventilation: "ac", cookingFuel: "induction", nearBusyRoad: true },
      sensitivities: ["pregnancy"],
      outdoorHours: 1,
    },
  },
];

async function run() {
  assert.equal(classifyAqiBand(35), "Good");
  assert.equal(classifyAqiBand(80), "Moderate");
  assert.equal(classifyAqiBand(125), "Unhealthy-Sensitive");
  assert.equal(classifyAqiBand(175), "Unhealthy");
  assert.equal(classifyAqiBand(250), "Very Unhealthy");
  assert.equal(classifyAqiBand(350), "Hazardous");

  const fallback = await getAqiReading("NonExistentCityXYZ_999", undefined, 215);
  assert.equal(fallback.source, "manual");
  assert.equal(fallback.fallbackUsed, true);
  assert.equal(fallback.band, "Very Unhealthy");

  for (const profile of SAMPLE_PROFILES) {
    const parsedInput = AdviseInputSchema.safeParse(profile.input);
    assert.ok(parsedInput.success, `Input schema failed for ${profile.name}`);
  }

  const hasKey = Boolean(process.env.LLM_API_KEY || process.env.GEMINI_API_KEY);
  if (!hasKey) {
    console.log("Unit checks passed for all 3 profiles (skipping live LLM call: no API key set).");
    return;
  }

  for (const profile of SAMPLE_PROFILES) {
    const res = await handleAdvise(profile.input);
    assert.equal(res.status, 200, `Expected 200 for ${profile.name}, got ${res.status}`);
    if ("plan" in res.payload) {
      const check = AdviseOutputSchema.safeParse(res.payload.plan);
      assert.ok(check.success, `Output schema failed for ${profile.name}`);
      console.log(`PASS [${profile.name}]: AQI ${res.payload.reading.aqi} (${res.payload.reading.band})`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
