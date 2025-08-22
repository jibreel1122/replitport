"use client"
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ContactPage() {
  const { locale } = useParams() as { locale: string }
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setLoading(true)
    setMessage(null)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        message: form.get('message'),
      })
    })
    const data = await res.json()
    if (res.ok) setMessage('Thanks! We received your message.')
    else setMessage(data.error || 'Something went wrong')
    setLoading(false)
    ;(event.target as HTMLFormElement).reset()
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" required className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" required className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea name="message" required rows={5} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <button disabled={loading} className="rounded-xl bg-primary text-white px-4 py-2">
          {loading ? 'Sending…' : 'Send'}
        </button>
        {message && <p className="text-green-700">{message}</p>}
      </form>
    </main>
  )
}