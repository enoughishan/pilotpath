export const STATE = {
  name: 'Maharashtra',
  nameMr: 'महाराष्ट्र',
  districts: [
    { id: 'PUN', name: 'Pune', nameMr: 'पुणे' },
    { id: 'MUM', name: 'Mumbai City', nameMr: 'मुंबई शहर' },
    { id: 'MSU', name: 'Mumbai Suburban', nameMr: 'मुंबई उपनगर' },
    { id: 'NGP', name: 'Nagpur', nameMr: 'नागपूर' },
    { id: 'NSK', name: 'Nashik', nameMr: 'नाशिक' },
    { id: 'THN', name: 'Thane', nameMr: 'ठाणे' },
    { id: 'AUR', name: 'Aurangabad', nameMr: 'औरंगाबाद' },
    { id: 'SOL', name: 'Solapur', nameMr: 'सोलापूर' },
    { id: 'KOL', name: 'Kolhapur', nameMr: 'कोल्हापूर' },
    { id: 'AMR', name: 'Amravati', nameMr: 'अमरावती' },
    { id: 'NRD', name: 'Nanded', nameMr: 'नांदेड' },
    { id: 'SAT', name: 'Satara', nameMr: 'सातारा' }
  ]
};

export const DEPARTMENTS = [
  { id: 'UDD', name: 'Urban Development Department', nameMr: 'नगरविकास विभाग', short: 'UDD' },
  { id: 'PWD', name: 'Public Works Department', nameMr: 'सार्वजनिक बांधकाम विभाग', short: 'PWD' },
  { id: 'WRD', name: 'Water Resources Department', nameMr: 'जलसंपदा विभाग', short: 'WRD' },
  { id: 'PHD', name: 'Public Health Department', nameMr: 'सार्वजनिक आरोग्य विभाग', short: 'PHD' },
  { id: 'MED', name: 'Medical Education & Drugs', nameMr: 'वैद्यकीय शिक्षण विभाग', short: 'MED' },
  { id: 'SED', name: 'School Education Department', nameMr: 'शालेय शिक्षण विभाग', short: 'SED' },
  { id: 'HED', name: 'Higher & Technical Education', nameMr: 'उच्च व तंत्र शिक्षण विभाग', short: 'HED' },
  { id: 'TRP', name: 'Transport Department', nameMr: 'वाहतूक विभाग', short: 'TRP' },
  { id: 'AGR', name: 'Agriculture Department', nameMr: 'कृषी विभाग', short: 'AGR' },
  { id: 'ENE', name: 'Energy Department', nameMr: 'ऊर्जा विभाग', short: 'ENE' },
  { id: 'ENV', name: 'Environment Department', nameMr: 'पर्यावरण विभाग', short: 'ENV' },
  { id: 'ITD', name: 'Information Technology Directorate', nameMr: 'माहिती तंत्रज्ञान संचालनालय', short: 'ITD' }
];

export const ROLES = [
  {
    id: 'officer',
    name: 'Innovation Officer',
    nameMr: 'नवोन्मेष अधिकारी',
    desc: 'Create challenges, review evaluations, approve pilots and scale-up decisions',
    icon: 'building'
  },
  {
    id: 'evaluator',
    name: 'Domain Expert / Evaluator',
    nameMr: 'क्षेत्र तज्ञ / मूल्यांकनकर्ता',
    desc: 'Score applications against the weighted rubric and submit evaluations',
    icon: 'evaluation'
  },
  {
    id: 'validator',
    name: 'Principal Validator',
    nameMr: 'प्रमुख प्रमाणक',
    desc: 'Independently verify pilot KPIs and issue validation certificates',
    icon: 'award'
  },
  {
    id: 'accounts',
    name: 'Accounts Officer',
    nameMr: 'लेखा अधिकारी',
    desc: 'Verify milestone evidence and approve milestone-linked payments',
    icon: 'payment'
  }
];

export const DEMO_USERS = {
  officer:  { name: 'Meera Kulkarni',  email: 'meera.kulkarni@maharashtra.gov.in',  designation: 'Joint Director, Innovation Cell' },
  evaluator:{ name: 'Dr. Arvind Rao',  email: 'arvind.rao@maharashtra.gov.in',     designation: 'Domain Expert Panel' },
  validator:{ name: 'Prof. Nandini Bose', email: 'nandini.bose@maharashtra.gov.in', designation: 'Principal Validator, State Test Lab' },
  accounts: { name: 'Rakesh Menon',    email: 'rakesh.menon@maharashtra.gov.in',    designation: 'Accounts Officer, Finance Dept' }
};

export const DEMO_STARTUP = {
  name: 'Sana Iqbal',
  email: 'sana@aquavirt.in',
  company: 'Aquavirt Systems Pvt. Ltd.',
  designation: 'Co-founder & CEO'
};