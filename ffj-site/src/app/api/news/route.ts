export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const db = createServerSupabase()
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Math.min(Number(searchParams.get('pageSize') || '10'), 50)
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'ar'

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await db
    .from('posts')
    .select('slug,published_at,post_translations(title,summary,locale),post_meta(cover_image_url,tags,category)')
    .eq('status','published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data || []).map((p: any) => {
    const t = (p.post_translations || []).find((x: any) => x.locale === locale) || p.post_translations?.[0]
    return {
      slug: p.slug,
      publishedAt: p.published_at,
      title: t?.title,
      summary: t?.summary,
      cover: p.post_meta?.cover_image_url,
      tags: p.post_meta?.tags || [],
      category: p.post_meta?.category || null
    }
  })

  return NextResponse.json({ page, pageSize, items })
}