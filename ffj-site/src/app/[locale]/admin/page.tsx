import { setRequestLocale } from 'next-intl/server'

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Protected area. Configure Supabase Auth and roles to enable access.</p>
    </main>
  )
}