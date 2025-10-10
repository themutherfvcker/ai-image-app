// ============================================================================
// Google GenAI (AI Studio API key) — Gemini 2.5 Flash Image Preview (IMAGE EDIT)
// Flow:
//   1) ensure user + check credits (fast DB)
//   2) read image (multipart or dataUrl) + prompt
//   3) call Gemini (no transaction)
//   4) short transaction: decrement credits + ledger
// Returns { ok:true, dataUrl, balance }
//
// ENV:
//   GOOGLE_GENAI_API_KEY=...                  (required)
// Optional:
//   GENAI_IMAGE_MODEL=gemini-2.5-flash-image-preview
//   IMAGINE_DEBUG=novertex                    (returns 1x1 PNG, still charges -1)
// ============================================================================

export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { GoogleGenAI } from "@google/genai"

const prisma = new PrismaClient()
const DEBUG_SKIP = (process.env.IMAGINE_DEBUG || "").toLowerCase() === "novertex"

function cfg() {
  return {
    apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
    model: process.env.GENAI_IMAGE_MODEL || "gemini-2.5-flash-image-preview",
  }
}

function tinyPngDataUrl() {
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9U4gq/0AAAAASUVORK5CYII="
  return `data:image/png;base64,${b64}`
}

async function createLedger(tx, data) {
  if (tx.ledger?.create) { try { return await tx.ledger.create({ data }) } catch {}
  }
  if (tx.creditLedger?.create) { try { return await tx.creditLedger.create({ data }) } catch {}
  }
  return null
}

async function ensureUser(id) {
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: { id, credits: 25 },
  })
}

function parseDataUrl(d) {
  const m = /^data:([^;]+);base64,([\s\S]+)$/i.exec(d || "")
  if (!m) return null
  return { mimeType: m[1], base64: m[2] }
}

async function readBody(req) {
  // Returns { prompt, mimeType, base64, targetMimeType?, targetBase64? } or throws
  const ct = (req.headers.get("content-type") || "").toLowerCase()

  // multipart/form-data: fields prompt + image (file)
  if (ct.startsWith("multipart/form-data")) {
    const form = await req.formData()
    const prompt = (form.get("prompt") || "").toString().trim()
    const file = form.get("image") || form.get("file")
    if (!prompt) throw new Error("Missing prompt")
    if (!file || typeof file === "string") throw new Error("Missing image file")

    const mimeType = file.type || "application/octet-stream"
    const buf = Buffer.from(await file.arrayBuffer())
    const base64 = buf.toString("base64")
    return { prompt, mimeType, base64 }
  }

  // JSON: { prompt, imageDataUrl, targetDataUrl? }
  if (ct.includes("application/json")) {
    const j = await req.json().catch(() => ({}))
    const prompt = (j?.prompt || "").toString().trim()
    if (!prompt) throw new Error("Missing prompt")
    const d = parseDataUrl(j?.imageDataUrl || "")
    if (!d) throw new Error("Missing imageDataUrl (data:...;base64,...)")
    const t = parseDataUrl(j?.targetDataUrl || "")
    const out = { prompt, mimeType: d.mimeType, base64: d.base64 }
    if (t) {
      out.targetMimeType = t.mimeType
      out.targetBase64 = t.base64
    }
    return out
  }

  // x-www-form-urlencoded (rare)
  if (ct.includes("application/x-www-form-urlencoded")) {
    const raw = await req.text().catch(() => "")
    const p = new URLSearchParams(raw)
    const prompt = (p.get("prompt") || "").trim()
    const imageDataUrl = p.get("imageDataUrl") || ""
    const targetDataUrl = p.get("targetDataUrl") || ""
    if (!prompt) throw new Error("Missing prompt")
    const d = parseDataUrl(imageDataUrl)
    if (!d) throw new Error("Missing imageDataUrl (data:...;base64,...)")
    const t = parseDataUrl(targetDataUrl)
    const out = { prompt, mimeType: d.mimeType, base64: d.base64 }
    if (t) {
      out.targetMimeType = t.mimeType
      out.targetBase64 = t.base64
    }
    return out
  }

  throw new Error("Unsupported content-type")
}

export async function GET() {
  const env = cfg()
  return NextResponse.json({
    ok: true,
    env: {
      modelFromEnv: env.model,
      hasApiKey: !!env.apiKey,
      debugSkipVertex: DEBUG_SKIP,
    },
  })
}

