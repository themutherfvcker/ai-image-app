// =============================================================
// FILE: app/api/session/route.js
// PURPOSE: Create/fetch anonymous session via uid cookie.
// - Uses uid as User.id in DB
// - Grants 25 starter credits on first visit
// - Writes a signup_bonus row if a Ledger table exists
// =============================================================

import { NextResponse } from 'next/server'
import { cookies as cookieStore, headers as getHeaders } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Helper that works with either Ledger or CreditLedger model names
async function createLedger(tx, data) {
  if (tx.ledger?.create) {
    try { return await tx.ledger.create({ data }) } catch { return null }
  }
  if (tx.creditLedger?.create) {
    try { return await tx.creditLedger.create({ data }) } catch { return null }
  }
  return null
}

export async function GET() {
  const jar = await cookieStore()
  const hdrs = await getHeaders()
  const authHeader = hdrs.get('authorization') || ''
  const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
  const accessToken = m?.[2] || ''

  let cookieUid = jar.get('uid')?.value || ''

  // Resolve canonical id via Supabase auth when available
  let canonicalId = ''
  if (accessToken) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { user: authUser } } = await supabase.auth.getUser(accessToken)
    if (authUser?.id) canonicalId = authUser.id
  }

  // Ensure we have some uid
  if (!cookieUid && !canonicalId) {
    cookieUid = randomUUID()
    jar.set('uid', cookieUid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  // Case 1: Not authenticated -> operate strictly on cookie uid
  if (!canonicalId) {
    const uid = cookieUid
    let user = await prisma.user.findUnique({ where: { id: uid } })
    if (!user) {
      user = await prisma.user.create({ data: { id: uid, credits: 25 } })
      await createLedger(prisma, { userId: user.id, amount: 25, reason: 'signup_bonus' })
    }
    return NextResponse.json({ ok: true, uid, balance: user.credits })
  }

  // Case 2: Authenticated -> set canonical cookie and return canonical balance.
  // SAFETY: Do NOT auto-merge anon data to avoid cross-user contamination.
  // If desired, a deliberate import flow can be implemented later.
  const out = await prisma.$transaction(async (tx) => {
    let canonical = await tx.user.findUnique({ where: { id: canonicalId } })
    if (!canonical) {
      canonical = await tx.user.create({ data: { id: canonicalId, credits: 25 } })
      await createLedger(tx, { userId: canonicalId, amount: 25, reason: 'signup_bonus' })
    }
    const fresh = await tx.user.findUnique({ where: { id: canonical.id } })
    return { uid: canonical.id, balance: fresh?.credits ?? 0 }
  })

  // Rewrite cookie to canonical id so future reads use the same id
  jar.set('uid', out.uid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })

  return NextResponse.json({ ok: true, uid: out.uid, balance: out.balance })
}
