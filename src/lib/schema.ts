import { z } from "zod";

export const AqiBandSchema = z.enum([
  "Good", "Moderate", "Unhealthy-Sensitive", "Unhealthy", "Very Unhealthy", "Hazardous",
]);
export const CommuteSchema = z.enum(["walk", "bike", "bus", "car", "two-wheeler", "work-from-home"]);
export const SensitivitySchema = z.enum(["asthma", "children", "elderly", "pregnancy", "none"]);

export const AdviseInputSchema = z
  .object({
    city: z.string().trim().optional(),
    manualAqi: z.number().finite().min(0).max(1000).optional(),
    commute: CommuteSchema,
    home: z.object({
      ventilation: z.enum(["windows", "ac", "both", "poor"]),
      cookingFuel: z.enum(["lpg", "induction", "biomass", "other"]),
      nearBusyRoad: z.boolean(),
    }),
    sensitivities: z.array(SensitivitySchema).min(1),
    outdoorHours: z.number().finite().min(0).max(24).optional(),
  })
  .refine((d) => Boolean(d.city && d.city.length > 0) || d.manualAqi !== undefined, {
    message: "Please provide either a city name or a manual AQI value.",
    path: ["city"],
  });

const nonEmpty = z.string().trim().min(1);

export const AdviseOutputSchema = z.object({
  summary: nonEmpty,
  aqiBand: AqiBandSchema,
  outdoorRoutine: z.array(z.object({
    action: nonEmpty, timing: nonEmpty, why: nonEmpty, impact: z.enum(["low", "medium", "high"]),
  })).min(3).max(5),
  indoorHacks: z.array(z.object({
    hack: nonEmpty, cost: z.enum(["free", "low", "medium"]), why: nonEmpty,
  })).min(4).max(6),
  lowEmissionSwaps: z.array(z.object({
    swap: nonEmpty, estimatedBenefit: nonEmpty,
  })).min(2).max(3),
  healthNote: nonEmpty,
  disclaimer: nonEmpty,
});

export type AqiBand = z.infer<typeof AqiBandSchema>;
export type AdviseInput = z.infer<typeof AdviseInputSchema>;
export type AdviseOutput = z.infer<typeof AdviseOutputSchema>;

export interface AqiReading {
  aqi: number;
  pm25: number | null;
  band: AqiBand;
  city: string;
  source: "open-meteo" | "manual";
  fallbackUsed: boolean;
}

export interface AdviseApiResponse {
  reading: AqiReading;
  plan: AdviseOutput;
}
