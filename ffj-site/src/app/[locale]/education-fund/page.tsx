import {getTranslations, setRequestLocale} from 'next-intl/server'

export default async function EducationFundPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{t('nav.educationFund')}</h1>
      <p className="opacity-80">Information and donation options will be listed here.</p>
    </main>
  )
}