import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Bergluft – Digitale Gästemappe", short_name: "Bergluft", description: "Ihre digitale Gästemappe für unterwegs und in der Unterkunft.", start_url: "/", display: "standalone", background_color: "#f5f1e8", theme_color: "#315c4c", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}
