import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const schema = `CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
)`;

async function ready() { await env.DB.prepare(schema).run(); }

export async function GET() {
  await ready();
  const row = await env.DB.prepare("SELECT content, updated_at FROM site_content WHERE id = 1").first<{ content: string; updated_at: string }>();
  return Response.json(row ? { content: JSON.parse(row.content), updatedAt: row.updated_at } : { content: null });
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });
  const content = await request.json();
  const serialized = JSON.stringify(content);
  if (serialized.length > 150_000) return Response.json({ error: "Inhalt zu groß" }, { status: 413 });
  await ready();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO site_content (id, content, updated_at, updated_by)
    VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at, updated_by = excluded.updated_by`)
    .bind(serialized, now, user.email).run();
  return Response.json({ ok: true, updatedAt: now });
}
