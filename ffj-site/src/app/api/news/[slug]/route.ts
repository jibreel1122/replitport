export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const db = createServerSupabase()
  const { searchParams } = new URL(request.url)
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'ar'

  const { data, error } = await db
    .from('posts')
    .select('id,slug,published_at,post_translations(*),post_meta(*)')
    .eq('slug', params.slug)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  const t = (data.post_translations || []).find((x: any) => x.locale === locale) || data.post_translations?.[0]
  const meta = Array.isArray((data as any).post_meta) ? (data as any).post_meta[0] : (data as any).post_meta

  return NextResponse.json({
    slug: data.slug,
    publishedAt: data.published_at,
    title: t?.title,
    summary: t?.summary,
    body: t?.body,
    cover: meta?.cover_image_url,
    tags: meta?.tags || [],
    category: meta?.category || null
  })
}