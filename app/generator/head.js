export default function Head() {
  return (
    <>
      <title>Generator — Nano Banana</title>
      <meta name="description" content="Generate or edit images with text. Change anything and keep what matters." />
      <link rel="canonical" href="https://www.nanobanana-ai.dev/generator" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Generator — Nano Banana" />
      <meta property="og:description" content="Generate or edit images with text. Change anything and keep what matters." />
      <meta property="og:url" content="https://www.nanobanana-ai.dev/generator" />
      <meta property="og:image" content="/og/generator.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Generator — Nano Banana" />
      <meta name="twitter:description" content="Generate or edit images with text. Change anything and keep what matters." />
      <meta name="twitter:image" content="/og/generator.png" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nanobanana-ai.dev/" },
          { "@type": "ListItem", "position": 2, "name": "Generator", "item": "https://www.nanobanana-ai.dev/generator" }
        ]
      }) }} />
    </>
  )
}

// (Removed duplicate Head export)
