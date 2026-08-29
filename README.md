# DAP Transports

A trip ledger for a transport/logistics business — replaces the paper notebook.
Log each trip (vehicle, route, company, driver, money in/out) and see monthly
reports: total trips, business, expenses, driver payouts, diesel, and net profit.

Built with Next.js (App Router) + Tailwind CSS + Supabase (Postgres).

See the setup guide provided alongside this project for step-by-step
instructions on creating the Supabase database, connecting it, and deploying
to Vercel. In short:

1. `npm install`
2. Create a Supabase project, run `supabase/schema.sql` in its SQL Editor.
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL + anon key.
4. `npm run dev` — open http://localhost:3000
5. Push to GitHub, import into Vercel, add the same two env vars, deploy.
