import { z } from 'zod'

export const RoleSchema = z.enum(['officer', 'evaluator', 'startup', 'validator', 'finance', 'admin'])
export type Role = z.infer<typeof RoleSchema>

export const StageSchema = z.number().min(1).max(10)
export type Stage = z.infer<typeof StageSchema>

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  orgUnit: z.string(),
})
export type Department = z.infer<typeof DepartmentSchema>

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: RoleSchema,
  departmentId: z.string().optional(),
  startupId: z.string().optional(),
  orgName: z.string().optional(),
  avatarColor: z.string(),
})
export type User = z.infer<typeof UserSchema>

export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  departmentId: z.string(),
  ownerId: z.string(),
  sector: z.string(),
  district: z.string(),
  stage: StageSchema,
  status: z.enum(['active', 'completed', 'blocked', 'archived']),
  context: z.string(),
  baseline: z.object({ metric: z.string(), value: z.number(), unit: z.string() }),
  target: z.object({ metric: z.string(), value: z.number(), unit: z.string(), byDays: z.number() }),
  budgetBand: z.object({ minLakh: z.number(), maxLakh: z.number() }),
  dataAvailable: z.array(z.string()),
  constraints: z.array(z.string()),
  callOpensOn: z.string(),
  callClosesOn: z.string(),
  rubricId: z.string(),
  rulesetId: z.string(),
  createdAt: z.string(),
})
export type Challenge = z.infer<typeof ChallengeSchema>

export const StartupSchema = z.object({
  id: z.string(),
  name: z.string(),
  pitch: z.string(),
  sectors: z.array(z.string()),
  tags: z.array(z.string()),
  dpiitRecognised: z.boolean(),
  incorporatedYear: z.number(),
  turnoverBandCr: z.string(),
  teamSize: z.number(),
  pastPilots: z.number(),
  presence: z.array(z.string()),
  certifications: z.array(z.string()),
  website: z.string().optional(),
})
export type Startup = z.infer<typeof StartupSchema>

export const ApplicationSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  startupId: z.string(),
  submittedAt: z.string(),
  approach: z.string(),
  priceLakh: z.number(),
  eligibility: z.any().optional(),
  shortlisted: z.boolean().optional(),
})
export type Application = z.infer<typeof ApplicationSchema>

export const RubricSchema = z.object({
  id: z.string(),
  name: z.string(),
  criteria: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      weight: z.number(),
      guidance: z.string(),
      maxScore: z.number(),
    })
  ),
})
export type Rubric = z.infer<typeof RubricSchema>

export const EvaluationSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  evaluatorId: z.string(),
  scores: z.record(z.string(), z.number()),
  comments: z.record(z.string(), z.string()).optional(),
  conflict: z.object({ declared: z.boolean(), note: z.string().optional() }),
  lockedAt: z.string().optional(),
})
export type Evaluation = z.infer<typeof EvaluationSchema>

export const KPISchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: z.string(),
  baseline: z.number(),
  target: z.number(),
  direction: z.enum(['down', 'up']),
  cadence: z.string(),
  readings: z.array(z.object({ date: z.string(), value: z.number(), note: z.string().optional() })),
})
export type KPI = z.infer<typeof KPISchema>

export const RiskSchema = z.object({
  id: z.string(),
  title: z.string(),
  likelihood: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  impact: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  owner: z.string(),
  mitigation: z.string(),
  status: z.string(),
})
export type Risk = z.infer<typeof RiskSchema>

export const PilotSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  startupId: z.string(),
  scope: z.string(),
  durationDays: z.number(),
  startDate: z.string(),
  sites: z.array(z.string()),
  kpis: z.array(KPISchema),
  risks: z.array(RiskSchema),
  dataTerms: z.string(),
  ipTerms: z.string(),
  cyber: z.array(z.object({ id: z.string(), label: z.string(), status: z.string() })),
  status: z.string(),
})
export type Pilot = z.infer<typeof PilotSchema>

export const MilestoneSchema = z.object({
  id: z.string(),
  pilotId: z.string(),
  title: z.string(),
  kpiId: z.string().optional(),
  evidenceRequired: z.array(z.string()),
  percent: z.number(),
  amountInr: z.number(),
  dueDate: z.string(),
  status: z.enum(['pending', 'evidence_submitted', 'verified', 'approved', 'released', 'rejected']),
  evidence: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kind: z.string(),
      uploadedAt: z.string(),
    })
  ),
  verifiedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  releasedAt: z.string().optional(),
  submittedAt: z.string().optional(),
})
export type Milestone = z.infer<typeof MilestoneSchema>

export const ValidationSchema = z.object({
  id: z.string(),
  pilotId: z.string(),
  validatorId: z.string(),
  method: z.string(),
  kpiVerdicts: z.array(
    z.object({
      kpiId: z.string(),
      achieved: z.number(),
      verdict: z.string(),
    })
  ),
  findings: z.string(),
  verdict: z.enum(['pass', 'partial', 'fail']),
  signedAt: z.string().optional(),
})
export type Validation = z.infer<typeof ValidationSchema>

export const ScaleDecisionSchema = z.object({
  id: z.string(),
  pilotId: z.string(),
  evidenceGrade: z.enum(['A', 'B', 'C']),
  pathwayChosen: z.string().optional(),
  rationale: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
})
export type ScaleDecision = z.infer<typeof ScaleDecisionSchema>

export const AdoptionSchema = z.object({
  id: z.string(),
  pilotId: z.string(),
  departmentId: z.string(),
  district: z.string(),
  status: z.enum(['requested', 'approved', 'live']),
})
export type Adoption = z.infer<typeof AdoptionSchema>

export const AuditEventSchema = z.object({
  id: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  action: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
  at: z.string(),
  prevHash: z.string(),
  hash: z.string(),
})
export type AuditEvent = z.infer<typeof AuditEventSchema>

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  kind: z.string(),
  text: z.string(),
  entityRef: z.string(),
  at: z.string(),
  readAt: z.string().optional(),
})
export type Notification = z.infer<typeof NotificationSchema>

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  version: z.string(),
  fields: z.array(z.object({ key: z.string(), label: z.string(), type: z.string() })),
  body: z.string(),
})
export type Template = z.infer<typeof TemplateSchema>

export const DemandItemSchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  theme: z.string(),
  description: z.string(),
  districts: z.array(z.string()),
  estimatedBudgetLakh: z.number(),
  targetQuarter: z.string(),
})
export type DemandItem = z.infer<typeof DemandItemSchema>
