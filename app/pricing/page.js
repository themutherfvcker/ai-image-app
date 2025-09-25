"use client"

import { useState } from "react"
import Link from "next/link"

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState("subscription") // "credits" | "subscription"

  async function onSubscribe() {
    setLoading(true)
    setError("")
    try {
      const r = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success_url: `${location.origin}/success`,
          cancel_url: `${location.origin}/cancel`,
        }),
      })
      const j = await r.json()
      if (!r.ok || !j?.url) {
        throw new Error(j?.error || `HTTP ${r.status}`)
      }
      window.location.href = j.url
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  async function onBuy() {
    setLoading(true)
    setError("")
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success_url: `${location.origin}/success`,
          cancel_url: `${location.origin}/cancel`,
        }),
      })
      const j = await r.json()
      if (!r.ok || !j?.url) {
        throw new Error(j?.error || `HTTP ${r.status}`)
      }
      window.location.href = j.url
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  async function onSubscribePlan(planKey) {
    setLoading(true)
    setError("")
    try {
      const r = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success_url: `${location.origin}/success`,
          cancel_url: `${location.origin}/cancel`,
          plan: String(planKey || "").toUpperCase(),
        }),
      })
      const j = await r.json()
      if (!r.ok || !j?.url) {
        throw new Error(j?.error || `HTTP ${r.status}`)
      }
      window.location.href = j.url
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAV (match homepage) */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://nanobanana.ai/_next/image?url=%2Fbanana-decoration.png&w=640&q=75"
                  alt="Nano Banana"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">Nano Banana</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link href="/generator" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Image Editor</Link>
              <Link href="/showcase" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Showcase</Link>
              <Link href="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500">Pricing</Link>
              <Link href="/developers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">API</Link>
              <a href="#faq" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">FAQ</a>
              <Link href="/toolbox" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Toolbox</Link>
              <Link href="/account" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Account</Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/generator"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Choose Your Nano Banana AI Image Generation Plan</h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl lg:mx-auto">Start generating instantly. Credits never expire. Upgrade anytime.</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Plan selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border bg-white p-1">
            <button
              onClick={() => setMode("credits")}
              className={`px-4 py-2 text-sm font-medium rounded-full ${mode === "credits" ? "bg-yellow-600 text-white" : "text-gray-700"}`}
            >
              Credits
            </button>
            <button
              onClick={() => setMode("subscription")}
              className={`px-4 py-2 text-sm font-medium rounded-full ${mode === "subscription" ? "bg-yellow-600 text-white" : "text-gray-700"}`}
            >
              Subscription
            </button>
          </div>
        </div>
        {mode === "credits" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Starter (Credits) */}
            <div className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h2 className="text-2xl font-bold">Starter</h2>
              <p className="text-gray-500 mt-1">For testing and light use</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$5<span className="text-2xl align-top ml-1">AUD</span></div>
                <div className="text-gray-500 mt-1">100 credits</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {[
                  "1 credit per generate",
                  "Fast queue",
                  "Email support",
                  "Commercial use",
                ].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button
                onClick={onBuy}
                disabled={loading}
                className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Buy 100 credits ($5)"}
              </button>
              {error && <p className="mt-3 text-sm text-red-600">Error: {error}</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Basic */}
            <div className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h2 className="text-2xl font-bold">Basic</h2>
              <p className="text-gray-500 mt-1">Great for getting started</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$8.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Personal use</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {[
                  "100 monthly credits included",
                  "Up to 50 high‑quality images per month",
                  "Access to all style templates",
                  "Standard generation speed",
                  "Basic email support",
                  "JPG and PNG downloads",
                  "Unused credits roll over to next billing cycle",
                ].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribePlan('BASIC')}
                disabled={loading}
                className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Subscribe $8.99/mo"}
              </button>
            </div>

            {/* Standard (Most Popular) */}
            <div className="relative bg-white rounded-2xl shadow p-8 border ring-1 ring-yellow-300 flex flex-col h-full">
              <div className="absolute -top-3 right-6"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">Most Popular</span></div>
              <h2 className="text-2xl font-bold">Standard</h2>
              <p className="text-gray-500 mt-1">For regular creators</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$27.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Priority features</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {[
                  "400 monthly credits included",
                  "Up to 250 high‑quality images per month",
                  "All style templates + advanced controls",
                  "Priority generation speed",
                  "Standard support (email + queue)",
                  "JPG and PNG downloads",
                  "Unused credits roll over to next billing cycle",
                ].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribePlan('STANDARD')}
                disabled={loading}
                className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Subscribe $27.99/mo"}
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h2 className="text-2xl font-bold">Premium</h2>
              <p className="text-gray-500 mt-1">For teams and power users</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$77.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Best value</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {[
                  "1200 monthly credits included",
                  "Up to 800 high‑quality images per month",
                  "All templates + premium features & team seats",
                  "Top‑priority generation speed",
                  "Priority support (fast response)",
                  "JPG and PNG downloads",
                  "Unused credits roll over to next billing cycle",
                ].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribePlan('PREMIUM')}
                disabled={loading}
                className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Subscribe $77.99/mo"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-500">Taxes/VAT may apply at checkout. Payments are processed by Stripe.</p>
      </section>

      {/* Guarantee & Support */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-white">Satisfaction Guarantee</h3>
          <p className="mt-2 text-sm text-gray-300">If something isn’t working for you, contact us and we’ll make it right.</p>
          <div className="mt-3 text-sm">
            <a href="/contact" className="text-yellow-300 hover:text-yellow-200">Contact support</a>
            <span className="mx-2 text-gray-500">·</span>
            <a href="/refunds" className="text-yellow-300 hover:text-yellow-200">Refund policy</a>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Compare plans</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starter</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {[
                  ["Price", "$5 one-time", "$5/mo"],
                  ["Credits", "100 credits", "Unlimited while active"],
                  ["Generation cost", "1 credit per generate", "Included"],
                  ["Queue priority", "Fast", "Fast"],
                  ["Commercial use", "Yes", "Yes"],
                  ["Billing portal", "—", "Included"],
                ].map(([k, v1, v2]) => (
                  <tr key={k}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{k}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{v1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{v2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center text-center">
            <div className="p-4 bg-white rounded-lg border">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                alt="Google"
                className="h-6 mx-auto"
                loading="lazy"
              />
              <span className="mt-2 block text-sm font-medium text-gray-700">Powered by Google</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/30/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                className="h-6 mx-auto"
                loading="lazy"
              />
              <span className="mt-2 block text-sm font-medium text-gray-700">Stripe Payments</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <svg className="h-6 w-6 mx-auto text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 10V8a6 6 0 1112 0v2"/>
                <rect x="4" y="10" width="16" height="10" rx="2" ry="2"/>
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-700">Secure SSL</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <svg className="h-6 w-6 mx-auto text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-700">Privacy First</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Help Center</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Pricing FAQ</p>
          </div>
          <div className="mt-10 max-w-3xl mx-auto">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">Do credits expire?</dt>
                <dd className="mt-2 text-base text-gray-500">No. Purchased credits do not expire.</dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">Can I cancel anytime?</dt>
                <dd className="mt-2 text-base text-gray-500">Yes. Manage your plan via the Billing Portal.</dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">How many credits per generate?</dt>
                <dd className="mt-2 text-base text-gray-500">1 credit per generation or edit.</dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">Is there a free trial?</dt>
                <dd className="mt-2 text-base text-gray-500">We occasionally grant bonus credits for new users.</dd>
              </div>
            </dl>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Do credits expire?", "acceptedAnswer": { "@type": "Answer", "text": "No. Purchased credits do not expire." } },
                { "@type": "Question", "name": "Can I cancel anytime?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Manage your plan via the Billing Portal." } },
                { "@type": "Question", "name": "How many credits per generate?", "acceptedAnswer": { "@type": "Answer", "text": "1 credit per generation or edit." } },
                { "@type": "Question", "name": "Is there a free trial?", "acceptedAnswer": { "@type": "Answer", "text": "We occasionally grant bonus credits for new users." } }
              ]
            }) }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-yellow-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to get started?</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-yellow-100 sm:mt-4">Choose a plan and start editing in seconds.</p>
          <div className="mt-8 flex gap-3 justify-center">
            <button onClick={onBuy} disabled={loading} className="inline-flex items-center px-6 py-3 rounded-md text-yellow-700 bg-white hover:bg-gray-50 disabled:opacity-60">Buy 100 credits</button>
            <button onClick={onSubscribe} disabled={loading} className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gray-900 hover:bg-black disabled:opacity-60">Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  )
}
