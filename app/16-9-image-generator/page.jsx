export const metadata = {
  title: "16:9 Image Generator & Converter | NanoBanana",
  description: "Generate native 16:9 images or convert any photo to 16:9.",
};

export default function Page() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Resize Any Image to</span>
            <span className="block text-yellow-500">Perfect 16:9</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600">
            Smart conversion that preserves composition and fills edges naturally. Perfect for YouTube thumbnails and hero banners.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#app" className="inline-flex items-center justify-center px-8 py-3 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow">
              Try It Free
            </a>
            <a href="#features" className="inline-flex items-center justify-center px-8 py-3 rounded-md text-yellow-600 bg-white hover:bg-gray-50 border">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Embedded App */}
      <section id="app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow overflow-hidden h-[70vh] md:h-[75vh]">
          <iframe
            src={process.env.NEXT_PUBLIC_169_APP_URL || "https://nano-banana-16-9-image-creator.vercel.app/"}
            className="w-full h-full border-0"
            loading="eager"
            title="16:9 Image Generator"
          />
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">16:9</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Any Aspect Ratio</h3>
            <p className="mt-3 text-gray-600">Upload any image—convert to perfect 16:9 while keeping your subject centered.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">AI</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Smart Fill</h3>
            <p className="mt-3 text-gray-600">Extend backgrounds naturally to fill edges without stretching or warping.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-12 w-12 rounded-md bg-yellow-500 text-white grid place-items-center">DL</div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Multiple Formats</h3>
            <p className="mt-3 text-gray-600">Download as JPEG, PNG, WEBP, or GIF to suit your workflow.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

