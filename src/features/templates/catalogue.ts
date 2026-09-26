export interface TemplateCatalogueItem {
  id: string
  name: string
  kind: string
  version: string
  category: string
  summary: string
  fields: { key: string; label: string; type: string }[]
  clauses: string[]
  body: string
}

export const TEMPLATE_CATALOGUE: TemplateCatalogueItem[] = [
  {
    id: 'tmpl-1',
    name: 'Outcome-based problem statement',
    kind: 'problem_statement',
    version: '2.1',
    category: 'Challenge identification',
    summary: 'Forces departments to describe the operational gap, baseline, target, data available and constraints — not a product specification.',
    fields: [
      { key: 'context', label: 'Operational context', type: 'text' },
      { key: 'baseline', label: 'Baseline KPI', type: 'metric' },
      { key: 'target', label: 'Target KPI and window', type: 'metric' },
    ],
    clauses: ['Baseline must be measurable', 'No brand or architecture lock-in', 'Data inventory required'],
    body: `Purpose
This template is used by a department to publish an outcome-based challenge. It replaces a conventional tender specification so that startups compete on results, not on matching a pre-written bill of quantities.

1. Problem in one paragraph
Describe the operational failure as experienced by citizens or field staff. State who is affected, where, and how often. Do not name a preferred technology.

2. Baseline
Name the KPI, the current value, the unit, and the source of the figure (MIS, sample survey, or audited report). If the figure is approximate, say so.

3. Target and window
State the improvement the department will accept as a successful pilot, and the number of days allowed (typically 60–90). Targets must be directionally testable (up or down).

4. Data the department can share
List datasets, update cadence, and whether personal data is involved. Personal data must remain on department systems unless a separate DPDP-compliant transfer is approved.

5. Constraints
Site access, intermittent power or connectivity, integration with existing meters or ledgers, language, and any statutory prohibition.

6. Budget band
Publish a min–max band in lakh rupees. Exact award value is set only after evaluation and milestone design.

7. Call window
Open and close dates. Late applications are not scored.

Honesty note
Figures in the demo are illustrative. Confirm baselines against current departmental MIS before publication.`,
  },
  {
    id: 'tmpl-2',
    name: 'Weighted evaluation rubric',
    kind: 'rubric',
    version: '1.4',
    category: 'Expert evaluation',
    summary: 'Blind, weighted scoring with conflict declaration, spread detection and ranking lock before any vendor is named to the committee.',
    fields: [
      { key: 'weights', label: 'Criterion weights (must total 100)', type: 'weights' },
    ],
    clauses: ['Conflict of interest declaration', 'Blind codes until lock', 'Spread flag if evaluators diverge > 2 points'],
    body: `Purpose
Independent evaluators score shortlisted applications against a published rubric. Names are hidden until scores are locked. The department officer approves ranking only after the matrix is complete.

Default criteria (weights configurable in Admin)
• Technical fit to the stated outcome — 30
• Feasibility in the published constraints — 20
• Data protection and cybersecurity posture — 15
• Innovation relative to current practice — 15
• Team capacity to deliver a 90-day pilot — 10
• Cost effectiveness within the budget band — 10

Scoring
Each criterion is 0–10. Weighted total is normalised to 100. Evaluators must add a one-line justification per criterion.

Integrity
Evaluators declare conflicts before seeing applications. A spread of more than two points on any criterion flags a calibration discussion. Ranking cannot advance the challenge until RANKING_APPROVED is written to the audit chain.

Use
This rubric is attached to every challenge at publication. Changing weights after applications open is not permitted without a recorded addendum.`,
  },
  {
    id: 'tmpl-3',
    name: 'Controlled pilot agreement',
    kind: 'agreement',
    version: '3.0',
    category: 'Sandbox / pilot',
    summary: 'Time-boxed, site-limited trial with dual acceptance, evidence duties and no implied scale-up award.',
    fields: [],
    clauses: ['90-day default term', 'Named sites only', 'Dual acceptance', 'No promise of GeM listing'],
    body: `Purpose
A pilot is a controlled test, not a supply contract. This agreement authorises work only at named sites, for a fixed duration, against published KPIs.

Parties
The department (data controller and site owner) and the startup (solution provider). Finance and independent validator are not parties but receive evidence under this agreement.

Scope
Sites, duration (default 90 days), KPIs, reporting cadence, and named department owner. Work outside scope requires a written variation.

Obligations of the startup
Install and operate the solution; submit evidence packs against each milestone; notify incidents within 24 hours; follow the cybersecurity checklist.

Obligations of the department
Provide agreed data and site access; nominate a single officer; not unreasonably withhold milestone verification.

Acceptance
The agreement is binding only when both the department officer and the startup authorised signatory accept. Until then, no payment obligation arises.

Exit and scale-up
Either party may exit for material breach after a 7-day cure notice. Successful validation does not by itself create a right to statewide roll-out. Scale-up follows a separate, compliant procurement pathway recorded on the dossier.`,
  },
  {
    id: 'tmpl-4',
    name: 'Data, IP and DPDP clauses',
    kind: 'data_ip',
    version: '1.5',
    category: 'Legal / IP',
    summary: 'Department retains operational data; startup retains background IP; foreground project artefacts are licensed for government use.',
    fields: [],
    clauses: ['Department as data fiduciary', 'No PII off-premises by default', 'Background vs foreground IP'],
    body: `Data
The department is the data fiduciary. Pilot data, including telemetry, remains on department-controlled systems unless a written transfer addendum is signed. Personal data is processed only for the published purpose and deleted or returned at exit.

Intellectual property
Background IP (models, libraries, patents owned before the pilot) remains with the startup. Foreground artefacts created for the department (configurations, site maps, trained weights on department data, runbooks) are licensed to the government on a perpetual, royalty-free, non-exclusive basis for public-service use.

Publication
Neither party publishes identifiable citizen data. Aggregated KPI results may be published on the public transparency ledger.

Audit
The department and an appointed independent validator may inspect processing logs relevant to the KPIs. Trade secrets of the startup are not disclosed beyond what is required to validate outcomes.

Dispute
IP and data disputes are recorded on the audit chain and referred to the Innovation Cell before litigation.`,
  },
  {
    id: 'tmpl-5',
    name: 'Cybersecurity checklist',
    kind: 'cyber',
    version: '1.2',
    category: 'Risk / cyber',
    summary: 'Minimum controls before a sandbox goes live: identity, encryption, logging, incident notice and no standing admin on department networks.',
    fields: [],
    clauses: ['MFA for operator accounts', 'TLS in transit', 'Incident notice 24h', 'No standing VPN admin'],
    body: `Before go-live (all must be marked complete)
1. Unique named accounts for operators; no shared passwords.
2. Multi-factor authentication for any remote access.
3. Encryption in transit (TLS 1.2+) and at rest for copies held by the startup.
4. Role-based access; department can revoke a user the same day.
5. Audit logs retained for the pilot duration plus 90 days.
6. Vulnerability scan of internet-facing components; critical findings closed.
7. Incident notification to the department CISO within 24 hours.
8. No standing privileged access on department LAN; jump-host or supervised sessions only.
9. Backup and restore test of configuration, not of citizen databases.
10. Exit: credentials revoked, copies of department data certified deleted.

Status values
open · in progress · complete · waived (with recorded reason)

Waivers
A control may be waived only by the department owner in writing. Waivers appear on the risk register.`,
  },
  {
    id: 'tmpl-6',
    name: 'Pilot risk register',
    kind: 'risk',
    version: '2.0',
    category: 'Risk / cyber',
    summary: 'Likelihood × impact grid with named owners and mitigations. Materialised risks feed the scale-up dossier grade.',
    fields: [],
    clauses: ['Owner required', 'Mitigation required', 'Status reviewed weekly'],
    body: `How to use
Log every residual risk that could stop the KPI, harm citizens, leak data, or delay payment. Score likelihood and impact 1–3. Owner must be a named person, not a department.

Typical entries for civic pilots
• Sensor theft or vandalism at ward sites
• Intermittent electricity or cellular coverage
• Delay in department data extracts
• Startup key-person absence
• Integration failure with legacy meters or MIS
• Public complaint if a trial ward is perceived as neglected

Review
The officer reviews open risks weekly during monitoring. A risk that materialises is tagged on the evidence pack and is visible to finance and the validator.

Link to payment
If a milestone is missed because of a department-owned risk, the SLA clock for payment does not start until the blocker is cleared. If startup-owned, the milestone may be rejected with reasons on the audit chain.`,
  },
  {
    id: 'tmpl-7',
    name: 'Scale-up procurement pathway',
    kind: 'procurement',
    version: '1.0',
    category: 'Procurement',
    summary: 'Maps a validated pilot to GeM catalogue, limited tender, or repeat-order options without skipping statutory steps.',
    fields: [],
    clauses: ['Evidence grade A/B/C', 'GeM first if listed', 'No turnover waiver at scale without rule'],
    body: `Purpose
A successful sandbox is evidence, not an award. This note records which compliant path the department will use to buy or replicate the solution.

Inputs the dossier must contain
Independent validator verdict, KPI table, payment SLA performance, residual risks, and estimated contract value.

Pathway chooser (illustrative)
• GeM catalogue / marketplace listing — preferred when the solution is listed and value is within delegated powers.
• Repeat order / rate contract — when the same configuration is needed in additional wards or districts.
• Limited tender among capable vendors seen in the challenge — when competition was real and more than one vendor could deliver.
• Open tender — when value, uniqueness or policy requires it.

What this pathway does not do
It does not waive GFR, GeM mandates, or CVC guidance. Turnover and experience relaxations used at the challenge stage (for example DPIIT recognition) do not automatically apply to the scale-up contract unless the applicable rule still allows it.

Publication
The chosen pathway, rationale and approving officer are written to the audit chain and may be shown on the public ledger in summary form.`,
  },
]

export function templateToSeedRow(t: TemplateCatalogueItem) {
  return {
    id: t.id,
    name: t.name,
    kind: t.kind,
    version: t.version,
    fields: t.fields,
    body: t.body,
  }
}
