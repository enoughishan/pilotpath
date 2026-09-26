# Pilot Bridge

**Pilot Bridge** is a frontend-only prototype of a platform that helps government departments find, test, pay, and scale startup solutions across a structured 10-stage innovation lifecycle.

All data is sample data. All server behaviour is simulated in the browser. The logic — rules, scoring, matching, clocks, documents, audit hashing — is real and runs client-side.

> **Honesty label:** This is a prototype with sample data. Thresholds, names, and figures are illustrative. Confirm against your current procurement rules before use.

---

## Quick start

```bash
# Clone and install
git clone <repo-url>
cd pilotpath
npm install

# Start the dev server
npm run dev

# Open in browser
# http://localhost:5173
```

No backend, no API keys, no Docker. Everything runs offline in IndexedDB + Service Worker mocks.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 + CSS custom properties (design tokens) |
| Routing | React Router 7 |
| State | Zustand (demo clock/state), Dexie live reads |
| Mock backend | MSW 2 (REST handlers) + Dexie 4 (IndexedDB) |
| PDF | @react-pdf/renderer |
| Charts | Custom SVG (KPI chart, SLA ring) |
| Drag & drop | @dnd-kit |
| i18n | react-i18next (English + Hindi) |
| Motion | Framer Motion |
| Testing | Vitest + React Testing Library + Playwright (E2E) |
| Fonts | @fontsource (Barlow, Barlow Semi Condensed, Source Serif 4, Noto Sans Devanagari) |

---

## Architecture

```
pilotpath/            # repo directory
├── docs/
│   ├── DEMO_SCRIPT.md        # 12-step narrated hero flow (~7 min)
│   └── PROGRESS.md           # Phase-by-phase build log
├── src/
│   ├── app/
│   │   └── Layout.tsx         # Shell: top bar, left rail, footer, tour, command palette
│   ├── components/            # Signature reusable components
│   │   ├── Stone.tsx          # 10-stage milestone SVG marker
│   │   ├── Pathway.tsx        # Horizontal/vertical road of Stones
│   │   ├── SLARing.tsx        # SLA countdown ring (48px SVG)
│   │   ├── ScoreMatrix.tsx    # Weighted rubric evaluation matrix
│   │   ├── KPIChart.tsx       # Baseline → target → actual chart
│   │   ├── GateChecklist.tsx  # Stage exit condition popover
│   │   ├── AuditTrail.tsx     # SHA-256 hash chain event log
│   │   ├── DocumentView.tsx   # Source Serif 4 document viewer
│   │   ├── CommandPalette.tsx # Ctrl+K navigation and actions
│   │   ├── DemoPanel.tsx      # Demo controls drawer (Ctrl+Shift+D)
│   │   └── GuidedTour.tsx     # 8-step anchored tour system
│   ├── design/
│   │   ├── tokens.css         # Light/dark theme CSS custom properties
│   │   └── motion.ts          # Transition presets + reduced-motion
│   ├── features/              # Screen-level feature modules
│   │   ├── challenges/        # S2 Pathway Board, S3 Builder, S5 Discovery, S6 Screening
│   │   ├── evaluation/        # S7 Evaluator blind scoring workspace
│   │   ├── pilots/            # S8 Pilot monitoring + KPI chart
│   │   ├── contracts/         # S9 Contract + milestone allocator
│   │   ├── payments/          # S10 Finance 3-step payment release
│   │   ├── validation/        # S11 Independent validator workspace
│   │   ├── scaleup/           # S12 Dossier + adoption grid
│   │   ├── templates/         # S13 Template library + clause library
│   │   ├── startup-portal/    # S14 Startup portal (home, opportunities, payments)
│   │   ├── public/            # S1 Landing, S15 Public transparency ledger
│   │   ├── admin/             # S16 Admin rules, rubrics, audit
│   │   └── dev/               # Hidden /dev/components gallery
│   ├── i18n/
│   │   ├── en.json            # English strings
│   │   ├── hi.json            # Hindi strings
│   │   └── index.ts           # i18next config
│   ├── logic/                 # Pure TypeScript business logic (no React)
│   │   ├── stateMachine.ts    # 10-stage lifecycle + gate evaluation
│   │   ├── rules.ts           # Eligibility rule engine with relaxation
│   │   ├── scoring.ts         # Weighted scoring + spread detection
│   │   ├── matching.ts        # TF-IDF startup-to-challenge matching
│   │   ├── sla.ts             # SLA deadline calculation
│   │   ├── pathway.ts         # Pathway recommendation for scale-up
│   │   ├── dossier.ts         # Pilot dossier assembly + grading
│   │   ├── auditChain.ts      # SHA-256 hash chain with tamper detection
│   │   ├── money.ts           # INR formatting + lakh/crore parsing
│   │   └── statementQuality.ts # Problem statement quality scoring
│   ├── mock/
│   │   ├── db.ts              # Dexie IndexedDB schema
│   │   ├── handlers.ts        # MSW REST handlers
│   │   ├── seed/              # Deterministic seed data generator
│   │   ├── demoClock.ts       # Virtual clock (Zustand store)
│   │   ├── demoShortcuts.ts   # Demo-panel data shortcuts (simulate applications, fill stage, demo pilot/milestones)
│   │   ├── latency.ts         # Simulated network latency
│   │   └── browser.ts         # MSW browser worker init
│   ├── test/
│   │   └── setup.ts           # Vitest setup (jest-dom matchers)
│   ├── App.tsx                # Route definitions
│   ├── main.tsx               # React DOM entry point
│   └── index.css              # Tailwind + font imports + token imports
├── package.json
├── vite.config.ts             # Vite + Tailwind + Vitest + path alias
├── tsconfig.app.json
└── tsconfig.json
```