export async function POST(req) {
  const env = cfg()
  try {
    if (!env.apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_GENAI_API_KEY. Add it to .env.local (and Vercel)." },
        { status: 500 }
      )
    }

    const { prompt, mimeType, base64, targetMimeType, targetBase64 } = await readBody(req)

    // Prefer Supabase Bearer auth; otherwise fall back to cookie-based anonymous uid
    let id = ""
    const authHeader = req.headers.get("authorization") || ""
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ""
    if (accessToken) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      const supabase = createClient(supabaseUrl, supabaseAnon)
      const { data: { user: sbUser } } = await supabase.auth.getUser(accessToken)
      if (sbUser?.id) {
        id = sbUser.id
      }
    }
    if (!id) {
      const jar = await cookies()
      const cookieUid = jar.get('uid')?.value || ''
      if (!cookieUid) {
        return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 })
      }
      id = cookieUid
    }

    // 1) Ensure user + check credits
    const dbUser = await ensureUser(id)
    if (dbUser.credits < 1) {
      return NextResponse.json({ ok: false, error: "Not enough credits. Please purchase more." }, { status: 402 })
    }

    // 2) Model call (no transaction)
    let dataUrl = null
    if (DEBUG_SKIP) {
      dataUrl = tinyPngDataUrl()
    } else {
      const ai = new GoogleGenAI({ apiKey: env.apiKey })
      const safetySettings = [
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ]

      let resp
      try {
        // If the client provided a targetDataUrl (blank 16:9 canvas,
        // or any specific target), include it as a second image part to
        // encourage outpainting/extension rather than mere overlay.
        const parts = [{ inlineData: { mimeType, data: base64 } }]
        if (typeof targetBase64 === 'string' && targetBase64.length > 0 && typeof targetMimeType === 'string' && targetMimeType) {
          parts.push({ inlineData: { mimeType: targetMimeType, data: targetBase64 } })
        }
        parts.push({ text: prompt })

        resp = await ai.models.generateContent({
          model: env.model,
          contents: [ { role: "user", parts } ],
          config: { responseModalities: ["IMAGE"], safetySettings, temperature: 0.9 },
        })
      } catch (e) {
        const msg = e?.message || ""
        if (/(^|\b)(429|RESOURCE_EXHAUSTED|quota exceeded)/i.test(msg)) {
          return NextResponse.json(
            { ok: false, error: "The image engine is rate-limiting right now. Please try again shortly." },
            { status: 429 }
          )
        }
        return NextResponse.json({ ok: false, error: msg || "GENERATION_FAILED", details: { promptPreview: prompt?.slice?.(0, 160) || '', hasTarget: !!targetBase64 } }, { status: 500 })
      }

      const parts = resp?.candidates?.[0]?.content?.parts || []
      for (const p of parts) {
        if (p?.inlineData?.mimeType && p?.inlineData?.data) {
          dataUrl = `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`
          break
        }
        if (p?.media?.mimeType && p?.media?.data) {
          dataUrl = `data:${p.media.mimeType};base64,${p.media.data}`
          break
        }
      }
      if (!dataUrl) {
        return NextResponse.json(
          { ok: false, error: "GENERATE_FAILED (no image in response)", partsPreview: parts?.slice?.(0, 2) || [], details: { promptPreview: prompt?.slice?.(0, 160) || '', hasTarget: !!targetBase64 } },
          { status: 500 }
        )
      }
    }

    const startedAt = Date.now()
    // 3) Short transaction: -1 credit + ledger + job log
    const out = await prisma.$transaction(async (tx) => {
      const fresh = await tx.user.findUnique({ where: { id } })
      if (!fresh || fresh.credits < 1) {
        return { balance: fresh?.credits ?? 0 }
      }
      const updated = await tx.user.update({
        where: { id },
        data: { credits: { decrement: 1 } },
      })
      await createLedger(tx, {
        userId: id,
        amount: -1,
        reason: "image_edit",
        meta: { modelName: env.model, prompt, inputMime: mimeType },
      })
      try {
        await tx.generationJob.create({
          data: {
            userId: id,
            prompt,
            mode: 'image',
            latencyMs: Math.max(0, Date.now() - startedAt),
            success: true,
          },
        })
      } catch {}
      return { balance: updated.credits }
    }, { timeout: 15000 })

    return NextResponse.json({ ok: true, dataUrl, balance: out.balance })
  } catch (err) {
    const msg = err?.message || "Unknown error"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
