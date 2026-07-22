import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";

const MAX_SIZE = 5_000_000_000;

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });
  const action = new URL(request.url).searchParams.get("action");

  if (action === "init") {
    const { name, size } = await request.json<{ name: string; size: number }>();
    if (!name?.toLowerCase().endsWith(".pdf") || !Number.isFinite(size) || size <= 0 || size > MAX_SIZE)
      return Response.json({ error: "Bitte eine PDF bis maximal 5 GB auswählen" }, { status: 400 });
    return Response.json({ key: `${crypto.randomUUID()}.pdf`, uploadId: crypto.randomUUID(), size });
  }

  if (action === "part") {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const partNumber = Number(url.searchParams.get("partNumber"));
    if (!key || !/^[a-f0-9-]+\.pdf$/i.test(key) || !Number.isInteger(partNumber) || partNumber < 1 || !request.body)
      return Response.json({ error: "Ungültiger PDF-Teil" }, { status: 400 });
    await env.MEDIA.put(`${key}.parts/${partNumber}`, request.body, { httpMetadata: { contentType: "application/octet-stream" } });
    return Response.json({ partNumber, etag: String(partNumber) });
  }

  if (action === "complete") {
    const { key, parts, categoryId, itemId, size } = await request.json<{
      key: string; parts: Array<{ partNumber: number }>; categoryId: string; itemId: string; size?: number;
    }>();
    if (!key || !parts?.length || !/^[a-f0-9-]+\.pdf$/i.test(key)) return Response.json({ error: "Upload ist unvollständig" }, { status: 400 });
    const totalSize = Number(size) || 0;
    await env.MEDIA.put(key, JSON.stringify({ chunked: true, parts: parts.length, size: totalSize }), {
      httpMetadata: { contentType: "application/pdf" }, customMetadata: { chunked: "true", parts: String(parts.length), size: String(totalSize) }
    });
    const mediaUrl = `/api/media/${key}`;
    let persisted = false;
    const row = await env.DB.prepare("SELECT content FROM site_content WHERE id = 1").first<{ content: string }>();
    if (row) {
      const content = JSON.parse(row.content);
      const category = content.categories?.find((entry: { id: string }) => entry.id === categoryId);
      const item = category?.items?.find((entry: { id: string }) => entry.id === itemId);
      if (item) {
        item.brochure = mediaUrl;
        await env.DB.prepare("UPDATE site_content SET content = ?, updated_at = ?, updated_by = ? WHERE id = 1")
          .bind(JSON.stringify(content), new Date().toISOString(), user.email).run();
        persisted = true;
      }
    }
    return Response.json({ url: mediaUrl, persisted });
  }

  return Response.json({ error: "Unbekannte Upload-Aktion" }, { status: 400 });
}
