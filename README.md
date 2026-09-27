# Pilot Bridge

**Pilot Bridge**  platform that helps government departments find, test, pay, and scale startup solutions across a structured 10-stage innovation lifecycle.

 All server behaviour is simulated in the browser. The logic — rules, scoring, matching, clocks, documents, audit hashing — is real and runs client-side.

> **Honesty label:** This is a prototype Thresholds, names, and figures are illustrative. Confirm against your current procurement rules before use.

---



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
