# Handoff — Dostra frontend (Login · Dashboard · Leads · Lead detail)

## Overview

Design for the **Dostra** lead-operations CRM frontend — four screens (Login, Dashboard, Leads list, Lead detail), light + dark themes, role-aware for **admin** and **client** users.

Dostra ingests leads from client sites (WPForms → Zapier webhook → Laravel API) and lets operators read/filter them. It is **not** a sales pipeline tool. The UI is quiet, data-dense, and operational — closer to a log viewer than a CRM.

## About the design files

Everything in `prototype/` is a **design reference written in HTML + inline React/JSX via Babel-standalone**. It is **not production code**. Re-implement it in the real Dostra Web codebase (Vite + React + TypeScript SPA talking to the Laravel API) using that project's established patterns. Lift visual decisions, layout, tokens, copy, and interaction intent — not the JSX itself.

Open `prototype/Dostra Frontend Design.html` in a browser to view all screens on a pan/zoom canvas.

## Fidelity

**High-fidelity.** Colors, type, spacing, layout, and copy are final. Hit them pixel-for-pixel.

## Tech target

- React 18 + TypeScript + Vite
- Styling: match whatever the codebase uses. If nothing is established, plain CSS + CSS variables keyed off the token objects in `prototype/tokens.jsx`.
- Server state: TanStack Query. Filter/selection state: URL query params.
- Suggested routes: `/login`, `/`, `/leads?client=&from=&to=&email=&page=&selected=`, `/leads/:id`.

## Roles

Every in-app screen branches on `user.role`:

|  | admin | client |
|---|---|---|
| Sidebar nav | Dashboard · Leads · Clients (soon) · Users (soon) | Dashboard · Leads |
| Topbar chip | `All clients · 6` | assigned client name + mono key |
| Leads scope | all leads, all clients | only assigned client's leads |
| Leads table cols | ID · Lead · **Client** · Message · Received | ID · Lead · Message · Received |
| Leads filter bar | editable Client filter | locked client chip (non-editable) |
| Dashboard "Top clients" card | top clients by volume | replaced with "Lead sources" (per-form counts) |
| Dashboard metrics | Total / New 24h / Active clients / Reachable | Total / New 24h / **Avg response** / Reachable |
| Dashboard greeting | "9 leads today across 5 clients" | "2 leads today for Acme Plumbing" |
| Role badge dot | accent (indigo) | signal (green) |
| Breadcrumbs on Leads/Detail | `Leads / #id` | `Leads / Acme Plumbing / #id` |

Admin sees everything. Client sees only what's theirs. Filter scoping must happen server-side too — never rely on the frontend to hide records.

## Design tokens

Canonical values. `prototype/tokens.jsx` has both themes as JS objects ready to port.

