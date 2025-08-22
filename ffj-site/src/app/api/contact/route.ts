export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase/server'

const ContactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  message: z.string().min(10).max(5000)
})

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null)
  const parsed = ContactSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }
  const { name, email, message } = parsed.data
  const db = createServerSupabase()
  const { error } = await db.from('contacts').insert({ name, email, message })
  if (error) return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  return NextResponse.json({ ok: true })
}