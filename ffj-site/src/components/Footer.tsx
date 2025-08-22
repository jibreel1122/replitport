import Link from 'next/link'

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="border-t mt-16 py-8 text-sm">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="opacity-70">© {new Date().getFullYear()} Friends of Freedom and Justice – Bil’in</p>
        <nav className="flex items-center gap-4">
          <Link href={`/${locale}/about`} className="hover:underline">About</Link>
          <Link href={`/${locale}/contact`} className="hover:underline">Contact</Link>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a>
        </nav>
      </div>
    </footer>
  )
}