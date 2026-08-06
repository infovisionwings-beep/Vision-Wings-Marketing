<div align="center">

# Vision Wings Marketing

**Marketing site, insights publishing, and a role-based admin console — in one repo.**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Turnstile](https://img.shields.io/badge/Cloudflare_Turnstile-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/turnstile/)

</div>

---

## Contents

- [What this is](#what-this-is)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [**Admin access & RBAC**](#admin-access--rbac) ← *read this before changing the super admin*
- [Security posture](#security-posture)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## What this is

A two-tier application:

| Tier | What it does |
|:--|:--|
| **`frontend/`** | Next.js App Router — public marketing site, insights/essays, client dashboard, and the `/admin` console. Owns Neon Auth sessions, RBAC guards, and server actions. |
| **`backend/`** | Express + Drizzle API — media library, campaigns, contact submissions, admin invites, audit logging. Owns the privileged writes and the `admin_roles` table. |

Both talk to the same Neon Postgres database. The frontend is the only thing a browser reaches; the backend is called server-to-server and by the admin console.

---

## Architecture

```
                    ┌──────────────────────────────┐
   Browser  ───────▶│  Next.js  (frontend/)        │
                    │  · public site + /insights   │
                    │  · /login  (Turnstile)       │
                    │  · /admin  (RBAC guards)     │
                    └───────────┬──────────────────┘
                                │ server-to-server
                                ▼
                    ┌──────────────────────────────┐
                    │  Express API  (backend/)     │
                    │  · media · campaigns         │
                    │  · invites · audit log       │
                    └───────────┬──────────────────┘
                                ▼
                 ┌────────────────────────────────────┐
                 │  Neon Postgres  ·  Upstash Redis   │
                 │  Vercel Blob    ·  Resend (email)  │
                 └────────────────────────────────────┘
```

**Two independent identity sources.** Neon Auth handles ordinary site users. The admin console layers a second, short-lived JWT (`admin_session`, 12h) on top — so an admin's elevated role expires on its own schedule, separate from their site login.

---

## Repository layout

```
.
├── frontend/                 Next.js 16 · App Router · Tailwind
│   ├── app/
│   │   ├── admin/            Admin console — one folder per surface, each role-guarded
│   │   ├── admin-login/      Super-admin / invited-admin password login
│   │   ├── admin-invite/     Invite redemption (token from email)
│   │   ├── login/            Public sign-in + sign-up, Turnstile-protected
│   │   ├── insights/         Long-form articles
│   │   └── actions/          Server actions (auth, invites, uploads)
│   ├── lib/auth/rbac.ts      requireAdmin() — the single authorization chokepoint
│   ├── lib/db/schema.ts      Drizzle schema (frontend view)
│   └── next.config.ts        Security headers + CSP
│
├── backend/                  Express 5 · Drizzle · TypeScript
│   ├── src/routes/           admin · campaigns · photos · videos · settings
│   ├── src/middleware/       adminAuthMiddleware() — JWT verify + role check
│   ├── src/db/schema.ts      Drizzle schema (source of truth)
│   └── drizzle/manual/       Hand-written SQL migrations
│
├── md/                       Product docs — PRD, Architecture, Design, Phases
└── legal/                    Policy source documents
```

---

## Getting started

```bash
git clone <repo-url> && cd assetss
```

**Backend**

```bash
cd backend && npm install && npm run dev
```

**Frontend** (separate terminal)

```bash
cd frontend && npm install && npm run dev
```

The site comes up on `http://localhost:3000`, the API on the port set in `backend/.env`.

> [!IMPORTANT]
> Cloudflare Turnstile rejects the sign-in widget with **error 110200** unless `localhost` is listed under *Turnstile → your widget → Hostname Management*. Add it, or swap in a testing site key for local work.

---

## Environment variables

Both `.env` files are gitignored. **Never commit real values.**

### `frontend/.env.local`

| Variable | Purpose |
|:--|:--|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for auth callbacks and SEO |
| `NEXT_PUBLIC_BACKEND_URL` | Where server actions reach the Express API |
| `SUPER_ADMIN_EMAIL` | **Sole source of the `Developer` role** — see below |
| `SUPER_ADMIN_PASSWORD` | Password for `/admin-login` as the super admin |
| `ADMIN_EMAILS` | Comma-separated static allowlist granted `Admin` |
| `ADMIN_JWT_SECRET` | Signs the `admin_session` cookie. Rotating it logs out every admin |
| `SIGNUP_SECRET` | Guards the signup OTP flow |
| `NEON_AUTH_BASE_URL` · `NEON_AUTH_COOKIE_SECRET` | Neon Auth session handling for ordinary site users |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget key (public) |
| `TURNSTILE_SECRET_KEY` | Turnstile server-side verification key |
| `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` · `REDIS_URL` | Rate limiting and queues |
| `RESEND_API_KEY` | Transactional email |
| `RESEND_FROM` | **Required.** Verified sender for signup OTPs. Unset means no mail goes out — see below |
| `RESEND_REPLY_TO` | Where replies land |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads |

### `backend/.env`

| Variable | Purpose |
|:--|:--|
| `PORT` | API listen port |
| `DATABASE_URL` | Same Neon database as the frontend |
| `REDIS_URL` · `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` | Upstash — rate limiting and job queues |
| `SUPER_ADMIN_EMAIL` | **Must match the frontend value exactly** |
| `SUPER_ADMIN_PASSWORD` | **Must match the frontend value exactly** |
| `ADMIN_JWT_SECRET` | **Must match the frontend value** — the frontend signs, the backend verifies |
| `FRONTEND_URL` | Base URL for invite links, and the CORS origin |
| `RESEND_API_KEY` | Transactional email (invites, notifications) |
| `RESEND_FROM` | Verified sender. The shared sandbox address only delivers to the account owner, so invites fail until this is set |
| `RESEND_REPLY_TO` | Where replies land — `RESEND_FROM` has no mailbox behind it |
| `CONTACT_NOTIFY_EMAIL` | *Optional.* Contact-form recipient; falls back to `SUPER_ADMIN_EMAIL` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads |

> [!WARNING]
> **`RESEND_FROM` must be set in *both* tiers.** Resend's shared `onboarding@resend.dev` sandbox sender only delivers to the Resend account owner — every other recipient is rejected with a `403`. The backend has always set a verified sender, so admin invites went out fine; the frontend did not, so signup OTPs were silently rejected and users waited on a code screen for mail that was never accepted. Both tiers now refuse to send rather than fall back to the sandbox.

---

## Admin access & RBAC

### The roles

| Role | Granted by | Media library | Campaigns | Written content | Invites & logs |
|:--|:--|:--:|:--:|:--:|:--:|
| **Developer** | `SUPER_ADMIN_EMAIL` env var — *nothing else* | ✅ | ✅ | ✅ | ✅ |
| **Admin** | Invite, or the `ADMIN_EMAILS` allowlist | ✅ | ✅ | ✅ | ❌ |
| **SEO** | Invite | ✅ | ✅ | ❌ | ❌ |
| **Content Manager** | Invite | ✅ | ❌ | ✅ | ❌ |

`Developer` is deliberately absent from the assignable-roles list, so **no invite can ever mint a second super admin**. The only way to change who holds it is to change the environment variable.

### How a request is authorized

Every admin surface funnels through `requireAdmin()` in `frontend/lib/auth/rbac.ts`, which resolves a role in this order:

1. Email matches `SUPER_ADMIN_EMAIL` → **`Developer`**. Env-derived, so it survives cookie expiry.
2. A valid `admin_session` JWT carries a role → use it.
3. Otherwise ask the backend (`GET /api/admin/is-admin/:email`), which reads `admin_roles`.
4. Still nothing, but the email is in `ADMIN_EMAILS` → **`Admin`**.
5. No role resolved → redirect to `/admin-login`.

The role is **never defaulted**. Every branch fails closed.

### Changing the super admin

> [!WARNING]
> The super admin lives in **two** env files plus **two** deployment environments. Changing one and not the others leaves the frontend and backend disagreeing about who is privileged — the console will let you in while the API returns `403`.

**Checklist:**

- [ ] `frontend/.env.local` — `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`
- [ ] `backend/.env` — the same two, byte-for-byte identical
- [ ] **Vercel** project env vars (frontend) → redeploy
- [ ] **Render** service env vars (backend) → restart
- [ ] `ADMIN_EMAILS` — prune the outgoing admin, or they keep `Admin` on their next sign-in
- [ ] `admin_roles` table — invited admins persist here with their own password hashes and **survive deleting users from Neon Auth**. Audit and delete stale rows:

  ```sql
  SELECT email, role, name, created_by FROM admin_roles;
  DELETE FROM admin_roles WHERE email = 'stale@example.com';
  ```

- [ ] Confirm `ADMIN_JWT_SECRET` still matches across both tiers

### The invite flow

The super admin creates an invite; the backend emails a single-use link. The raw token never comes back through the HTTP response — **the email is the proof of identity**. Invites expire in 24 hours, and the invitee sets a password of at least 12 characters at redemption.

---

## Security posture

| Control | Where | Notes |
|:--|:--|:--|
| **Content Security Policy** | `frontend/next.config.ts` | `default-src 'self'`; explicit allowlists for analytics, Turnstile, and embeds |
| **HSTS** | `next.config.ts` | 2 years, `includeSubDomains`, preload-eligible |
| **Turnstile** | `/login` + `authenticateWithTurnstile` | Token verified server-side against `siteverify` |
| **Password hashing** | `bcryptjs` | Invited admins only; the super admin authenticates from env |
| **Audit log** | `admin_audit_logs` | Every admin login and privileged mutation, success *and* failure |
| **Rate limiting** | Upstash Redis | Per-admin key in `requireAdmin()`, plus API-level limits |
| **Input sanitisation** | `dompurify` + `zod` | Article HTML is sanitised on render; API bodies are schema-validated |

> [!NOTE]
> The CSP carries `'unsafe-inline'` for scripts and styles — this app has no nonce plumbing, and adding it would force every page dynamic. The policy is therefore honest about its limits: it does not stop injected inline script, but it *does* stop the step after that — exfiltration to an unlisted origin, foreign script hosts, `<base>` hijacking, and framing.

---

## Scripts

**Frontend**

```bash
npm run dev            # next dev
npm run build          # theme-token check, then next build
npm run start          # next start
npm run lint           # eslint
npm run check:tokens   # fail the build on hardcoded colours
```

**Backend**

```bash
npm run dev              # ts-node src/index.ts
npm run build            # tsc
npm run start            # node dist/index.js
npm run migrate:invites  # apply a hand-written SQL migration
```

**Tests** — plain `node:assert` files, no framework:

```bash
node backend/src/routes/__adminRoles.test.js
node backend/src/routes/__adminInvites.test.js
```

---

## Deployment

| Piece | Host |
|:--|:--|
| Frontend | Vercel |
| Backend | Render (`npm run build && npm run start`) |
| Database | Neon Postgres |
| Cache / queues | Upstash Redis |
| Media | Vercel Blob |
| Email | Resend |

`headers()` in `next.config.ts` is evaluated at **build** time. A CSP or header change needs a rebuild — restarting `next start` alone will not pick it up.

---

<div align="center">
<sub>Vision Wings Marketing · built with Next.js, Express, and Neon</sub>
</div>
