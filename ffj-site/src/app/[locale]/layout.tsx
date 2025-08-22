import '../globals.css'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { locales } from '@/i18n/locales'
import { ReactNode } from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Friends of Freedom and Justice – Bil’in (FFJ)',
  description: 'Community-led non-violent resistance and programs in Bil’in, Ramallah',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) notFound()
  const messages = (await import(`@/messages/${locale}.json`)).default
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <NavBar locale={locale} />
            {children}
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}