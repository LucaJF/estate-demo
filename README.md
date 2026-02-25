# EstateTools — Agent Portal Demo

A real estate agent productivity platform built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Dashboard** — Stats overview, today's follow-ups, smart client-property matching
- **Client Management** — Full CRUD, status tracking (Active / Pending / Closed), activity timeline
- **Event Tracking** — Log calls, emails, showings, offers, and notes per client
- **Properties** — Listing management with price, size, and area details
- **Integrations** — Gmail & Google Calendar UI (coming soon)
- **Bilingual** — English / Chinese toggle

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-intl](https://next-intl-docs.vercel.app/) for i18n
- [lucide-react](https://lucide.dev/) for icons

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd estate-tools
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page. Enter any email and password to create a demo account.

### 5. Seed demo data (optional)

After signing up, copy your user ID from Supabase **Authentication → Users**, then uncomment and run the seed block at the bottom of `supabase/schema.sql`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Project Structure

```
app/
  [locale]/
    login/          # Auth page
    (dashboard)/
      page.tsx      # Dashboard
      clients/      # Client list + detail
      properties/   # Property listings
      integrations/ # Gmail/Calendar UI
  api/              # REST API routes
components/
  Sidebar.tsx
  dashboard/        # StatsCards, RemindersWidget, MatchWidget
  clients/          # ClientTable, ClientForm, EventTimeline
  properties/       # PropertiesClient
lib/
  supabase.ts       # Browser client
  supabase-server.ts# Server client
  types.ts          # TypeScript types
  utils.ts          # Helpers
messages/
  en.json           # English strings
  zh.json           # Chinese strings
supabase/
  schema.sql        # Database schema + RLS policies
```
