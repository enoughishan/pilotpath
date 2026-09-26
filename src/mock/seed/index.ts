import { db } from '../db'
import { createAuditEvent } from '../../logic/auditChain'
import type {
  Department,
  User,
  Startup,
  Challenge,
  Application,
  Rubric,
  Evaluation,
  Pilot,
  Milestone,
  Validation,
  ScaleDecision,
  Adoption,
  Template,
  DemandItem,
  AuditEvent,
  Notification,
} from '../schema'
import { TEMPLATE_CATALOGUE, templateToSeedRow } from '@/features/templates/catalogue'

export async function seedDatabase(force = false) {
  const metaCount = await db.meta.count()
  if (metaCount > 0 && !force) {
    const existingTemplates = await db.templates.count()
    if (existingTemplates < TEMPLATE_CATALOGUE.length) {
      await db.templates.clear()
      await db.templates.bulkAdd(TEMPLATE_CATALOGUE.map(templateToSeedRow) as Template[])
    }
    const existingNotes = await db.notifications.count()
    if (existingNotes === 0) {
      await db.notifications.bulkAdd(defaultNotifications())
    }
    return
  }

  await db.transaction(
    'rw',
    [
      db.departments,
      db.users,
      db.startups,
      db.challenges,
      db.applications,
      db.rubrics,
      db.evaluations,
      db.pilots,
      db.milestones,
      db.validations,
      db.scaleDecisions,
      db.adoptions,
      db.auditEvents,
      db.notifications,
      db.templates,
      db.demandItems,
      db.meta,
    ],
    async () => {
      // Clear all
      await db.departments.clear()
      await db.users.clear()
      await db.startups.clear()
      await db.challenges.clear()
      await db.applications.clear()
      await db.rubrics.clear()
      await db.evaluations.clear()
      await db.pilots.clear()
      await db.milestones.clear()
      await db.validations.clear()
      await db.scaleDecisions.clear()
      await db.adoptions.clear()
      await db.auditEvents.clear()
      await db.notifications.clear()
      await db.templates.clear()
      await db.demandItems.clear()
      await db.meta.clear()

      // 1. Departments
      const departments: Department[] = [
        { id: 'dept-ud', name: 'Urban Development Department', orgUnit: 'Ranipur Municipal Corporation' },
        { id: 'dept-ph', name: 'Public Health Department', orgUnit: 'State Health Mission' },
        { id: 'dept-edu', name: 'School Education Department', orgUnit: 'District Education Office' },
        { id: 'dept-agri', name: 'Agriculture Department', orgUnit: 'Krishi Vikas Kendra' },
        { id: 'dept-trans', name: 'Transport Department', orgUnit: 'State Road Transport Corp' },
        { id: 'dept-water', name: 'Water Resources Department', orgUnit: 'Jal Nigam' },
        { id: 'dept-energy', name: 'Energy Department', orgUnit: 'State Electricity Board' },
        { id: 'dept-rev', name: 'Revenue and Land Records', orgUnit: 'District Collectorate' },
      ]
      await db.departments.bulkAdd(departments)

      // 2. Users (6 personas + support)
      const users: User[] = [
        { id: 'u-meera', name: 'Meera Kulkarni', role: 'officer', departmentId: 'dept-ud', orgName: 'Joint Director, Urban Development', avatarColor: '#17539B' },
        { id: 'u-arvind', name: 'Dr. Arvind Rao', role: 'evaluator', orgName: 'External Domain Expert, IIT', avatarColor: '#F2B705' },
        { id: 'u-sana', name: 'Sana Iqbal', role: 'startup', startupId: 'st-aquavrit', orgName: 'Co-founder, Aquavrit Systems', avatarColor: '#23744A' },
        { id: 'u-nandini', name: 'Prof. Nandini Bose', role: 'validator', orgName: 'State Engineering College Test Lab', avatarColor: '#C23B22' },
        { id: 'u-rakesh', name: 'Rakesh Menon', role: 'finance', departmentId: 'dept-ud', orgName: 'Accounts Officer, Finance', avatarColor: '#44535E' },
        { id: 'u-farah', name: 'Farah Sheikh', role: 'admin', orgName: 'Nodal Officer, State Innovation Cell', avatarColor: '#0F3F7A' },
        // Support personas
        { id: 'u-anita', name: 'Anita Joseph', role: 'finance', departmentId: 'dept-ud', orgName: 'Senior Accounts Officer (Finance 2)', avatarColor: '#5B6A74' },
        { id: 'u-karan', name: 'Karan Malhotra', role: 'officer', departmentId: 'dept-ph', orgName: 'Director, Public Health', avatarColor: '#17539B' },
      ]
      await db.users.bulkAdd(users)

      // 3. Startups (32)
      const startups: Startup[] = [
        {
          id: 'st-aquavrit',
          name: 'Aquavrit Systems',
          pitch: 'Smart acoustic sensors for municipal water leak detection and distribution monitoring',
          sectors: ['Water Resources', 'Urban Development'],
          tags: ['water', 'leakage', 'sensors', 'flow', 'meters'],
          dpiitRecognised: true,
          incorporatedYear: 2021,
          turnoverBandCr: '₹1-5 crore',
          teamSize: 18,
          pastPilots: 2,
          presence: ['Ranipur', 'Devgarh'],
          certifications: ['ISO 9001', 'CE Mark'],
          website: 'https://aquavrit.example.com',
        },
        {
          id: 'st-nirvahan',
          name: 'Nirvahan Utility Labs',
          pitch: 'District flow analytics and automated pressure management valves for urban water grids',
          sectors: ['Water Resources'],
          tags: ['water', 'pressure', 'flow', 'analytics'],
          dpiitRecognised: true,
          incorporatedYear: 2020,
          turnoverBandCr: '₹5-10 crore',
          teamSize: 25,
          pastPilots: 4,
          presence: ['Sundarvan'],
          certifications: ['ISO 14001'],
        },
        {
          id: 'st-tantu',
          name: 'Tantu Flow Analytics',
          pitch: 'Ultrasonic inline flow metering and non-revenue water auditing dashboard',
          sectors: ['Water Resources'],
          tags: ['flow', 'metering', 'audit', 'water'],
          dpiitRecognised: false,
          incorporatedYear: 2019,
          turnoverBandCr: 'Under ₹1 crore',
          teamSize: 12,
          pastPilots: 1,
          presence: ['Chandrapali'],
          certifications: [],
        },
        {
          id: 'st-kshetra',
          name: 'Kshetra Sensing',
          pitch: 'Drone and satellite imagery analytics for automated crop loss and land record surveys',
          sectors: ['Agriculture', 'Revenue and Land Records'],
          tags: ['crop', 'satellite', 'drone', 'land'],
          dpiitRecognised: true,
          incorporatedYear: 2022,
          turnoverBandCr: '₹1-5 crore',
          teamSize: 15,
          pastPilots: 3,
          presence: ['Manikpur', 'Kasturigram'],
          certifications: ['DGCA Certified'],
        },
        {
          id: 'st-rasta',
          name: 'Rasta Insight',
          pitch: 'Vehicle-mounted optical camera system for automated pothole and road defect logging',
          sectors: ['Urban Development', 'Transport'],
          tags: ['pothole', 'road', 'camera', 'ai'],
          dpiitRecognised: true,
          incorporatedYear: 2023,
          turnoverBandCr: 'Under ₹1 crore',
          teamSize: 10,
          pastPilots: 1,
          presence: ['Ranipur'],
          certifications: [],
        },
      ]
      // Add generated startups up to 32
      const sectorPool = ['Public Health', 'School Education', 'Agriculture', 'Transport', 'Energy', 'Urban Development']
      const namePrefixes = ['Vayu', 'Gramin', 'Seemant', 'Anvay', 'Sahaj', 'Jal', 'Urja', 'Vidya', 'Chikit', 'Setu', 'Nagar', 'Jan', 'Subh', 'Pratham', 'Marga', 'Pragati', 'Drishti', 'Kushal', 'Suvidha', 'Pariksha', 'Yantra', 'Shakti', 'Samarth', 'Sanjeevani', 'Pravah', 'Niti', 'Lok']
      for (let i = 6; i <= 32; i++) {
        const prefix = namePrefixes[(i - 6) % namePrefixes.length]
        startups.push({
          id: `st-gen-${i}`,
          name: `${prefix} Tech Labs ${i}`,
          pitch: `Innovative automated solutions for ${sectorPool[i % sectorPool.length].toLowerCase()} management`,
          sectors: [sectorPool[i % sectorPool.length]],
          tags: ['sensors', 'analytics', 'automation'],
          dpiitRecognised: i % 3 !== 0,
          incorporatedYear: 2018 + (i % 7),
          turnoverBandCr: i % 2 === 0 ? '₹1-5 crore' : 'Under ₹1 crore',
          teamSize: 8 + (i % 20),
          pastPilots: i % 4,
          presence: ['Ranipur', 'Devgarh', 'Jheelpur'],
          certifications: ['ISO 9001'],
        })
      }
      await db.startups.bulkAdd(startups)

      // 4. Default Rubric & Ruleset
      const rubric: Rubric = {
        id: 'rubric-default',
        name: 'Standard Pilot Evaluation Rubric',
        criteria: [
          { id: 'c1', label: 'Technical fit', weight: 30, guidance: 'Score 0-10 on alignment with technical specs', maxScore: 10 },
          { id: 'c2', label: 'Innovation', weight: 15, guidance: 'Novelty of approach and IP strength', maxScore: 10 },
          { id: 'c3', label: 'Feasibility and scalability', weight: 20, guidance: 'Execution feasibility in municipal conditions', maxScore: 10 },
          { id: 'c4', label: 'Data security and compliance', weight: 15, guidance: 'Compliance with data privacy guidelines', maxScore: 10 },
          { id: 'c5', label: 'Team and delivery capability', weight: 10, guidance: 'Past track record and key personnel', maxScore: 10 },
          { id: 'c6', label: 'Cost effectiveness', weight: 10, guidance: 'Value for money and pilot pricing', maxScore: 10 },
        ],
      }
      await db.rubrics.add(rubric)

      // 5. Challenges (14 across 10 stages)
      const challenges: Challenge[] = [
        // Stage 1
        { id: 'CH-021', title: 'Digitise land-record mutation requests', departmentId: 'dept-rev', ownerId: 'u-meera', sector: 'Revenue and Land Records', district: 'Manikpur', stage: 1, status: 'active', context: 'Paper mutation requests take months to verify.', baseline: { metric: 'Processing time', value: 90, unit: 'days' }, target: { metric: 'Processing time', value: 7, unit: 'days', byDays: 90 }, budgetBand: { minLakh: 20, maxLakh: 35 }, dataAvailable: ['Sample mutation ledgers'], constraints: ['Must integrate with state land portal'], callOpensOn: '2026-10-01', callClosesOn: '2026-10-30', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-09-10' },
        { id: 'CH-022', title: 'Detect potholes from municipal vehicles', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 1, status: 'active', context: 'Road repairs delayed due to manual reporting.', baseline: { metric: 'Detection lag', value: 30, unit: 'days' }, target: { metric: 'Detection lag', value: 2, unit: 'days', byDays: 60 }, budgetBand: { minLakh: 15, maxLakh: 25 }, dataAvailable: ['City road network map'], constraints: ['Vehicle camera fitment'], callOpensOn: '2026-10-05', callClosesOn: '2026-11-05', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-09-15' },
        // Stage 2
        { id: 'CH-019', title: 'Real-time bus arrival for district routes', departmentId: 'dept-trans', ownerId: 'u-meera', sector: 'Transport', district: 'Devgarh', stage: 2, status: 'active', context: 'Passenger wait times high on rural routes.', baseline: { metric: 'Arrival accuracy', value: 40, unit: '%' }, target: { metric: 'Arrival accuracy', value: 85, unit: '%', byDays: 90 }, budgetBand: { minLakh: 30, maxLakh: 50 }, dataAvailable: ['Bus route schedules'], constraints: ['Low cellular connectivity areas'], callOpensOn: '2026-09-01', callClosesOn: '2026-09-30', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-08-25' },
        // Stage 3
        { id: 'CH-018', title: 'Early flood alerts for low-lying wards', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 3, status: 'active', context: 'Monsoon flooding damages low-lying urban settlements.', baseline: { metric: 'Warning lead time', value: 1, unit: 'hours' }, target: { metric: 'Warning lead time', value: 6, unit: 'hours', byDays: 90 }, budgetBand: { minLakh: 25, maxLakh: 45 }, dataAvailable: ['Drainage telemetry'], constraints: ['Solar powered sensors'], callOpensOn: '2026-08-15', callClosesOn: '2026-09-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-08-10' },
        // Stage 4
        { id: 'CH-016', title: 'Crop-loss assessment from satellite and drone imagery', departmentId: 'dept-agri', ownerId: 'u-meera', sector: 'Agriculture', district: 'Sundarvan', stage: 4, status: 'active', context: 'Crop insurance claims delayed by manual field inspections.', baseline: { metric: 'Claim survey time', value: 45, unit: 'days' }, target: { metric: 'Claim survey time', value: 5, unit: 'days', byDays: 60 }, budgetBand: { minLakh: 35, maxLakh: 60 }, dataAvailable: ['Historical weather and crop data'], constraints: ['DGCA compliance for drones'], callOpensOn: '2026-08-01', callClosesOn: '2026-09-01', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-07-25' },
        { id: 'CH-017', title: 'Biomedical waste tracking across hospitals', departmentId: 'dept-ph', ownerId: 'u-karan', sector: 'Public Health', district: 'Ranipur', stage: 4, status: 'active', context: 'Waste disposal leakages pose health hazards.', baseline: { metric: 'Disposal compliance', value: 65, unit: '%' }, target: { metric: 'Disposal compliance', value: 98, unit: '%', byDays: 90 }, budgetBand: { minLakh: 20, maxLakh: 40 }, dataAvailable: ['Hospital disposal logs'], constraints: ['Barcode scanning'], callOpensOn: '2026-08-05', callClosesOn: '2026-09-05', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-08-01' },
        // Stage 5
        { id: 'CH-015', title: 'Attendance and learning-level tracking for primary schools', departmentId: 'dept-edu', ownerId: 'u-meera', sector: 'School Education', district: 'Jheelpur', stage: 5, status: 'active', context: 'Dropout identification is slow.', baseline: { metric: 'Dropout detection lag', value: 60, unit: 'days' }, target: { metric: 'Dropout detection lag', value: 7, unit: 'days', byDays: 90 }, budgetBand: { minLakh: 30, maxLakh: 50 }, dataAvailable: ['School roster logs'], constraints: ['Offline sync capability'], callOpensOn: '2026-07-15', callClosesOn: '2026-08-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-07-10' },
        // Stage 6
        { id: 'CH-012', title: 'Digital queue management in district hospitals', departmentId: 'dept-ph', ownerId: 'u-karan', sector: 'Public Health', district: 'Ranipur', stage: 6, status: 'active', context: 'OPD wait times exceed 4 hours.', baseline: { metric: 'OPD wait time', value: 240, unit: 'minutes' }, target: { metric: 'OPD wait time', value: 45, unit: 'minutes', byDays: 90 }, budgetBand: { minLakh: 25, maxLakh: 40 }, dataAvailable: ['OPD registration logs'], constraints: ['SMS tokens support'], callOpensOn: '2026-06-15', callClosesOn: '2026-07-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-06-10' },
        // Stage 7 - HERO MID-PILOT
        { id: 'CH-014', title: 'Cut water lost in ward supply networks', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 7, status: 'active', context: 'A quarter of treated water and more in some wards never reaches a bill. Leaks are found by complaints, repair takes days, and meter data is incomplete.', baseline: { metric: 'Non-revenue water %', value: 38, unit: '%' }, target: { metric: 'Non-revenue water %', value: 25, unit: '%', byDays: 90 }, budgetBand: { minLakh: 40, maxLakh: 60 }, dataAvailable: ['12 months of flow logs', 'pipe network map', 'complaint records'], constraints: ['no consumer personal data leaves department servers', 'must work with intermittent supply', 'must read existing meters'], callOpensOn: '2026-07-01', callClosesOn: '2026-07-31', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-06-25' },
        { id: 'CH-011', title: 'Cold-chain temperature monitoring for vaccines', departmentId: 'dept-ph', ownerId: 'u-karan', sector: 'Public Health', district: 'Devgarh', stage: 7, status: 'active', context: 'Vaccine wastage due to temperature fluctuations.', baseline: { metric: 'Wastage %', value: 12, unit: '%' }, target: { metric: 'Wastage %', value: 2, unit: '%', byDays: 90 }, budgetBand: { minLakh: 30, maxLakh: 45 }, dataAvailable: ['Cold storage logs'], constraints: ['Battery backup for 48h'], callOpensOn: '2026-06-01', callClosesOn: '2026-07-01', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-05-25' },
        // Stage 8
        { id: 'CH-010', title: 'Energy-use monitoring for government buildings', departmentId: 'dept-energy', ownerId: 'u-meera', sector: 'Energy', district: 'Ranipur', stage: 8, status: 'active', context: 'Overconsumption during non-working hours.', baseline: { metric: 'Off-peak energy use', value: 35, unit: '%' }, target: { metric: 'Off-peak energy use', value: 10, unit: '%', byDays: 90 }, budgetBand: { minLakh: 20, maxLakh: 35 }, dataAvailable: ['Building electricity bills'], constraints: ['Smart meter retrofit'], callOpensOn: '2026-05-15', callClosesOn: '2026-06-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-05-10' },
        // Stage 9
        { id: 'CH-008', title: 'Air-quality hotspot mapping', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 9, status: 'active', context: 'High PM2.5 levels near industrial zones.', baseline: { metric: 'Sensor density', value: 1, unit: 'per sq km' }, target: { metric: 'Sensor density', value: 10, unit: 'per sq km', byDays: 90 }, budgetBand: { minLakh: 30, maxLakh: 50 }, dataAvailable: ['AQI baseline data'], constraints: ['Calibrated optical sensors'], callOpensOn: '2026-04-15', callClosesOn: '2026-05-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-04-10' },
        // Stage 10 - COMPLETED & ADOPTED
        { id: 'CH-004', title: 'Streetlight fault detection', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 10, status: 'completed', context: 'Manual night patrolling for broken streetlights.', baseline: { metric: 'Fault detection time', value: 7, unit: 'days' }, target: { metric: 'Fault detection time', value: 4, unit: 'hours', byDays: 90 }, budgetBand: { minLakh: 25, maxLakh: 40 }, dataAvailable: ['Feeder pillar network map'], constraints: ['GSM gateway fitment'], callOpensOn: '2026-02-01', callClosesOn: '2026-03-01', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-01-25' },
        { id: 'CH-003', title: 'Grievance triage and routing engine', departmentId: 'dept-ud', ownerId: 'u-meera', sector: 'Urban Development', district: 'Ranipur', stage: 10, status: 'completed', context: 'Citizens report grievances to wrong departments.', baseline: { metric: 'Triage time', value: 5, unit: 'days' }, target: { metric: 'Triage time', value: 1, unit: 'hours', byDays: 60 }, budgetBand: { minLakh: 15, maxLakh: 30 }, dataAvailable: ['10,000 past grievance tickets'], constraints: ['Multilingual support'], callOpensOn: '2026-01-15', callClosesOn: '2026-02-15', rubricId: 'rubric-default', rulesetId: 'rules-default', createdAt: '2026-01-10' },
      ]
      await db.challenges.bulkAdd(challenges)

      // 6. Applications for CH-014 Hero Challenge
      const applications: Application[] = [
        { id: 'app-014-1', challengeId: 'CH-014', startupId: 'st-aquavrit', submittedAt: '2026-07-15', approach: 'Acoustic leakage sensors deployed on trunk distribution lines coupled with real-time pressure fluctuation mapping.', priceLakh: 48, shortlisted: true },
        { id: 'app-014-2', challengeId: 'CH-014', startupId: 'st-nirvahan', submittedAt: '2026-07-20', approach: 'Automated pressure regulating valves installed at district metering points to prevent pipe bursts.', priceLakh: 52, shortlisted: true },
        { id: 'app-014-3', challengeId: 'CH-014', startupId: 'st-tantu', submittedAt: '2026-07-25', approach: 'Ultrasonic flow meter telemetry and AI water balance algorithm.', priceLakh: 44, shortlisted: true },
      ]
      await db.applications.bulkAdd(applications)

      // 7. Evaluations for CH-014
      const evaluations: Evaluation[] = [
        { id: 'eval-014-1-1', applicationId: 'app-014-1', evaluatorId: 'u-arvind', scores: { c1: 9, c2: 8.5, c3: 9, c4: 8, c5: 8.5, c6: 8 }, conflict: { declared: false }, lockedAt: '2026-08-02T11:00:00Z' },
        { id: 'eval-014-1-2', applicationId: 'app-014-1', evaluatorId: 'u-farah', scores: { c1: 9.5, c2: 9, c3: 8.5, c4: 8.5, c5: 9, c6: 8.5 }, conflict: { declared: false }, lockedAt: '2026-08-02T14:30:00Z' },
        { id: 'eval-014-2-1', applicationId: 'app-014-2', evaluatorId: 'u-arvind', scores: { c1: 7.5, c2: 7, c3: 8, c4: 8.5, c5: 7.5, c6: 7 }, conflict: { declared: false }, lockedAt: '2026-08-02T11:30:00Z' },
        { id: 'eval-014-2-2', applicationId: 'app-014-2', evaluatorId: 'u-farah', scores: { c1: 7, c2: 7.5, c3: 7.5, c4: 8, c5: 7, c6: 7.5 }, conflict: { declared: false }, lockedAt: '2026-08-02T15:00:00Z' },
      ]
      await db.evaluations.bulkAdd(evaluations)

      // 8. Pilot for CH-014
      const heroPilot: Pilot = {
        id: 'pilot-014',
        challengeId: 'CH-014',
        startupId: 'st-aquavrit',
        scope: 'Deploy smart acoustic leakage sensors across Wards 7, 12 and 19 for 90 days to achieve non-revenue water reduction to 25%.',
        durationDays: 90,
        startDate: '2026-08-08',
        sites: ['Ward 7', 'Ward 12', 'Ward 19'],
        kpis: [
          {
            id: 'kpi-nrw',
            name: 'Non-revenue water %',
            unit: '%',
            baseline: 38,
            target: 25,
            direction: 'down',
            cadence: 'weekly',
            readings: [
              { date: '8 Aug', value: 38 },
              { date: '15 Aug', value: 37.1 },
              { date: '22 Aug', value: 35.8, note: 'Sensors installed and calibrated' },
              { date: '29 Aug', value: 34.9 },
              { date: '5 Sep', value: 33.6, note: 'Baseline validated' },
              { date: '12 Sep', value: 32.4 },
              { date: '21 Sep', value: 31.7, note: 'Mid-pilot target achieved' },
            ],
          },
          {
            id: 'kpi-repair',
            name: 'Leak repair time in hours',
            unit: 'hours',
            baseline: 72,
            target: 24,
            direction: 'down',
            cadence: 'weekly',
            readings: [
              { date: '8 Aug', value: 72 },
              { date: '22 Aug', value: 54 },
              { date: '5 Sep', value: 40 },
              { date: '21 Sep', value: 28 },
            ],
          },
        ],
        risks: [
          { id: 'r1', title: 'Sensor theft in Ward 12', likelihood: 2, impact: 2, owner: 'Aquavrit', mitigation: 'Tamper-proof physical enclosures installed', status: 'monitored' },
          { id: 'r2', title: 'Intermittent meter data gaps', likelihood: 3, impact: 2, owner: 'Department', mitigation: 'Local memory buffering on sensor node', status: 'mitigated' },
        ],
        dataTerms: 'Department retains raw sensor data. Aquavrit holds non-exclusive licence for algorithm improvement.',
        ipTerms: 'Foreground IP co-owned with department non-exclusive royalty-free perpetual licence.',
        cyber: [
          { id: 'cy1', label: 'Data encryption in transit (TLS 1.3)', status: 'verified' },
          { id: 'cy2', label: 'No consumer PII exported', status: 'verified' },
          { id: 'cy3', label: 'Vulnerability scan certificate', status: 'verified' },
        ],
        status: 'active',
      }
      await db.pilots.add(heroPilot)

      // 9. Milestones for CH-014 (M1 released, M2 released, M3 submitted waiting finance, M4 pending)
      const heroMilestones: Milestone[] = [
        {
          id: 'm-014-1',
          pilotId: 'pilot-014',
          title: 'M1 Install and calibrate sensors',
          percent: 20,
          amountInr: 960000,
          dueDate: '2026-08-22',
          status: 'released',
          evidenceRequired: ['Installation log', 'Sensor calibration report'],
          evidence: [
            { id: 'e1', name: 'sensor_calibration_ward7.pdf', kind: 'pdf', uploadedAt: '2026-08-20' },
          ],
          verifiedBy: 'u-rakesh',
          approvedAt: '2026-08-21',
          releasedAt: '2026-08-22',
          submittedAt: '2026-08-20',
        },
        {
          id: 'm-014-2',
          pilotId: 'pilot-014',
          title: 'M2 Baseline validated with department',
          percent: 20,
          amountInr: 960000,
          dueDate: '2026-09-05',
          status: 'released',
          evidenceRequired: ['Joint baseline verification sign-off'],
          evidence: [
            { id: 'e2', name: 'baseline_signoff_ranipur.pdf', kind: 'pdf', uploadedAt: '2026-09-03' },
          ],
          verifiedBy: 'u-rakesh',
          approvedAt: '2026-09-04',
          releasedAt: '2026-09-05',
          submittedAt: '2026-09-03',
        },
        {
          id: 'm-014-3',
          pilotId: 'pilot-014',
          title: 'M3 Non-revenue water at or below 32% by day 45',
          percent: 30,
          amountInr: 1440000,
          dueDate: '2026-09-22',
          status: 'evidence_submitted',
          evidenceRequired: ['Weekly telemetry logs', 'Validator interim note'],
          evidence: [
            { id: 'e3', name: 'telemetry_day45_readings.csv', kind: 'csv', uploadedAt: '2026-09-21' },
          ],
          submittedAt: '2026-09-21',
        },
        {
          id: 'm-014-4',
          pilotId: 'pilot-014',
          title: 'M4 Final target met and handover',
          percent: 30,
          amountInr: 1440000,
          dueDate: '2026-11-06',
          status: 'pending',
          evidenceRequired: ['Final validation report', 'System handover sign-off'],
          evidence: [],
        },
      ]
      await db.milestones.bulkAdd(heroMilestones)

      // 10. Completed Pilot CH-004 Data
      const pilot004: Pilot = {
        id: 'pilot-004',
        challengeId: 'CH-004',
        startupId: 'st-aquavrit',
        scope: 'Automated streetlight fault detection across 5,000 poles.',
        durationDays: 90,
        startDate: '2026-03-05',
        sites: ['Ward 1', 'Ward 2', 'Ward 3'],
        kpis: [
          { id: 'kpi-fault', name: 'Fault detection time', unit: 'hours', baseline: 168, target: 4, direction: 'down', cadence: 'weekly', readings: [{ date: '5 May', value: 3.2 }] },
        ],
        risks: [],
        dataTerms: 'Department owned',
        ipTerms: 'Startup owned with non-exclusive department licence',
        cyber: [],
        status: 'completed',
      }
      await db.pilots.add(pilot004)

      const validation004: Validation = {
        id: 'val-004',
        pilotId: 'pilot-004',
        validatorId: 'u-nandini',
        method: 'Independent physical audit and telemetry verification',
        kpiVerdicts: [{ kpiId: 'kpi-fault', achieved: 3.2, verdict: 'Target achieved' }],
        findings: 'The GSM fault detection gateways accurately reported lamp failures within 3.2 hours average.',
        verdict: 'pass',
        signedAt: '2026-06-10',
      }
      await db.validations.add(validation004)

      const scaleDecision004: ScaleDecision = {
        id: 'sd-004',
        pilotId: 'pilot-004',
        evidenceGrade: 'A',
        pathwayChosen: 'catalogue',
        rationale: 'Proven high reliability and fast ROI. Recommending government marketplace catalogue procurement for city-wide rollout.',
        approvedBy: 'u-meera',
        approvedAt: '2026-06-15',
      }
      await db.scaleDecisions.add(scaleDecision004)

      const adoptions004: Adoption[] = [
        { id: 'ad-1', pilotId: 'pilot-004', departmentId: 'dept-ud', district: 'Ranipur', status: 'live' },
        { id: 'ad-2', pilotId: 'pilot-004', departmentId: 'dept-ud', district: 'Devgarh', status: 'live' },
        { id: 'ad-3', pilotId: 'pilot-004', departmentId: 'dept-ud', district: 'Sundarvan', status: 'approved' },
        { id: 'ad-4', pilotId: 'pilot-004', departmentId: 'dept-ud', district: 'Manikpur', status: 'requested' },
      ]
      await db.adoptions.bulkAdd(adoptions004)

      await db.templates.bulkAdd(TEMPLATE_CATALOGUE.map(templateToSeedRow) as Template[])
      await db.notifications.bulkAdd(defaultNotifications())

      // 12. Demand Items (24)
      const demandItems: DemandItem[] = []
      const themes = ['Water Supply', 'Public Health', 'School Tech', 'Smart Mobility', 'Clean Energy', 'Civic Tech']
      for (let i = 1; i <= 24; i++) {
        demandItems.push({
          id: `dem-${i}`,
          departmentId: departments[i % departments.length].id,
          departmentName: departments[i % departments.length].name,
          theme: themes[i % themes.length],
          description: `Demand item ${i}: Need innovative automated solution for regional ${themes[i % themes.length].toLowerCase()} challenges.`,
          districts: ['Ranipur', 'Devgarh', 'Sundarvan'],
          estimatedBudgetLakh: 25 + (i * 3) % 40,
          targetQuarter: `Q${(i % 4) + 1} 2027`,
        })
      }
      await db.demandItems.bulkAdd(demandItems)

      // 13. Audit Chain Initial Events
      const initialEvents: AuditEvent[] = []
      const ev1 = await createAuditEvent([], {
        id: 'aud-001',
        entityType: 'challenge',
        entityId: 'CH-014',
        actorId: 'u-meera',
        actorName: 'Meera Kulkarni',
        action: 'CHALLENGE_CREATED',
        payload: { title: 'Cut water lost in ward supply networks' },
        at: '2026-06-25T10:00:00Z',
      })
      initialEvents.push(ev1 as AuditEvent)

      const ev2 = await createAuditEvent(initialEvents, {
        id: 'aud-002',
        entityType: 'challenge',
        entityId: 'CH-014',
        actorId: 'u-meera',
        actorName: 'Meera Kulkarni',
        action: 'CHALLENGE_PUBLISHED',
        at: '2026-07-01T09:00:00Z',
      })
      initialEvents.push(ev2 as AuditEvent)

      const ev3 = await createAuditEvent(initialEvents, {
        id: 'aud-003',
        entityType: 'pilot',
        entityId: 'pilot-014',
        actorId: 'u-sana',
        actorName: 'Sana Iqbal',
        action: 'PILOT_AGREEMENT_ACCEPTED',
        at: '2026-08-08T11:00:00Z',
      })
      initialEvents.push(ev3 as AuditEvent)

      await db.auditEvents.bulkAdd(initialEvents)

      await db.meta.put({ key: 'seededAt', value: new Date().toISOString() })
    }
  )
}

function defaultNotifications(): Notification[] {
  return [
    {
      id: 'n-1',
      userId: 'u-meera',
      kind: 'gate',
      text: 'CH-018 screening is ready — 4 applications await shortlist.',
      entityRef: '/app/challenges/CH-018?tab=screening',
      at: '2026-09-21T08:10:00Z',
    },
    {
      id: 'n-2',
      userId: 'u-meera',
      kind: 'sla',
      text: 'Milestone M3 on CH-014 is inside the 30-day payment SLA window.',
      entityRef: '/app/challenges/CH-014?tab=payments',
      at: '2026-09-20T14:00:00Z',
    },
    {
      id: 'n-3',
      userId: 'u-sana',
      kind: 'payment',
      text: 'Evidence for leak-repair SLA was verified. Finance can now approve release.',
      entityRef: '/app/startup/payments',
      at: '2026-09-19T11:30:00Z',
    },
    {
      id: 'n-4',
      userId: 'u-meera',
      kind: 'demand',
      text: 'Public Health published forward demand for cold-chain monitoring in Q1 2027.',
      entityRef: '/app/demand',
      at: '2026-09-18T09:00:00Z',
    },
  ]
}
