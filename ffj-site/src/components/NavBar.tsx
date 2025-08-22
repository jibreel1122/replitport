import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {LanguageSwitcher} from './LanguageSwitcher'

export function NavBar({ locale }: { locale: string }) {
  const t = useTranslations()
  return (
    <header className="border-b bg-card/60 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href={`/${locale}`} className="font-semibold">FFJ</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href={`/${locale}/news`} className="hover:underline">{t('nav.news')}</Link>
          <Link href={`/${locale}/projects`} className="hover:underline">{t('nav.projects')}</Link>
          <Link href={`/${locale}/gallery`} className="hover:underline">{t('nav.gallery')}</Link>
          <Link href={`/${locale}/about`} className="hover:underline">{t('nav.about')}</Link>
          <Link href={`/${locale}/programs`} className="hover:underline">{t('nav.programs')}</Link>
          <Link href={`/${locale}/guest-house`} className="hover:underline">{t('nav.guestHouse')}</Link>
          <Link href={`/${locale}/education-fund`} className="hover:underline">{t('nav.educationFund')}</Link>
          <Link href={`/${locale}/contact`} className="hover:underline">{t('nav.contact')}</Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}