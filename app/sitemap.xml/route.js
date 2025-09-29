function url(loc, priority = "0.8") {
  const lastmod = new Date().toISOString()
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>${priority}</priority></url>`
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nanobanana-ai.dev"
  const showcaseSlugs = [
    "remove-background",
    "change-clothing-color",
    "product-ad",
    "storyboard",
    "age-transformation",
    "style-transfer",
  ]

  const urls = [
    url(`${base}/`, "1.0"),
    url(`${base}/generator`, "0.8"),
    url(`${base}/showcase`, "0.7"),
    url(`${base}/developers`, "0.6"),
    url(`${base}/docs`, "0.6"),
    url(`${base}/about`, "0.5"),
    url(`${base}/contact`, "0.5"),
    url(`${base}/privacy`, "0.4"),
    url(`${base}/refunds`, "0.4"),
    url(`${base}/terms`, "0.4"),
    ...showcaseSlugs.map((slug) => url(`${base}/showcase/${slug}`, "0.7")),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
  </urlset>`
  return new Response(xml, { headers: { "Content-Type": "application/xml" } })
}
