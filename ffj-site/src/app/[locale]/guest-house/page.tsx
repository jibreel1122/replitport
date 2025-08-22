import {getTranslations, setRequestLocale} from 'next-intl/server'

export default async function GuestHousePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{t('nav.guestHouse')}</h1>
      <p className="opacity-80">Guest House info and booking details will be available here.</p>
    </main>
  )
}