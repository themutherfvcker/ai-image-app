"use client"
import { useEffect, useRef, useState } from "react"

export default function GeminiSliderSection() {
  const [html, setHtml] = useState("")
  const [error, setError] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/gemini-image-slider.html", { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (!cancelled) setHtml(text)
      } catch (e) {
        if (!cancelled) setError("Slider HTML not found. Add public/gemini-image-slider.html.")
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !html) return
    const host = containerRef.current
    // Clear
    while (host.firstChild) host.removeChild(host.firstChild)
    // Parse HTML and separate scripts
    const temp = document.createElement("div")
    temp.innerHTML = html
    const scripts = Array.from(temp.querySelectorAll("script"))
    scripts.forEach((s) => s.parentNode.removeChild(s))
    // Inject markup
    host.innerHTML = temp.innerHTML
    // Re-insert scripts so the browser executes them
    scripts.forEach((old) => {
      const s = document.createElement("script")
      if (old.src) s.src = old.src
      if (old.type) s.type = old.type
      for (const attr of old.attributes) {
        if (attr.name !== "src" && attr.name !== "type") s.setAttribute(attr.name, attr.value)
      }
      if (old.textContent) s.textContent = old.textContent
      host.appendChild(s)
    })
  }, [html])

  return (
    <section id="examples" className="py-12 bg-white cv-lazy" loading="lazy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-8">
          <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Before/After Slider</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">Real transformations with Nano Banana</p>
          <p className="mt-2 text-gray-600">Drag the handle to compare results.</p>
        </div>
        {error ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div ref={containerRef} className="w-full">
            {/* HTML injected here */}
          </div>
        )}
      </div>
    </section>
  )
}

