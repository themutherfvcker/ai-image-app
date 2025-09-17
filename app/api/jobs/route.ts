// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const jar = await cookies()
    const uid = jar.get('uid')?.value
    if (!uid) {
      return NextResponse.json({ ok: false, error: 'No uid cookie. Visit /api/session first.' }, { status: 400 })
    }

    const jobs = await prisma.generationJob.findMany({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: { id: true, createdAt: true, prompt: true, mode: true, latencyMs: true, success: true },
    })

    return NextResponse.json({ ok: true, jobs })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

