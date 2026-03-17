# 🕊️ PewNeighbor

**Find friends in your church community.** PewNeighbor helps introverted church members connect with fellow members who share their interests — at their own pace. Strictly not a dating site.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Auth | Auth.js v5 (magic link + Google OAuth) |
| Database | Neon Serverless Postgres + Drizzle ORM |
| Hosting | Azure Static Web Apps |
| Email | Resend + React Email |
| Styling | Tailwind CSS v4 |

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) account (free tier works)
- A [Resend](https://resend.com) account (free tier works)

### 2. Environment setup

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your values. At minimum you need:
- `DATABASE_URL` — from your Neon project dashboard
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `RESEND_API_KEY` — from your Resend dashboard
- `MESSAGE_ENCRYPTION_KEY` — generate with `npm run crypto:keygen`

### 3. Database setup

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Seed the interests table (run once)
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Protected app routes (require auth + profile)
│   │   ├── discover/       # Member discovery feed
│   │   ├── waves/          # Send/receive/accept waves
│   │   ├── messages/       # In-app messaging
│   │   └── onboarding/     # First-time profile setup
│   ├── (auth)/
│   │   ├── sign-in/        # Magic link + Google OAuth sign-in
│   │   └── verify/         # "Check your email" page
│   ├── admin/              # Platform admin (app admins only)
│   ├── church-admin/       # Church admin dashboard
│   ├── churches/register/  # Church registration form
│   └── api/                # API routes
├── lib/
│   ├── auth/               # Auth.js config + session helpers
│   ├── crypto.ts           # AES-256-GCM message encryption
│   ├── db/                 # Drizzle schema + seed data
│   ├── email/              # Resend + React Email templates
│   └── validation/         # Zod schemas
└── components/
    ├── layout/             # AppShell, navigation
    └── ui/                 # Button, Input, Card, Badge
```

## Key Design Decisions

### Privacy
- **Church-only visibility** — profiles are never shown outside your church
- **No public pages** — all member content requires authentication
- **Encrypted messages** — AES-256-GCM at the application layer before DB storage
- **Private photos** — stored in Azure Blob with short-lived SAS tokens only
- **First names only** — never full names; no exact ages (ranges only)

### Security
- **Passwordless** — magic link email auth, no passwords to leak
- **Database sessions** — revocable, not JWT
- **Zod validation** — all API input validated before touching the database
- **Parameterized queries** — Drizzle ORM, no SQL injection possible

### Multi-tenancy
- Every table with user data has an `organization_id` column
- Drizzle queries filter by `organizationId` on every data fetch
- Cross-church data access is structurally impossible

## Useful Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (DB GUI)
npm run db:seed          # Seed interests table
npm run crypto:keygen    # Generate a MESSAGE_ENCRYPTION_KEY
```

## Roadmap

- [ ] Profile photo upload (Azure Blob + SAS tokens)
- [ ] Push notifications
- [ ] Group events / activities
- [ ] Stripe integration for church billing
- [ ] Account deletion job (GDPR-compliant)
- [ ] Email digest notifications
- [ ] Church admin: suspend member workflow
