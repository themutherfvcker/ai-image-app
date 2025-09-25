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
    </main>
  )
}