# Decisions

- 2026-10-25 — P0-1/P0-3: use Node 24 LTS, the current stable Next.js App Router, Tailwind 4 and locally owned shadcn-style Radix button primitives. Use system fonts to avoid external font requests. The setup page is a temporary, data-free entry point until the signed-in shell is built. Playwright runs production builds with actual Chrome/Edge channels at 1366×768, plus a phone-width smoke test. No deployment is configured here.
