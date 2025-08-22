export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const db = createServerSupabase()
  const { searchParams } = new URL(request.url)
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'ar'

  const { data, error } = await db
    .from('projects')
    .select('slug,status,location,project_translations(*),project_media(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data || []).map((p: any) => {
    const t = (p.project_translations || []).find((x: any) => x.locale === locale) || p.project_translations?.[0]
    return {
      slug: p.slug,
      status: p.status,
      location: p.location,
      title: t?.title,
      description: t?.description,
      images: p.project_media || []
    }
  })

  return NextResponse.json({ items })
}