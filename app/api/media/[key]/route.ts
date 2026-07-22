import { env } from "cloudflare:workers";

const CHUNK_SIZE = 1024 * 1024;

export async function GET(request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!/^[a-f0-9-]+\.[a-z0-9]+$/i.test(key)) return new Response("Not found", { status: 404 });
  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  if (object.customMetadata?.chunked !== "true") {
    const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  }

  const parts = Number(object.customMetadata.parts); const size = Number(object.customMetadata.size);
  const rangeMatch = request.headers.get("range")?.match(/^bytes=(\d+)-(\d*)$/);
  const start = rangeMatch ? Number(rangeMatch[1]) : 0;
  const end = rangeMatch ? Math.min(rangeMatch[2] ? Number(rangeMatch[2]) : size - 1, size - 1) : size - 1;
  if (!Number.isFinite(size) || size <= 0 || start < 0 || end < start || start >= size) return new Response("Invalid range", { status: 416 });
  const firstPart = Math.floor(start / CHUNK_SIZE) + 1; const lastPart = Math.floor(end / CHUNK_SIZE) + 1;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let part = firstPart; part <= Math.min(lastPart, parts); part++) {
          const partStart = (part - 1) * CHUNK_SIZE; const from = Math.max(start, partStart) - partStart; const to = Math.min(end + 1, partStart + CHUNK_SIZE) - partStart;
          const chunk = await env.MEDIA.get(`${key}.parts/${part}`, { range: { offset: from, length: to - from } });
          if (!chunk) throw new Error("Missing PDF part"); controller.enqueue(new Uint8Array(await chunk.arrayBuffer()));
        }
        controller.close();
      } catch (error) { controller.error(error); }
    }
  });
  const headers = new Headers({ "content-type": "application/pdf", "accept-ranges": "bytes", "content-length": String(end - start + 1), "cache-control": "public, max-age=31536000, immutable" });
  if (rangeMatch) headers.set("content-range", `bytes ${start}-${end}/${size}`);
  return new Response(stream, { status: rangeMatch ? 206 : 200, headers });
}
