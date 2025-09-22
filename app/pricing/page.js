"use client"

import { useState } from "react"

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Simple, Transparent Pricing</h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl lg:mx-auto">Start generating instantly. Credits never expire. Upgrade anytime.</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-8 border">
            <h2 className="text-2xl font-bold">Starter</h2>
            <p className="text-gray-500 mt-1">For testing and light use</p>
            <div className="mt-6">
              <div className="text-5xl font-extrabold">$5<span className="text-2xl align-top ml-1">AUD</span></div>
              <div className="text-gray-500 mt-1">100 credits</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• 1 credit per generate</li>
              <li>• Fast queue</li>
              <li>• Email support</li>
            </ul>
            <button
              onClick={onBuy}
              disabled={loading}
              className="mt-8 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Buy 100 credits ($5)"}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">Error: {error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow p-8 border">
            <h2 className="text-2xl font-bold">Pro</h2>
            <p className="text-gray-500 mt-1">Monthly subscription for regular use</p>
            <div className="mt-6">
              <div className="text-5xl font-extrabold">$5<span className="text-2xl align-top ml-1">/mo</span></div>
              <div className="text-gray-500 mt-1">Unlimited access while active</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• Subscription billed monthly via Stripe</li>
              <li>• Cancel anytime in Billing Portal</li>
              <li>• Supports future pro-only features</li>
            </ul>
            <button
              onClick={onSubscribe}
              disabled={loading}
              className="mt-8 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-gray-900 hover:bg-black disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Subscribe $5/mo"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">Taxes/VAT may apply at checkout. Payments are processed by Stripe.</p>
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
              <span className="text-sm font-medium text-gray-700">Powered by Google</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <span className="text-sm font-medium text-gray-700">Stripe Payments</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <span className="text-sm font-medium text-gray-700">Secure SSL</span>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <span className="text-sm font-medium text-gray-700">Privacy First</span>
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
