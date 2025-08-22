import {getTranslations, setRequestLocale} from 'next-intl/server'

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{t('nav.about')}</h1>
      <p className="opacity-80">About content will be managed via Admin.</p>
    </main>
  )
}