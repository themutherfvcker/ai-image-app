import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLdRaw from "./components/JsonLdRaw";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nano Banana – Advanced AI Image Editor | Gemini 2.5 Flash",
  description: "Nanobanana AI image editor powered by Gemini 2.5 Flash. Edit, replace, and restyle photos with simple prompts while preserving faces and scene.",
  keywords: [
    "nanobanana",
    "nano banana",
    "AI image editor",
    "Google Gemini 2.5 Flash image editor"
  ],
  metadataBase: new URL("https://www.nanobanana-ai.dev"),
  alternates: { canonical: "https://www.nanobanana-ai.dev" },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
  openGraph: {
    type: "website",
    url: "https://www.nanobanana-ai.dev",
    title: "Nano Banana – Advanced AI Image Editor | Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Gemini 2.5 Flash. Edit, replace, and restyle photos with simple prompts while preserving faces and scene.",
    siteName: "Nano Banana",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Nanobanana AI image editor · Google Gemini 2.5 Flash" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana – Advanced AI Image Editor | Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Gemini 2.5 Flash. Edit, replace, and restyle photos with simple prompts while preserving faces and scene.",
    images: ["/og/home.png"],
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.nanobanana-ai.dev/#org",
  "name": "Nano Banana",
  "url": "https://www.nanobanana-ai.dev",
  "logo": { "@type": "ImageObject", "url": "https://www.nanobanana-ai.dev/og/home.png" }
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
        <meta property="og:image:alt" content="Nanobanana AI image editor · Google Gemini 2.5 Flash" />
        <meta name="twitter:image:alt" content="Nanobanana AI image editor · Google Gemini 2.5 Flash" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://www.nanobanana-ai.dev/#org",
                "name": "Nano Banana",
                "url": "https://www.nanobanana-ai.dev",
                "logo": "https://www.nanobanana-ai.dev/og/home.png"
              },
              {
                "@type": "WebSite",
                "@id": "https://www.nanobanana-ai.dev/#website",
                "url": "https://www.nanobanana-ai.dev",
                "name": "Nano Banana",
                "publisher": { "@id": "https://www.nanobanana-ai.dev/#org" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.nanobanana-ai.dev/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "WebApplication",
                "@id": "https://www.nanobanana-ai.dev/#app",
                "name": "Nano Banana – AI Image Editor",
                "applicationCategory": "Multimedia",
                "operatingSystem": "Web",
                "url": "https://www.nanobanana-ai.dev"
              }
            ]
          }) }}
        />
      </head>
      <body className={`${inter.className} antialiased h-full safe-area`}>
        {/* Entity JSON-LD provided via @graph in <head> */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
