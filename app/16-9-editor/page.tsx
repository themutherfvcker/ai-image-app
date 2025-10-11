import Client from "./Client";

export const metadata = {
  title: "Nano Banana 16:9 — Native Editor",
  description: "Generate or convert images to true 16:9 inside Nano Banana.",
};

export default function Page() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          16:9 Image Editor (Native)
        </h1>
        <p className="text-gray-700 mb-8">Edit any image to a perfect 1920×1080 frame, or generate a new one.</p>
        <Client />
      </section>
    </main>
  );
}
