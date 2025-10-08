export const metadata = {
  title: "Nano Banana 16:9 — Fix Gemini Nano Banana 16:9 Aspect Ratio Problems",
  description: "Generate native 16:9 images or convert any photo to 16:9.",
};

export default function Page() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-tight font-extrabold text-gray-900 [-letter-spacing:-0.01em] leading-tight">
            {"Nano Banana "}
            <span className="text-yellow-600">16:9</span>
            {" Problems?"}
          </h1>
          <h2 className="mt-5 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 font-medium">
            Frustrated with the Wrong Aspect Ratio in Your Nano Banana Images?
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600">
            Instantly convert Nano Banana images to perfect 16:9 widescreen with AI magic
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#app" className="inline-flex items-center justify-center px-8 py-3 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow transition-colors">
              Try Now - It's Free
            </a>
            <a href="#features" className="inline-flex items-center justify-center px-8 py-3 rounded-md text-yellow-700 bg-white hover:bg-yellow-50 border-2 border-yellow-500 transition-colors">
              Learn More
            </a>
          </div>
          <a href="#app" aria-label="Scroll to app" className="mt-12 inline-flex items-center justify-center text-yellow-600 hover:text-yellow-700">
            <svg className="w-6 h-6 mx-auto animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Embedded App */}
      <section id="app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh]">
          <iframe
            src={process.env.NEXT_PUBLIC_169_APP_URL || "https://nano-banana-16-9-image-creator.vercel.app/"}
            className="w-full h-full border-0"
            loading="eager"
            title="16:9 Image Generator"
          />
        </div>
      </section>

      {/* Narrative helper section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Nano Banana Square Images? Get 16:9 with 1-click</h2>
          <p className="mt-4 text-gray-800 text-lg sm:text-xl"><strong>Have you tried Nano Banana, felt amazed… and then totally stuck?</strong></p>
          <p className="mt-3 text-gray-700 text-lg">
            You get a gorgeous image, but when you need 16:9 for a banner or YouTube thumbnail, the editor keeps spitting out 1:1.
            You add “aspect ratio” to your prompt—bam, still square. Then it’s off to YouTube for 700 “fixes” and weird hacks like
            uploading a blank 16:9 as the second image. Exhausting, right?
          </p>
          <p className="mt-3 text-gray-700 text-lg">
            Skip the hacks. Our 1-click 16:9 tool converts or generates true widescreen, outpaints the edges, and keeps your subject and
            composition—so you can ship the image you already love.
          </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Smart Image Conversion</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Adjusts images to 16:9 without distortion using composition-aware framing and natural background fill.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">16:9</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Any Aspect Ratio</h3>
            <p className="mt-3 text-gray-600">Upload any image—convert to perfect 16:9 while keeping your subject centered.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">AI</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Smart Fill</h3>
            <p className="mt-3 text-gray-600">Extend backgrounds naturally to fill edges without stretching or warping.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">DL</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Multiple Formats</h3>
            <p className="mt-3 text-gray-600">Download as JPEG, PNG, WEBP, or GIF to suit your workflow.</p>
          </div>
        </div>
      </section>

      {/* 16:9 FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">16:9 Image Generator – FAQ</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">Tips and answers for composition, sizes, and exports.</p>
        </div>
        <div className="mt-8 grid gap-3 max-w-3xl mx-auto">
          {[ 
            { q: "What is the 16:9 Image Generator?", a: "A tool to generate native 16:9 visuals or convert images while preserving composition." },
            { q: "Best sizes for YouTube thumbnails?", a: "1280×720 is standard; keep important elements within the central safe area for mobile." },
            { q: "Cropping vs outpainting?", a: "Outpainting can extend edges to maintain composition; cropping trims edges and may lose context." },
            { q: "How do I keep text crisp?", a: "Generate at target resolution, use high contrast, and avoid ultra‑thin fonts at small sizes." },
            { q: "Will faces stay consistent across variants?", a: "Yes—use identity cues and the same references for character consistency." },
            { q: "Can I convert vertical (9:16) to 16:9?", a: "Yes—use outpainting prompts to fill sides while matching lighting and style." },
            { q: "What formats can I export?", a: "PNG/JPG; choose PNG for crisp graphics and JPG for photographic content." }
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
          "@id": "https://www.nanobanana-ai.dev/16-9-image-generator#faq",
          isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
          about: { "@id": "https://www.nanobanana-ai.dev/#app" },
          mainEntity: [
            { "@type": "Question", name: "What is the 16:9 Image Generator?", acceptedAnswer: { "@type": "Answer", text: "A tool to generate native 16:9 visuals or convert images while preserving composition." }},
            { "@type": "Question", name: "Best sizes for YouTube thumbnails?", acceptedAnswer: { "@type": "Answer", text: "1280×720 is standard; keep important elements within the central safe area for mobile." }},
            { "@type": "Question", name: "Cropping vs outpainting?", acceptedAnswer: { "@type": "Answer", text: "Outpainting can extend edges to maintain composition; cropping trims edges and may lose context." }},
            { "@type": "Question", name: "How do I keep text crisp?", acceptedAnswer: { "@type": "Answer", text: "Generate at target resolution, use high contrast, and avoid ultra‑thin fonts at small sizes." }},
            { "@type": "Question", name: "Will faces stay consistent across variants?", acceptedAnswer: { "@type": "Answer", text: "Yes—use identity cues and the same references for character consistency." }},
            { "@type": "Question", name: "Can I convert vertical (9:16) to 16:9?", acceptedAnswer: { "@type": "Answer", text: "Yes—use outpainting prompts to fill sides while matching lighting and style." }},
            { "@type": "Question", name: "What formats can I export?", acceptedAnswer: { "@type": "Answer", text: "PNG/JPG; choose PNG for crisp graphics and JPG for photographic content." }}
          ]
        }) }}
      />
    </main>
  );
}

