
export default function ShowcaseDetail({ params }) {
  const { slug } = params
  const map = {
    'remove-background': {
      title: 'Remove Background',
      prompt: 'Remove the background and place the subject on a clean white background.'
    },
    'change-clothing-color': {
      title: 'Change Clothing Color',
      prompt: 'Change the jacket to a deep navy blue while keeping fabric texture.'
    },
    'product-ad': {
      title: 'Product Ad',
      prompt: 'A premium product photo on a marble countertop with soft morning light.'
    },
    'storyboard': {
      title: 'Storyboard',
      prompt: 'Four cinematic stills of a traveler boarding a train at sunrise, consistent character and outfit.'
    },
    'age-transformation': {
      title: 'Age Transformation',
      prompt: 'Make the person appear about 10 years older, keep skin details and hair line realistic.'
    },
    'style-transfer': {
      title: 'Artistic Style Transfer',
      prompt: 'Render this image in the style of an oil painting with visible brush strokes and warm tones.'
    },
  }
  const data = map[slug] || { title: 'Showcase', prompt: '' }
  const tab = slug === 'product-ad' || slug === 'storyboard' ? 't2i' : 'i2i'
  const url = `/generator?tab=${encodeURIComponent(tab)}&prompt=${encodeURIComponent(data.prompt)}`
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{data.title}</h1>
        <p className="text-gray-700 mt-4">Prompt</p>
        <pre className="mt-2 p-4 bg-white rounded-md border shadow-sm text-sm overflow-x-auto">{data.prompt}</pre>
        <a href={url} className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700">Try this in Editor</a>
      </main>
    </div>
  )
}

