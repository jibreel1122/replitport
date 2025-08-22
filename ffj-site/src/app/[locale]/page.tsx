import {getTranslations, setRequestLocale} from 'next-intl/server'

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <main className="container py-10">
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('site.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t('site.tagline')}
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl shadow-soft bg-card p-6">News</div>
        <div className="rounded-2xl shadow-soft bg-card p-6">Projects</div>
        <div className="rounded-2xl shadow-soft bg-card p-6">Gallery</div>
      </div>
    </main>
  )
}