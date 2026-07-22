import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { address?: string };
  const address = body.address?.trim();
  if (!address || address.length < 6) return Response.json({ error: "Bitte eine vollständige Adresse eingeben." }, { status: 400 });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, { headers: { "User-Agent": "Bergluft-Gaestemappe/1.0", "Accept-Language": "de" } });
  if (!response.ok) return Response.json({ error: "Der Adressdienst ist gerade nicht erreichbar. Bitte später erneut versuchen." }, { status: 502 });
  const results = await response.json() as Array<{ lat: string; lon: string; display_name: string }>;
  const match = results[0];
  if (!match) return Response.json({ error: "Adresse nicht gefunden. Bitte Straße, Hausnummer, PLZ und Ort prüfen." }, { status: 404 });

  const latitude = Number(match.lat); const longitude = Number(match.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return Response.json({ error: "Adresse konnte nicht eindeutig bestimmt werden." }, { status: 422 });
  return Response.json({ latitude, longitude, displayName: match.display_name });
}