### Typography
- Sans: `Geist, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Mono: `"Geist Mono", ui-monospace, "JetBrains Mono", "Fira Code", Menlo, monospace`
- Monospace is used for IDs, timestamps, counts, payload keys, and "uppercase caption" labels (11–12px, `letter-spacing: 0.8`, uppercase).
- Numbers should use `font-variant-numeric: tabular-nums`.
- Body text: `text-wrap: pretty` where it flows.

### Color — light theme
```
bg        #f0eee9   (warm bone)
surface   #faf9f5
surface2  #f3f1ea
line      #e4e0d6
ink       #1a1a18   (near black, warm)
inkMuted  #55524a
inkFaint  #8a867a
accent    oklch(0.48 0.14 262)   indigo-slate
accentSoft oklch(0.93 0.03 262)
accentInk  oklch(0.35 0.15 262)
signal    oklch(0.62 0.17 150)   green — NEW leads, "good"
signalBg  oklch(0.95 0.05 150)
warn      oklch(0.68 0.15 55)    amber — data-quality issues
warnBg    oklch(0.95 0.06 70)
danger    oklch(0.55 0.20 25)
codeBg    #f7f5ee
codeKey   oklch(0.45 0.13 262)
codeStr   oklch(0.42 0.12 150)
codeNum   oklch(0.55 0.15 55)
```

### Color — dark theme
```
bg        #14130f
surface   #1c1a16
surface2  #232119
line      #2e2b23
ink       #ebe7db
inkMuted  #a5a092
inkFaint  #6b675b
accent    oklch(0.72 0.12 262)
accentSoft oklch(0.30 0.08 262)
accentInk  oklch(0.85 0.10 262)
signal    oklch(0.72 0.16 150)
signalBg  oklch(0.28 0.08 150)
warn      oklch(0.76 0.14 70)
warnBg    oklch(0.30 0.08 70)
danger    oklch(0.68 0.18 25)
codeBg    #161410
codeKey   oklch(0.75 0.11 262)
codeStr   oklch(0.75 0.13 150)
codeNum   oklch(0.78 0.13 55)
```

### Spacing / radius / stroke
- Border: `1px solid line`; dashed `1px dashed line` used for tertiary dividers.
- Radii: 4 (chips), 6 (buttons/inputs), 8 (cards), 10 (feature cards), 20 (pill chips).
- Card padding: 16–22px. Gutter between cards: 14–18px. Screen padding: 22px × 28px.
- Sidebar widths: 64 collapsed, 232 expanded. Topbar height 56. Artboard 1440 × 900.
- Shadows are minimal — `0 1px 2px rgba(0,0,0,.08)` on pressed segmented buttons and Tweak panel `0 8px 32px rgba(0,0,0,.12)`. Otherwise prefer borders over shadows.

### Accent usage rules
- **One accent** (indigo-slate) for active states, primary links, chart fills, focus rings.
- **One signal** (green) reserved *only* for "new" / fresh / success / live-webhook signals. Never use it decoratively.
- **Warn** (amber) for data-quality issues (missing email, empty message). **Danger** (red) for errors only.
- Placeholder / "soon" features get a muted `soon` mono badge, never a colored one.

## Screens

### 1. Login (`/login`)
- Single centered card, 440px wide, on `bg`. Dostra wordmark + logo monogram at top. Inputs: email, password. Primary button "Sign in" (ink bg, bg text). Inline link to forgot password (disabled, "soon").
- Error state: inline red text under form. No modal dialogs.
- On success → `/`.

### 2. Dashboard (`/`)
- Topbar breadcrumbs: `Dashboard`.
- Greeting row: `Good afternoon, {firstName}` + timestamp line. Right side: role pill (`Admin · all clients` or `Client · 1 client`) + `Last 14 days` button.
- Four metric cards (grid-cols-4, gap 14). Each: mono uppercase label, delta pill top-right, big number bottom-left (32px, 500wt, tabular), sparkline bottom-right.
- Middle row (grid 1.8fr / 1fr): **Leads by day** 14-bar chart (today = signal green, yesterday = accent, rest = accentSoft) + **Quick status** list (5 rows, each with name, number, dot colored by tone).
- Bottom row (grid 1fr / 1.8fr): **Top clients** (admin) / **Lead sources** (client) ranked bar list + **Recent leads** mini-table (6 rows, ID · Lead · Client|Email · Received).

### 3. Leads list (`/leads`)
- Topbar breadcrumbs: `Leads` (admin) or `Leads / Acme Plumbing` (client). Right slot: `Filters` + `Add lead` buttons (both "soon", disabled).
- Filter bar below topbar: Client dropdown (or locked chip for clients) · Email · From · To · right side shows `{n} leads · page 1 / {p}` with pager.
- Body is a two-column grid: **table left (1fr) / preview right (440px)**.
- Table rows 48–52px tall. Freshness dot (signal) to left of name if `new`. Selected row: `surface` bg + 2px left accent border, `paddingLeft: 20` (compensating for the border so content stays aligned).
- Preview pane (right): header with ID + "Open detail" button → name → email → chips (NEW pill, source, key) → Message block → 2×2 KV grid (Client/Key/Received/Source) → Payload preview as syntax-highlighted JSON (monospace, colored keys/strings).

### 4. Lead detail (`/leads/:id`)
- Topbar breadcrumbs reflect role. Right slot: `Edit lead` (soon).
- Main grid: **content left (1fr) / right rail (420px, surface bg)**.
- Header card: `All leads` back button + `/ lead #id` + pills (NEW, source). Big name (30px, 500wt), email + phone on one line. Right-aligned actions: `Copy email` (secondary) + `Reply via email` (primary, ink bg).
- Message card: label + message body (15px, line-height 1.6).
- Raw payload card: segmented toggle `Pretty / Raw JSON` + `Copy` action. Pretty mode is a 2-col mono table (200px key col + value col), alternating `surface`/`surface2` row backgrounds, `null` rendered italic in `inkFaint`.
- Right rail sections: **Client attribution** (avatar tile), **Identity** (Lead ID, webhook event, source, UTM source, IP — all mono), **Timeline** (3 items: Received, Verified, Stored — marked "derived" badge, since backend doesn't emit yet). Footer row: created / updated timestamps.

## Components

Shared across screens (names as in `prototype/shell.jsx` and friends):

- `<Sidebar t collapsed current user onToggle onNav />` — 64/232 width, collapsible, role-aware nav items
- `<Topbar t user crumbs right />` — breadcrumbs, ⌘K search (read-only for now), right slot, role-aware client chip
- `<Icon name size stroke color />` — inline SVG icon set (dashboard, leads, clients, users, search, chevron*, dot, arrow*, logout, copy, external, back, filter, plus, sidebar, sun, moon, check, clock, sparkle)
- `<MetricCard t label value delta deltaDir spark sparkColor unit />` — dashboard KPI card with sparkline
- `<Sparkline data color w h />` — SVG polyline + end-dot
- `<Pill t tone>` (tone: neutral | signal | warn) — uppercase mono mini-tag
- `<FilterChip t label value />` — rounded 20px pill with mono label + value + chevron
- `<KV t label value mono />` — uppercase mono label over value row
- `<LeadPreview t lead />` — right-pane preview used in Leads list
- `<Section t title future>` + `<TLItem t ts label detail last>` — right-rail sections + timeline items used in Lead detail

## Interactions

- **Sidebar collapse** — saved to localStorage. Expanded shows label + count + "soon" badges; collapsed shows icons only, centered.
- **Theme** — light/dark toggle; saved to localStorage. All screens swap via the single `t` token object.
- **Role** — comes from auth/session, NOT a toggle in production. The prototype exposes it as a tweak for review.
- **Leads row click** — updates `?selected=<id>` and scrolls preview pane into view (single column on mobile).
- **Open detail** — navigates to `/leads/:id`.
- **Search ⌘K** — stubbed; wire to a command-palette component when available.
- **Filters** (client/from/to/email) — every change updates query params and triggers a refetch. Debounce text inputs 250ms. Server is source of truth; no client-side filtering of records the user shouldn't see.
- **Pretty/Raw JSON toggle** — local state on Lead detail. `Copy` copies the raw JSON string to clipboard; show a 1.5s toast.
- **"soon" buttons** — render disabled with a `soon` mono badge. Do not wire up.

## State & data

- Auth: existing session endpoint returns `{ id, name, role: 'admin' | 'client', clients: [{ name, key }] }`. Gate routes on presence of user; role drives UI branching.
- Dashboard: `GET /api/dashboard` returns the four metrics, 14-day histogram, quick-status counts, top-clients / sources list, and 6 most-recent leads. If the Laravel API doesn't aggregate yet, compute client-side from `/api/leads?limit=500&since=14d` as a fallback — mark the aggregate cards with a small `derived` badge (already in the design for Timeline).
- Leads list: `GET /api/leads?client=&from=&to=&email=&page=&per_page=50`. For client role, server MUST scope by assigned client(s) regardless of query.
- Lead detail: `GET /api/leads/:id`. Payload arrives as `{ ...lead, payload: {...} }` — pretty table iterates `Object.entries(payload)`.

## Assets

No external image assets. The Dostra monogram is an inline SVG in `prototype/shell.jsx` → `<DostraLogo>`. All icons are inline SVG in `<Icon>`. Geist + Geist Mono should be loaded via `@fontsource/geist-sans` and `@fontsource/geist-mono` (or equivalent) in the real app.

## Files in this bundle

```
prototype/
  Dostra Frontend Design.html   ← open this in a browser
  design-canvas.jsx              ← pan/zoom canvas wrapper (not for production)
  tokens.jsx                     ← DOSTRA_LIGHT, DOSTRA_DARK, DOSTRA_TYPE, DOSTRA_DAILY, DOSTRA_CLIENTS, DOSTRA_LEADS
  shell.jsx                      ← Sidebar, Topbar, Icon, DostraLogo
  login.jsx                      ← LoginScreen
  dashboard.jsx                  ← DashboardScreen, MetricCard, Sparkline, Pill
  leads.jsx                      ← LeadsListScreen, LeadPreview, FilterChip, KV
  detail.jsx                     ← LeadDetailScreen, Section, TLItem
```

Port tokens first, then the shell (Sidebar + Topbar + Icon), then screens in order: Login → Leads list → Lead detail → Dashboard. Role-awareness is a prop drill of `user` from the auth context down to each screen — don't invent a new role context.
