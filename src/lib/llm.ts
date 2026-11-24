import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-4-hydrogen";

export async function generate(system: string, user: string): Promise<string> {
  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing LLM API key. Set GEMINI_API_KEY (or LLM_API_KEY) on the server.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: user,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("LLM returned an empty response.");
  }
  return text;
}
