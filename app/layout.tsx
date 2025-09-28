import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "./components/JsonLd";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nano Banana – Text-Based Photo Editor · Change Anything. Keep What Matters.",
  description: "Edit images with plain-English prompts. Preserve faces, identity and scene while changing anything else. Try free.",
  metadataBase: new URL("https://www.nanobanana-ai.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.nanobanana-ai.dev/",
    title: "Nano Banana – Text-Based Photo Editor",
    description: "Edit images with plain-English prompts. Preserve faces, identity and scene.",
    siteName: "Nano Banana",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Nano Banana – AI Image Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana – Text-Based Photo Editor",
    description: "Edit images with plain-English prompts. Preserve faces, identity and scene.",
    images: ["/og/home.png"],
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.nanobanana-ai.dev/#org",
  "name": "Nano Banana",
  "url": "https://www.nanobanana-ai.dev/"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Nano Banana – Text-Based Photo Editor",
            "description": "Edit images with plain-English prompts while preserving faces, identity and scene.",
            "brand": { "@type": "Brand", "name": "Nano Banana" },
            "url": "https://www.nanobanana-ai.dev/",
            "image": "https://www.nanobanana-ai.dev/og/home.png",
            "offers": { "@type": "Offer", "price": "5", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
          }) }}
        />
      </head>
      <body className={`${inter.className} antialiased h-full`}>
        <JsonLd id="org-jsonld" data={ORG_JSONLD} />
        {children}
      </body>
    </html>
  );
}
