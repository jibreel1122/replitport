export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const db = createServerSupabase()
  const { searchParams } = new URL(request.url)
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'ar'

  const { data, error } = await db
    .from('albums')
    .select('slug,cover_image_url,album_translations(*),album_images(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data || []).map((a: any) => {
    const t = (a.album_translations || []).find((x: any) => x.locale === locale) || a.album_translations?.[0]
    return {
      slug: a.slug,
      title: t?.title,
      cover: a.cover_image_url,
      images: a.album_images || []
    }
  })

  return NextResponse.json({ items })
}