# StudyFlow

A clean, modern student productivity app.

**Features**
- Dashboard with today's overview
- Task manager (priority + due dates)
- Notes (colored cards)
- Weekly class timetable
- GPA calculator
- Pomodoro focus timer

Data is stored in the browser (localStorage) so it works offline immediately.  
Prisma schema is included so you can connect **Neon Postgres** later for multi-device sync.

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Run
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel + GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo
3. Deploy (no env vars needed for the localStorage version)

### Optional: Connect Neon Database

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. In Vercel project → Settings → Environment Variables → add `DATABASE_URL`
4. Locally:
   ```bash
   cp .env.example .env
   # paste your DATABASE_URL
   npx prisma db push
   npx prisma generate
   ```
5. Then you can extend the app with API routes + Prisma client for cloud sync.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide icons
- Prisma (ready for Neon)
- localStorage for instant offline use

---

## Project Structure

```
src/
  app/           → pages & layout
  components/    → UI pieces (Dashboard, Tasks, Notes...)
  hooks/         → useAppData (state + localStorage)
  lib/           → types, utils
prisma/
  schema.prisma  → Neon-ready models
```

Made with care for students who actually want to get things done.
