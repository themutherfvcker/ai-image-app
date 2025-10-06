import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
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
  openGraph: {
    type: "website",
    url: "https://www.nanobanana-ai.dev/",
    title: "Nano Banana (nanobanana) – AI Image Editor · Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit, replace, and restyle photos with simple text prompts while preserving faces and scene.",
    siteName: "Nano Banana",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Nanobanana AI image editor · Google Gemini 2.5 Flash" }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana (nanobanana) – AI Image Editor · Gemini 2.5 Flash",
    description: "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit, replace, and restyle photos with simple text prompts while preserving faces and scene.",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({ children }) {
  const inter = Inter({ subsets: ["latin"], display: "swap" });
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:image:alt" content="Nanobanana AI image editor · Google Gemini 2.5 Flash" />
        <meta name="twitter:image:alt" content="Nanobanana AI image editor · Google Gemini 2.5 Flash" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://www.nanobanana-ai.dev/",
          "name": "Nano Banana",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.nanobanana-ai.dev/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Nano Banana – AI Image Editor",
          "url": "https://www.nanobanana-ai.dev/",
          "applicationCategory": "Multimedia",
          "operatingSystem": "Web",
          "description": "Nanobanana AI image editor powered by Google Gemini 2.5 Flash image editor—edit with simple text prompts while preserving faces and scene.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }) }}
      />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nano Banana",
            "url": "https://www.nanobanana-ai.dev/",
            "logo": "https://www.nanobanana-ai.dev/og/home.png",
            "sameAs": [
              "https://x.com/", "https://github.com/"
            ]
          }) }}
        />
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
      <body className={`${inter.className} antialiased h-full`}>{children}</body>
    </html>
  );
}
