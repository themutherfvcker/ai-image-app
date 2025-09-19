import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Nano Banana – AI Image Editor for Text-based Photo Editing",
  description: "Change anything. Keep what matters. Text-based photo edits that preserve faces, identities, and details.",
  metadataBase: new URL("https://www.nanobanana-ai.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.nanobanana-ai.dev/",
    title: "Nano Banana – AI Image Editor",
    description: "Change anything. Keep what matters.",
    siteName: "Nano Banana",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Nano Banana – AI Image Editor" }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana – AI Image Editor",
    description: "Change anything. Keep what matters.",
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
      </head>
      <body className={`${inter.className} antialiased h-full`}>{children}</body>
    </html>
  );
}
