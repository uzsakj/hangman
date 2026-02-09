# Hangman Game

A React + TypeScript hangman game with difficulty levels, dark mode, and an admin area to manage the word list. Data and auth are backed by [Supabase](https://supabase.com).

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key (see below)
npm run dev
```

## Supabase setup

The app needs a Supabase project for the **words** table and **Auth** (admin login).

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → choose org, name, database password, region.
3. Wait for the project to be ready.

### 2. Get API keys

1. In the project: **Project Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → use as `VITE_SUPABASE_URL` in `.env`.
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY` in `.env`.

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create the table and seed data

1. In Supabase: **SQL Editor** → **New query**.
2. Paste the contents of **`supabase/seed-words.sql`** and run it.

This will:

- Create the **words** table (`id`, `word`, `created_at`).
- Insert the default **admin** user (see step 4 for credentials).
- Insert the **auth.identities** row so the admin can sign in.
- Insert initial **words** for the game.

### 4. Enable Email auth (if not already on)

1. **Authentication** → **Providers** → **Email**.
2. Ensure **Email** is enabled (default for new projects).

The seed adds a default admin user. Use it to log in at **Admin** in the app:

- **Email:** `admin@admin.com` (or the email set in `supabase/seed-words.sql`)
- **Password:** `admin`

Change the password in production (e.g. via Supabase Dashboard → Authentication → Users).

### 5. (Optional) Restrict who can add words with RLS

To allow only logged-in users to insert into `words`:

1. **Table Editor** → select **words** → **RLS** (or **Authentication** → **Policies**).
2. Enable **Row Level Security** on the `words` table.
3. Add a policy, e.g. **“Allow insert for authenticated users”**:
   - Operation: **INSERT**
   - Target roles: `authenticated`
   - Policy: `auth.role() = 'authenticated'`
4. Add a **SELECT** policy so the game can read words, e.g. allow `anon` and `authenticated` to **SELECT** (or keep the table readable by all if you prefer).

## Scripts

| Command       | Description                |
|--------------|----------------------------|
| `npm run dev`| Start dev server           |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`   | Run ESLint             |

## Features

- **Home:** Choose difficulty (easy / medium / hard) and start a game.
- **Game:** Guess letters, see hangman progress and remaining failures; end or restart game.
- **Admin:** Sign in with Supabase Auth to add words to the list (protected).
- **Dark mode:** Toggle in the navbar; preference stored in `localStorage`.
