import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "16:9 Image Generator FAQ | Nano Banana",
  description:
    "FAQs for the 16:9 image creator: best resolutions, composition tips, YouTube thumbnail sizes, cropping vs outpainting.",
  alternates: { canonical: "https://www.nanobanana-ai.dev/16-9-image-generator/faq" },
  openGraph: {
    url: "https://www.nanobanana-ai.dev/16-9-image-generator/faq",
    title: "16:9 Image Generator FAQ | Nano Banana",
    description:
      "FAQs for the 16:9 image creator: best resolutions, composition tips, YouTube thumbnail sizes, cropping vs outpainting.",
  },
  twitter: {
    title: "16:9 Image Generator FAQ | Nano Banana",
    description:
      "FAQs for the 16:9 image creator: best resolutions, composition tips, YouTube thumbnail sizes, cropping vs outpainting.",
  },
};

function FaqItem169({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
      <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, "-").toLowerCase()}>{q}</summary>
      <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

export default function Page() {
  const faqs = [
    { q: "What is the 16:9 Image Generator?", a: "A tool to generate native 16:9 visuals or convert images while preserving composition." },
    { q: "Best sizes for YouTube thumbnails?", a: "1280×720 is standard; keep important elements within the central safe area for mobile." },
    { q: "Cropping vs outpainting?", a: "Outpainting can extend edges to maintain composition; cropping trims edges and may lose context." },
    { q: "How do I keep text crisp?", a: "Generate at target resolution, use high contrast, and avoid ultra‑thin fonts at small sizes." },
    { q: "Will faces stay consistent across variants?", a: "Yes—use identity cues and the same references for character consistency." },
    { q: "Can I convert vertical (9:16) to 16:9?", a: "Yes—use outpainting prompts to fill sides while matching lighting and style." },
    { q: "What formats can I export?", a: "PNG/JPG; choose PNG for crisp graphics and JPG for photographic content." },
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://www.nanobanana-ai.dev/16-9-image-generator/faq#page",
            isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
            about: { "@id": "https://www.nanobanana-ai.dev/#app" },
            mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">16:9 Image Generator – FAQ</h1>
        <div className="mt-8 grid gap-3">{faqs.map((f) => <FaqItem169 key={f.q} {...f} />)}</div>
        <div className="mt-10 flex gap-3">
          <a href="/16-9-image-generator" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">Open 16:9 Tool</a>
          <a href="/pricing" className="rounded-2xl border px-6 py-3 hover:bg-slate-50">View Pricing</a>
        </div>
      </section>
    </main>
  );
}
