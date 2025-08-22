# FFJ – Friends of Freedom and Justice (Bil’in)

Production-ready bilingual site (en/ar) built with Next.js App Router, Tailwind, Supabase (Postgres/Auth/Storage), and next-intl.

## Tech
- Next.js 14 (App Router, TS)
- Tailwind CSS + RTL + shadcn-ready
- Supabase (Postgres, RLS, Auth, Storage)
- next-intl i18n (en/ar)
- Zod, RHF, Framer Motion

## Getting Started
1. Copy env
```bash
cp .env.example .env.local
```
2. Fill Supabase keys (project URL, anon key, service role key)
3. Install deps
```bash
npm install
```
4. Dev
```bash
npm run dev
```
- App at http://localhost:3000
- Localized routes: /en, /ar

## Database
- Use Supabase CLI or SQL editor to run migrations
- Apply `supabase/migrations/0001_init.sql`

## Seed
```bash
npm run seed
```
- Inserts pages, 10 news posts, 2 projects, 3 albums

## Build & Deploy
- Build: `npm run build`
- Deploy front-end on Vercel
- Backend/Auth/DB/Storage via Supabase project

## Scripts
- `dev`, `build`, `start`, `lint`, `seed`, `test:e2e`

## Notes
- RLS policies enforce public read for published content; auth required to modify
- Add storage buckets: `media` for images
- Add email provider (Resend/SMTP) for contact notifications