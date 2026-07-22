import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Bergluft – Digitale Gästemappe",
  description: "Ihr digitaler Begleiter für einen entspannten Aufenthalt im Bergluft Chalet & Spa.",
  openGraph: {
    title: "Bergluft – Digitale Gästemappe",
    description: "Alles für einen entspannten Aufenthalt.",
    type: "website",
    locale: "de_DE",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Bergluft – Ihre digitale Gästemappe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bergluft – Digitale Gästemappe",
    description: "Alles für einen entspannten Aufenthalt.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
