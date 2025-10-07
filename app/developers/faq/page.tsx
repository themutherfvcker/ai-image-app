import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers – API FAQ | Nano Banana",
  description:
    "Nano Banana API FAQs: endpoints, auth, quotas, webhooks, SDKs, and pricing for integrations.",
  alternates: { canonical: "https://www.nanobanana-ai.dev/developers/faq" },
  openGraph: {
    url: "https://www.nanobanana-ai.dev/developers/faq",
    title: "Developers – API FAQ | Nano Banana",
    description:
      "Nano Banana API FAQs: endpoints, auth, quotas, webhooks, SDKs, and pricing for integrations.",
  },
  twitter: {
    title: "Developers – API FAQ | Nano Banana",
    description:
      "Nano Banana API FAQs: endpoints, auth, quotas, webhooks, SDKs, and pricing for integrations.",
  },
};

function DevFaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
      <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, "-").toLowerCase()}>{q}</summary>
      <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

export default function Page() {
  const faqs = [
    { q: "Is there an API?", a: "We’re preparing API access to integrate editing/generation into apps and workflows." },
    { q: "What can I automate?", a: "Programmatic edits, text‑to‑image jobs, batch runs, and retrieval of results." },
    { q: "Do you support webhooks?", a: "Planned: job status webhooks and async result retrieval." },
    { q: "Rate limits and quotas?", a: "Tied to plan tier; details will be documented in the API reference." },
    { q: "Auth & keys?", a: "API keys scoped to your account; rotate/regenerate via the dashboard." },
    { q: "SDKs?", a: "Client examples in JS/TS will be provided along with REST endpoints." },
    { q: "Pricing for API?", a: "Usage‑based with credits; enterprise plans available for higher throughput." },
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://www.nanobanana-ai.dev/developers/faq#page",
            isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
            about: { "@id": "https://www.nanobanana-ai.dev/#app" },
            mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Developers – API FAQ</h1>
        <div className="mt-8 grid gap-3">{faqs.map((f) => <DevFaqItem key={f.q} {...f} />)}</div>
        <div className="mt-10 flex gap-3">
          <a href="/developers" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">Open Developer Docs</a>
          <a href="/pricing" className="rounded-2xl border px-6 py-3 hover:bg-slate-50">View Pricing</a>
        </div>
      </section>
    </main>
  );
}
