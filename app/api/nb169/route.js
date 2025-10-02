export async function POST(req) {
  try {
    const form = await req.formData()
    const mode = String(form.get('mode') || 'generate')
    const ratio = String(form.get('ratio') || '16:9')
    const prompt = String(form.get('prompt') || '')
    const file = form.get('file')
    const auth = req.headers.get('authorization') || ''

    // Forward to existing endpoints using our Vertex routes
    let out
    if (mode === 'convert' && file) {
      // Image→Image edit with aspect
      const fd = new FormData()
      fd.append('prompt', prompt || 'Convert to 16:9 keeping subject centered')
      fd.append('image', file)
      const headers = auth ? { Authorization: auth } : {}
      const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/vertex/edit`, { method: 'POST', headers, body: fd })
      const j = await r.json()
      if (!r.ok || !j?.dataUrl) throw new Error(j?.error || `Upstream ${r.status}`)
      out = j.dataUrl
    } else {
      // Text→Image generate with 16:9
      const headers = { 'Content-Type': 'application/json' }
      if (auth) headers['Authorization'] = auth
      const body = JSON.stringify({ prompt: prompt || '16:9 cinematic image', meta: { aspect: '16:9' } })
      const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/vertex/imagine`, { method: 'POST', headers, body })
      const j = await r.json()
      if (!r.ok || !j?.dataUrl) throw new Error(j?.error || `Upstream ${r.status}`)
      out = j.dataUrl
    }

    return new Response(JSON.stringify({ url: out }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Failed' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}

