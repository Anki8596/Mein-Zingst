export async function GET(request: Request) {
  const url = new URL(request.url); const latitude = Number(url.searchParams.get("lat")); const longitude = Number(url.searchParams.get("lon"));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return Response.json({ error: "Ungültiger Standort." }, { status: 400 });
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", String(latitude)); endpoint.searchParams.set("longitude", String(longitude)); endpoint.searchParams.set("timezone", "auto"); endpoint.searchParams.set("forecast_days", "7"); endpoint.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  const response = await fetch(endpoint); if (!response.ok) return Response.json({ error: "Der Wetterdienst ist gerade nicht erreichbar." }, { status: 502 });
  const data = await response.json() as { daily?: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] } };
  if (!data.daily) return Response.json({ error: "Keine Wetterdaten verfügbar." }, { status: 502 });
  return Response.json({ days: data.daily.time.map((date, index) => ({ date, code: data.daily!.weather_code[index], max: data.daily!.temperature_2m_max[index], min: data.daily!.temperature_2m_min[index], rain: data.daily!.precipitation_probability_max[index] })) });
}
