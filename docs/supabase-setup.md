# Supabase Setup Guide for Juanet

**Juanet – Software Command Center**  
Production-grade Supabase foundation for multi-user SaaS with Row Level Security.

This guide helps you safely connect Juanet to a real Supabase project without breaking the existing mock-based application.

---

## 1. Prerequisites

- A Supabase account (https://supabase.com)
- A new or existing Supabase project
- Node.js + pnpm (or npm) installed
- The Juanet repository cloned locally

---

## 2. Required Environment Variables

Create or update `.env` (or `.env.local`) in the project root:

```bash
# Public (browser + client) – safe to expose
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only (TanStack Start / API routes) – NEVER expose in frontend
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find them**  
Supabase Dashboard → Project Settings → API

- `VITE_SUPABASE_URL` → Project URL
- `VITE_SUPABASE_ANON_KEY` → `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY` → `service_role` key (keep secret)

**Current state**: The app already has the public keys configured.  
You only need to add the `SERVICE_ROLE_KEY` when you start writing data from the server.

---

## 3. Run the Initial Migration

The foundation schema lives at:

```
supabase/migrations/001_initial_schema.sql
```

### Option A – Using Supabase CLI (Recommended)

1. Install the CLI:

   ```bash
   npm install -g supabase
   ```

2. Link your local project to Supabase:

   ```bash
   supabase link --project-ref YOUR-PROJECT-REF
   ```

3. Push the migration:
   ```bash
   supabase db push
   ```

### Option B – Manual via Supabase Dashboard (Quick Start)

1. Go to your Supabase project → **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor and click **Run**

You should see "Success. No rows returned" (or similar).

---

## 4. What the Migration Creates

- **6 core tables** with consistent structure:
  - `profiles`
  - `projects`
  - `requests`
  - `messages`
  - `invoices`
  - `payments`

- Every table includes:
  - `id` (UUID, primary key)
  - `user_id` (FK → `auth.users.id`)
  - `created_at` / `updated_at` (auto-managed)

- **Row Level Security (RLS)** enabled on all tables
- **SELECT policies only** — users can only see their own rows (`auth.uid() = user_id`)
- Automatic `updated_at` trigger on every table
- Profile auto-provisioning trigger on new user signup

**No write policies** have been added yet — this is intentional.

---

## 5. Recommended Supabase Project Settings

Go to **Authentication → Providers**:

- Enable **Email** (with "Confirm email" for production)
- Optionally enable **Google**, **GitHub**, etc.

**Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` (dev) or your production domain
- Redirect URLs: add `http://localhost:3000/**` and production URLs

**Database → Replication** (optional but recommended later):

- Enable replication on tables you will query frequently

**Storage** (future):

- Create a bucket named `attachments` or `user-uploads`
- Set it to private
- Use RLS policies on `storage.objects` when you add file features

---

## 6. How Row Level Security (RLS) Works

RLS is the heart of secure multi-tenancy in Juanet.

Example policy on `projects`:

```sql
CREATE POLICY "projects_select_own"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id);
```

This means:

- Every `SELECT` automatically adds `WHERE user_id = auth.uid()`
- A malicious or buggy query from the frontend can **never** see another user's data
- Even if someone obtains the anon key, they can only access their own rows

**Current state**: Only `SELECT` is allowed.  
Future migrations will add `INSERT`, `UPDATE`, `DELETE` policies with the same ownership rule.

---

## 7. Local Development Workflow

1. Keep the mock system working:
   - `SUPABASE_READY=false` (or missing env vars) → app uses mock data
   - This is the current default behavior

2. When testing real Supabase:
   - Add your `VITE_SUPABASE_*` keys
   - Run the migration
   - The repositories will automatically switch to real queries

3. Never delete the mock layer until you have:
   - Full test coverage
   - RLS verified in a staging project
   - Write operations implemented and tested

---

## 8. Next Steps (After This Migration)

The current task only prepares infrastructure. Future work will include:

- Adding `INSERT`/`UPDATE`/`DELETE` RLS policies
- Implementing write repositories (`createProject`, `updateRequest`, etc.)
- Adding foreign keys (`project_id` on invoices, etc.)
- Introducing organizations / teams tables
- Adding audit logging
- File upload + storage integration

**Do not remove the mock fallback** until the above is complete and battle-tested.

---

## 9. Troubleshooting

**"relation does not exist"**  
→ Migration not applied. Run it again via SQL Editor or `supabase db push`.

**"new row violates row-level security policy"**  
→ You are trying to insert without a matching `user_id` or the policy does not exist yet.  
Current policies are SELECT-only.

**Profile not created on signup**  
→ Check that the `handle_new_user()` trigger exists and the migration succeeded.

**RLS not working in local Supabase**  
→ Make sure you are using the correct JWT from the anon key and that `auth.uid()` returns a value.

---

## 10. Security Checklist

- [x] RLS enabled on every table
- [x] No public or anon policies allowing cross-user access
- [x] `user_id` is NOT NULL and references `auth.users`
- [x] Service role key is never exposed to the browser
- [ ] (Future) Add `INSERT`/`UPDATE` policies only after review
- [ ] (Future) Add storage bucket policies
- [ ] (Future) Enable email confirmation in production

---

**You now have a secure, multi-tenant database foundation ready for Juanet.**

The application will continue to run exactly as before until you explicitly enable real data paths.

When you are ready to implement writes, the next migration will build directly on top of this schema.
