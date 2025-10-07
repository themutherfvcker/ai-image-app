import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ – Nano Banana AI Image Editor",
  description:
    "Answers about Nano Banana: what it is, features, pricing, credits, commercial use, privacy, availability, troubleshooting, and more.",
  alternates: { canonical: "https://www.nanobanana-ai.dev/faq" },
  openGraph: {
    url: "https://www.nanobanana-ai.dev/faq",
    title: "FAQ – Nano Banana AI Image Editor",
    description:
      "Answers about Nano Banana: what it is, features, pricing, credits, commercial use, privacy, availability, troubleshooting, and more.",
  },
  twitter: {
    title: "FAQ – Nano Banana AI Image Editor",
    description:
      "Answers about Nano Banana: what it is, features, pricing, credits, commercial use, privacy, availability, troubleshooting, and more.",
  },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
      <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, "-").toLowerCase()}>{q}</summary>
      <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

export default function Page() {
  const brand = [
    {
      q: "What is Nano Banana?",
      a: "Nano Banana is an advanced AI image editor for natural‑language image editing and generation, including background swaps, object removal, style changes, character consistency, and multi‑image composition.",
    },
    {
      q: "Is \"nanobanana\" the same as Nano Banana?",
      a: "Yes—people often type \"nanobanana\". Both refer to our AI image editor brand and product.",
    },
    {
      q: "Is Nano Banana powered by Google’s Gemini 2.5 Flash Image?",
      a: "Yes. We utilize Google’s Gemini 2.5 Flash Image to deliver fast, high‑quality text‑based editing and generation.",
    },
    {
      q: "Who is Nano Banana for?",
      a: "Creators, businesses, marketers, developers, ecommerce teams, and anyone who needs fast, reliable image edits.",
    },
    {
      q: "What makes Nano Banana different?",
      a: "Focus on conversational edits, character consistency, and seamless scene preservation—plus simple, prompt‑based workflows.",
    },
  ];

  const product = [
    {
      q: "What can I do with the editor?",
      a: "Remove/replace objects, change backgrounds, recolor items, adjust lighting/styles, preserve identity, and merge images—using plain prompts.",
    },
    {
      q: "Do you support image‑to‑image and text‑to‑image?",
      a: "Yes—start from an existing photo or generate from scratch with a text prompt.",
    },
    {
      q: "What is character consistency?",
      a: "Keeping the same person’s face/identity across edits and variations for coherent results.",
    },
    {
      q: "Do I need to mask or use layers?",
      a: "No—describe the change in natural language; the editor handles masking and blending.",
    },
    {
      q: "Which formats and aspect ratios are supported?",
      a: "Uploads: PNG/JPG (plus WEBP where noted). Downloads: PNG/JPG. Aspect ratios include 1:1, 3:4, 4:3, 16:9, 9:16.",
    },
  ];

  const services = [
    {
      q: "What is the 16:9 Image Generator?",
      a: "A dedicated tool for native 16:9 images or conversions—ideal for YouTube thumbnails and hero banners.",
    },
    {
      q: "What is the Transparent background remover?",
      a: "A workflow that removes backgrounds and exports clean transparent PNGs for ecommerce and design.",
    },
    {
      q: "Do you offer batch editing as a service?",
      a: "Yes—contact us for managed/bulk editing of catalogs, ads, or large photo sets.",
    },
    {
      q: "Do you offer prompt packs or consulting?",
      a: "We can provide prompt templates and tailor playbooks for your brand/use cases.",
    },
  ];

  const pricing = [
    { q: "Is there a free trial?", a: "Yes—start with free credits to try core features." },
    {
      q: "How do credits work and do they roll over?",
      a: "Each generation/edit uses credits. On paid plans, unused credits may roll into the next cycle—see Pricing for details.",
    },
    { q: "What plans are available?", a: "We offer Basic, Standard, and Premium tiers with different monthly credits and speeds." },
    { q: "What payment methods do you accept?", a: "Major cards via Stripe; taxes/VAT may apply based on your location." },
    { q: "Can I cancel anytime?", a: "Yes—manage your subscription in your account; access continues until the end of the current period." },
  ];

  const policy = [
    { q: "Can I use outputs commercially?", a: "Yes—you own your exported results subject to our Terms and the rights to any materials you upload." },
    { q: "What is SynthID?", a: "A hidden AI provenance watermark used by Google to help identify AI‑generated imagery." },
    { q: "Are there content restrictions?", a: "Yes—we prohibit illegal, harmful, or disallowed content. See Terms/Acceptable Use." },
    { q: "How do you handle privacy and data?", a: "We store the minimum needed to run edits and improve reliability; deletion and opt‑outs are available—see Privacy Policy." },
  ];

  const geo = [
    { q: "Is Nano Banana available in my country?", a: "Yes—available globally where permitted by law. Taxes/VAT may apply depending on your billing country." },
    { q: "Can teams in different time zones collaborate?", a: "Yes—your account works anywhere your teammates log in." },
  ];

  const troubleshoot = [
    { q: "Why does my result look overly smooth or blurry?", a: "Try a higher resolution, refine the prompt, or lower edit strength for subtle changes." },
    { q: "The wrong object was edited—what now?", a: "Be more specific (e.g., ‘remove the blue lamp on the left side table’) or add context about location/appearance." },
    { q: "Why is my job queued?", a: "High demand can briefly queue jobs; they’ll run automatically in order—no action needed." },
    { q: "How do I report issues or request features?", a: "Use the Contact page or in‑app feedback; include examples and prompts so we can reproduce." },
  ];

  const all = [brand, product, services, pricing, policy, geo, troubleshoot];
  const flatForJsonLd = all.flat().slice(0, 20);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.nanobanana-ai.dev" },
              { "@type": "ListItem", position: 2, name: "FAQ", item: "https://www.nanobanana-ai.dev/faq" }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://www.nanobanana-ai.dev/faq#page",
            isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
            about: { "@id": "https://www.nanobanana-ai.dev/#app" },
            mainEntity: flatForJsonLd.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Clear, concise answers for creators, businesses, and developers using the Nano Banana AI image editor.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Brand & “What is”</h2>
            <div className="grid gap-3">{brand.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Product & Features</h2>
            <div className="grid gap-3">{product.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Services</h2>
            <div className="grid gap-3">{services.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Pricing & Billing</h2>
            <div className="grid gap-3">{pricing.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Policy & Rights</h2>
            <div className="grid gap-3">{policy.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Availability</h2>
            <div className="grid gap-3">{geo.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
            <div className="grid gap-3">{troubleshoot.map((i) => <FaqItem key={i.q} {...i} />)}</div>
          </section>
        </div>

        <div className="mt-12 flex gap-3">
          <a href="/app" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">Open the Editor</a>
          <a href="/pricing" className="rounded-2xl border px-6 py-3 hover:bg-slate-50">View Pricing</a>
        </div>
      </section>
    </main>
  );
}
