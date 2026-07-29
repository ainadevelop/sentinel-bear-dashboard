# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and Devin when working in this repository.

Project-wide context lives in [`ainadevelop/sentinel-hub`](https://github.com/ainadevelop/sentinel-hub) — read its `CLAUDE.md` and `docs/STATUS.md` before starting work.

## Repository

`ainadevelop/sentinel-bear-dashboard` is **SENTINEL BEAR** — a monitoring dashboard for AI bear detection. It is a separate product line from the minpaku entry-control stack, but reuses the same Raspberry Pi 5 detection backend.

⚠️ **This repository is public.** Never commit credentials, private endpoints, or personal data.

Most user-facing strings are Japanese.

## Stack

Next.js 16 (App Router) / React 19 / TypeScript / Tailwind v4 / shadcn + `@base-ui/react` / recharts. Deployed on Vercel.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint     # eslint
```

## Layout

- `app/page.tsx` — single-page dashboard shell.
- `components/sentinel/dashboard.tsx` — top-level composition; tabs are `overview` / `camera` / `analysis` / `history` / `map` / `stations` / `settings`.
- `components/sentinel/alert-banner.tsx` — detection alert banner (drives the warning sounds in `public/*.wav`).
- `lib/api.ts` — the Pi backend client. `PI5_BASE = 'https://cam.ainadevelop.com'` (the Cloudflare Tunnel in front of `ainadevelop/detector`'s `api.py`). Endpoints used: `/api/snapshot`, `/api/bear/settings`, `/api/bear/stats`.
- `lib/bear-data.ts` — response types plus the `STATION_NAMES` map (`UMEDAYA-001`, `BEAR-001`, `TEST-001` → 宇都宮市街地).
- `lib/bear-context.tsx` — React context holding the dashboard KPIs.
- `lib/data.ts` — demo/fallback data used when the Pi is unreachable.

## Conventions that matter

- **The Pi is the source of truth.** Detection thresholds and sensitivity live in the Pi's `/api/bear/settings`; this app reads and writes them but must not keep its own copy.
- Fall back to the demo data in `lib/data.ts` when the Pi API is unreachable — the dashboard must still render.
- Alert sounds are static assets in `public/` (`bear_alert.wav`, `bear_warning.wav`, `bear_voice.wav`, `bear_closing.wav`). Autoplay requires a prior user gesture; keep the existing unlock flow.
- Station IDs are opaque strings from the Pi; add new ones to `STATION_NAMES` rather than hardcoding names in components.

## Known state (2026-07)

- Positioned as a v0 demo. Feature depth is far below the minpaku stack.
- No tests and no CI beyond Vercel's build.
