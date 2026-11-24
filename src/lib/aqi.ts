import type { AqiBand, AqiReading } from "./schema.ts";

interface GeoResponse {
  results?: Array<{ name: string; country?: string; latitude: number; longitude: number }>;
}

interface AirQualityResponse {
  current?: { us_aqi?: number | null; pm2_5?: number | null };
}

export function classifyAqiBand(aqi: number): AqiBand {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy-Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

async function fetchOpenMeteo(city: string): Promise<AqiReading> {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!geoRes.ok) throw new Error(`Geocoding lookup failed (${geoRes.status}).`);
  const place = ((await geoRes.json()) as GeoResponse).results?.[0];
  if (!place) throw new Error(`City "${city}" was not found. Try a nearby major city or enter a manual AQI.`);

  const aqiRes = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&current=us_aqi,pm2_5`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!aqiRes.ok) throw new Error(`Open-Meteo Air Quality request failed (${aqiRes.status}).`);

  const current = ((await aqiRes.json()) as AirQualityResponse).current;
  if (typeof current?.us_aqi !== "number" || Number.isNaN(current.us_aqi)) {
    throw new Error(`Live AQI reading unavailable for "${place.name}".`);
  }

  const aqi = Math.round(current.us_aqi);
  const pm25 = typeof current.pm2_5 === "number" ? Number(current.pm2_5.toFixed(1)) : null;
  return {
    aqi,
    pm25,
    band: classifyAqiBand(aqi),
    city: place.country ? `${place.name}, ${place.country}` : place.name,
    source: "open-meteo",
    fallbackUsed: false,
  };
}

export async function getAqiReading(city?: string, manualAqi?: number, fallbackAqi?: number): Promise<AqiReading> {
  const cleanCity = city?.trim();
  if (manualAqi !== undefined) {
    return {
      aqi: Math.round(manualAqi), pm25: null, band: classifyAqiBand(manualAqi),
      city: cleanCity || "Manual Reading", source: "manual", fallbackUsed: Boolean(cleanCity),
    };
  }
  if (cleanCity) {
    try {
      return await fetchOpenMeteo(cleanCity);
    } catch (err) {
      if (fallbackAqi !== undefined) {
        return {
          aqi: Math.round(fallbackAqi), pm25: null, band: classifyAqiBand(fallbackAqi),
          city: cleanCity, source: "manual", fallbackUsed: true,
        };
      }
      throw err instanceof Error ? err : new Error("Failed to fetch live AQI.");
    }
  }
  throw new Error("Provide a city name or manual AQI value.");
}
