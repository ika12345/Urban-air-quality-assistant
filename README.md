# Urban Air Quality Assistant

A clean, single-page GenAI web application that combines live US AQI and PM2.5 readings from Open-Meteo with a resident's commute, home ventilation, cooking fuel, and health sensitivities to generate tailored outdoor routines, low-cost indoor air quality hacks, and low-emission swaps.

## How It Works

1. **Validate Input**: `POST /api/advise` validates the user profile (`city` and/or `manualAqi`, `commute`, `home`, `sensitivities`, `outdoorHours`) with `zod`.
2. **Fetch Live AQI or Fallback**: `src/lib/aqi.ts` geocodes the city via Open-Meteo and fetches current US AQI and PM2.5, classifying it into the 6 US AQI bands (`0–50 Good` through `301+ Hazardous`). If `manualAqi` is supplied or Open-Meteo fails with a fallback value, manual AQI is used seamlessly.
3. **Generate & Validate Plan**: `src/lib/prompts.ts` injects the exact AQI facts and profile into `src/lib/llm.ts` (`generate(system, user)`). The server parses and validates the JSON response with `zod`, retrying **once** with validation errors appended if the first output is malformed.
4. **Render Actionable UI**: `src/app/page.tsx` displays a color-coded AQI badge, loading skeleton, clear error recovery, and visible *"Why this helps"* explanations on every recommendation.

## Setup & Running

```bash
npm install
# Add GEMINI_API_KEY (or LLM_API_KEY in .env.local)
npm run dev
```

Run tests across the 3 sample profiles:

```bash
npx tsx tests/advise.test.ts
```

## Prompt Design Notes

- **Fact Grounding in Code, Not Model Memory**: AQI, PM2.5, and the US AQI band are computed deterministically in `src/lib/aqi.ts` and injected into the user prompt with strict instructions never to invent numbers or percentages.
- **Band & Sensitivity Differentiation**: The system prompt instructs the model to shift outdoor time windows, mask guidance, and indoor sealing behavior across bands (e.g., `Moderate` vs. `Hazardous`) and vulnerable groups (`asthma`, `children`, `elderly`, `pregnancy`).
- **Hedged Qualitative Benefits**: To avoid hallucinated precision, `estimatedBenefit` uses qualitative phrasing (*"can noticeably reduce exposure"*) rather than fabricated percentages.
- **Cost & Local Relevance**: Prompts prioritize free or low-cost measures first and include India-relevant urban context (LPG/biomass cooking smoke, two-wheeler N95 masks, winter inversion/stubble-burning haze, roadside dust).
- **Strict JSON + Single-Retry Guardrail**: `SYSTEM_PROMPT` enforces raw JSON output without markdown fences, and `/api/advise` retries once with exact `zod` path/message errors if schema validation fails.
