import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLdRaw from "./components/JsonLdRaw";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nano Banana – Text-Based Photo Editor · Change Anything. Keep What Matters.",
  description: "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit, replace, and restyle photos with simple text prompts while preserving faces and scene.",
  keywords: [
    "nanobanana",
    "nano banana",
    "AI image editor",
    "Google Gemini 2.5 Flash image editor"
  ],
  metadataBase: new URL("https://www.nanobanana-ai.dev"),
  alternates: { canonical: "/" },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
  openGraph: {
    type: "website",
    url: "https://www.nanobanana-ai.dev/",
    title: "Nano Banana (nanobanana) – AI Image Editor · Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit, replace, and restyle photos with simple text prompts while preserving faces and scene.",
    siteName: "Nano Banana",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Nano Banana – AI Image Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana (nanobanana) – AI Image Editor · Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit, replace, and restyle photos with simple text prompts while preserving faces and scene.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        <link rel="preconnect" href="https://nanobanana.ai" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Nano Banana – Text-Based Photo Editor",
            "description": "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit with simple text prompts while preserving faces and scene.",
            "brand": { "@type": "Brand", "name": "Nano Banana" },
            "url": "https://www.nanobanana-ai.dev/",
            "image": "https://www.nanobanana-ai.dev/og/home.png",
            "offers": { "@type": "Offer", "price": "5", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
          }) }}
        />
      </head>
      <body className={`${inter.className} antialiased h-full safe-area`}>
        <JsonLdRaw id="org-jsonld" data={ORG_JSONLD} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
