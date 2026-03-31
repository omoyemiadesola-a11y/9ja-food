# 9ja Food (React + Supabase)

A mobile-first, desktop-responsive restaurant web app with:
- Supabase authentication (signup/login/session persistence)
- user-specific cart checkout + order history
- admin-only dashboard for food/location CRUD and image uploads
- role-aware navigation (public, user, and admin navigation bars)
- admin transaction insights (users count, orders count, recent transactions)
- Google Maps locations visualization

## Admin Login
- **Email:** `9jafoodsucres@gmail.com`
- **Password:** `ADMIN!12349JAfood`

> Admin access is protected in both frontend route guards and Supabase RLS policies.

## Environment
Create `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
VITE_GOOGLE_MAPS_API_KEY=...
```

## Install and run

```bash
npm install
npm run dev
```

## Supabase setup
1. Open Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. Confirm buckets exist:
   - `food-images`
   - `location-images`
4. If admin form writes fail, re-run `supabase/schema.sql` to refresh RLS/storage policies.
5. Admin uploads accept `.png`, `.jpg`, `.jpeg`, and `.pdf` files.

## App routes
- `/` home
- `/auth` login/signup
- `/menu` foods list + cart actions
- `/cart` checkout (authenticated users)
- `/orders` user order history
- `/locations` map + location cards
- `/admin` admin CRUD dashboard (admin-only)
