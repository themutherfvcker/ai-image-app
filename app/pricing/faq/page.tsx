import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Credits – FAQ | Nano Banana",
  description:
    "FAQ about pricing, credits, rollover, refunds, invoices, taxes/VAT, and cancellations.",
  alternates: { canonical: "https://www.nanobanana-ai.dev/pricing/faq" },
  openGraph: {
    url: "https://www.nanobanana-ai.dev/pricing/faq",
    title: "Pricing & Credits – FAQ | Nano Banana",
    description:
      "FAQ about pricing, credits, rollover, refunds, invoices, taxes/VAT, and cancellations.",
  },
  twitter: {
    title: "Pricing & Credits – FAQ | Nano Banana",
    description:
      "FAQ about pricing, credits, rollover, refunds, invoices, taxes/VAT, and cancellations.",
  },
};

function PriceFaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
      <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, "-").toLowerCase()}>{q}</summary>
      <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

export default function Page() {
  const faqs = [
    { q: "Is there a free trial?", a: "Yes—new users can start with free credits to try core features." },
    { q: "How do credits work?", a: "Each edit or generation uses credits; advanced options may consume more." },
    { q: "Do credits roll over?", a: "On paid plans, unused credits may roll into the next cycle—see plan details." },
    { q: "Which plans exist?", a: "Basic, Standard, and Premium with different monthly credits/speeds and support levels." },
    { q: "Payment methods & invoices?", a: "Major cards via Stripe; downloadable invoices available in your account. Taxes/VAT may apply." },
    { q: "Can I cancel anytime?", a: "Yes—you can cancel from your account; access continues until the current period ends." },
    { q: "Refunds?", a: "See our Refunds policy; contact support if something isn’t working as expected." },
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://www.nanobanana-ai.dev/pricing/faq#page",
            isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
            about: { "@id": "https://www.nanobanana-ai.dev/#app" },
            mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Pricing & Credits – FAQ</h1>
        <div className="mt-8 grid gap-3">{faqs.map((f) => <PriceFaqItem key={f.q} {...f} />)}</div>
        <div className="mt-10 flex gap-3">
          <a href="/pricing" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">See Plans</a>
          <a href="/app" className="rounded-2xl border px-6 py-3 hover:bg-slate-50">Open the Editor</a>
        </div>
      </section>
    </main>
  );
}
