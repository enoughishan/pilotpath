import Dexie from 'dexie'
import type { Table } from 'dexie'
import type {
  Department,
  User,
  Challenge,
  Startup,
  Application,
  Rubric,
  Evaluation,
  Pilot,
  Milestone,
  Validation,
  ScaleDecision,
  Adoption,
  AuditEvent,
  Notification,
  Template,
  DemandItem,
} from './schema'

export class PilotBridgeDatabase extends Dexie {
  departments!: Table<Department, string>
  users!: Table<User, string>
  challenges!: Table<Challenge, string>
  startups!: Table<Startup, string>
  applications!: Table<Application, string>
  rubrics!: Table<Rubric, string>
  evaluations!: Table<Evaluation, string>
  pilots!: Table<Pilot, string>
  milestones!: Table<Milestone, string>
  validations!: Table<Validation, string>
  scaleDecisions!: Table<ScaleDecision, string>
  adoptions!: Table<Adoption, string>
  auditEvents!: Table<AuditEvent, string>
  notifications!: Table<Notification, string>
  templates!: Table<Template, string>
  demandItems!: Table<DemandItem, string>
  meta!: Table<{ key: string; value: string }, string>

  constructor() {
    super('PilotBridgeDB')
    this.version(1).stores({
      departments: 'id, name',
      users: 'id, role, departmentId, startupId',
      challenges: 'id, stage, status, departmentId, ownerId, sector',
      startups: 'id, dpiitRecognised',
      applications: 'id, challengeId, startupId, shortlisted',
      rubrics: 'id',
      evaluations: 'id, applicationId, evaluatorId',
      pilots: 'id, challengeId, startupId, status',
      milestones: 'id, pilotId, status, dueDate',
      validations: 'id, pilotId, validatorId, verdict',
      scaleDecisions: 'id, pilotId',
      adoptions: 'id, pilotId, departmentId, district, status',
      auditEvents: 'id, entityType, entityId, actorId, at',
      notifications: 'id, userId, readAt',
      templates: 'id, kind',
      demandItems: 'id, departmentId, theme',
      meta: 'key',
    })
  }
}

export const db = new PilotBridgeDatabase()
