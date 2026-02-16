
  # Xylem Landscape Portal

  Customer/Admin portal UI with financial documents stored in Supabase and payments handled by Stripe Checkout.

  ## Local development

  1) Install dependencies

  Run `npm i`

  2) Configure environment variables

  Copy `.env.example` to `.env.local` and fill in values.

  - Client (Vite): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Serverless (Vercel Functions): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

  3) Create the Supabase table

  Apply SQL from `supabase/schema.sql` in Supabase SQL Editor.

  3.1) (Optional but recommended) Postal code auto-fill (Thailand)

  This app can auto-fill จังหวัด/อำเภอ/ตำบล from a postal code by querying the Supabase table `postal_code_areas`.

  - Dataset source (MIT): https://github.com/thailand-geography-data/thailand-geography-json
  - Build a CSV for import:
    - `npm run build:postal`
    - Output: `supabase/postal_code_areas.csv`
  - Import into Supabase:
    - Supabase Dashboard → Table Editor → `postal_code_areas` → Import data → choose `supabase/postal_code_areas.csv`

  4) Run

  Run `npm run dev`

  ## Payments (Stripe)

  - Create a Stripe webhook endpoint that points to `/api/stripe-webhook` on your domain.
  - Listen for `checkout.session.completed`.

  ## Deploy on Vercel + connect domain

  1) Import the repository into Vercel.
  2) Set the same environment variables in Vercel Project Settings.
  3) Deploy.
  4) Add your custom domain in Vercel (Project → Settings → Domains).

  Notes:
  - SPA routing is handled via `vercel.json`.
  - The frontend calls `/api/documents` for CRUD and `/api/create-checkout-session` to start Stripe Checkout.
  