
export default function ShowcasePage() {
  const items = [
    { slug: 'remove-background', title: 'Remove Background', desc: 'Cut subjects cleanly while preserving edges and hair.' },
    { slug: 'change-clothing-color', title: 'Change Clothing Color', desc: 'Recolor garments without losing texture.' },
    { slug: 'product-ad', title: 'Product Ad', desc: 'Turn studio shots into lifestyle scenes.' },
    { slug: 'storyboard', title: 'Storyboard', desc: 'Generate sequential images to tell a story.' },
    { slug: 'age-transformation', title: 'Age Transformation', desc: 'See younger/older while keeping identity consistent.' },
    { slug: 'style-transfer', title: 'Artistic Style Transfer', desc: 'Render photos as painterly artworks.' },
  ]
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:text-center">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Lightning-Fast Nano Banana AI Creations</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Nano Banana Showcase</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Before/after examples with prompts. Click any to try in the editor.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(it => (
            <a key={it.slug} href={`/showcase/${it.slug}`} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{it.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{it.desc}</p>
                <span className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">View example</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

