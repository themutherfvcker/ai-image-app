// app/api/bonus/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const jar = await cookies()
    let uid = jar.get('uid')?.value || ''
    if (!uid) {
      uid = randomUUID()
      jar.set('uid', uid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
      // Ensure user exists (credits default from schema)
      await prisma.user.upsert({ where: { id: uid }, update: {}, create: { id: uid } })
    }

    // Check if login bonus already granted via ledger
    const already = await prisma.creditLedger.findFirst({ where: { userId: uid, reason: 'login_bonus' } })
    if (already) {
      const user = await prisma.user.findUnique({ where: { id: uid }, select: { credits: true } })
      return NextResponse.json({ ok: true, credits: user?.credits ?? null, granted: false })
    }

    // Grant +2 credits one-time and record ledger
    const out = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({ where: { id: uid }, data: { credits: { increment: 2 } }, select: { credits: true } })
      await tx.creditLedger.create({ data: { userId: uid, delta: 2, reason: 'login_bonus', ref: null } })
      return updated.credits
    })

    return NextResponse.json({ ok: true, credits: out, granted: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error)?.message || String(e) }, { status: 500 })
  }
}

