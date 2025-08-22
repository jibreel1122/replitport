"use client"
import Link from 'next/link'
import {usePathname, useParams} from 'next/navigation'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const params = useParams() as { locale?: string }
  const current = (params?.locale as string) || 'en'
  const other = current === 'ar' ? 'en' : 'ar'
  const href = pathname?.replace(`/${current}`, `/${other}`) || `/${other}`
  return (
    <nav aria-label="Language switcher" className="flex items-center gap-2">
      <Link href={href} className="underline text-sm">{other.toUpperCase()}</Link>
    </nav>
  )
}