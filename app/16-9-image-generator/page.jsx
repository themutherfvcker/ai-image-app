import ClientFrame from "./ClientFrame";

export const metadata = {
  title: "Fix Nano Banana 16:9 Problems — 1-Click Solution",
  description:
    "Having trouble getting Nano Banana to make real 16:9 images? Use our Nano Banana 16:9 Image Generator to fix aspect ratio problems and convert any photo to true widescreen (1920×1080).",
};

export default function Page() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl [-letter-spacing:-0.01em]">
            <span className="block">
              Fix Nano Banana 16:9 Problems — Get True Widescreen Images for Your Weabsite or YouTube Thumbnails
            </span>
            <span className="block text-yellow-600">
              Nano Banana 16:9 Aspect Ratio Issues Solved
            </span>
          </h1>

          <h2 className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 font-medium">
            Instantly fix the frustrating aspect ratio issues in Nano Banana
            when it keeps generating square or vertical images instead of your
            desired 16:9.
          </h2>

          <p className="mt-4 max-w-prose mx-auto text-base sm:text-lg md:text-xl text-gray-600">
            <strong>Having trouble getting Nano Banana to make real 16:9 images?</strong> You&apos;re
            not alone. Most users find Nano Banana keeps generating square or
            vertical outputs no matter what aspect ratio they select. That&apos;s
            why we built the{" "}
            <span className="font-semibold">
              Nano Banana 16:9 Image Generator
            </span>{" "}
            — a simple tool that automatically fixes aspect-ratio problems and
            converts any photo or prompt into perfect widescreen (1920×1080)
            format. Whether you&apos;re creating YouTube thumbnails, banners, or
            cinematic AI artwork, this generator ensures every image fits the
            16:9 frame with zero cropping or distortion.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#app"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow transition-colors"
            >
              Try It Free
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-yellow-600 bg-white hover:bg-gray-50 border transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Embedded App */}
      <section
        id="app"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh]">
          <ClientFrame />
        </div>
      </section>

      {/* Narrative helper section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Nano Banana Square Images? Get 16:9 with 1-click
            </h2>
            <p className="mt-4 text-gray-800 text-lg sm:text-xl">
              <strong>
                Have you tried Nano Banana, felt amazed… and then totally stuck?
              </strong>
            </p>
            <p className="mt-3 text-gray-700 text-lg">
              You get a gorgeous image, but when you need 16:9 for a banner or
              YouTube thumbnail, the editor keeps spitting out 1:1. You add
              &quot;aspect ratio&quot; to your prompt—bam, still square. Then it&apos;s off to
              YouTube for 700 &quot;fixes&quot; and weird hacks like uploading a blank
              16:9 as the second image. Exhausting, right?
            </p>
            <p className="mt-3 text-gray-700 text-lg">
              Skip the hacks. Our 1-click 16:9 tool converts or generates true
              widescreen, outpaints the edges, and keeps your subject and
              composition—so you can ship the image you already love.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Smart Image Conversion
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Adjusts images to 16:9 without distortion using composition-aware
            framing and natural background fill.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">
              16:9
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">
              Any Aspect Ratio
            </h3>
            <p className="mt-3 text-gray-600">
              Upload any image—convert to perfect 16:9 while keeping your
              subject centered.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">
              AI
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">
              Smart Fill
            </h3>
            <p className="mt-3 text-gray-600">
              Extend backgrounds naturally to fill edges without stretching or
              warping.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">
              DL
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">
              Multiple Formats
            </h3>
            <p className="mt-3 text-gray-600">
              Download as JPEG, PNG, WEBP, or GIF to suit your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* PAA-style 16:9 FAQ (for Nano Banana) */}
      <section
        id="faq"
        className="bg-white border-t border-gray-100 mt-4 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions about Nano Banana 16:9
          </h2>

          <div className="mt-6 space-y-6 text-gray-700 text-base sm:text-lg">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Can Nano Banana do 16:9 images?
              </h3>
              <p className="mt-2">
                Yes. Nano Banana can produce 16:9 images if you use the correct
                generation parameters or tools. Our{" "}
                <a
                  href="/16-9-image-generator"
                  className="text-yellow-700 underline underline-offset-4 hover:no-underline"
                >
                  Nano Banana 16:9 Image Generator
                </a>{" "}
                automatically fixes aspect ratio issues and ensures your output
                is true widescreen (1920×1080) for YouTube thumbnails and
                banners.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                How to change ratio in Nano Banana?
              </h3>
              <p className="mt-2">
                You can change the aspect ratio in Nano Banana by adjusting the
                ratio or dimensions setting. However, many users still get
                cropped or square results—which is why we built this 16:9
                converter that forces a proper widescreen frame without
                distortion.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                How to convert a picture to 16:9?
              </h3>
              <p className="mt-2">
                You can use Nano Banana&apos;s crop tool or our 16:9 generator to
                automatically resize and pad your existing images into perfect
                16:9 ratio. Just upload any photo and it will instantly adjust
                to 1920×1080 resolution.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Is it better to use 4:3 or 16:9?
              </h3>
              <p className="mt-2">
                For most modern displays, social platforms, and video
                thumbnails, 16:9 is the best choice. It fills widescreen
                monitors and YouTube frames perfectly, while 4:3 is more suited
                for legacy content or prints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Original 16:9 Image Generator FAQ (accordion) */}
      <section
        id="image-faq"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            16:9 Image Generator – FAQ
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Tips and answers for composition, sizes, and exports.
          </p>
        </div>
        <div className="mt-8 grid gap-3 max-w-3xl mx-auto">
          {[
            {
              q: "What is the 16:9 Image Generator?",
              a: "A tool to generate native 16:9 visuals or convert images while preserving composition.",
            },
            {
              q: "Best sizes for YouTube thumbnails?",
              a: "1280×720 is standard; keep important elements within the central safe area for mobile.",
            },
            {
              q: "Cropping vs outpainting?",
              a: "Outpainting can extend edges to maintain composition; cropping trims edges and may lose context.",
            },
            {
              q: "How do I keep text crisp?",
              a: "Generate at target resolution, use high contrast, and avoid ultra-thin fonts at small sizes.",
            },
            {
              q: "Will faces stay consistent across variants?",
              a: "Yes—use identity cues and the same references for character consistency.",
            },
            {
              q: "Can I convert vertical (9:16) to 16:9?",
              a: "Yes—use outpainting prompts to fill sides while matching lighting and style.",
            },
            {
              q: "What formats can I export?",
              a: "PNG/JPG; choose PNG for crisp graphics and JPG for photographic content.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer"
            >
              <summary
                className="text-lg font-semibold text-slate-900"
                id={q.replace(/\s+/g, "-").toLowerCase()}
              >
                {q}
              </summary>
              <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* FAQ Schema for PAA questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id":
              "https://www.nanobanana-ai.dev/16-9-image-generator#faq",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can Nano Banana do 16:9 images?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. Nano Banana can produce 16:9 images if you use the correct generation parameters or tools. The Nano Banana 16:9 Image Generator automatically fixes aspect ratio issues and ensures your output is true widescreen (1920×1080) for YouTube thumbnails and banners.",
                },
              },
              {
                "@type": "Question",
                name: "How to change ratio in Nano Banana?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "You can change the aspect ratio in Nano Banana by adjusting the ratio or dimensions settings, or by using a dedicated 16:9 converter tool that forces a proper widescreen frame without distortion.",
                },
              },
              {
                "@type": "Question",
                name: "How to convert a picture to 16:9?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "You can convert a picture to 16:9 by using Nano Banana's crop tools or by uploading it to a 16:9 generator that automatically resizes and pads the image to 1920×1080 while preserving composition.",
                },
              },
              {
                "@type": "Question",
                name: "Is it better to use 4:3 or 16:9?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "For most modern screens, social platforms, and video thumbnails, 16:9 is preferred. It matches widescreen displays and YouTube frames, while 4:3 is generally better suited for older content or certain print formats.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
