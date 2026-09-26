# Pilot Bridge Demo Script
> **Duration:** ~7–8 minutes · **Offline:** fully offline, no backend required · **Reset:** Demo Controls (footer) → "Reset Data" at any time

---

## Before you begin

Open `http://localhost:5173` in a browser at 1440 px wide. The honesty label "Prototype with sample data" is visible at all times. The demo clock shows the simulated date in the top bar. Every action you take below is written to a SHA-256 audit chain that you will verify and tamper with at the end.

---

## Step 1 — Open `/` and pick Officer

*Narration:* "Pilot Bridge starts here — a role-based entry point. We're going in as Meera Kulkarni, Joint Director, Urban Development Department."

- Open `/`.
- Click **Officer – Meera Kulkarni**. The Pathway road animates in, showing all 10 lifecycle stages.
- Land on `/app/pathway` — the Kanban board with 14 seeded challenges distributed across stages.

---

## Step 2 — Try dragging a ticket that fails its gate

*Narration:* "Every column has a gate. You can only move a challenge forward when all exit conditions are met."

- Find **CH-019** in Stage 2 (Discovery) — it has 0 applications.
- Drag it right toward Stage 3 (Screening) and drop it.
- The **"Cannot advance yet"** modal appears with the gate checklist — "Applications received ≥ 3" is blocked in red.
- Read the checklist, then close the modal. (Keyboard alternative: the card's **Move →** button.)

---

## Step 3 — Create a new challenge

*Narration:* "Creating a challenge turns a pain point into an outcome-based problem statement in five structured steps."

- Click **New challenge** (top right of the Pathway board).
- At Step 1, click **Use sample problem** to auto-populate the water-loss scenario.
- Click **Draft problem statement (AI Assistant)** — watch the draft stream into the preview pane.
- Observe the **Quality score** (aim for 90+). If a quality warning appears, fix the flagged field.
- Complete steps 2–5 (metadata, rules, team, review) and tick the final checkbox.
- Click **Publish Challenge** — the new challenge appears in **Stage 1** of the Pathway board.
- Open it and click **Advance to Stage 2** (the Stage 1 gate is met) and confirm in the dialog.

---

## Step 4 — Review matches and simulate applications arriving

*Narration:* "The matching engine ranks all registered startups by fit and explains why."

- Open **CH-019** → **Startups** tab.
- The ranked list shows startups with fit scores and reason breakdowns; expand one result to see the match details.
- Invite **Aquavrit Systems**, **Nirvahan Utility Labs**, and **Tantu Flow Analytics** with the Invite toggles.
- Open **Demo Controls** (footer) → click **Simulate applications arriving**.
- The panel confirms "3 applications arrived for CH-019." and Applications Received jumps from 0 to 3.
- Back on the Overview tab, click **Advance to Stage 3** → confirm. (Optionally advance the demo clock a few days first.)

---

## Step 5 — Run eligibility screening

*Narration:* "Rules are live — changing a threshold instantly re-screens all applicants."

- Click the **Screening** tab on CH-019.
- The rule engine evaluates each application live. Watch the what-if simulator:
- Drag the **Prior Turnover Requirement Threshold** slider and watch applicants flip between Eligible / Relaxed / Not Eligible.
- The three applicants are pre-selected — click **Shortlist 3 startups** to persist the shortlist (audit event logged).
- Click **Advance to Evaluation** to move CH-019 to Stage 4.

---

## Step 6 — Switch to Evaluator and score in blind mode

*Narration:* "Evaluators see anonymised codes, not startup names, until scores are locked."

- Open the persona switcher (top-right or Demo Controls) → select **Evaluator (Arvind)**.
- Navigate to `/app/evaluator/queue`.
- Open the first assignment. The conflict-of-interest modal appears — click **No Conflict (Proceed)**.
- In blind mode the startup shows as **Startup S-01**. Score each rubric criterion with the sliders.
- Click **Lock scores** and confirm the irreversible action in the dialog.

---

## Step 7 — Back as Officer: approve the ranking

*Narration:* "The officer sees all evaluator scores side by side and approves the ranking."

- Switch back to **Officer (Meera)**.
- Open CH-019 → **Evaluation** tab.
- The score matrix shows the shortlisted startups (blinded codes S-01…S-03) across all six criteria with weighted totals.
- Click **Approve ranking & unlock next stage** — a RANKING_APPROVED event lands on the audit chain.
- Click **Advance to Stage 5** (Pilot design).

---

## Step 8 — Pilot design, startup acceptance, contract

*Narration:* "Pilot terms are structured — KPIs, duration, milestones — then a binding agreement both sides accept."

- Open the **Pilot** tab → click **Fill with demo shortcut**. A pilot with KPIs, risks, and a 4-milestone schedule is created from the demo template.
- Advance to Stage 6 (Contract).
- Switch to **Startup (Sana)** → `/app/startup/home` → the **"Pilot agreement awaiting your acceptance"** card → click **Accept pilot terms**.
- Switch back to **Officer** → CH-019 → **Contract** tab → click **Accept on behalf of department**.
- Both acceptances are recorded on the audit chain. Advance to Stage 7 (Monitoring).

---

## Step 9 — Finance: verify, approve, and release a milestone payment

*Narration:* "Three-step payment release with separation of duties — verification and approval are different people."

- Open **CH-014** → **Pilot** tab. The KPI chart shows non-revenue water trending from 38% toward the 25% target.
- Switch to **Finance (Rakesh)** → `/app/finance/payments`. The milestone ledger shows **M3** with evidence submitted.
- The SLA ring counts down the days remaining. Click **1. Verify Evidence**.
- Click **2. Approve Milestone (Senior Accounts Officer Anita)** — a second user, enforcing separation of duties.
- Click **3. Release Payment & Log Ledger Entry**. The SLA ring turns green and the ledger total updates.
- The public dashboard will now show the released amount.

---

## Step 10 — Validator signs a pass

*Narration:* "An independent validator audits the evidence and signs a verdict that unlocks the Stage 9 gate."

- Switch to **Validator (Nandini)** → `/app/validator/assignments`.
- The assignment is **CH-008 Air-quality Hotspot Mapping** (Stage 9). Review the sensor-density telemetry evidence.
- Select the **Pass** verdict, tick the declaration, and click **Sign Report & Lock**.
- A VALIDATION_REPORT_SIGNED event lands on the audit chain.

---

## Step 11 — Scale-up: record the decision and request district adoption

*Narration:* "A completed pilot becomes a reusable dossier. Another district can adopt it with one action."

- Switch back to **Officer**. Open **CH-004** → **Scale-up** tab.
- The dossier grade badge shows **A** (validated KPIs, full audit chain).
- The procurement pathway recommender ranks options and marks the top recommendation.
- Click **Record decision & sign off** — the decision is persisted with an approver sign-off.
- On the District Adoption Grid, click a **not adopted** tile (e.g. Jheelpur) to request adoption — the tile flips to **Requested**.

---

## Step 12 — Public dashboard and audit chain verification

*Narration:* "Everything that happened is published on the public dashboard and locked in a cryptographic audit chain."

- Open `/public` in a new tab. The payment released in Step 9 is reflected in payment timeliness.
- Switch to **Admin (Farah)** → `/app/admin/overview` → **Audit** tab.
- Click **Verify chain** — "Chain intact: N events verified."
- Open **Demo Controls** → click **Tamper Audit Event** (modifies the first event).
- Click **Verify chain** again — the chain now fails and the broken event is pinpointed.

---

## End of demo

Total runtime: ~7–8 minutes. The hero flow runs completely offline with no network requests.

To reset: Demo Controls → **Reset Data**, then reload. All 14 challenges, 32 startups, audit events, pilots, and milestones are regenerated from the seed generator.
