// Synthetic scenario for the "Community TB Care Continuity" demo
// (route: /demo/care-continuity). Every figure, cohort, district label and
// alert here is ILLUSTRATIVE. None of it is real programme or patient data.
// Districts are generic labels (District A, B...) on purpose.

export type Severity = 'high' | 'medium' | 'low';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  note: string;
  trend: 'up' | 'down' | 'flat';
  good: boolean; // whether the trend direction is good news
}

export interface Region {
  name: string;
  districts: number;
  cohort: number;
  adherence: number; // % of doses taken in last 4 weeks
}

export interface FundingLine {
  label: string;
  status: 'secured' | 'ending' | 'pending';
  detail: string;
}

export interface Stage {
  id: string;
  label: string;
  timing: string;
  retained: number; // illustrative people remaining out of 100 starting
  dropRisk: string;
  services: string[];
}

export interface Service {
  id: string;
  name: string;
  what: string;
}

export interface Alert {
  id: string;
  severity: Severity;
  category: 'Adherence' | 'Supply' | 'Mobility' | 'Funding';
  scope: string;
  signal: string;
  action: string;
  owner: string;
}

export interface Actor {
  id: string;
  name: string;
  short: string;
  ring: 'care' | 'community' | 'system';
  angle: number; // position on the ring, degrees (0 = top)
  role: string;
  responsibilities: string[];
}

export interface OutcomePoint {
  q: string;
  supported: number; // treatment success %, supported cohort
  comparison: number; // treatment success %, comparison cohort
}

export interface CostItem {
  label: string;
  value: number; // indicative USD per patient per treatment course
}

