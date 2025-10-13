// app/api/vertex/imagine/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  try {
    const { VertexAI } = await import('@google-cloud/vertexai');

    // Auth via JSON from env (works locally & on Vercel)
    const credentials = process.env.GOOGLE_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
      : undefined;

    const project = process.env.GOOGLE_PROJECT_ID;
    const location = process.env.GOOGLE_LOCATION || 'us-central1';
    const modelName = process.env.VERTEX_IMAGE_MODEL || 'imagen-3.0-generate-002';

    if (!project || !credentials) {
      return NextResponse.json({ ok: false, error: 'Google credentials missing' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = (body.prompt || '').slice(0, 2000).trim();
    if (!prompt) return NextResponse.json({ ok: false, error: 'Missing prompt' }, { status: 400 });

    // 1) Auth & credits
    const authHeader = req.headers.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''
    if (!accessToken) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 })
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken)
    if (authErr || !user) return NextResponse.json({ ok: false, error: 'AUTH_INVALID' }, { status: 401 })
    const uid = user.id

    const user = await prisma.user.findUnique({ where: { id: uid }, select: { credits: true } });
    if (!user || user.credits < 1) {
      return NextResponse.json({ ok: false, error: 'Not enough credits' }, { status: 402 });
    }

    // 2) Call Vertex Imagen 3
    const vertex = new VertexAI({ project, location, credentials });

    // As of the current SDK, images are generated via the Image generation model in Vertex AI.
    // Some SDKs expose a dedicated image API; here we call the model directly through the Vertex client.
    const client = vertex.preview.getImageGenerationModel
      ? vertex.preview.getImageGenerationModel({ model: modelName })
      : null;

    if (!client) {
      return NextResponse.json({ ok: false, error: 'Image generation model not available in this SDK' }, { status: 500 });
    }

    // Basic generation – 1 image, PNG
    const result = await client.generateImages({
      prompt,
      // You can also pass { negativePrompt, numberOfImages: 1, aspectRatio: '1:1', safetyFilterLevel: 'block_some' }
      // depending on availability in your project/SDK version.
    });

    // Result handling varies slightly by SDK version; normalize to a single PNG base64
    const img = result?.images?.[0];
    const b64 = img?.bytesBase64Encoded || img?.base64Data || img?.imageBytes;
    if (!b64) return NextResponse.json({ ok: false, error: 'No image returned' }, { status: 502 });

    // 3) Deduct 1 credit (atomic) & record ledger
    await prisma.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({ where: { id: uid, credits: { gte: 1 } }, data: { credits: { decrement: 1 } } })
      if (updated.count === 0) throw new Error('INSUFFICIENT_CREDITS')
      await tx.creditLedger.create({ data: { userId: uid, delta: -1, reason: 'usage:generate' } })
    });

    // Send data URL for easy <img src="...">
    return NextResponse.json({ ok: true, dataUrl: `data:image/png;base64,${b64}` });
  } catch (err) {
    console.error('vertex/imagine error', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Vertex error' }, { status: 500 });
  }
}
