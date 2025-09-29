// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const jar = await cookies()
    const hdrs = await headers()
    const authHeader = hdrs.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''

    let uid = ''
    if (accessToken) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      if (user?.id) uid = user.id
    }
    if (!uid) uid = jar.get('uid')?.value || ''
    if (!uid) return NextResponse.json({ ok: false, error: 'No user id available.' }, { status: 400 })

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

