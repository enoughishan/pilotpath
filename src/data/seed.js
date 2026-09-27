// ============================================================
// UDBHAV — Seed Data (Maharashtra Edition)
// ============================================================

export const STATE = 'Maharashtra';

// Maharashtra districts used across all demo challenges
export const DISTRICTS = [
  'Pune',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nashik',
  'Thane',
  'Aurangabad',
  'Solapur',
  'Kolhapur'
];

// Departments (Maharashtra secretariat naming)
export const DEPARTMENTS = [
  { id: 'UDD', name: 'Urban Development Department', short: 'UDD' },
  { id: 'PWD', name: 'Public Works Department', short: 'PWD' },
  { id: 'WRD', name: 'Water Resources Department', short: 'WRD' },
  { id: 'PHD', name: 'Public Health Department', short: 'PHD' },
  { id: 'MED', name: 'Medical Education & Drugs', short: 'MED' },
  { id: 'SED', name: 'School Education Department', short: 'SED' },
  { id: 'HED', name: 'Higher & Technical Education', short: 'HED' },
  { id: 'TRP', name: 'Transport Department', short: 'TRP' },
  { id: 'AGR', name: 'Agriculture Department', short: 'AGR' },
  { id: 'ENE', name: 'Energy Department', short: 'ENE' },
  { id: 'ENV', name: 'Environment Department', short: 'ENV' },
  { id: 'ITD', name: 'Information Technology Directorate', short: 'ITD' }
];

// 10-stage pathway (unchanged)
export const STAGES = [
  { key: 'CHALLENGE',    name: 'Challenge',    num: 1 },
  { key: 'DISCOVERY',    name: 'Discovery',    num: 2 },
  { key: 'SCREENING',    name: 'Screening',    num: 3 },
  { key: 'EVALUATION',   name: 'Evaluation',   num: 4 },
  { key: 'PILOT_DESIGN', name: 'Pilot Design', num: 5 },
  { key: 'CONTRACT',     name: 'Contract',     num: 6 },
  { key: 'MONITORING',   name: 'Monitoring',   num: 7 },
  { key: 'PAYMENT',      name: 'Payment',      num: 8 },
  { key: 'VALIDATION',   name: 'Validation',   num: 9 },
  { key: 'SCALE_UP',     name: 'Scale-up',     num: 10 }
];

// Startups (same, but Indian names + Maharashtra districts)
export const STARTUPS = [
  { id:'ST-01', name:'Aquavirt Systems Pvt. Ltd.', tech:'Water intelligence platform', industry:'Water', stage:'Series A',
    district:'Pune', deployments:3, cost:1200000, readiness:88, techFit:91, certs:['ISO 27001','DPIIT'],
    founded:2021, team:24, prevGov:['Pune Municipal Corporation','Nashik Water Board','Kolhapur PHED'],
    desc:'AI-driven leak detection and non-revenue water reduction using acoustic sensors and network analytics.' },
  { id:'ST-02', name:'FloodSense Labs', tech:'Hyperlocal flood forecasting', industry:'Disaster Mgmt', stage:'Seed',
    district:'Mumbai Suburban', deployments:2, cost:1800000, readiness:84, techFit:89, certs:['DPIIT','ISO 9001'],
    founded:2022, team:18, prevGov:['BMC Disaster Cell','Thane Municipal Corp'],
    desc:'Sensor fusion + rainfall nowcasting to issue ward-level flood alerts 2+ hours ahead of thresholds.' },
  { id:'ST-03', name:'MedChain Cold Pvt. Ltd.', tech:'Cold-chain IoT monitoring', industry:'Health', stage:'Series A',
    district:'Nagpur', deployments:4, cost:950000, readiness:90, techFit:86, certs:['ISO 27001','CE'],
    founded:2020, team:31, prevGov:['Nagpur Health Dept','Pune PHC Network','State Vaccine Cell'],
    desc:'Temperature telemetry and excursion alerts for vaccine and biologics cold chain across PHCs.' },
  { id:'ST-04', name:'LuminaGrid Technologies', tech:'Streetlight fault detection', industry:'Energy', stage:'Seed',
    district:'Nashik', deployments:2, cost:780000, readiness:82, techFit:88, certs:['DPIIT'],
    founded:2022, team:14, prevGov:['Nashik Municipal Corporation','Aurangabad Smart City'],
    desc:'Retrofittable current-signature sensors to detect streetlight faults and predict failures.' },
  { id:'ST-05', name:'AirVeda Analytics', tech:'Air quality sensor network', industry:'Environment', stage:'Series A',
    district:'Mumbai City', deployments:5, cost:2200000, readiness:92, techFit:93, certs:['ISO 27001','ISO 9001','NABL'],
    founded:2019, team:42, prevGov:['MPCB','Pune Smart City','Nagpur Municipal Corp'],
    desc:'Low-cost calibrated air quality sensor grids with hyperlocal forecasting and source attribution.' },
  { id:'ST-06', name:'TeleCare Bharat Healthtech', tech:'Teleconsultation platform', industry:'Health', stage:'Series B',
    district:'Pune', deployments:6, cost:1600000, readiness:94, techFit:90, certs:['ISO 27001','ABDM Ready'],
    founded:2018, team:78, prevGov:['Pune PHC Cluster','Nagpur District Hospital','Nashik Health Dept'],
    desc:'ABDM-integrated teleconsultation with e-prescription, referral routing and offline-first design.' },
  { id:'ST-07', name:'EduTrack AI', tech:'Education analytics', industry:'Education', stage:'Seed',
    district:'Aurangabad', deployments:1, cost:620000, readiness:76, techFit:81, certs:['DPIIT'],
    founded:2023, team:11, prevGov:['Aurangabad Education Dept'],
    desc:'Attendance anomaly detection and early-warning dropout risk scoring for government schools.' },
  { id:'ST-08', name:'RouteMinds Mobility', tech:'Transit route optimisation', industry:'Transport', stage:'Series A',
    district:'Pune', deployments:3, cost:1400000, readiness:87, techFit:90, certs:['ISO 27001'],
    founded:2020, team:29, prevGov:['PMPML','Nashik City Bus','Thane Municipal Transport'],
    desc:'Demand-weighted route optimisation and schedule adherence analytics for city bus networks.' },
  { id:'ST-09', name:'SolarWatch Cleanenergy', tech:'Solar asset monitoring', industry:'Energy', stage:'Seed',
    district:'Solapur', deployments:2, cost:880000, readiness:80, techFit:85, certs:['DPIIT','BIS'],
    founded:2022, team:16, prevGov:['MEDA','Solapur Renewable Agency'],
    desc:'Rooftop solar generation monitoring, soiling detection and performance-ratio benchmarking.' },
  { id:'ST-10', name:'WasteWise Solutions', tech:'Waste collection routing', industry:'Waste', stage:'Seed',
    district:'Kolhapur', deployments:2, cost:740000, readiness:79, techFit:83, certs:['DPIIT'],
    founded:2023, team:13, prevGov:['Kolhapur Municipal Corp','Pune ULB'],
    desc:'Fill-level sensing and dynamic collection routing to reduce vehicle-km and missed pickups.' }
];

