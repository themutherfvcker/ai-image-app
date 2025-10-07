export default function DevelopersPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Nano Banana API</h1>
      <p className="text-gray-600 mt-2">Text-based and image-to-image editing via HTTP. Join the waitlist below.</p>
      <h2 className="text-lg font-semibold text-gray-900 mt-6">Example (Text → Image)</h2>
      <pre className="mt-2 p-3 bg-gray-50 rounded border text-sm overflow-x-auto">{`POST https://api.nanobanana.dev/v1/generate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{ "prompt": "a cinematic banana astronaut on the moon" }`}</pre>
      <h2 className="text-lg font-semibold text-gray-900 mt-6">Example (Image → Image)</h2>
      <pre className="mt-2 p-3 bg-gray-50 rounded border text-sm overflow-x-auto">{`POST https://api.nanobanana.dev/v1/edit
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{ "prompt": "remove background", "imageDataUrl": "data:image/jpeg;base64,..." }`}</pre>
      <a href="#" className="mt-6 inline-flex items-center px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">Get API Key (Waitlist)</a>

      {/* Developers FAQ */}
      <section id="faq" className="mt-10">
        <h2 className="text-xl font-bold mb-4">Developers – API FAQ</h2>
        <div className="grid gap-3">
          {[ 
            { q: "Is there an API?", a: "We’re preparing API access to integrate editing/generation into apps and workflows." },
            { q: "What can I automate?", a: "Programmatic edits, text‑to‑image jobs, batch runs, and retrieval of results." },
            { q: "Do you support webhooks?", a: "Planned: job status webhooks and async result retrieval." },
            { q: "Rate limits and quotas?", a: "Tied to plan tier; details will be documented in the API reference." },
            { q: "Auth & keys?", a: "API keys scoped to your account; rotate/regenerate via the dashboard." },
            { q: "SDKs?", a: "Client examples in JS/TS will be provided along with REST endpoints." },
            { q: "Pricing for API?", a: "Usage‑based with credits; enterprise plans available for higher throughput." }
          ].map(({ q, a }) => (
            <details key={q} className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
              <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, '-').toLowerCase()}>{q}</summary>
              <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": "https://www.nanobanana-ai.dev/developers#faq",
          isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
          about: { "@id": "https://www.nanobanana-ai.dev/#app" },
          mainEntity: [
            { "@type": "Question", name: "Is there an API?", acceptedAnswer: { "@type": "Answer", text: "We’re preparing API access to integrate editing/generation into apps and workflows." }},
            { "@type": "Question", name: "What can I automate?", acceptedAnswer: { "@type": "Answer", text: "Programmatic edits, text‑to‑image jobs, batch runs, and retrieval of results." }},
            { "@type": "Question", name: "Do you support webhooks?", acceptedAnswer: { "@type": "Answer", text: "Planned: job status webhooks and async result retrieval." }},
            { "@type": "Question", name: "Rate limits and quotas?", acceptedAnswer: { "@type": "Answer", text: "Tied to plan tier; details will be documented in the API reference." }},
            { "@type": "Question", name: "Auth & keys?", acceptedAnswer: { "@type": "Answer", text: "API keys scoped to your account; rotate/regenerate via the dashboard." }},
            { "@type": "Question", name: "SDKs?", acceptedAnswer: { "@type": "Answer", text: "Client examples in JS/TS will be provided along with REST endpoints." }},
            { "@type": "Question", name: "Pricing for API?", acceptedAnswer: { "@type": "Answer", text: "Usage‑based with credits; enterprise plans available for higher throughput." }}
          ]
        }) }}
      />
    </main>
  )
}