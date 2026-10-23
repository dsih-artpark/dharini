// The eBird API key is now accessed server‑side via the backend proxy.
// Remove the public exposure – the client should call our own endpoint.
// export const EBIRD_API_KEY = process.env.NEXT_PUBLIC_EBIRD_API_KEY || '';
// OWM API key is intentionally omitted for security; weather data will be unavailable without a valid key.
// const OWM_API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || '';
// openweathermap.org

import apiClient from "@/src/libs/apiClient";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: string;
  windDeg: number;
  description: string;
  icon: string;
  cityName: string;
  visibility: string | null;
  rain: number;
  dewPoint: number;
}

export interface HistoricalWeatherData {
  maxTemp: number | null;
  minTemp: number | null;
  avgMaxTemp: number | null;
  avgMinTemp: number | null;
  totalPrecip: string | null;
  avgHumidity: number | null;
  days: number;
  dailyData: {
    date: string;
    maxTemp: number;
    minTemp: number;
    precip: number;
    humidity: number;
  }[];
}

export async function fetchWeather(
  lat: number | null | undefined,
  lng: number | null | undefined,
): Promise<WeatherData | null> {
  try {
    if (lat == null || lng == null) return null;
    // Routed through apiClient so this carries the Bearer token — the
    // backend's /geolens/* routes now require auth.
    const res = await apiClient.get("/geolens/weather", {
      params: { lat, lng },
    });
    return res.data?.data ?? null;
  } catch (e) {
    console.error("fetchWeather failed:", e);
    return null;
  }
}

export async function fetchHistoricalWeather(
  lat: number | null | undefined,
  lng: number | null | undefined,
): Promise<HistoricalWeatherData | null> {
  try {
    if (lat == null || lng == null) return null;
    const res = await apiClient.get("/geolens/weather/historical", {
      params: { lat, lng },
    });
    return res.data?.data ?? null;
  } catch (e) {
    console.error("fetchHistoricalWeather failed:", e);
    return null;
  }
}

/**
 * Fetch recent eBird observations via the backend proxy.
 * The frontend no longer needs the public eBird API key.
 */
export async function fetchEbirdObservations(
  lat: number,
  lng: number,
  dist?: number,
  back?: number,
): Promise<unknown[]> {
  try {
    const res = await apiClient.get("/geolens/ebird", {
      params: { lat, lng, dist, back },
    });
    return res.data?.data ?? [];
  } catch (e) {
    console.error("fetchEbirdObservations failed:", e);
    return [];
  }
}