// Challenges — real Maharashtra context
export const CHALLENGES = [
  { id: 'CH-018', title: 'Early Flood Alerts for Low-Lying Wards in Mumbai Suburban',
    dept: 'Urban Development Department', district: 'Mumbai Suburban',
    stage: 'EVALUATION', priority: 'High', day: 12, status: 'Needs action',
    problem: 'Low-lying wards in Mumbai Suburban experience delayed flood warnings, resulting in avoidable disruption and emergency response delays.',
    baseline: 'Warning lead time 20 minutes; false alert rate 28%; ward coverage 55%.',
    outcome: 'Provide actionable flood alerts at least 2 hours before critical water-level thresholds are breached.',
    users: 'Residents of 14 low-lying wards; District Disaster Management Cell; Ward officers.',
    budget: 1800000, duration: 90, risk: 'Medium',
    kpis: [
      { name:'Flood warning lead time', baseline:'20 min', target:'120 min', current:'—', unit:'min', dir:'up' },
      { name:'False alert rate', baseline:'28%', target:'<10%', current:'—', unit:'%', dir:'down' },
      { name:'Ward coverage', baseline:'55%', target:'>90%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'IoT water-level sensors, rainfall nowcasting, ML alerting engine.',
    dataReq: 'Historical rainfall, drainage network maps, ward-level elevation, sensor telemetry.',
    secReq: 'Sensor data encryption in transit and at rest; role-based access; incident logging.',
    ipReq: 'Startup retains foreground IP; department gets non-exclusive perpetual licence for public use.',
    eligibility: 'DPIIT-recognised startup; prior deployment in disaster or municipal domain preferred; ISO 27001 or equivalent.'
  },
  { id: 'CH-014', title: 'Cut Non-Revenue Water Loss in Pune Ward Supply Networks',
    dept: 'Water Resources Department', district: 'Pune',
    stage: 'MONITORING', priority: 'High', day: 64, status: 'On track',
    problem: 'Non-revenue water loss in ward supply networks due to delayed leak detection and unmetered flow.',
    baseline: 'Water loss 31.4%; response time 48 hours; coverage 55%.',
    outcome: 'Reduce non-revenue water loss below 20% and cut leak response time under 12 hours.',
    users: 'Ward supply consumers; Water Board operations team.',
    budget: 1800000, duration: 120, risk: 'Medium',
    kpis: [
      { name:'Water loss', baseline:'31.4%', target:'<20%', current:'18.7%', unit:'%', dir:'down' },
      { name:'Response time', baseline:'48 h', target:'<12 h', current:'13 h', unit:'h', dir:'down' },
      { name:'Coverage', baseline:'55%', target:'>90%', current:'94%', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Acoustic leak sensors, network hydraulic modelling, anomaly detection.',
    dataReq: 'Flow and pressure telemetry, valve maps, consumer complaint logs.',
    secReq: 'Encrypted telemetry; SCADA isolation; quarterly VAPT.',
    ipReq: 'Startup retains IP; department gets non-exclusive licence; source escrow for critical components.',
    eligibility: 'DPIIT-recognised; prior water utility deployment; ISO 27001.'
  },
  { id: 'CH-017', title: 'Cold-Chain Monitoring for Vaccine Delivery — Nagpur Division',
    dept: 'Public Health Department', district: 'Nagpur',
    stage: 'PAYMENT', priority: 'Medium', day: 88, status: 'Awaiting payment',
    problem: 'Vaccine cold-chain excursions go undetected between district stores and PHCs, causing wastage.',
    baseline: 'Excursion detection time 8 hours; wastage 4.2%.',
    outcome: 'Detect cold-chain excursions within 15 minutes and reduce wastage below 1%.',
    users: 'PHC nurses; district vaccine store; cold-chain handlers.',
    budget: 950000, duration: 90, risk: 'Low',
    kpis: [
      { name:'Excursion detection time', baseline:'8 h', target:'<15 min', current:'11 min', unit:'min', dir:'down' },
      { name:'Vaccine wastage', baseline:'4.2%', target:'<1%', current:'0.8%', unit:'%', dir:'down' },
      { name:'PHC coverage', baseline:'40%', target:'>95%', current:'97%', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'BLE temperature loggers, gateway mesh, alerting dashboard.',
    dataReq: 'Temperature logs, shipment manifests, PHC inventory.',
    secReq: 'Device identity, encrypted BLE payloads, audit trails.',
    ipReq: 'Startup retains IP; department licence for internal use.',
    eligibility: 'DPIIT-recognised; health cold-chain experience; ISO 27001.'
  },
  { id: 'CH-021', title: 'Streetlight Fault Detection & Predictive Maintenance — Nashik',
    dept: 'Urban Development Department', district: 'Nashik',
    stage: 'VALIDATION', priority: 'Medium', day: 96, status: 'Awaiting validation',
    problem: 'Streetlight faults are reported by citizens and take days to locate and repair.',
    baseline: 'Mean time to detect 3.2 days; complaint-based discovery 82%.',
    outcome: 'Automatically detect and localise streetlight faults within 30 minutes.',
    users: 'Ward electrical staff; citizens; night-time road users.',
    budget: 780000, duration: 75, risk: 'Low',
    kpis: [
      { name:'Mean time to detect', baseline:'3.2 days', target:'<30 min', current:'22 min', unit:'min', dir:'down' },
      { name:'Auto-detection share', baseline:'18%', target:'>85%', current:'91%', unit:'%', dir:'up' },
      { name:'Pole coverage', baseline:'30%', target:'>90%', current:'93%', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Current-signature sensing, mesh network, predictive failure model.',
    dataReq: 'Pole inventory, feeder maps, outage history.',
    secReq: 'Device attestation, encrypted mesh, OTA update signing.',
    ipReq: 'Startup retains IP; department gets perpetual non-exclusive licence.',
    eligibility: 'DPIIT-recognised; prior municipal deployment; BIS-compliant hardware.'
  },
  { id: 'CH-022', title: 'Hyperlocal Air Quality Sensor Network — Mumbai City',
    dept: 'Environment Department', district: 'Mumbai City',
    stage: 'SCALE_UP', priority: 'High', day: 130, status: 'Decision pending',
    problem: 'City has only 2 reference-grade monitors for 60 wards, so hyperlocal AQI is unknown.',
    baseline: '2 monitors; ward-level AQI coverage 3%.',
    outcome: 'Deploy a calibrated 40-node network providing ward-level AQI and source attribution.',
    users: 'Citizens; pollution control board; health department.',
    budget: 2200000, duration: 120, risk: 'Medium',
    kpis: [
      { name:'Ward AQI coverage', baseline:'3%', target:'>85%', current:'94%', unit:'%', dir:'up' },
      { name:'Correlation with reference', baseline:'—', target:'>0.85', current:'0.91', unit:'r', dir:'up' },
      { name:'Data uptime', baseline:'—', target:'>95%', current:'98.4%', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Low-cost PM2.5/PM10 sensors, calibration model, source attribution.',
    dataReq: 'Reference station data, meteorology, land-use, traffic.',
    secReq: 'Signed firmware, encrypted MQTT, public API rate limiting.',
    ipReq: 'Startup retains IP; department gets licence; calibration model source escrow.',
    eligibility: 'DPIIT-recognised; NABL calibration partner; prior pollution board deployment.'
  },
  { id: 'CH-019', title: 'Teleconsultation for Rural PHCs in Pune Division',
    dept: 'Public Health Department', district: 'Pune',
    stage: 'PILOT_DESIGN', priority: 'High', day: 34, status: 'In progress',
    problem: 'Rural PHCs lack specialist access, forcing patients to travel 40+ km for basic consultations.',
    baseline: 'Specialist access 12%; average travel 42 km.',
    outcome: 'Enable 80% of PHC patients to receive specialist teleconsultation locally.',
    users: 'PHC patients; medical officers; district specialists.',
    budget: 1600000, duration: 120, risk: 'Medium',
    kpis: [
      { name:'Specialist access rate', baseline:'12%', target:'>80%', current:'—', unit:'%', dir:'up' },
      { name:'Avg patient travel', baseline:'42 km', target:'<8 km', current:'—', unit:'km', dir:'down' },
      { name:'Consultation completion', baseline:'—', target:'>90%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'ABDM-integrated teleconsult, e-prescription, offline-first mobile.',
    dataReq: 'Patient records (consented), PHC rosters, specialist availability.',
    secReq: 'ABDM compliance, end-to-end encryption, consent artefact logging.',
    ipReq: 'Startup retains IP; department gets licence; data remains government property.',
    eligibility: 'DPIIT-recognised; ABDM-ready; ISO 27001.'
  },
  { id: 'CH-023', title: 'School Attendance Anomaly Detection — Aurangabad',
    dept: 'School Education Department', district: 'Aurangabad',
    stage: 'SCREENING', priority: 'Low', day: 8, status: 'In progress',
    problem: 'Dropout risk is identified too late, after students have been absent for weeks.',
    baseline: 'Dropout identification lag 6 weeks; dropout rate 3.8%.',
    outcome: 'Flag at-risk students within 1 week of anomalous attendance patterns.',
    users: 'School headmasters; block education officers; parents.',
    budget: 620000, duration: 90, risk: 'Low',
    kpis: [
      { name:'Identification lag', baseline:'6 weeks', target:'<1 week', current:'—', unit:'wk', dir:'down' },
      { name:'Dropout rate', baseline:'3.8%', target:'<2%', current:'—', unit:'%', dir:'down' },
      { name:'School coverage', baseline:'—', target:'100%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: false },
    tech: 'Attendance analytics, anomaly detection, parent SMS alerts.',
    dataReq: 'Attendance registers (anonymised), enrolment data.',
    secReq: 'Child data protection, role-based access, no PII in analytics layer.',
    ipReq: 'Startup retains IP; department gets perpetual licence.',
    eligibility: 'DPIIT-recognised; education sector experience; child data compliance.'
  },
  { id: 'CH-024', title: 'PMPML Bus Route Optimisation — Pune Metropolitan Region',
    dept: 'Transport Department', district: 'Pune',
    stage: 'DISCOVERY', priority: 'Medium', day: 5, status: 'Discovering',
    problem: 'Bus routes have not been revised in 7 years despite shifting demand patterns.',
    baseline: 'Average load factor 46%; schedule adherence 61%.',
    outcome: 'Revise routes and schedules to raise load factor above 70% and adherence above 85%.',
    users: 'Bus commuters; transport corporation operations.',
    budget: 1400000, duration: 120, risk: 'Medium',
    kpis: [
      { name:'Load factor', baseline:'46%', target:'>70%', current:'—', unit:'%', dir:'up' },
      { name:'Schedule adherence', baseline:'61%', target:'>85%', current:'—', unit:'%', dir:'up' },
      { name:'Avg wait time', baseline:'18 min', target:'<10 min', current:'—', unit:'min', dir:'down' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Demand modelling, GPS trace analytics, schedule optimiser.',
    dataReq: 'Ticket data, GPS traces, census, land-use.',
    secReq: 'Anonymised mobility data, encrypted storage.',
    ipReq: 'Startup retains IP; department perpetual licence.',
    eligibility: 'DPIIT-recognised; transit authority experience.'
  },
  { id: 'CH-025', title: 'Rooftop Solar Performance Monitoring — Solapur',
    dept: 'Energy Department', district: 'Solapur',
    stage: 'CHALLENGE', priority: 'Medium', day: 2, status: 'Draft',
    problem: 'Rooftop solar installations underperform but underperformance is invisible to the agency.',
    baseline: 'Average performance ratio 0.62; soiling detection manual.',
    outcome: 'Continuous monitoring with soiling and underperformance alerts within 24 hours.',
    users: 'Renewable energy agency; rooftop owners.',
    budget: 880000, duration: 90, risk: 'Low',
    kpis: [
      { name:'Performance ratio', baseline:'0.62', target:'>0.75', current:'—', unit:'', dir:'up' },
      { name:'Underperformance detection', baseline:'Manual', target:'<24 h', current:'—', unit:'h', dir:'down' },
      { name:'Site coverage', baseline:'—', target:'>90%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: false },
    tech: 'Inverter telemetry, soiling model, performance benchmarking.',
    dataReq: 'Inverter logs, irradiance, weather.',
    secReq: 'Device identity, encrypted telemetry.',
    ipReq: 'Startup retains IP; department licence.',
    eligibility: 'DPIIT-recognised; BIS-compliant hardware.'
  },
  { id: 'CH-026', title: 'Waste Collection Route Intelligence — Kolhapur',
    dept: 'Urban Development Department', district: 'Kolhapur',
    stage: 'CHALLENGE', priority: 'Medium', day: 1, status: 'Draft',
    problem: 'Waste collection routes are static; bins overflow in some areas while trucks run half-empty elsewhere.',
    baseline: 'Missed pickups 14%; vehicle-km per tonne 3.8.',
    outcome: 'Dynamic routing to cut missed pickups below 3% and vehicle-km per tonne below 2.5.',
    users: 'Sanitation workers; ward officers; citizens.',
    budget: 740000, duration: 90, risk: 'Low',
    kpis: [
      { name:'Missed pickups', baseline:'14%', target:'<3%', current:'—', unit:'%', dir:'down' },
      { name:'Vehicle-km / tonne', baseline:'3.8', target:'<2.5', current:'—', unit:'', dir:'down' },
      { name:'Bin coverage', baseline:'—', target:'>95%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: false },
    tech: 'Fill-level sensors, dynamic routing, driver mobile app.',
    dataReq: 'Bin locations, vehicle GPS, collection logs.',
    secReq: 'Encrypted telemetry, driver authentication.',
    ipReq: 'Startup retains IP; department licence.',
    eligibility: 'DPIIT-recognised; municipal waste experience.'
  },
  { id: 'CH-027', title: 'Groundwater Level Prediction — Marathwada Region',
    dept: 'Water Resources Department', district: 'Aurangabad',
    stage: 'DISCOVERY', priority: 'High', day: 6, status: 'Discovering',
    problem: 'Groundwater depletion is measured too late to inform extraction policy.',
    baseline: 'Manual monitoring quarterly; prediction horizon 0.',
    outcome: 'Predict groundwater levels 3 months ahead with under 10% error.',
    users: 'Water resources dept; farmers; policy cell.',
    budget: 1100000, duration: 120, risk: 'Medium',
    kpis: [
      { name:'Prediction error', baseline:'—', target:'<10%', current:'—', unit:'%', dir:'down' },
      { name:'Forecast horizon', baseline:'0', target:'90 days', current:'—', unit:'d', dir:'up' },
      { name:'Observation well coverage', baseline:'22%', target:'>80%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Aquifer modelling, remote sensing, ML forecasting.',
    dataReq: 'Well logs, rainfall, extraction permits, satellite data.',
    secReq: 'Encrypted storage, controlled API access.',
    ipReq: 'Startup retains IP; department licence + model documentation.',
    eligibility: 'DPIIT-recognised; hydrology modelling experience.'
  },
  { id: 'CH-028', title: 'Emergency Response Dispatch Optimisation — Pune',
    dept: 'Public Health Department', district: 'Pune',
    stage: 'SCREENING', priority: 'High', day: 10, status: 'Needs action',
    problem: 'Ambulance dispatch is manual and does not account for real-time traffic or hospital capacity.',
    baseline: 'Average response time 19 min; hospital diversion 12%.',
    outcome: 'Reduce average emergency response time below 10 minutes.',
    users: 'Emergency patients; 108 dispatch; hospitals.',
    budget: 1500000, duration: 100, risk: 'High',
    kpis: [
      { name:'Response time', baseline:'19 min', target:'<10 min', current:'—', unit:'min', dir:'down' },
      { name:'Hospital diversion', baseline:'12%', target:'<3%', current:'—', unit:'%', dir:'down' },
      { name:'Dispatch accuracy', baseline:'—', target:'>95%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: true },
    tech: 'Real-time dispatch engine, traffic integration, capacity-aware routing.',
    dataReq: 'Ambulance GPS, traffic feeds, hospital bed availability.',
    secReq: 'High-availability architecture, encrypted comms, audit logging.',
    ipReq: 'Startup retains IP; department licence; escrow for critical algorithms.',
    eligibility: 'DPIIT-recognised; emergency services experience; ISO 27001.'
  },
  { id: 'CH-029', title: 'Digital Attendance for Anganwadi Centres — Nashik Division',
    dept: 'School Education Department', district: 'Nashik',
    stage: 'EVALUATION', priority: 'Low', day: 16, status: 'In progress',
    problem: 'Anganwadi attendance is paper-based and aggregated monthly, hiding daily absences.',
    baseline: 'Reporting lag 30 days; data completeness 58%.',
    outcome: 'Daily digital attendance with offline sync and 95% completeness.',
    users: 'Anganwadi workers; supervisors; ICDS officers.',
    budget: 520000, duration: 75, risk: 'Low',
    kpis: [
      { name:'Reporting lag', baseline:'30 days', target:'<1 day', current:'—', unit:'d', dir:'down' },
      { name:'Data completeness', baseline:'58%', target:'>95%', current:'—', unit:'%', dir:'up' },
      { name:'Centre coverage', baseline:'—', target:'100%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: false },
    tech: 'Offline-first mobile app, biometric/photo attendance, sync engine.',
    dataReq: 'Beneficiary rolls (anonymised), worker rosters.',
    secReq: 'Child data protection, device encryption, consent logging.',
    ipReq: 'Startup retains IP; department perpetual licence.',
    eligibility: 'DPIIT-recognised; ICDS/education experience; child data compliance.'
  },
  { id: 'CH-030', title: 'Pothole Detection using Computer Vision — Thane',
    dept: 'Public Works Department', district: 'Thane',
    stage: 'PILOT_DESIGN', priority: 'Medium', day: 28, status: 'In progress',
    problem: 'Pothole complaints are citizen-reported and road repair prioritisation is not data-driven.',
    baseline: 'Avg repair time 34 days; citizen complaints 1,200/month.',
    outcome: 'Automated pothole detection from bus-mounted cameras with 90% accuracy.',
    users: 'Road maintenance crews; commuters.',
    budget: 980000, duration: 90, risk: 'Low',
    kpis: [
      { name:'Detection accuracy', baseline:'—', target:'>90%', current:'—', unit:'%', dir:'up' },
      { name:'Avg repair time', baseline:'34 days', target:'<14 days', current:'—', unit:'d', dir:'down' },
      { name:'Road coverage', baseline:'—', target:'>80%', current:'—', unit:'%', dir:'up' }
    ],
    compliance: { dataProtection: true, cyber: true, ip: true, procurement: true, risk: false },
    tech: 'Edge CV on bus cameras, geo-tagged detection, prioritisation engine.',
    dataReq: 'Road imagery, GPS traces, complaint logs.',
    secReq: 'Edge processing, no PII capture, encrypted uploads.',
    ipReq: 'Startup retains IP; department licence.',
    eligibility: 'DPIIT-recognised; CV deployment experience.'
  }
];

// Applications — same structure
export const APPLICATIONS = [
  { id:'AP-018-1', challengeId:'CH-018', startupId:'ST-02', status:'Shortlisted', submittedAt:'2026-09-04', docs:[] },
  { id:'AP-018-2', challengeId:'CH-018', startupId:'ST-05', status:'Shortlisted', submittedAt:'2026-09-05', docs:[] },
  { id:'AP-018-3', challengeId:'CH-018', startupId:'ST-08', status:'Evaluation', submittedAt:'2026-09-06', docs:[] },
  { id:'AP-014-1', challengeId:'CH-014', startupId:'ST-01', status:'Pilot', submittedAt:'2026-06-12', docs:[] },
  { id:'AP-014-2', challengeId:'CH-014', startupId:'ST-10', status:'Rejected', submittedAt:'2026-06-14', docs:[] },
  { id:'AP-017-1', challengeId:'CH-017', startupId:'ST-03', status:'Pilot', submittedAt:'2026-05-20', docs:[] },
  { id:'AP-021-1', challengeId:'CH-021', startupId:'ST-04', status:'Pilot', submittedAt:'2026-05-02', docs:[] },
  { id:'AP-022-1', challengeId:'CH-022', startupId:'ST-05', status:'Pilot', submittedAt:'2026-03-18', docs:[] },
  { id:'AP-019-1', challengeId:'CH-019', startupId:'ST-06', status:'Pilot', submittedAt:'2026-08-02', docs:[] },
  { id:'AP-023-1', challengeId:'CH-023', startupId:'ST-07', status:'Screening', submittedAt:'2026-09-14', docs:[] },
  { id:'AP-028-1', challengeId:'CH-028', startupId:'ST-06', status:'Screening', submittedAt:'2026-09-16', docs:[] },
  { id:'AP-024-1', challengeId:'CH-024', startupId:'ST-08', status:'Submitted', submittedAt:'2026-09-19', docs:[] },
  { id:'AP-027-1', challengeId:'CH-027', startupId:'ST-01', status:'Submitted', submittedAt:'2026-09-20', docs:[] },
  { id:'AP-030-1', challengeId:'CH-030', startupId:'ST-08', status:'Pilot', submittedAt:'2026-07-10', docs:[] },
  { id:'AP-030-2', challengeId:'CH-030', startupId:'ST-04', status:'Shortlisted', submittedAt:'2026-07-11', docs:[] },
  { id:'AP-029-1', challengeId:'CH-029', startupId:'ST-07', status:'Evaluation', submittedAt:'2026-09-01', docs:[] },
  { id:'AP-029-2', challengeId:'CH-029', startupId:'ST-06', status:'Evaluation', submittedAt:'2026-09-02', docs:[] }
];

export const RUBRIC = [
  { key:'technical', name:'Technical feasibility', weight:30 },
  { key:'impact', name:'Impact potential', weight:25 },
  { key:'cost', name:'Cost effectiveness', weight:20 },
  { key:'security', name:'Security & compliance', weight:15 },
  { key:'scalability', name:'Scalability', weight:10 }
];

export const EVALUATIONS = [
  { id:'EV-018-1', applicationId:'AP-018-1', evaluator:'Dr. Arvind Rao', role:'Domain Expert Panel',
    scores:{technical:88, impact:92, cost:85, security:86, scalability:90}, status:'Submitted',
    comments:'Strong sensor fusion approach; past Mumbai Suburban deployment directly relevant.', coi:false, submittedAt:'2026-09-18' },
  { id:'EV-018-2', applicationId:'AP-018-1', evaluator:'Dr. Kavita Menon', role:'Domain Expert Panel',
    scores:{technical:85, impact:90, cost:82, security:88, scalability:87}, status:'Submitted',
    comments:'Solid technical plan. Recommend milestone-based hardware validation.', coi:false, submittedAt:'2026-09-18' },
  { id:'EV-018-3', applicationId:'AP-018-2', evaluator:'Dr. Arvind Rao', role:'Domain Expert Panel',
    scores:{technical:80, impact:84, cost:88, security:82, scalability:78}, status:'Submitted',
    comments:'Good air quality credentials but flood-domain fit is a stretch.', coi:false, submittedAt:'2026-09-19' },
  { id:'EV-018-4', applicationId:'AP-018-3', evaluator:'Dr. Arvind Rao', role:'Domain Expert Panel',
    scores:{technical:76, impact:74, cost:80, security:79, scalability:72}, status:'Submitted',
    comments:'Transit optimisation is adjacent; flood use case not well evidenced.', coi:false, submittedAt:'2026-09-19' },
  { id:'EV-018-5', applicationId:'AP-018-2', evaluator:'Dr. Kavita Menon', role:'Domain Expert Panel',
    scores:{technical:82, impact:86, cost:86, security:84, scalability:80}, status:'Draft',
    comments:'', coi:false, submittedAt:null }
];

export const PILOTS = [
  { id:'PL-014', challengeId:'CH-014', startupId:'ST-01', contractId:'CT-014',
    title:'Water Loss Reduction — Pune Ward 7–14',
    startDate:'2026-07-15', endDate:'2026-11-12', duration:120, budget:1800000,
    status:'Active', progress:62, riskLevel:'Medium',
    geography:'Pune Wards 7–14', users:'14,200 households',
    milestones:[
      { id:'M1', name:'Deployment', amount:300000, due:'2026-07-30', status:'PAID', paidAt:'2026-08-02', deliverables:'Sensor installation in 8 wards; gateway commissioning.', evidence:'Installation report, sensor map', evidenceRequired:true },
      { id:'M2', name:'Operational pilot', amount:500000, due:'2026-08-30', status:'PAID', paidAt:'2026-09-01', deliverables:'Leak detection live; ops dashboard handed over.', evidence:'Ops report, dashboard screenshots', evidenceRequired:true },
      { id:'M3', name:'Performance target', amount:600000, due:'2026-10-15', status:'AWAITING_VALIDATION', paidAt:null, deliverables:'Water loss <20%; response time <12h.', evidence:'KPI dataset, sensor logs, field inspection', evidenceRequired:true },
      { id:'M4', name:'Final validation', amount:400000, due:'2026-11-12', status:'LOCKED', paidAt:null, deliverables:'Final validated report; scale-up recommendation.', evidence:'Validation certificate', evidenceRequired:true }
    ],
    kpis:[
      { name:'Water loss', baseline:31.4, current:18.7, target:20, unit:'%', dir:'down', status:'ACHIEVED' },
      { name:'Response time', baseline:48, current:13, target:12, unit:'h', dir:'down', status:'NEAR' },
      { name:'Coverage', baseline:55, current:94, target:90, unit:'%', dir:'up', status:'ACHIEVED' }
    ],
    trend:[
      {week:'W1', loss:30.1, response:44, coverage:58},
      {week:'W2', loss:28.4, response:38, coverage:66},
      {week:'W3', loss:26.2, response:31, coverage:71},
      {week:'W4', loss:24.0, response:26, coverage:78},
      {week:'W5', loss:22.1, response:21, coverage:83},
      {week:'W6', loss:20.6, response:18, coverage:88},
      {week:'W7', loss:19.4, response:15, coverage:91},
      {week:'W8', loss:18.7, response:13, coverage:94}
    ],
    risks:[
      { name:'Budget variance', value:'12%', level:'warn', detail:'Sensor unit cost 12% above estimate due to import duty revision.' },
      { name:'Timeline', value:'8 days delayed', level:'warn', detail:'M2 slipped 8 days due to monsoon access restrictions in Ward 11.' },
      { name:'KPI achievement', value:'91%', level:'ok', detail:'Two of three KPIs fully achieved.' },
      { name:'Data completeness', value:'97%', level:'ok', detail:'Sensor telemetry gap of 3% attributable to two offline nodes.' },
      { name:'Security review', value:'Pending', level:'warn', detail:'Quarterly VAPT scheduled.' },
      { name:'Incident count', value:'1 minor', level:'ok', detail:'One sensor enclosure tampering attempt; resolved.' }
    ]
  },
  { id:'PL-017', challengeId:'CH-017', startupId:'ST-03', contractId:'CT-017',
    title:'Vaccine Cold-Chain Monitoring — Nagpur District',
    startDate:'2026-06-01', endDate:'2026-08-30', duration:90, budget:950000,
    status:'Completed', progress:100, riskLevel:'Low',
    geography:'Nagpur District — 42 PHCs', users:'42 PHCs, 18,000 monthly doses',
    milestones:[
      { id:'M1', name:'Deployment', amount:250000, due:'2026-06-15', status:'PAID', paidAt:'2026-06-18', deliverables:'Loggers + gateways at 42 PHCs.', evidence:'Installation report', evidenceRequired:true },
      { id:'M2', name:'Operational pilot', amount:300000, due:'2026-07-15', status:'PAID', paidAt:'2026-07-17', deliverables:'Alerting dashboard live; staff trained.', evidence:'Training report', evidenceRequired:true },
      { id:'M3', name:'Performance target', amount:250000, due:'2026-08-15', status:'PAID', paidAt:'2026-08-18', deliverables:'Wastage <1%; detection <15 min.', evidence:'KPI dataset', evidenceRequired:true },
      { id:'M4', name:'Final validation', amount:150000, due:'2026-08-30', status:'AWAITING_PAYMENT', paidAt:null, deliverables:'Final validated report.', evidence:'Validation certificate', evidenceRequired:true }
    ],
    kpis:[
      { name:'Excursion detection', baseline:480, current:11, target:15, unit:'min', dir:'down', status:'ACHIEVED' },
      { name:'Vaccine wastage', baseline:4.2, current:0.8, target:1, unit:'%', dir:'down', status:'ACHIEVED' },
      { name:'PHC coverage', baseline:40, current:97, target:95, unit:'%', dir:'up', status:'ACHIEVED' }
    ],
    trend:[
      {week:'W1', loss:3.8, response:120, coverage:52},
      {week:'W2', loss:3.1, response:74, coverage:64},
      {week:'W3', loss:2.4, response:48, coverage:73},
      {week:'W4', loss:1.9, response:32, coverage:81},
      {week:'W5', loss:1.4, response:22, coverage:88},
      {week:'W6', loss:1.1, response:16, coverage:92},
      {week:'W7', loss:0.9, response:13, coverage:95},
      {week:'W8', loss:0.8, response:11, coverage:97}
    ],
    risks:[
      { name:'Budget variance', value:'4%', level:'ok', detail:'Minor savings on gateway units.' },
      { name:'Timeline', value:'On schedule', level:'ok', detail:'All milestones delivered on time.' },
      { name:'KPI achievement', value:'100%', level:'ok', detail:'All three KPIs exceeded target.' },
      { name:'Data completeness', value:'99.2%', level:'ok', detail:'Excellent telemetry continuity.' },
      { name:'Security review', value:'Cleared', level:'ok', detail:'VAPT cleared.' },
      { name:'Incident count', value:'0', level:'ok', detail:'No incidents.' }
    ]
  },
  { id:'PL-021', challengeId:'CH-021', startupId:'ST-04', contractId:'CT-021',
    title:'Streetlight Fault Detection — Nashik Zone 3',
    startDate:'2026-06-20', endDate:'2026-09-03', duration:75, budget:780000,
    status:'Completed', progress:100, riskLevel:'Low',
    geography:'Nashik Zone 3 — 2,140 poles', users:'Zone 3 residents',
    milestones:[
      { id:'M1', name:'Deployment', amount:200000, due:'2026-07-05', status:'PAID', paidAt:'2026-07-08', deliverables:'Sensors on 2,140 poles.', evidence:'Installation report', evidenceRequired:true },
      { id:'M2', name:'Operational pilot', amount:250000, due:'2026-08-05', status:'PAID', paidAt:'2026-08-07', deliverables:'Detection dashboard live.', evidence:'Ops report', evidenceRequired:true },
      { id:'M3', name:'Performance target', amount:200000, due:'2026-08-25', status:'PAID', paidAt:'2026-08-28', deliverables:'MTTD <30 min; auto-detection >85%.', evidence:'KPI dataset', evidenceRequired:true },
      { id:'M4', name:'Final validation', amount:130000, due:'2026-09-03', status:'AWAITING_VALIDATION', paidAt:null, deliverables:'Validated report + certificate.', evidence:'Validation certificate', evidenceRequired:true }
    ],
    kpis:[
      { name:'Mean time to detect', baseline:4608, current:22, target:30, unit:'min', dir:'down', status:'ACHIEVED' },
      { name:'Auto-detection share', baseline:18, current:91, target:85, unit:'%', dir:'up', status:'ACHIEVED' },
      { name:'Pole coverage', baseline:30, current:93, target:90, unit:'%', dir:'up', status:'ACHIEVED' }
    ],
    trend:[
      {week:'W1', loss:120, response:340, coverage:38},
      {week:'W2', loss:96, response:210, coverage:52},
      {week:'W3', loss:71, response:120, coverage:66},
      {week:'W4', loss:52, response:74, coverage:76},
      {week:'W5', loss:38, response:48, coverage:84},
      {week:'W6', loss:29, response:32, coverage:89},
      {week:'W7', loss:25, response:26, coverage:92},
      {week:'W8', loss:22, response:22, coverage:93}
    ],
    risks:[
      { name:'Budget variance', value:'2%', level:'ok', detail:'Within tolerance.' },
      { name:'Timeline', value:'On schedule', level:'ok', detail:'Completed on time.' },
      { name:'KPI achievement', value:'100%', level:'ok', detail:'All KPIs exceeded.' },
      { name:'Data completeness', value:'98.1%', level:'ok', detail:'Minor gaps.' },
      { name:'Security review', value:'Cleared', level:'ok', detail:'Device attestation verified.' },
      { name:'Incident count', value:'0', level:'ok', detail:'No incidents.' }
    ]
  },
  { id:'PL-022', challengeId:'CH-022', startupId:'ST-05', contractId:'CT-022',
    title:'Hyperlocal Air Quality Network — Mumbai City',
    startDate:'2026-04-10', endDate:'2026-08-08', duration:120, budget:2200000,
    status:'Validated', progress:100, riskLevel:'Medium',
    geography:'Mumbai City — 40 wards', users:'1.2M residents',
    milestones:[
      { id:'M1', name:'Deployment', amount:600000, due:'2026-05-01', status:'PAID', paidAt:'2026-05-04', deliverables:'40 nodes installed & calibrated.', evidence:'Installation report', evidenceRequired:true },
      { id:'M2', name:'Operational pilot', amount:700000, due:'2026-06-15', status:'PAID', paidAt:'2026-06-18', deliverables:'Public dashboard + API live.', evidence:'Dashboard', evidenceRequired:true },
      { id:'M3', name:'Performance target', amount:550000, due:'2026-07-20', status:'PAID', paidAt:'2026-07-22', deliverables:'Coverage >85%; correlation >0.85.', evidence:'KPI dataset', evidenceRequired:true },
      { id:'M4', name:'Final validation', amount:350000, due:'2026-08-08', status:'PAID', paidAt:'2026-08-12', deliverables:'Validation certificate.', evidence:'Validation certificate', evidenceRequired:true }
    ],
    kpis:[
      { name:'Ward AQI coverage', baseline:3, current:94, target:85, unit:'%', dir:'up', status:'ACHIEVED' },
      { name:'Correlation with reference', baseline:0, current:0.91, target:0.85, unit:'r', dir:'up', status:'ACHIEVED' },
      { name:'Data uptime', baseline:0, current:98.4, target:95, unit:'%', dir:'up', status:'ACHIEVED' }
    ],
    trend:[
      {week:'W1', loss:12, response:60, coverage:22},
      {week:'W2', loss:28, response:52, coverage:38},
      {week:'W3', loss:44, response:44, coverage:54},
      {week:'W4', loss:58, response:36, coverage:66},
      {week:'W5', loss:70, response:28, coverage:76},
      {week:'W6', loss:80, response:22, coverage:84},
      {week:'W7', loss:88, response:16, coverage:90},
      {week:'W8', loss:94, response:12, coverage:94}
    ],
    risks:[
      { name:'Budget variance', value:'6%', level:'ok', detail:'Calibration partner costs slightly higher.' },
      { name:'Timeline', value:'4 days delayed', level:'ok', detail:'Minor delay in node installation.' },
      { name:'KPI achievement', value:'100%', level:'ok', detail:'All KPIs exceeded.' },
      { name:'Data completeness', value:'98.4%', level:'ok', detail:'Excellent uptime.' },
      { name:'Security review', value:'Cleared', level:'ok', detail:'API rate limiting verified.' },
      { name:'Incident count', value:'0', level:'ok', detail:'No incidents.' }
    ]
  },
  { id:'PL-019', challengeId:'CH-019', startupId:'ST-06', contractId:'CT-019',
    title:'Teleconsultation for Rural PHCs — Pune Division',
    startDate:'2026-09-15', endDate:'2027-01-13', duration:120, budget:1600000,
    status:'Active', progress:8, riskLevel:'Medium',
    geography:'Pune Division — 18 PHCs', users:'18 PHCs, 240,000 catchment',
    milestones:[
      { id:'M1', name:'Deployment', amount:400000, due:'2026-10-05', status:'IN_PROGRESS', paidAt:null, deliverables:'Teleconsult platform live at 18 PHCs.', evidence:'Deployment report', evidenceRequired:true },
      { id:'M2', name:'Operational pilot', amount:500000, due:'2026-11-10', status:'LOCKED', paidAt:null, deliverables:'50% of consults via teleconsult.', evidence:'Consultation logs', evidenceRequired:true },
      { id:'M3', name:'Performance target', amount:450000, due:'2026-12-15', status:'LOCKED', paidAt:null, deliverables:'Access >80%; travel <8 km.', evidence:'KPI dataset', evidenceRequired:true },
      { id:'M4', name:'Final validation', amount:250000, due:'2027-01-13', status:'LOCKED', paidAt:null, deliverables:'Validation certificate.', evidence:'Validation certificate', evidenceRequired:true }
    ],
    kpis:[
      { name:'Specialist access rate', baseline:12, current:14, target:80, unit:'%', dir:'up', status:'BELOW' },
      { name:'Avg patient travel', baseline:42, current:41, target:8, unit:'km', dir:'down', status:'BELOW' },
      { name:'Consultation completion', baseline:0, current:0, target:90, unit:'%', dir:'up', status:'BELOW' }
    ],
    trend:[
      {week:'W1', loss:12, response:42, coverage:14},
      {week:'W2', loss:13, response:42, coverage:16},
      {week:'W3', loss:14, response:41, coverage:18},
      {week:'W4', loss:14, response:41, coverage:20}
    ],
    risks:[
      { name:'Budget variance', value:'0%', level:'ok', detail:'No variance yet.' },
      { name:'Timeline', value:'On schedule', level:'ok', detail:'Deployment underway.' },
      { name:'KPI achievement', value:'Early stage', level:'warn', detail:'KPIs are baseline; pilot has just started.' },
      { name:'Data completeness', value:'72%', level:'warn', detail:'ABDM consent artefacts still being onboarded.' },
      { name:'Security review', value:'Pending', level:'warn', detail:'ABDM compliance review scheduled.' },
      { name:'Incident count', value:'0', level:'ok', detail:'No incidents.' }
    ]
  }
];

export const CONTRACTS = [
  { id:'CT-014', challengeId:'CH-014', startupId:'ST-01', value:1800000, start:'2026-07-15', end:'2026-11-12',
    status:'Active', signedAt:'2026-07-14',
    ipClause:'Startup retains foreground IP. Department receives non-exclusive, perpetual, royalty-free licence for internal government use. Source escrow for critical detection algorithms.',
    dataClause:'All operational data generated during the pilot is the property of the Water Resources Department.',
    securityClause:'ISO 27001 controls; encrypted telemetry (TLS 1.3, AES-256 at rest); quarterly VAPT; incident reporting within 24 hours; SCADA network isolation.',
    termination:'Either party may terminate with 30 days written notice.' },
  { id:'CT-017', challengeId:'CH-017', startupId:'ST-03', value:950000, start:'2026-06-01', end:'2026-08-30',
    status:'Completed', signedAt:'2026-05-30',
    ipClause:'Startup retains IP. Department receives non-exclusive perpetual licence for internal use.',
    dataClause:'Temperature and shipment data belongs to the Public Health Department.',
    securityClause:'ISO 27001; encrypted BLE payloads; device identity; audit trails.',
    termination:'30-day written notice; immediate termination for breach.' },
  { id:'CT-021', challengeId:'CH-021', startupId:'ST-04', value:780000, start:'2026-06-20', end:'2026-09-03',
    status:'Completed', signedAt:'2026-06-18',
    ipClause:'Startup retains IP. Department receives perpetual non-exclusive licence.',
    dataClause:'Pole-level fault data belongs to the Urban Development Department.',
    securityClause:'Device attestation; encrypted mesh; signed OTA updates.',
    termination:'30-day written notice.' },
  { id:'CT-022', challengeId:'CH-022', startupId:'ST-05', value:2200000, start:'2026-04-10', end:'2026-08-08',
    status:'Completed', signedAt:'2026-04-08',
    ipClause:'Startup retains IP; calibration model source escrow with department.',
    dataClause:'AQI data is public; raw sensor data belongs to the Environment Department.',
    securityClause:'Signed firmware; encrypted MQTT; public API rate limiting.',
    termination:'30-day written notice.' },
  { id:'CT-019', challengeId:'CH-019', startupId:'ST-06', value:1600000, start:'2026-09-15', end:'2027-01-13',
    status:'Active', signedAt:'2026-09-12',
    ipClause:'Startup retains IP; department licence for internal use; data remains government property.',
    dataClause:'Patient data belongs to the Public Health Department and must remain within India.',
    securityClause:'ABDM compliance; end-to-end encryption; consent logging; ISO 27001.',
    termination:'30-day written notice.' }
];

export const EVIDENCE = [
  { id:'EV-014-1', pilotId:'PL-014', type:'Installation report', name:'Ward 7–14 Sensor Installation Report.pdf',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-07-29T10:12:00', milestone:'M1', status:'Verified',
    verifiedBy:'Rakesh Menon', verifiedAt:'2026-08-01T14:30:00', kpi:'—', size:'4.2 MB', supports:'Milestone M1 — Deployment' },
  { id:'EV-014-2', pilotId:'PL-014', type:'Sensor data', name:'Acoustic Sensor Telemetry — Aug 2026.csv',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-08-28T16:40:00', milestone:'M2', status:'Verified',
    verifiedBy:'Rakesh Menon', verifiedAt:'2026-08-30T09:15:00', kpi:'Water loss', size:'18.7 MB', supports:'Milestone M2' },
  { id:'EV-014-3', pilotId:'PL-014', type:'KPI dataset', name:'Water Loss KPI Dataset — W1–W8.xlsx',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-10-10T11:05:00', milestone:'M3', status:'Under review',
    verifiedBy:null, verifiedAt:null, kpi:'Water loss', size:'1.1 MB', supports:'Milestone M3' },
  { id:'EV-014-4', pilotId:'PL-014', type:'Field photos', name:'Ward 11 Leak Repair.jpg',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-10-11T09:22:00', milestone:'M3', status:'Submitted',
    verifiedBy:null, verifiedAt:null, kpi:'Response time', size:'6.4 MB', supports:'Milestone M3' },
  { id:'EV-017-1', pilotId:'PL-017', type:'Installation report', name:'42 PHC Logger Installation Report.pdf',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-06-14T10:00:00', milestone:'M1', status:'Verified',
    verifiedBy:'Rakesh Menon', verifiedAt:'2026-06-17T11:20:00', kpi:'—', size:'3.1 MB', supports:'Milestone M1' },
  { id:'EV-017-2', pilotId:'PL-017', type:'KPI dataset', name:'Cold Chain KPI Dataset.xlsx',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-08-14T14:30:00', milestone:'M3', status:'Verified',
    verifiedBy:'Prof. Nandini Bose', verifiedAt:'2026-08-16T10:00:00', kpi:'Vaccine wastage', size:'2.2 MB', supports:'Milestone M3' },
  { id:'EV-021-1', pilotId:'PL-021', type:'Installation report', name:'Zone 3 Pole Sensor Installation.pdf',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-07-04T11:00:00', milestone:'M1', status:'Verified',
    verifiedBy:'Rakesh Menon', verifiedAt:'2026-07-07T15:00:00', kpi:'—', size:'5.6 MB', supports:'Milestone M1' },
  { id:'EV-021-2', pilotId:'PL-021', type:'KPI dataset', name:'Streetlight Detection KPI Dataset.xlsx',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-08-24T10:00:00', milestone:'M3', status:'Verified',
    verifiedBy:'Prof. Nandini Bose', verifiedAt:'2026-08-26T14:00:00', kpi:'Mean time to detect', size:'1.4 MB', supports:'Milestone M3' },
  { id:'EV-022-1', pilotId:'PL-022', type:'Installation report', name:'40 Node Installation & Calibration.pdf',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-04-30T10:00:00', milestone:'M1', status:'Verified',
    verifiedBy:'Rakesh Menon', verifiedAt:'2026-05-03T11:00:00', kpi:'—', size:'7.2 MB', supports:'Milestone M1' },
  { id:'EV-022-2', pilotId:'PL-022', type:'KPI dataset', name:'AQI Coverage & Correlation Dataset.xlsx',
    uploadedBy:'Sana Iqbal', uploadedAt:'2026-07-19T10:00:00', milestone:'M3', status:'Verified',
    verifiedBy:'Prof. Nandini Bose', verifiedAt:'2026-07-21T09:00:00', kpi:'Ward AQI coverage', size:'3.3 MB', supports:'Milestone M3' }
];

export const PAYMENTS = [
  { id:'PM-014-1', pilotId:'PL-014', contractId:'CT-014', milestone:'M1', amount:300000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-08-02', paidAt:'2026-08-02', reason:'Deployment evidence verified.' },
  { id:'PM-014-2', pilotId:'PL-014', contractId:'CT-014', milestone:'M2', amount:500000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-09-01', paidAt:'2026-09-01', reason:'Operational pilot evidence verified.' },
  { id:'PM-014-3', pilotId:'PL-014', contractId:'CT-014', milestone:'M3', amount:600000, status:'AWAITING_VALIDATION', approvedBy:null, approvedAt:null, paidAt:null, reason:'Evidence under review.' },
  { id:'PM-014-4', pilotId:'PL-014', contractId:'CT-014', milestone:'M4', amount:400000, status:'LOCKED', approvedBy:null, approvedAt:null, paidAt:null, reason:'Locked until M3 completes.' },
  { id:'PM-017-1', pilotId:'PL-017', contractId:'CT-017', milestone:'M1', amount:250000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-06-18', paidAt:'2026-06-18', reason:'Installation verified.' },
  { id:'PM-017-2', pilotId:'PL-017', contractId:'CT-017', milestone:'M2', amount:300000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-07-17', paidAt:'2026-07-17', reason:'Ops verified.' },
  { id:'PM-017-3', pilotId:'PL-017', contractId:'CT-017', milestone:'M3', amount:250000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-08-18', paidAt:'2026-08-18', reason:'KPI evidence verified.' },
  { id:'PM-017-4', pilotId:'PL-017', contractId:'CT-017', milestone:'M4', amount:150000, status:'AWAITING_PAYMENT', approvedBy:null, approvedAt:null, paidAt:null, reason:'Awaiting accounts approval.' },
  { id:'PM-021-1', pilotId:'PL-021', contractId:'CT-021', milestone:'M1', amount:200000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-07-08', paidAt:'2026-07-08', reason:'Installation verified.' },
  { id:'PM-021-2', pilotId:'PL-021', contractId:'CT-021', milestone:'M2', amount:250000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-08-07', paidAt:'2026-08-07', reason:'Ops verified.' },
  { id:'PM-021-3', pilotId:'PL-021', contractId:'CT-021', milestone:'M3', amount:200000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-08-28', paidAt:'2026-08-28', reason:'KPI verified.' },
  { id:'PM-021-4', pilotId:'PL-021', contractId:'CT-021', milestone:'M4', amount:130000, status:'AWAITING_VALIDATION', approvedBy:null, approvedAt:null, paidAt:null, reason:'Awaiting validation.' },
  { id:'PM-022-1', pilotId:'PL-022', contractId:'CT-022', milestone:'M1', amount:600000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-05-04', paidAt:'2026-05-04', reason:'Installation verified.' },
  { id:'PM-022-2', pilotId:'PL-022', contractId:'CT-022', milestone:'M2', amount:700000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-06-18', paidAt:'2026-06-18', reason:'Dashboard verified.' },
  { id:'PM-022-3', pilotId:'PL-022', contractId:'CT-022', milestone:'M3', amount:550000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-07-22', paidAt:'2026-07-22', reason:'KPI verified.' },
  { id:'PM-022-4', pilotId:'PL-022', contractId:'CT-022', milestone:'M4', amount:350000, status:'PAID', approvedBy:'Rakesh Menon', approvedAt:'2026-08-12', paidAt:'2026-08-12', reason:'Certificate verified.' },
  { id:'PM-019-1', pilotId:'PL-019', contractId:'CT-019', milestone:'M1', amount:400000, status:'PENDING_EVIDENCE', approvedBy:null, approvedAt:null, paidAt:null, reason:'Awaiting deployment evidence.' }
];

export const VALIDATIONS = [
  { id:'VL-017', pilotId:'PL-017', startupClaim:'Vaccine wastage reduced from 4.2% to 0.8%',
    claimedValue:'80.9% reduction', verifiedValue:'80.9% reduction', variance:'0.0%', status:'Validated',
    validator:'Prof. Nandini Bose', validatedAt:'2026-08-28', evidenceCount:3,
    comments:'Verified against logger telemetry and PHC inventory reconciliation.',
    kpis:[
      { name:'Excursion detection', baseline:'8 h', startupReported:'11 min', verified:'11 min', status:'Verified' },
      { name:'Vaccine wastage', baseline:'4.2%', startupReported:'0.8%', verified:'0.8%', status:'Verified' },
      { name:'PHC coverage', baseline:'40%', startupReported:'97%', verified:'97%', status:'Verified' }
    ]},
  { id:'VL-021', pilotId:'PL-021', startupClaim:'Streetlight fault detection reduced from 3.2 days to 22 minutes',
    claimedValue:'99.5% reduction', verifiedValue:'—', variance:'—', status:'Under review',
    validator:'Prof. Nandini Bose', validatedAt:null, evidenceCount:3,
    comments:'Awaiting final inspection report before certificate issuance.',
    kpis:[
      { name:'Mean time to detect', baseline:'3.2 days', startupReported:'22 min', verified:'—', status:'Pending' },
      { name:'Auto-detection share', baseline:'18%', startupReported:'91%', verified:'—', status:'Pending' },
      { name:'Pole coverage', baseline:'30%', startupReported:'93%', verified:'—', status:'Pending' }
    ]},
  { id:'VL-022', pilotId:'PL-022', startupClaim:'Ward-level AQI coverage increased from 3% to 94%',
    claimedValue:'94%', verifiedValue:'94%', variance:'0.0%', status:'Validated',
    validator:'Prof. Nandini Bose', validatedAt:'2026-08-06', evidenceCount:3,
    comments:'Verified against node registry and API logs.',
    kpis:[
      { name:'Ward AQI coverage', baseline:'3%', startupReported:'94%', verified:'94%', status:'Verified' },
      { name:'Correlation with reference', baseline:'—', startupReported:'0.91', verified:'0.91', status:'Verified' },
      { name:'Data uptime', baseline:'—', startupReported:'98.4%', verified:'98.4%', status:'Verified' }
    ]},
  { id:'VL-014', pilotId:'PL-014', startupClaim:'Water loss reduced by 40%',
    claimedValue:'40%', verifiedValue:'—', variance:'—', status:'Awaiting evidence',
    validator:'Prof. Nandini Bose', validatedAt:null, evidenceCount:2,
    comments:'KPI dataset under review.',
    kpis:[
      { name:'Water loss', baseline:'31.4%', startupReported:'18.7%', verified:'—', status:'Pending' },
      { name:'Response time', baseline:'48 h', startupReported:'13 h', verified:'—', status:'Pending' },
      { name:'Coverage', baseline:'55%', startupReported:'94%', verified:'—', status:'Pending' }
    ]}
];

export const SCALEUP_DECISIONS = [
  { id:'SD-022', pilotId:'PL-022', challengeId:'CH-022', status:'Pending',
    officer:null, decidedAt:null, decision:null, reason:null, evidenceRef:null,
    matrix:{ performance:'High', risk:'Medium', cost:'Medium', evidence:'High', scalability:'High' },
    recommendation:'Evidence supports multi-district scale-up. Cost per node is within benchmark.' }
];

export const TEMPLATES = [
  { id:'TP-01', name:'Problem Statement Template', version:'v2.1', updated:'2026-08-12', owner:'Innovation Cell', status:'Active', category:'Challenge' },
  { id:'TP-02', name:'Evaluation Rubric (Weighted)', version:'v3.0', updated:'2026-09-01', owner:'Innovation Cell', status:'Active', category:'Evaluation' },
  { id:'TP-03', name:'Pilot Agreement Template', version:'v1.8', updated:'2026-07-20', owner:'Legal Cell', status:'Active', category:'Contract' },
  { id:'TP-04', name:'Data Sharing Clause', version:'v2.0', updated:'2026-06-15', owner:'Legal Cell', status:'Active', category:'Contract' },
  { id:'TP-05', name:'IP Clause (Startup Retains IP)', version:'v2.2', updated:'2026-08-05', owner:'Legal Cell', status:'Active', category:'Contract' },
  { id:'TP-06', name:'Cybersecurity Checklist', version:'v1.4', updated:'2026-05-30', owner:'CISO Office', status:'Active', category:'Compliance' },
  { id:'TP-07', name:'Risk Assessment Framework', version:'v1.6', updated:'2026-07-10', owner:'Innovation Cell', status:'Active', category:'Compliance' },
  { id:'TP-08', name:'Validation Report Template', version:'v2.0', updated:'2026-09-10', owner:'Test Lab', status:'Active', category:'Validation' },
  { id:'TP-09', name:'Payment Milestone Template', version:'v1.5', updated:'2026-06-25', owner:'Finance Dept', status:'Active', category:'Payment' },
  { id:'TP-10', name:'Scale-up Decision Template', version:'v1.2', updated:'2026-08-28', owner:'Innovation Cell', status:'Active', category:'Scale-up' }
];

export const AUDIT_SEED = [
  { id:'AU-001', ts:'2026-09-20T09:12:00', user:'Meera Kulkarni', role:'Innovation Officer', action:'Challenge published', entity:'CH-018', details:'Challenge CH-018 published to discovery stage.' },
  { id:'AU-002', ts:'2026-09-21T11:45:00', user:'Dr. Arvind Rao', role:'Domain Expert', action:'Evaluation submitted', entity:'EV-018-1', details:'Scored AP-018-1 for CH-018.' },
  { id:'AU-003', ts:'2026-09-22T08:05:00', user:'Sana Iqbal', role:'Startup', action:'Evidence uploaded', entity:'EV-014-4', details:'Field photos uploaded for M3.' }
];

export const NOTIFICATIONS_SEED = [
  { id:'NT-01', ts:'2026-09-22T08:20:00', title:'CH-018 requires evaluation', body:'Application AP-018-2 has one pending evaluation.', type:'warning', read:false },
  { id:'NT-02', ts:'2026-09-22T08:15:00', title:'Milestone M3 evidence submitted', body:'Aquavirt Systems uploaded KPI dataset.', type:'info', read:false },
  { id:'NT-03', ts:'2026-09-22T07:50:00', title:'Payment awaiting approval', body:'M4 payment of ₹1,50,000 for CT-017.', type:'warning', read:false }
];

export const buildSeed = () => ({
  departments: structuredClone(DEPARTMENTS),
  challenges: structuredClone(CHALLENGES),
  startups: structuredClone(STARTUPS),
  applications: structuredClone(APPLICATIONS),
  evaluations: structuredClone(EVALUATIONS),
  pilots: structuredClone(PILOTS),
  contracts: structuredClone(CONTRACTS),
  evidence: structuredClone(EVIDENCE),
  payments: structuredClone(PAYMENTS),
  validations: structuredClone(VALIDATIONS),
  scaleup: structuredClone(SCALEUP_DECISIONS),
  templates: structuredClone(TEMPLATES),
  notifications: structuredClone(NOTIFICATIONS_SEED),
  audit: structuredClone(AUDIT_SEED),
  rubric: structuredClone(RUBRIC)
});