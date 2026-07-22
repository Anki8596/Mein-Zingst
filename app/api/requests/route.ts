import { env } from "cloudflare:workers";

const schema = `CREATE TABLE IF NOT EXISTS guest_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
)`;

export async function POST(request: Request) {
  const data = await request.json();
  if (!data?.type) return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  await env.DB.prepare(schema).run();
  await env.DB.prepare("INSERT INTO guest_requests (type, payload, created_at) VALUES (?, ?, ?)")
    .bind(String(data.type), JSON.stringify(data.payload ?? {}), new Date().toISOString()).run();
  return Response.json({ ok: true });
}
