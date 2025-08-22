export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const db = createServerSupabase()
  const { searchParams } = new URL(request.url)
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'ar'

  const { data, error } = await db
    .from('projects')
    .select('id,slug,status,location,project_translations(*),project_media(*)')
    .eq('slug', params.slug)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  const t = (data.project_translations || []).find((x: any) => x.locale === locale) || data.project_translations?.[0]

  return NextResponse.json({
    slug: data.slug,
    status: data.status,
    location: data.location,
    title: t?.title,
    description: t?.description,
    images: data.project_media || []
  })
}