export const scenario = {
  title: 'Community TB Care Continuity',
  country: 'Kazakhstan',
  question: 'Securing sustainable domestic financing for community-based TB patient support',
  asOf: 'Illustrative quarter: Q3',

  kpis: [
    { id: 'cohort', label: 'Active supported cohort', value: '1,240', note: 'people on treatment receiving support', trend: 'up', good: true },
    { id: 'adherence', label: 'Doses taken (4 weeks)', value: '91%', note: 'up from 86% two quarters ago', trend: 'up', good: true },
    { id: 'ltfu', label: 'Loss to follow-up', value: '4.2%', note: 'of supported cohort this quarter', trend: 'down', good: true },
    { id: 'months', label: 'External funding left', value: '7 mo', note: 'before the current grant ends', trend: 'down', good: false },
  ] satisfies Kpi[],

  regions: [
    { name: 'Region North', districts: 4, cohort: 310, adherence: 93 },
    { name: 'Region South', districts: 5, cohort: 420, adherence: 88 },
    { name: 'Region East', districts: 3, cohort: 220, adherence: 92 },
    { name: 'Region West', districts: 3, cohort: 290, adherence: 90 },
  ] satisfies Region[],

  funding: [
    { label: 'External grant (psychosocial + vouchers)', status: 'ending', detail: 'Ends in 7 months; no renewal planned' },
    { label: 'Video-observed treatment platform', status: 'secured', detail: 'Covered by the national TB programme budget' },
    { label: 'Domestic social-contracting line', status: 'pending', detail: 'Budget decision expected next fiscal cycle' },
  ] satisfies FundingLine[],

  stages: [
    { id: 'dx', label: 'Diagnosis', timing: 'Week 0', retained: 100, dropRisk: 'Delay between diagnosis and first dose', services: ['navigator'] },
    { id: 'start', label: 'Treatment start', timing: 'Week 1', retained: 97, dropRisk: 'Fear, stigma, cost of first visits', services: ['navigator', 'psycho'] },
    { id: 'intensive', label: 'Intensive phase', timing: 'Months 1–2', retained: 93, dropRisk: 'Side effects; lost income', services: ['psycho', 'vouchers', 'vot'] },
    { id: 'continuation', label: 'Continuation phase', timing: 'Months 3–6', retained: 89, dropRisk: 'Feeling well, seasonal migration', services: ['vot', 'vouchers', 'navigator'] },
    { id: 'done', label: 'Completion', timing: 'Month 6+', retained: 87, dropRisk: 'Missed final review', services: ['navigator'] },
  ] satisfies Stage[],

  // Comparison line for the journey chart: retention without community support.
  unsupportedRetained: [100, 94, 86, 78, 74],

  services: [
    { id: 'psycho', name: 'Psychosocial support', what: 'Counselling and peer groups to manage stigma, fear and side effects.' },
    { id: 'vouchers', name: 'Transport and food vouchers', what: 'Covers travel to the dispensary and offsets lost income.' },
    { id: 'vot', name: 'Video-observed treatment', what: 'Daily doses observed by smartphone instead of a clinic visit.' },
    { id: 'navigator', name: 'Peer navigators', what: 'Former patients who accompany people through each step.' },
  ] satisfies Service[],

  alerts: [
    { id: 'AL-01', severity: 'high', category: 'Funding', scope: 'All regions', signal: 'Psychosocial and voucher services lose external funding in 7 months.', action: 'Prepare a costed brief for the domestic budget decision.', owner: 'Programme coordinator' },
    { id: 'AL-02', severity: 'high', category: 'Adherence', scope: 'Region South · District C', signal: 'Missed doses rose from 6% to 13% in four weeks (cohort of 85).', action: 'Add a peer-navigator day; review voucher delivery.', owner: 'NGO case management' },
    { id: 'AL-03', severity: 'medium', category: 'Supply', scope: 'Region West · District B', signal: 'Stock of one continuation-phase medicine covers about 5 weeks.', action: 'Flag to the TB dispensary for redistribution.', owner: 'TB dispensary' },
    { id: 'AL-04', severity: 'medium', category: 'Mobility', scope: 'Region South · Districts A, D', signal: 'Seasonal labour migration expected; about 40 people may relocate.', action: 'Pre-arrange VOT and referral to the receiving district.', owner: 'Peer network' },
    { id: 'AL-05', severity: 'low', category: 'Adherence', scope: 'Region North · District A', signal: 'VOT connection failures up slightly in rural areas.', action: 'Offer offline recording; check data top-ups.', owner: 'VOT support desk' },
    { id: 'AL-06', severity: 'low', category: 'Funding', scope: 'Region East', signal: 'Akimat social-services co-funding letter not yet renewed.', action: 'Schedule meeting with local social services.', owner: 'Programme coordinator' },
  ] satisfies Alert[],

  actors: [
    { id: 'phc', name: 'Primary health care', short: 'Primary care', ring: 'care', angle: 0, role: 'First contact and referral', responsibilities: ['Screens and refers people with symptoms', 'Supports follow-up close to home'] },
    { id: 'disp', name: 'TB dispensaries', short: 'TB dispensary', ring: 'care', angle: 120, role: 'Clinical treatment and medicines', responsibilities: ['Confirms diagnosis and prescribes treatment', 'Manages medicine stock and side effects'] },
    { id: 'ngo', name: 'NGOs and peer networks', short: 'NGOs / peers', ring: 'care', angle: 240, role: 'Community support around the patient', responsibilities: ['Run peer navigation and psychosocial support', 'Deliver vouchers and track continuity signals'] },
    { id: 'ntc', name: 'National TB centre', short: 'National TB centre', ring: 'system', angle: 30, role: 'Clinical standards and surveillance', responsibilities: ['Sets treatment protocols', 'Runs the national TB register and VOT platform'] },
    { id: 'akimat', name: 'Local akimat social services', short: 'Akimat social services', ring: 'system', angle: 150, role: 'Local social protection', responsibilities: ['Co-funds food and transport support', 'Can contract NGOs through social procurement'] },
    { id: 'moh', name: 'Ministry of Health', short: 'Ministry of Health', ring: 'system', angle: 210, role: 'Policy and budget holder', responsibilities: ['Decides domestic financing lines', 'Sets rules for state social contracting'] },
    { id: 'funders', name: 'External funders', short: 'Funders', ring: 'system', angle: 330, role: 'Transitional financing', responsibilities: ['Fund community services today', 'Plan their exit as domestic funding grows'] },
  ] satisfies Actor[],

  outcomes: [
    { q: 'Q1 Y1', supported: 78, comparison: 74 },
    { q: 'Q2 Y1', supported: 80, comparison: 74 },
    { q: 'Q3 Y1', supported: 83, comparison: 75 },
    { q: 'Q4 Y1', supported: 84, comparison: 74 },
    { q: 'Q1 Y2', supported: 86, comparison: 75 },
    { q: 'Q2 Y2', supported: 87, comparison: 76 },
    { q: 'Q3 Y2', supported: 88, comparison: 75 },
  ] satisfies OutcomePoint[],

  costs: [
    { label: 'Peer navigation', value: 70 },
    { label: 'Psychosocial support', value: 55 },
    { label: 'Transport and food vouchers', value: 120 },
    { label: 'Video-observed treatment', value: 35 },
  ] satisfies CostItem[],

  evidence: [
    'In this illustrative scenario, supported patients complete treatment more often than the comparison cohort (88% vs 75%).',
    'The indicative cost of support is small next to the cost of retreating someone who stops treatment.',
    'Most of the support package depends on an external grant that ends within a year.',
    'A domestic social-contracting line would let akimats and the Ministry fund NGOs directly.',
  ],
};

export type Scenario = typeof scenario;
