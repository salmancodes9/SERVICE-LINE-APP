# SERVICE-LINE-APP

Full-stack student marketplace: **Next.js** frontend + **Convex** backend.

## Requirements

- Node.js 18+
- A [Convex](https://convex.dev) project (free tier is fine)
- OpenAI API key (optional, for AI description & price suggestions — set in Convex dashboard)

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Link Convex** (once per machine)

   ```bash
   npm run dev:convex
   ```

   Log in, create or select a project, and keep deploy running until functions sync. This creates `.env.local` entries Convex CLI uses for deployment.

3. **Frontend env**

   Copy `.env.example` to `.env.local` and set:

   ```env
   NEXT_PUBLIC_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud
   ```

   Find the URL under [Deployments](https://dashboard.convex.dev) → your dev deployment → **Show development credentials**.

4. **OpenAI (optional)**

   In the Convex dashboard: **Settings → Environment variables** → add `OPENAI_API_KEY`. Redeploy if needed.

## Run locally

**Terminal A — Convex** (watches & pushes backend):

```bash
npm run dev:convex
```

**Terminal B — Next.js**:

```bash
npm run
```

Or run both:

```bash
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Next.js dev server             |
| `npm run dev:convex` | Convex dev / deploy watcher |
| `npm run dev:all`    | Both in parallel            |
| `npm run build`  | Production build (needs `NEXT_PUBLIC_CONVEX_URL`) |
| `npm run typecheck`  | TypeScript checks          |

## Repo

[github.com/salmancodes9/SERVICE-LINE-APP](https://github.com/salmancodes9/SERVICE-LINE-APP)
