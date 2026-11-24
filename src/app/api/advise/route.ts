import { getAqiReading } from "../../../lib/aqi.ts";
import { generate } from "../../../lib/llm.ts";
import { buildUserPrompt, SYSTEM_PROMPT } from "../../../lib/prompts.ts";
import { AdviseApiResponse, AdviseInputSchema, AdviseOutput, AdviseOutputSchema } from "../../../lib/schema.ts";

function validatePlan(raw: string): { ok: true; data: AdviseOutput } | { ok: false; error: string } {
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const result = AdviseOutputSchema.safeParse(JSON.parse(cleaned));
    if (result.success) return { ok: true, data: result.data };
    return { ok: false, error: result.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`).join("; ") };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? `Invalid JSON: ${err.message}` : "Invalid JSON output" };
  }
}

export async function handleAdvise(body: unknown): Promise<{ status: number; payload: AdviseApiResponse | { error: string } }> {
  const parsed = AdviseInputSchema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, payload: { error: parsed.error.issues.map((i) => i.message).join("; ") || "Invalid request payload." } };
  }

  let reading;
  try {
    reading = await getAqiReading(parsed.data.city, parsed.data.manualAqi);
  } catch (err) {
    return { status: 422, payload: { error: err instanceof Error ? err.message : "Failed to retrieve AQI reading." } };
  }

  const userPrompt = buildUserPrompt(parsed.data, reading);
  try {
    const first = validatePlan(await generate(SYSTEM_PROMPT, userPrompt));
    if (first.ok) return { status: 200, payload: { reading, plan: { ...first.data, aqiBand: reading.band } } };

    const retryPrompt = `${userPrompt}\n\nYour previous JSON failed validation:\n${first.error}\nReturn strictly valid JSON only.`;
    const second = validatePlan(await generate(SYSTEM_PROMPT, retryPrompt));
    if (second.ok) return { status: 200, payload: { reading, plan: { ...second.data, aqiBand: reading.band } } };

    return { status: 502, payload: { error: `Model output invalid after retry (${second.error}).` } };
  } catch (err) {
    return { status: 502, payload: { error: err instanceof Error ? err.message : "LLM request failed." } };
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const result = await handleAdvise(await request.json());
    return Response.json(result.payload, { status: result.status });
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }
}