---

## How the mock backend maps to a future real API

| Mock layer | Current implementation | Future real API equivalent |
|---|---|---|
| **Dexie tables** (`db.ts`) | IndexedDB tables for challenges, startups, milestones, audit events, templates, demand items, users, departments | PostgreSQL/equivalent relational tables behind a REST or GraphQL API |
| **MSW handlers** (`handlers.ts`) | Intercepts `fetch()` calls and returns data from IndexedDB with simulated latency | Real HTTP endpoints (`GET /api/challenges`, `POST /api/milestones/:id/release`, etc.) |
| **Demo clock** (`demoClock.ts`) | Zustand store with `advanceDays()` to simulate time passing | Server-side `NOW()` — the clock advances naturally; no simulation needed |
| **Audit chain** (`auditChain.ts`) | SHA-256 hashing in the browser via `crypto.subtle` | Server-side audit table with hash chain, verified by an independent auditor service |
| **Seed data** (`seed/`) | Deterministic generator that creates 14 challenges, 32 startups, etc. on first load | Migration scripts + admin tooling; production starts with real data |
| **PDF generation** (`@react-pdf/renderer`) | Client-side PDF rendering from component data | Server-side PDF generation (same templates) or keep client-side |
| **File uploads** | Stored in IndexedDB blobs, never sent anywhere | Object storage (S3/GCS) with signed upload URLs |

**To migrate:** replace MSW handlers with real `fetch` calls, remove Dexie, and point React Query at the real API. The `src/logic/` modules are pure TypeScript and transfer unchanged.

---

## What is simulated

| Feature | Simulated? | Notes |
|---|---|---|
| AI drafting assistant | **Yes** | Streams a pre-written draft with `setTimeout` chunks to simulate LLM output |
| "Simulate applications arriving" | **Yes** | Writes 3 sample applications to IndexedDB |
| TF-IDF matching engine | **No** | Real TF-IDF implementation in `matching.ts` |
| Eligibility rules & relaxation | **No** | Real rule engine in `rules.ts` |
| Weighted scoring & spread detection | **No** | Real scoring in `scoring.ts` |
| SHA-256 audit chain | **No** | Real `crypto.subtle` hashing in `auditChain.ts` |
| SLA calculation | **No** | Real date arithmetic in `sla.ts` |
| Demo clock | **Yes** | Virtual clock; real app would use system time |
| Payment release flow | **Partially** | 3-step flow (verify → approve → release) is real; actual bank transfer is not |
| PDF download | **No** | Real client-side PDF rendering |
| CSV connector preview | **Yes** | Drop-zone preview for a registry CSV import; no file is actually parsed |
| Network latency | **Yes** | Configurable via Demo Panel; default 100ms |

---

## Scripts

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run test      # Vitest unit tests
npm run test:e2e  # Playwright hero-flow E2E test (full 12-step journey, offline)
npm run preview   # Preview production build
```

---

## Design system

Design tokens are defined in `src/design/tokens.css` as CSS custom properties. Key decisions:

- **Palette:** Cool paper-grey (`--ground: #F2F5F6`) with signage blue (`--primary: #17539B`) and signal yellow (`--marker: #F2B705`)
- **Type:** Barlow Semi Condensed 700 for headings, Barlow 400/600 for body, Source Serif 4 for documents
- **Components:** Stone (SVG milestone), Pathway (stage road), SLA Ring, Score Matrix, KPI Chart, Gate Checklist, Audit Trail, Document View
- **Themes:** Light (default) and dark, toggled via `data-theme` attribute on `<html>`
- **i18n:** English and Hindi, switched via `react-i18next`

---

## The hero flow

The primary demonstration path takes ~7 minutes and covers all 10 lifecycle stages. See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for the full narrated script.

**Quick summary:**
1. Landing → pick Officer → Pathway Board
2. Drag a ticket that fails its gate
3. Create a challenge with AI drafting
4. Match and invite startups
5. Screen with live eligibility rules
6. Switch to Evaluator → blind score → lock
7. Officer reviews score matrix → approve ranking
8. Pilot design + contract sign-off
9. Finance: verify → approve → release payment (SLA ring)
10. Validator signs a pass
11. Scale-up dossier + district adoption
12. Public dashboard + audit chain verify/tamper

---

## Guided tour

Click **Take the tour** in the app footer (or trigger it from the Demo Panel). The tour walks through 8 anchored popover steps highlighting key screens. It is skippable, resumable (via `sessionStorage`), and translated into Hindi.

---

## Licence

Prototype — not for production use.
