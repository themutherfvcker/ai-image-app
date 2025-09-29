// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET(req: Request) {
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

    // Pagination
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const pageSize = Math.min(48, Math.max(1, parseInt(url.searchParams.get('pageSize') || '12', 10)))
    const skip = (page - 1) * pageSize
    const take = pageSize + 1

    const items = await prisma.generationJob.findMany({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: { id: true, createdAt: true, prompt: true, mode: true, latencyMs: true, success: true },
    })
    const hasMore = items.length > pageSize
    const jobs = hasMore ? items.slice(0, pageSize) : items

    return NextResponse.json({ ok: true, jobs, page, pageSize, hasMore })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

