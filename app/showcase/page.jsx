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
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Showcase</h1>
      <p className="text-gray-600 mt-1">Before/after examples with prompts. Click any to try in the editor.</p>
      <ul className="mt-6 space-y-3">
        {items.map(it => (
          <li key={it.slug}>
            <a className="text-yellow-700 hover:text-yellow-800 underline" href={`/showcase/${it.slug}`}>{it.title}</a>
            <div className="text-sm text-gray-600">{it.desc}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}

