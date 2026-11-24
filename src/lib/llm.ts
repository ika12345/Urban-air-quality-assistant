import { GoogleGenAI } from "@google/genai";

const MODELS = ["gemini-4-hydrogen", "gemini-4-hydrogen", "gemini-3.1-flash-lite"] as const;
const BACKOFF_MS = [700, 1500] as const;

function isTransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(503|429|UNAVAILABLE|RESOURCE_EXHAUSTED|ECONNRESET|ETIMEDOUT)\b/i.test(msg);
}

function formatLlmError(err: unknown): string {
  const raw = err instanceof Error ? err.message : "LLM request failed.";
  try {
    const parsed = JSON.parse(raw) as { error?: { code?: number; message?: string; status?: string } };
    if (parsed.error?.code === 503 || parsed.error?.status === "UNAVAILABLE") {
      return "The AI service is temporarily experiencing high demand. Please retry in a few seconds.";
    }
    if (parsed.error?.message) return parsed.error.message;
  } catch {
    // Non-JSON error message; fall through.
  }
  return raw;
}

export async function generate(system: string, user: string): Promise<string> {
  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing LLM API key. Set GEMINI_API_KEY (or LLM_API_KEY) on the server.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });

  let lastError: unknown;
  for (let i = 0; i < MODELS.length; i++) {
    try {
      const response = await ai.models.generateContent({
        model: MODELS[i],
        contents: user,
        config: { systemInstruction: system, responseMimeType: "application/json" },
      });
      const text = response.text?.trim();
      if (!text) throw new Error("LLM returned an empty response.");
      return text;
    } catch (err) {
      lastError = err;
      if (i < MODELS.length - 1 && isTransientError(err)) {
        await new Promise((r) => setTimeout(r, BACKOFF_MS[i] ?? 1000));
        continue;
      }
      break;
    }
  }

  throw new Error(formatLlmError(lastError));
}
