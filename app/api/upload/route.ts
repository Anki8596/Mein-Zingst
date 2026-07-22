import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Keine Datei" }, { status: 400 });
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const supported = file.type.startsWith("image/") || isPdf;
  if (!supported || file.size > 15_000_000) return Response.json({ error: "Bitte ein Bild oder PDF bis 15 MB wählen" }, { status: 400 });
  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: isPdf ? "application/pdf" : file.type } });
  const url = `/api/media/${key}`;
  const categoryId = form.get("categoryId");
  const itemId = form.get("itemId");
  const field = form.get("field");
  let persisted = false;
  if (typeof categoryId === "string" && typeof itemId === "string" && field === "brochure") {
    const row = await env.DB.prepare("SELECT content FROM site_content WHERE id = 1").first<{ content: string }>();
    if (row) {
      const content = JSON.parse(row.content);
      const category = content.categories?.find((entry: { id: string }) => entry.id === categoryId);
      const item = category?.items?.find((entry: { id: string }) => entry.id === itemId);
      if (item) {
        item.brochure = url;
        await env.DB.prepare("UPDATE site_content SET content = ?, updated_at = ?, updated_by = ? WHERE id = 1")
          .bind(JSON.stringify(content), new Date().toISOString(), user.email).run();
        persisted = true;
      }
    }
  }
  return Response.json({ url, persisted });
}
