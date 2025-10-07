import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent – Background Remover FAQ | Nano Banana",
  description:
    "Transparent background remover FAQs: PNG transparency, file limits, tips, commercial use, and troubleshooting.",
  alternates: { canonical: "https://www.nanobanana-ai.dev/transparent/faq" },
  openGraph: {
    url: "https://www.nanobanana-ai.dev/transparent/faq",
    title: "Transparent – Background Remover FAQ | Nano Banana",
    description:
      "Transparent background remover FAQs: PNG transparency, file limits, tips, commercial use, and troubleshooting.",
  },
  twitter: {
    title: "Transparent – Background Remover FAQ | Nano Banana",
    description:
      "Transparent background remover FAQs: PNG transparency, file limits, tips, commercial use, and troubleshooting.",
  },
};

function TFaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
      <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, "-").toLowerCase()}>{q}</summary>
      <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

export default function Page() {
  const faqs = [
    { q: "What is Transparent?", a: "A background‑removal service that exports clean PNGs with transparency for ecommerce and design." },
    { q: "Which files work best?", a: "High‑resolution PNG/JPG with clear subject/background separation. Avoid heavy compression artifacts." },
    { q: "Does it keep hair and fine edges?", a: "Yes—edge handling is optimized for hair, fur, and semi‑transparent regions where possible." },
    { q: "How do I download a transparent PNG?", a: "Generate, then choose PNG export. The checkerboard preview denotes transparency." },
    { q: "Commercial usage?", a: "Yes—exports can be used commercially subject to our Terms and your rights to the input image." },
    { q: "File limits?", a: "See the upload UI for current size limits (commonly up to 10 MB per image)." },
    { q: "Tips for best cut‑outs?", a: "Use images with contrast between subject and background; prompt with context like ‘keep hair wisps’." },
    { q: "Troubleshooting halos?", a: "Try generating at higher resolution or refine the prompt to clarify edge treatment and background color spill." },
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://www.nanobanana-ai.dev/transparent/faq#page",
            isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
            about: { "@id": "https://www.nanobanana-ai.dev/#app" },
            mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Transparent – Background Remover FAQ</h1>
        <div className="mt-8 grid gap-3">{faqs.map((f) => <TFaqItem key={f.q} {...f} />)}</div>
        <div className="mt-10 flex gap-3">
          <a href="/transparent" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">Open Transparent</a>
          <a href="/pricing" className="rounded-2xl border px-6 py-3 hover:bg-slate-50">View Pricing</a>
        </div>
      </section>
    </main>
  );
}
