This is the Nano Banana AI Image Editor (Next.js App Router).

## Getting Started

Environment variables:

Create a `.env.local` with at least:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Supabase settings:
- Add Google as an OAuth provider in Supabase Auth.
- Authorized redirect URLs must include:
  - http://localhost:3000/auth/callback
  - https://www.nanobanana-ai.dev/auth/callback

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 16:9 Image Generator Embed

The 16:9 app is loaded in an iframe. Prefer bundling it same‑origin to avoid cross‑domain auth/iframe issues.

- Default local path: `/nb169-app/index.html` (served from `public/nb169-app/`)
- Override via env:

```bash
NEXT_PUBLIC_169_APP_URL=/nb169-app/index.html
```

To bundle `themutherfvcker/NanoBanana_16-9_image_creator` here:

1) Build that repo for production (e.g., `npm run build`).
2) Copy its static output directory into `public/nb169-app/`.
3) Deploy this app; the embed will be same‑origin, and postMessage + auth redirects will work reliably.
