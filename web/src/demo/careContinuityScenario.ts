// Stub data for the "Community TB Care Continuity" demo app
// (route: /demo/care-continuity, components in ./cc/).
//
// EVERYTHING HERE IS SYNTHETIC. Figures, cohorts, districts, alerts, cases,
// costs and comments are illustrative placeholders for a demo. There are no
// real patients, no real people and no real programme data. District labels
// are generic on purpose ("Region South · District C").
//
// The file is the single source of truth for the demo, so answers from a
// real conversation can be swapped in later without touching the components.
// Sections:
//   1. Types
//   2. Meta and time axis
//   3. KPIs and national trend
//   4. Regions and districts
//   5. Services, journey stages, funding
//   6. Alerts
//   7. Synthetic cases (+ deterministic generators for timelines/heatmaps)
//   8. Notifications
//   9. Service map (actors, edges, pathways)
//  10. Impact, costs, evidence pack

// ───────────────────────────── 1. Types ─────────────────────────────

export type Severity = 'high' | 'medium' | 'low';
export type AlertType = 'missed-doses' | 'stock-out' | 'migration' | 'funding-gap';
export type AlertStatus = 'new' | 'acknowledged' | 'assigned' | 'resolved';
export type RiskLevel = 'high' | 'medium' | 'low';
export type Phase = 'start' | 'intensive' | 'continuation' | 'completion';
export type ServiceId = 'psycho' | 'vouchers' | 'vot' | 'navigator';
export type CaseStatus = 'active' | 'follow-up' | 'paused' | 'completed' | 'transferred';
export type RegionId = 'rg-north' | 'rg-south' | 'rg-east' | 'rg-west';

export interface Kpi {
  id: 'cohort' | 'adherence' | 'ltfu' | 'funding';
  label: string;
  value: number;
  format: 'int' | 'pct' | 'pct1' | 'months';
  delta: string; // short change label shown on the tile
  deltaGood: boolean; // whether the change is good news
  note: string;
  spark: number[]; // 12 monthly points, oldest first
}

export interface Region {
  id: RegionId;
  name: string; // "Region South"
  short: string; // "South"
  setting: string;
}

export interface District {
  id: string; // "ds-south-c"
  regionId: RegionId;
  letter: string; // "C"
  setting: 'Urban' | 'Peri-urban' | 'Rural' | 'Remote rural';
  cohort: number; // people on treatment receiving community support
  adherence: number[]; // % doses taken, 12 monthly points, oldest first
  ltfu: number; // loss to follow-up, % of cohort this quarter
  workers: number; // outreach workers (peer navigators, nurses, social workers)
  capacityPerWorker: number; // recommended max caseload per worker
  serviceShare: Record<ServiceId, number>; // share of cohort using each service (0–1)
  note: string;
}

export interface Service {
  id: ServiceId;
  name: string;
  short: string;
  what: string;
  provider: string;
  fundedBy: string; // funding line id
  costPerPatient: number; // indicative USD per treatment course
  stages: Phase[] | 'all';
}

export interface StageServiceStat {
  serviceId: ServiceId;
  enrolled: number; // people in this stage using the service (aggregated)
  effect: string; // aggregated, illustrative
}

export interface Stage {
  id: 'dx' | Phase;
  label: string;
  timing: string;
  retained: number; // of 100 who start, still on treatment (supported cohort)
  retainedUnsupported: number; // comparison cohort, no community support
  inStage: number; // people currently in this stage (aggregated)
  medianDays: number;
  dropRisk: string;
  reasons: { label: string; share: number }[]; // why people drop out here (%, sums to 100)
  services: StageServiceStat[];
}

export interface FundingLine {
  id: string;
  label: string;
  source: string;
  status: 'secured' | 'ending' | 'pending';
  annualUsd: number; // indicative
  monthsLeft: number | null;
  detail: string;
}

export interface SignalSeries {
  label: string;
  unit: string; // '%', ' weeks', ' people'
  points: string[];
  values: number[];
  threshold: number;
  breach: 'above' | 'below'; // which side of the threshold is bad
}

export interface Comment {
  id: string;
  author: string; // role, never a name
  ago: string;
  text: string;
}

export interface Alert {
  id: string; // "al-3"
  severity: Severity;
  type: AlertType;
  title: string;
  scope: string;
  regionId: RegionId | null;
  districtIds: string[];
  detectedDaysAgo: number;
  summary: string;
  signal: SignalSeries;
  affected: { people: number; note: string; breakdown: { label: string; value: number }[] };
  actions: string[];
  suggestedOwner: string;
  status: AlertStatus;
  assignee: string | null;
  comments: Comment[];
}

export interface CaseRecord {
  id: string; // "SYN-0142"
  ageBand: string;
  districtId: string;
  phase: Phase;
  month: number; // month of treatment
  regimen: 'Drug-susceptible' | 'Drug-resistant';
  risk: RiskLevel;
  adherence: number; // % doses taken, last 8 weeks
  lastContact: string; // ISO date
  nextFollowUp: string | null; // ISO date
  worker: string; // outreach worker ROLE, never a name
  services: ServiceId[];
  status: CaseStatus;
  flags: string[];
}

export type ContactChannel = 'Home visit' | 'Phone call' | 'VOT check-in' | 'Dispensary visit' | 'Peer group' | 'Note';

export interface ContactEntry {
  id: string;
  date: string; // ISO date
  channel: ContactChannel;
  by: string; // role
  text: string;
  outcome?: 'reached' | 'not-reached' | 'escalated';
}

export type DoseDay = 'taken' | 'missed' | 'none';

export interface Notification {
  id: string;
  text: string;
  ago: string;
  view: ViewId;
  item?: string;
  tone: 'alert' | 'case' | 'info';
}

export interface Actor {
  id: string; // "ac-ngo"
  name: string;
  short: string;
  ring: 'care' | 'system';
  angle: number; // degrees, 0 = top
  role: string;
  responsibilities: string[];
  contacts: { label: string; how: string }[];
}

export interface Edge {
  id: string;
  from: string; // actor id or 'patient'
  to: string;
  kind: 'referral' | 'support' | 'funding' | 'policy' | 'data';
  label: string;
}

export interface Pathway {
  id: string;
  label: string;
  description: string;
  edges: string[];
}

export interface OutcomePoint {
  q: string;
  supported: number; // treatment success %, supported cohort
  comparison: number; // treatment success %, comparison cohort
}

export interface CostItem {
  id: string;
  label: string;
  value: number; // indicative USD per patient per treatment course
}

export type ViewId = 'overview' | 'regions' | 'journey' | 'caseload' | 'alerts' | 'map' | 'impact';

// ───────────────────────── 2. Meta and time axis ─────────────────────────

export const meta = {
  hub: 'EECA Hub',
  product: 'Care Continuity',
  title: 'Community TB Care Continuity',
  scenario: 'Kazakhstan · community TB support',
  country: 'Kazakhstan',
  question: 'Securing sustainable domestic financing for community-based TB patient support',
  asOf: '2026-10-15',
  asOfLabel: '15 Oct 2026',
  period: 'Last 12 months',
  user: {
    initials: 'PC',
    role: 'NGO programme coordinator (demo user)',
    org: 'Partner NGO (fictional)',
  },
  banner: 'Demo with synthetic data. No real patients, figures or alerts.',
};

export const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

// ───────────────────── 3. KPIs and national trend ─────────────────────

export const kpis: Kpi[] = [
  {
    id: 'cohort', label: 'Active supported cohort', value: 1240, format: 'int',
    delta: '+96 vs 3 mo', deltaGood: true, note: 'people on treatment receiving community support',
    spark: [1012, 1030, 1058, 1071, 1090, 1104, 1121, 1144, 1162, 1181, 1215, 1240],
  },
  {
    id: 'adherence', label: 'Doses taken', value: 91, format: 'pct',
    delta: '+5 pts vs 6 mo', deltaGood: true, note: 'share of scheduled doses taken, last 4 weeks',
    spark: [85, 86, 86, 87, 86, 88, 89, 89, 90, 91, 91, 91],
  },
  {
    id: 'ltfu', label: 'Loss to follow-up', value: 4.2, format: 'pct1',
    delta: '−1.6 pts vs 6 mo', deltaGood: true, note: 'of the supported cohort this quarter',
    spark: [6.1, 6.0, 5.9, 5.8, 5.6, 5.4, 5.1, 4.9, 4.7, 4.5, 4.4, 4.2],
  },
  {
    id: 'funding', label: 'External funding left', value: 7, format: 'months',
    delta: 'Grant ends May 2027', deltaGood: false, note: 'before the psychosocial and voucher grant ends',
    spark: [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7],
  },
];

/** National share of doses taken, plus the comparison cohort without community support. */
export const adherenceTrend = {
  supported: [85, 86, 86, 87, 86, 88, 89, 89, 90, 91, 91, 91],
  comparison: [80, 80, 79, 80, 79, 80, 81, 80, 80, 81, 80, 80],
  target: 90,
};

// ───────────────────── 4. Regions and districts ─────────────────────

export const regions: Region[] = [
  { id: 'rg-north', name: 'Region North', short: 'North', setting: 'Mixed urban and rural; long winter travel times' },
  { id: 'rg-south', name: 'Region South', short: 'South', setting: 'Densely populated; seasonal labour migration' },
  { id: 'rg-east', name: 'Region East', short: 'East', setting: 'Industrial towns; akimat co-funding in place' },
  { id: 'rg-west', name: 'Region West', short: 'West', setting: 'Remote settlements; flood-prone roads in spring' },
];

/** Builds a 12-point monthly series that moves from `start` to `end` with a small fixed wobble. */
function trend(start: number, end: number, wobble: number[] = [0, 0.6, -0.4, 0.3, -0.5, 0.4, -0.2, 0.5, -0.3, 0.2, 0, 0]): number[] {
  return months.map((_, i) => Math.round((start + ((end - start) * i) / 11 + wobble[i]) * 10) / 10);
}

const share = (psycho: number, vouchers: number, vot: number, navigator: number): Record<ServiceId, number> => ({ psycho, vouchers, vot, navigator });

export const districts: District[] = [
  { id: 'ds-north-a', regionId: 'rg-north', letter: 'A', setting: 'Rural', cohort: 88, adherence: trend(86, 91), ltfu: 4.1, workers: 4, capacityPerWorker: 25, serviceShare: share(0.36, 0.62, 0.71, 0.8), note: 'VOT connection failures rising in outlying villages.' },
  { id: 'ds-north-b', regionId: 'rg-north', letter: 'B', setting: 'Urban', cohort: 74, adherence: trend(89, 94), ltfu: 2.7, workers: 4, capacityPerWorker: 25, serviceShare: share(0.44, 0.48, 0.66, 0.77), note: 'Strong peer group; used as a training site.' },
  { id: 'ds-north-c', regionId: 'rg-north', letter: 'C', setting: 'Peri-urban', cohort: 81, adherence: trend(88, 93), ltfu: 3.2, workers: 4, capacityPerWorker: 25, serviceShare: share(0.39, 0.57, 0.6, 0.82), note: 'Stable; voucher delivery on schedule.' },
  { id: 'ds-north-d', regionId: 'rg-north', letter: 'D', setting: 'Urban', cohort: 67, adherence: trend(90, 95), ltfu: 2.4, workers: 3, capacityPerWorker: 25, serviceShare: share(0.42, 0.45, 0.74, 0.79), note: 'Highest share of video-observed treatment.' },
  { id: 'ds-south-a', regionId: 'rg-south', letter: 'A', setting: 'Peri-urban', cohort: 118, adherence: trend(84, 89), ltfu: 5.1, workers: 5, capacityPerWorker: 25, serviceShare: share(0.41, 0.72, 0.52, 0.84), note: 'Seasonal migration expected before winter.' },
  { id: 'ds-south-b', regionId: 'rg-south', letter: 'B', setting: 'Urban', cohort: 96, adherence: trend(87, 91), ltfu: 3.9, workers: 4, capacityPerWorker: 25, serviceShare: share(0.38, 0.6, 0.63, 0.78), note: 'Dispensary and NGO share a weekly case review.' },
  { id: 'ds-south-c', regionId: 'rg-south', letter: 'C', setting: 'Rural', cohort: 85, adherence: [88, 88, 87, 88, 87, 88, 88, 87, 87, 86, 84, 81], ltfu: 6.8, workers: 3, capacityPerWorker: 25, serviceShare: share(0.33, 0.74, 0.41, 0.86), note: 'One peer navigator post vacant since August; voucher delivery delayed.' },
  { id: 'ds-south-d', regionId: 'rg-south', letter: 'D', setting: 'Rural', cohort: 121, adherence: trend(83, 87), ltfu: 5.6, workers: 5, capacityPerWorker: 25, serviceShare: share(0.35, 0.76, 0.48, 0.83), note: 'Large share of seasonal workers in the cohort.' },
  { id: 'ds-east-a', regionId: 'rg-east', letter: 'A', setting: 'Urban', cohort: 84, adherence: trend(88, 93), ltfu: 3.0, workers: 4, capacityPerWorker: 25, serviceShare: share(0.46, 0.55, 0.68, 0.76), note: 'Akimat co-funds food vouchers.' },
  { id: 'ds-east-b', regionId: 'rg-east', letter: 'B', setting: 'Peri-urban', cohort: 71, adherence: trend(87, 92), ltfu: 3.4, workers: 3, capacityPerWorker: 25, serviceShare: share(0.4, 0.58, 0.62, 0.8), note: 'Several transfers to a neighbouring oblast this quarter.' },
  { id: 'ds-east-c', regionId: 'rg-east', letter: 'C', setting: 'Rural', cohort: 65, adherence: trend(86, 90), ltfu: 3.8, workers: 3, capacityPerWorker: 25, serviceShare: share(0.37, 0.69, 0.5, 0.81), note: 'Food-voucher stock running low.' },
  { id: 'ds-west-a', regionId: 'rg-west', letter: 'A', setting: 'Urban', cohort: 102, adherence: [86, 87, 88, 88, 89, 90, 91, 91, 92, 92, 91, 91], ltfu: 3.6, workers: 4, capacityPerWorker: 25, serviceShare: share(0.43, 0.59, 0.64, 0.79), note: 'Intensive-phase missed doses ticking up.' },
  { id: 'ds-west-b', regionId: 'rg-west', letter: 'B', setting: 'Remote rural', cohort: 97, adherence: trend(85, 89), ltfu: 4.4, workers: 4, capacityPerWorker: 22, serviceShare: share(0.31, 0.71, 0.45, 0.85), note: 'Continuation-phase medicine stock low at the dispensary.' },
  { id: 'ds-west-c', regionId: 'rg-west', letter: 'C', setting: 'Remote rural', cohort: 91, adherence: trend(86, 90), ltfu: 4.9, workers: 3, capacityPerWorker: 22, serviceShare: share(0.29, 0.73, 0.39, 0.88), note: 'Road access cut in places after autumn flooding.' },
];

// ───────────────── 5. Services, journey stages, funding ─────────────────

export const services: Service[] = [
  { id: 'psycho', name: 'Psychosocial support', short: 'Psychosocial', what: 'Counselling and peer groups to manage stigma, fear and side effects.', provider: 'NGO psychologists and peer groups', fundedBy: 'f-grant', costPerPatient: 55, stages: ['start', 'intensive', 'continuation'] },
  { id: 'vouchers', name: 'Transport and food vouchers', short: 'Vouchers', what: 'Covers travel to the dispensary and offsets lost income during treatment.', provider: 'NGO case management, with akimat co-funding in two regions', fundedBy: 'f-grant', costPerPatient: 120, stages: ['intensive', 'continuation'] },
  { id: 'vot', name: 'Video-observed treatment', short: 'VOT', what: 'Daily doses observed by smartphone instead of a daily clinic visit.', provider: 'National TB centre platform, supported by NGO outreach', fundedBy: 'f-vot', costPerPatient: 35, stages: ['intensive', 'continuation'] },
  { id: 'navigator', name: 'Peer navigators', short: 'Navigators', what: 'Former patients who accompany people through each step of care.', provider: 'Peer network, coordinated by the NGO', fundedBy: 'f-grant', costPerPatient: 70, stages: 'all' },
];

export const stages: Stage[] = [
  {
    id: 'dx', label: 'Diagnosis', timing: 'Week 0', retained: 100, retainedUnsupported: 100, inStage: 46, medianDays: 4,
    dropRisk: 'Delay between diagnosis and the first dose',
    reasons: [{ label: 'Did not return for results', share: 46 }, { label: 'Fear and stigma', share: 31 }, { label: 'Travel cost', share: 23 }],
    services: [{ serviceId: 'navigator', enrolled: 41, effect: 'Median 3 days to first dose with a navigator vs 9 without' }],
  },
  {
    id: 'start', label: 'Treatment start', timing: 'Week 1', retained: 97, retainedUnsupported: 94, inStage: 58, medianDays: 7,
    dropRisk: 'Fear, stigma and the cost of the first visits',
    reasons: [{ label: 'Fear and stigma', share: 42 }, { label: 'Cost of first visits', share: 35 }, { label: 'Side effects', share: 23 }],
    services: [
      { serviceId: 'navigator', enrolled: 55, effect: '97 of 100 start treatment with support vs 94 without' },
      { serviceId: 'psycho', enrolled: 31, effect: 'First counselling session within 7 days for 84%' },
    ],
  },
  {
    id: 'intensive', label: 'Intensive phase', timing: 'Months 1–2', retained: 93, retainedUnsupported: 86, inStage: 412, medianDays: 61,
    dropRisk: 'Side effects and lost income',
    reasons: [{ label: 'Side effects', share: 38 }, { label: 'Lost income', share: 33 }, { label: 'Travel to dispensary', share: 17 }, { label: 'Alcohol or substance use', share: 12 }],
    services: [
      { serviceId: 'psycho', enrolled: 168, effect: 'Doses taken 92% with counselling vs 84% without' },
      { serviceId: 'vouchers', enrolled: 281, effect: 'Missed dispensary visits halved where vouchers arrive on time' },
      { serviceId: 'vot', enrolled: 236, effect: '9 of 10 doses observed remotely' },
      { serviceId: 'navigator', enrolled: 338, effect: 'Weekly contact for 88% of people in this phase' },
    ],
  },
  {
    id: 'continuation', label: 'Continuation phase', timing: 'Months 3–6', retained: 89, retainedUnsupported: 78, inStage: 684, medianDays: 122,
    dropRisk: 'Feeling well, seasonal migration',
    reasons: [{ label: 'Feels well and stops', share: 36 }, { label: 'Seasonal migration', share: 29 }, { label: 'Lost income', share: 21 }, { label: 'Lost contact', share: 14 }],
    services: [
      { serviceId: 'vot', enrolled: 392, effect: 'Video observation keeps people on treatment when they travel' },
      { serviceId: 'vouchers', enrolled: 446, effect: 'Food vouchers linked to 6-point lower drop-out' },
      { serviceId: 'navigator', enrolled: 551, effect: 'Referral to the receiving district for 31 of 34 movers' },
      { serviceId: 'psycho', enrolled: 214, effect: 'Peer groups cut early stopping by about a third' },
    ],
  },
  {
    id: 'completion', label: 'Completion', timing: 'Month 6+', retained: 87, retainedUnsupported: 74, inStage: 40, medianDays: 14,
    dropRisk: 'Missed final review',
    reasons: [{ label: 'Missed final review', share: 58 }, { label: 'Moved away', share: 27 }, { label: 'Lost contact', share: 15 }],
    services: [{ serviceId: 'navigator', enrolled: 38, effect: 'Final review attended by 95% with a navigator reminder' }],
  },
];

export const funding: FundingLine[] = [
  { id: 'f-grant', label: 'External grant: psychosocial support and vouchers', source: 'International funder (transitional)', status: 'ending', annualUsd: 310000, monthsLeft: 7, detail: 'Ends May 2027. No renewal planned; the funder expects a domestic transition.' },
  { id: 'f-vot', label: 'Video-observed treatment platform', source: 'National TB programme budget', status: 'secured', annualUsd: 45000, monthsLeft: null, detail: 'Included in the national programme budget.' },
  { id: 'f-akimat', label: 'Akimat co-funding for food vouchers (East, North)', source: 'Local akimat social services', status: 'pending', annualUsd: 38000, monthsLeft: 2, detail: 'Renewal letter for Region East not yet signed.' },
  { id: 'f-social', label: 'Domestic social-contracting line', source: 'Ministry of Health / state social order', status: 'pending', annualUsd: 0, monthsLeft: null, detail: 'Budget decision expected in the next fiscal cycle.' },
];

// ───────────────────────────── 6. Alerts ─────────────────────────────

const weeks8 = ['W35', 'W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42'];

export const alerts: Alert[] = [
  {
    id: 'al-1', severity: 'high', type: 'funding-gap', title: 'External grant for psychosocial support and vouchers ends in 7 months',
    scope: 'All regions', regionId: null, districtIds: [], detectedDaysAgo: 3,
    summary: 'Three of the four support services depend on a grant that ends in May 2027. Without a domestic line, about 1,000 people would lose vouchers and counselling mid-treatment.',
    signal: { label: 'Months of external funding left', unit: ' mo', points: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov*', 'Dec*'], values: [12, 11, 10, 9, 8, 7, 6, 5], threshold: 9, breach: 'below' },
    affected: { people: 1012, note: 'People currently using a grant-funded service', breakdown: [{ label: 'Vouchers', value: 798 }, { label: 'Peer navigators', value: 1012 }, { label: 'Psychosocial', value: 471 }] },
    actions: ['Prepare a costed brief for the domestic budget decision', 'Share the evidence pack with the parliamentary committee', 'Agree a bridge with akimats in the two most affected regions'],
    suggestedOwner: 'Programme coordinator', status: 'acknowledged', assignee: 'Programme coordinator',
    comments: [
      { id: 'c1', author: 'Programme coordinator', ago: '3 days ago', text: 'Funder confirmed no renewal. Starting the costing with indicative figures.' },
      { id: 'c2', author: 'Finance officer', ago: '2 days ago', text: 'I can share the per-service cost breakdown by Friday.' },
    ],
  },
  {
    id: 'al-2', severity: 'high', type: 'missed-doses', title: 'Missed doses doubled in four weeks',
    scope: 'Region South · District C', regionId: 'rg-south', districtIds: ['ds-south-c'], detectedDaysAgo: 1,
    summary: 'Missed doses rose from 6% to 13% of scheduled doses. The rise follows a vacant peer-navigator post and late voucher delivery.',
    signal: { label: 'Missed doses, % of scheduled', unit: '%', points: weeks8, values: [6.0, 5.8, 6.4, 6.1, 7.9, 9.6, 11.8, 13.1], threshold: 10, breach: 'above' },
    affected: { people: 85, note: '11 people missed 3 or more doses in the last 14 days', breakdown: [{ label: 'Intensive phase', value: 29 }, { label: 'Continuation', value: 51 }, { label: 'Other', value: 5 }] },
    actions: ['Add a temporary peer-navigator day from District B', 'Check voucher delivery dates with the case manager', 'Call the 11 people with 3+ missed doses this week'],
    suggestedOwner: 'NGO case manager', status: 'new', assignee: null,
    comments: [{ id: 'c1', author: 'Peer navigator 3', ago: '1 day ago', text: 'Two people told me the vouchers arrived two weeks late. They could not pay for the bus.' }],
  },
  {
    id: 'al-3', severity: 'medium', type: 'stock-out', title: 'Continuation-phase medicine covers about 5 weeks',
    scope: 'Region West · District B', regionId: 'rg-west', districtIds: ['ds-west-b'], detectedDaysAgo: 4,
    summary: 'Dispensary stock of one continuation-phase medicine is below the 8-week safety level. A redistribution from Region West · District A is possible.',
    signal: { label: 'Weeks of stock on hand', unit: ' wk', points: weeks8, values: [14, 13, 11, 10, 9, 7, 6, 5], threshold: 8, breach: 'below' },
    affected: { people: 58, note: 'People in the continuation phase in this district', breakdown: [{ label: 'Continuation', value: 58 }] },
    actions: ['Flag to the TB dispensary for redistribution', 'Confirm the next central delivery date', 'Tell peer navigators what to say if doses change'],
    suggestedOwner: 'TB dispensary', status: 'assigned', assignee: 'TB dispensary pharmacist',
    comments: [{ id: 'c1', author: 'TB dispensary pharmacist', ago: '2 days ago', text: 'Redistribution request sent. Waiting for confirmation.' }],
  },
  {
    id: 'al-4', severity: 'medium', type: 'migration', title: 'Seasonal labour migration: about 40 people may relocate',
    scope: 'Region South · Districts A and D', regionId: 'rg-south', districtIds: ['ds-south-a', 'ds-south-d'], detectedDaysAgo: 6,
    summary: 'Peer navigators report that about 40 people plan to travel for seasonal work before winter. Most are in the continuation phase.',
    signal: { label: 'People reporting planned travel', unit: '', points: weeks8, values: [4, 6, 9, 14, 19, 26, 33, 40], threshold: 20, breach: 'above' },
    affected: { people: 40, note: 'Reported by peer navigators (aggregated)', breakdown: [{ label: 'District A', value: 17 }, { label: 'District D', value: 23 }] },
    actions: ['Pre-arrange video-observed treatment before departure', 'Send referral to the receiving district', 'Give a 2-week medicine buffer where the protocol allows'],
    suggestedOwner: 'Peer network', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-5', severity: 'low', type: 'missed-doses', title: 'VOT connection failures up in rural areas',
    scope: 'Region North · District A', regionId: 'rg-north', districtIds: ['ds-north-a'], detectedDaysAgo: 8,
    summary: 'Failed video uploads rose from 3% to 6%. Doses are probably taken but not observed.',
    signal: { label: 'Failed video uploads, %', unit: '%', points: weeks8, values: [3.0, 3.4, 3.1, 4.2, 4.8, 5.1, 5.6, 6.0], threshold: 5, breach: 'above' },
    affected: { people: 62, note: 'People on video-observed treatment in this district', breakdown: [{ label: 'Intensive', value: 21 }, { label: 'Continuation', value: 41 }] },
    actions: ['Offer offline recording with later upload', 'Check mobile data top-ups', 'Ask the VOT support desk about the new app version'],
    suggestedOwner: 'VOT support desk', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-6', severity: 'low', type: 'funding-gap', title: 'Akimat co-funding letter not yet renewed',
    scope: 'Region East', regionId: 'rg-east', districtIds: ['ds-east-a', 'ds-east-b', 'ds-east-c'], detectedDaysAgo: 12,
    summary: 'The akimat social-services co-funding for food vouchers expires in 8 weeks. The renewal letter is not signed yet.',
    signal: { label: 'Weeks until co-funding expires', unit: ' wk', points: weeks8, values: [15, 14, 13, 12, 11, 10, 9, 8], threshold: 10, breach: 'below' },
    affected: { people: 129, note: 'People receiving akimat-funded food vouchers', breakdown: [{ label: 'District A', value: 46 }, { label: 'District B', value: 41 }, { label: 'District C', value: 42 }] },
    actions: ['Schedule a meeting with local social services', 'Share district outcome figures with the akimat'],
    suggestedOwner: 'Programme coordinator', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-7', severity: 'medium', type: 'missed-doses', title: 'Intensive-phase missed doses rising',
    scope: 'Region West · District A', regionId: 'rg-west', districtIds: ['ds-west-a'], detectedDaysAgo: 2,
    summary: 'Missed doses in the intensive phase rose from 5% to 9%. Side effects are the most reported reason.',
    signal: { label: 'Missed doses, intensive phase, %', unit: '%', points: weeks8, values: [5.0, 5.2, 4.9, 5.8, 6.6, 7.4, 8.3, 9.1], threshold: 8, breach: 'above' },
    affected: { people: 34, note: 'People in the intensive phase in this district', breakdown: [{ label: 'Intensive', value: 34 }] },
    actions: ['Ask the dispensary doctor to review side-effect management', 'Offer a psychosocial session to everyone in the intensive phase'],
    suggestedOwner: 'NGO case manager', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-8', severity: 'medium', type: 'stock-out', title: 'Food-voucher stock covers 3 weeks',
    scope: 'Region East · District C', regionId: 'rg-east', districtIds: ['ds-east-c'], detectedDaysAgo: 5,
    summary: 'The voucher batch for District C runs out in about 3 weeks. The next batch depends on the akimat renewal.',
    signal: { label: 'Weeks of voucher stock', unit: ' wk', points: weeks8, values: [10, 9, 8, 7, 6, 5, 4, 3], threshold: 4, breach: 'below' },
    affected: { people: 45, note: 'People using food vouchers in this district', breakdown: [{ label: 'Intensive', value: 14 }, { label: 'Continuation', value: 31 }] },
    actions: ['Move spare vouchers from District A', 'Link to alert al-6 (akimat renewal)'],
    suggestedOwner: 'NGO case manager', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-9', severity: 'low', type: 'migration', title: 'Six transfers to another oblast not yet confirmed',
    scope: 'Region East · District B', regionId: 'rg-east', districtIds: ['ds-east-b'], detectedDaysAgo: 9,
    summary: 'Six people moved for work. The receiving dispensaries have not confirmed the referrals.',
    signal: { label: 'Unconfirmed referrals', unit: '', points: weeks8, values: [0, 1, 1, 2, 3, 4, 5, 6], threshold: 3, breach: 'above' },
    affected: { people: 6, note: 'People with an unconfirmed transfer', breakdown: [{ label: 'Continuation', value: 6 }] },
    actions: ['Call the receiving dispensaries', 'Keep video-observed treatment active until confirmed'],
    suggestedOwner: 'Peer network', status: 'new', assignee: null, comments: [],
  },
  {
    id: 'al-10', severity: 'high', type: 'migration', title: 'Flooding cut road access: 14 people may miss visits',
    scope: 'Region West · District C', regionId: 'rg-west', districtIds: ['ds-west-c'], detectedDaysAgo: 0,
    summary: 'Autumn flooding closed two roads to the dispensary. 14 people are due a visit in the next 10 days.',
    signal: { label: 'People with a visit at risk', unit: '', points: weeks8, values: [0, 0, 0, 0, 1, 3, 8, 14], threshold: 5, breach: 'above' },
    affected: { people: 14, note: 'People due a dispensary visit within 10 days', breakdown: [{ label: 'Intensive', value: 5 }, { label: 'Continuation', value: 9 }] },
    actions: ['Switch affected people to video-observed treatment', 'Arrange a medicine delivery with the dispensary', 'Ask the akimat about emergency transport'],
    suggestedOwner: 'TB dispensary', status: 'new', assignee: null, comments: [],
  },
];

export const assigneeOptions = [
  'Programme coordinator',
  'NGO case manager',
  'Peer network lead',
  'TB dispensary pharmacist',
  'District TB coordinator',
  'VOT support desk',
  'Finance officer',
];

// ─────────────── 7. Synthetic cases (no names, age bands only) ───────────────

export const caseRecords: CaseRecord[] = [
  { id: 'SYN-0142', ageBand: '35–44', districtId: 'ds-south-c', phase: 'intensive', month: 2, regimen: 'Drug-susceptible', risk: 'high', adherence: 74, lastContact: '2026-10-09', nextFollowUp: '2026-10-16', worker: 'Peer navigator 3', services: ['navigator', 'vouchers', 'vot'], status: 'follow-up', flags: ['3+ missed doses', 'Voucher delayed'] },
  { id: 'SYN-0157', ageBand: '25–34', districtId: 'ds-south-c', phase: 'continuation', month: 4, regimen: 'Drug-susceptible', risk: 'high', adherence: 79, lastContact: '2026-10-07', nextFollowUp: '2026-10-17', worker: 'Peer navigator 3', services: ['navigator', 'vouchers'], status: 'follow-up', flags: ['Phone unreachable'] },
  { id: 'SYN-0163', ageBand: '45–54', districtId: 'ds-south-a', phase: 'continuation', month: 5, regimen: 'Drug-susceptible', risk: 'medium', adherence: 88, lastContact: '2026-10-12', nextFollowUp: '2026-10-21', worker: 'Peer navigator 1', services: ['navigator', 'vot', 'vouchers'], status: 'active', flags: ['Planned seasonal travel'] },
  { id: 'SYN-0171', ageBand: '18–24', districtId: 'ds-south-d', phase: 'continuation', month: 3, regimen: 'Drug-susceptible', risk: 'medium', adherence: 86, lastContact: '2026-10-11', nextFollowUp: '2026-10-18', worker: 'Peer navigator 4', services: ['navigator', 'vouchers', 'psycho'], status: 'active', flags: ['Planned seasonal travel'] },
  { id: 'SYN-0178', ageBand: '55–64', districtId: 'ds-west-c', phase: 'intensive', month: 1, regimen: 'Drug-resistant', risk: 'high', adherence: 83, lastContact: '2026-10-13', nextFollowUp: '2026-10-16', worker: 'Outreach nurse 2', services: ['navigator', 'vouchers', 'psycho'], status: 'follow-up', flags: ['Road access cut'] },
  { id: 'SYN-0184', ageBand: '35–44', districtId: 'ds-west-b', phase: 'continuation', month: 4, regimen: 'Drug-susceptible', risk: 'medium', adherence: 90, lastContact: '2026-10-10', nextFollowUp: '2026-10-24', worker: 'Peer navigator 6', services: ['navigator', 'vot'], status: 'active', flags: ['Medicine stock low'] },
  { id: 'SYN-0190', ageBand: '25–34', districtId: 'ds-north-a', phase: 'intensive', month: 2, regimen: 'Drug-susceptible', risk: 'low', adherence: 93, lastContact: '2026-10-14', nextFollowUp: '2026-10-28', worker: 'Peer navigator 2', services: ['navigator', 'vot'], status: 'active', flags: ['VOT upload failures'] },
  { id: 'SYN-0196', ageBand: '45–54', districtId: 'ds-north-b', phase: 'continuation', month: 5, regimen: 'Drug-susceptible', risk: 'low', adherence: 97, lastContact: '2026-10-14', nextFollowUp: '2026-11-04', worker: 'Peer navigator 2', services: ['navigator', 'vot', 'psycho'], status: 'active', flags: [] },
  { id: 'SYN-0203', ageBand: '65+', districtId: 'ds-north-c', phase: 'completion', month: 6, regimen: 'Drug-susceptible', risk: 'low', adherence: 98, lastContact: '2026-10-08', nextFollowUp: '2026-10-22', worker: 'Outreach nurse 1', services: ['navigator'], status: 'active', flags: ['Final review due'] },
  { id: 'SYN-0211', ageBand: '35–44', districtId: 'ds-east-a', phase: 'continuation', month: 3, regimen: 'Drug-susceptible', risk: 'low', adherence: 95, lastContact: '2026-10-13', nextFollowUp: '2026-10-27', worker: 'Social worker 1', services: ['navigator', 'vouchers', 'vot'], status: 'active', flags: [] },
  { id: 'SYN-0219', ageBand: '25–34', districtId: 'ds-east-b', phase: 'continuation', month: 4, regimen: 'Drug-susceptible', risk: 'medium', adherence: 89, lastContact: '2026-10-02', nextFollowUp: null, worker: 'Peer navigator 5', services: ['navigator', 'vot'], status: 'transferred', flags: ['Transfer not confirmed'] },
  { id: 'SYN-0224', ageBand: '18–24', districtId: 'ds-east-c', phase: 'intensive', month: 1, regimen: 'Drug-susceptible', risk: 'medium', adherence: 87, lastContact: '2026-10-12', nextFollowUp: '2026-10-19', worker: 'Social worker 1', services: ['navigator', 'vouchers', 'psycho'], status: 'active', flags: ['Voucher stock low'] },
  { id: 'SYN-0230', ageBand: '45–54', districtId: 'ds-west-a', phase: 'intensive', month: 2, regimen: 'Drug-susceptible', risk: 'medium', adherence: 85, lastContact: '2026-10-11', nextFollowUp: '2026-10-18', worker: 'Outreach nurse 2', services: ['navigator', 'vot', 'psycho'], status: 'active', flags: ['Side effects reported'] },
  { id: 'SYN-0236', ageBand: '35–44', districtId: 'ds-south-b', phase: 'continuation', month: 5, regimen: 'Drug-susceptible', risk: 'low', adherence: 94, lastContact: '2026-10-14', nextFollowUp: '2026-10-30', worker: 'Peer navigator 1', services: ['navigator', 'vot'], status: 'active', flags: [] },
  { id: 'SYN-0241', ageBand: '55–64', districtId: 'ds-south-c', phase: 'continuation', month: 3, regimen: 'Drug-resistant', risk: 'high', adherence: 77, lastContact: '2026-10-05', nextFollowUp: '2026-10-16', worker: 'Peer navigator 3', services: ['navigator', 'vouchers', 'psycho'], status: 'follow-up', flags: ['3+ missed doses', 'Lost income'] },
  { id: 'SYN-0247', ageBand: '25–34', districtId: 'ds-north-d', phase: 'start', month: 1, regimen: 'Drug-susceptible', risk: 'medium', adherence: 91, lastContact: '2026-10-14', nextFollowUp: '2026-10-17', worker: 'Peer navigator 2', services: ['navigator', 'psycho'], status: 'active', flags: ['New to treatment'] },
  { id: 'SYN-0252', ageBand: '35–44', districtId: 'ds-west-c', phase: 'continuation', month: 4, regimen: 'Drug-susceptible', risk: 'high', adherence: 81, lastContact: '2026-10-06', nextFollowUp: '2026-10-16', worker: 'Outreach nurse 2', services: ['navigator', 'vouchers'], status: 'follow-up', flags: ['Road access cut', 'Phone unreachable'] },
  { id: 'SYN-0258', ageBand: '45–54', districtId: 'ds-east-a', phase: 'completion', month: 6, regimen: 'Drug-susceptible', risk: 'low', adherence: 99, lastContact: '2026-10-13', nextFollowUp: null, worker: 'Social worker 1', services: ['navigator'], status: 'completed', flags: [] },
  { id: 'SYN-0263', ageBand: '18–24', districtId: 'ds-south-a', phase: 'intensive', month: 1, regimen: 'Drug-susceptible', risk: 'medium', adherence: 86, lastContact: '2026-10-12', nextFollowUp: '2026-10-19', worker: 'Peer navigator 1', services: ['navigator', 'vouchers', 'vot', 'psycho'], status: 'active', flags: [] },
  { id: 'SYN-0269', ageBand: '65+', districtId: 'ds-west-b', phase: 'continuation', month: 5, regimen: 'Drug-susceptible', risk: 'low', adherence: 96, lastContact: '2026-10-09', nextFollowUp: '2026-10-23', worker: 'Peer navigator 6', services: ['navigator', 'vouchers'], status: 'active', flags: [] },
  { id: 'SYN-0274', ageBand: '25–34', districtId: 'ds-south-d', phase: 'intensive', month: 2, regimen: 'Drug-resistant', risk: 'high', adherence: 80, lastContact: '2026-10-08', nextFollowUp: '2026-10-16', worker: 'Peer navigator 4', services: ['navigator', 'vouchers', 'vot', 'psycho'], status: 'follow-up', flags: ['Side effects reported', 'Planned seasonal travel'] },
  { id: 'SYN-0280', ageBand: '35–44', districtId: 'ds-north-a', phase: 'continuation', month: 3, regimen: 'Drug-susceptible', risk: 'low', adherence: 92, lastContact: '2026-10-11', nextFollowUp: '2026-10-25', worker: 'Peer navigator 2', services: ['navigator', 'vot'], status: 'active', flags: [] },
  { id: 'SYN-0286', ageBand: '45–54', districtId: 'ds-west-a', phase: 'continuation', month: 4, regimen: 'Drug-susceptible', risk: 'low', adherence: 95, lastContact: '2026-10-12', nextFollowUp: '2026-10-26', worker: 'Peer navigator 6', services: ['navigator', 'vot', 'vouchers'], status: 'active', flags: [] },
  { id: 'SYN-0291', ageBand: '55–64', districtId: 'ds-east-c', phase: 'continuation', month: 5, regimen: 'Drug-susceptible', risk: 'medium', adherence: 88, lastContact: '2026-10-04', nextFollowUp: '2026-10-20', worker: 'Peer navigator 5', services: ['navigator', 'vouchers'], status: 'paused', flags: ['Hospitalised (unrelated)'] },
  { id: 'SYN-0297', ageBand: '25–34', districtId: 'ds-south-b', phase: 'start', month: 1, regimen: 'Drug-susceptible', risk: 'medium', adherence: 90, lastContact: '2026-10-14', nextFollowUp: '2026-10-17', worker: 'Peer navigator 4', services: ['navigator', 'psycho', 'vouchers'], status: 'active', flags: ['New to treatment'] },
];

export const workerRoles = Array.from(new Set(caseRecords.map((c) => c.worker))).sort();

/** Deterministic PRNG so synthetic heatmaps and timelines are stable across reloads. */
function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 56 days (8 weeks) ending on meta.asOf. Synthetic: generated from the case's adherence %. */
export function adherenceDays(c: CaseRecord): { date: string; state: DoseDay }[] {
  const rnd = seeded(c.id);
  const missRate = (100 - c.adherence) / 100;
  const startedDaysAgo = c.month * 30;
  return Array.from({ length: 56 }, (_, i) => {
    const daysAgo = 55 - i;
    const date = addDays(meta.asOf, -daysAgo);
    if (daysAgo > startedDaysAgo || c.status === 'paused' && daysAgo < 10) return { date, state: 'none' as DoseDay };
    // Misses cluster in the most recent weeks for high-risk cases.
    const recentBoost = c.risk === 'high' && daysAgo < 21 ? 1.8 : c.risk === 'high' ? 0.5 : 1;
    return { date, state: rnd() < missRate * recentBoost ? 'missed' : 'taken' };
  });
}

const timelineTemplates: { channel: ContactChannel; text: string; outcome: ContactEntry['outcome'] }[] = [
  { channel: 'VOT check-in', text: 'Doses observed by video. No side effects reported.', outcome: 'reached' },
  { channel: 'Home visit', text: 'Talked through side effects; agreed to keep going. Referred to the dispensary doctor.', outcome: 'reached' },
  { channel: 'Phone call', text: 'Transport voucher issued for the next dispensary visit.', outcome: 'reached' },
  { channel: 'Peer group', text: 'Attended the weekly peer support group.', outcome: 'reached' },
  { channel: 'Dispensary visit', text: 'Monthly review at the TB dispensary. Sputum sample taken.', outcome: 'reached' },
  { channel: 'Phone call', text: 'No answer after two attempts. Will try a home visit.', outcome: 'not-reached' },
];

/** Synthetic contact history for a case, newest first. */
export function contactHistory(c: CaseRecord): ContactEntry[] {
  const rnd = seeded(`${c.id}-t`);
  const entries: ContactEntry[] = [];
  let date = c.lastContact;
  const count = 5;
  for (let i = 0; i < count; i++) {
    let t = timelineTemplates[Math.floor(rnd() * timelineTemplates.length)];
    if (i === 0 && c.risk === 'high') t = timelineTemplates[5];
    if (i === count - 1) t = { channel: 'Dispensary visit', text: 'Enrolled in community support at treatment start.', outcome: 'reached' };
    entries.push({ id: `${c.id}-h${i}`, date, channel: t.channel, by: t.channel === 'Dispensary visit' ? 'District TB coordinator' : c.worker, text: t.text, outcome: t.outcome });
    date = addDays(date, -(4 + Math.floor(rnd() * 9)));
  }
  return entries;
}

// ─────────────────────────── 8. Notifications ───────────────────────────

export const notifications: Notification[] = [
  { id: 'n-1', text: 'New high alert: flooding cut road access in Region West · District C', ago: '12 min ago', view: 'alerts', item: 'al-10', tone: 'alert' },
  { id: 'n-2', text: 'Missed doses doubled in Region South · District C', ago: '1 h ago', view: 'alerts', item: 'al-2', tone: 'alert' },
  { id: 'n-3', text: 'SYN-0142 has 3+ missed doses this week', ago: '3 h ago', view: 'caseload', item: 'SYN-0142', tone: 'case' },
  { id: 'n-4', text: 'Follow-up due today for SYN-0178', ago: '5 h ago', view: 'caseload', item: 'SYN-0178', tone: 'case' },
  { id: 'n-5', text: 'Outreach capacity in Region South · District C is above 110%', ago: 'Yesterday', view: 'regions', item: 'ds-south-c', tone: 'info' },
  { id: 'n-6', text: 'Quarterly evidence pack is ready to generate', ago: '2 days ago', view: 'impact', tone: 'info' },
];

// ──────────────────── 9. Service map (actors around the patient) ────────────────────

export const actors: Actor[] = [
  {
    id: 'ac-phc', name: 'Primary health care', short: 'Primary care', ring: 'care', angle: 0, role: 'First contact, screening and referral',
    responsibilities: ['Screens people with symptoms and refers them for diagnosis', 'Supports follow-up close to home in the continuation phase', 'Flags side effects to the dispensary'],
    contacts: [{ label: 'District polyclinic TB focal point', how: 'Through the polyclinic registry' }, { label: 'Family doctor team', how: 'Weekly case review' }],
  },
  {
    id: 'ac-disp', name: 'TB dispensaries', short: 'TB dispensary', ring: 'care', angle: 120, role: 'Clinical treatment and medicines',
    responsibilities: ['Confirms diagnosis and prescribes treatment', 'Manages medicine stock and side effects', 'Refers people to community support at treatment start'],
    contacts: [{ label: 'District TB coordinator', how: 'Dispensary front desk' }, { label: 'Dispensary pharmacist', how: 'Stock requests via the regional system' }],
  },
  {
    id: 'ac-ngo', name: 'NGOs and peer networks', short: 'NGOs and peers', ring: 'care', angle: 240, role: 'Community support around the patient',
    responsibilities: ['Run peer navigation and psychosocial support', 'Deliver transport and food vouchers', 'Track continuity signals and raise alerts'],
    contacts: [{ label: 'NGO case manager', how: 'Daily case-management board' }, { label: 'Peer network lead', how: 'Weekly coordination call' }],
  },
  {
    id: 'ac-ntc', name: 'National TB centre', short: 'National TB centre', ring: 'system', angle: 45, role: 'Clinical standards, surveillance and VOT platform',
    responsibilities: ['Sets treatment protocols', 'Runs the national TB register', 'Hosts the video-observed treatment platform'],
    contacts: [{ label: 'Surveillance unit', how: 'Monthly register reconciliation' }, { label: 'VOT support desk', how: 'Ticketing system' }],
  },
  {
    id: 'ac-moh', name: 'Ministry of Health', short: 'Ministry of Health', ring: 'system', angle: 135, role: 'Policy and budget holder',
    responsibilities: ['Decides domestic financing lines', 'Sets the rules for state social contracting', 'Approves the national TB programme budget'],
    contacts: [{ label: 'TB programme department', how: 'Formal letter or working group' }],
  },
  {
    id: 'ac-akimat', name: 'Akimat social services', short: 'Akimat social services', ring: 'system', angle: 315, role: 'Local social protection',
    responsibilities: ['Co-funds food and transport support', 'Can contract NGOs through social procurement', 'Links people to social benefits'],
    contacts: [{ label: 'Social protection department', how: 'Quarterly co-funding review' }],
  },
  {
    id: 'ac-funders', name: 'External funders', short: 'Funders', ring: 'system', angle: 225, role: 'Transitional financing',
    responsibilities: ['Fund community services today', 'Plan their exit as domestic funding grows', 'Require outcome reporting'],
    contacts: [{ label: 'Grant manager', how: 'Quarterly report and calls' }],
  },
];

export const edges: Edge[] = [
  { id: 'e-phc-disp', from: 'ac-phc', to: 'ac-disp', kind: 'referral', label: 'Refers for diagnosis' },
  { id: 'e-disp-ngo', from: 'ac-disp', to: 'ac-ngo', kind: 'referral', label: 'Enrols in community support' },
  { id: 'e-ngo-patient', from: 'ac-ngo', to: 'patient', kind: 'support', label: 'Navigation, counselling, vouchers' },
  { id: 'e-disp-patient', from: 'ac-disp', to: 'patient', kind: 'support', label: 'Treatment and medicines' },
  { id: 'e-phc-patient', from: 'ac-phc', to: 'patient', kind: 'support', label: 'Care close to home' },
  { id: 'e-ngo-disp', from: 'ac-ngo', to: 'ac-disp', kind: 'data', label: 'Adherence signals and alerts' },
  { id: 'e-ntc-disp', from: 'ac-ntc', to: 'ac-disp', kind: 'policy', label: 'Protocols and VOT platform' },
  { id: 'e-moh-ntc', from: 'ac-moh', to: 'ac-ntc', kind: 'policy', label: 'Programme budget' },
  { id: 'e-moh-ngo', from: 'ac-moh', to: 'ac-ngo', kind: 'funding', label: 'State social order (proposed)' },
  { id: 'e-akimat-ngo', from: 'ac-akimat', to: 'ac-ngo', kind: 'funding', label: 'Co-funding and social contracts' },
  { id: 'e-funders-ngo', from: 'ac-funders', to: 'ac-ngo', kind: 'funding', label: 'Transitional grant' },
  { id: 'e-ngo-akimat', from: 'ac-ngo', to: 'ac-akimat', kind: 'referral', label: 'Requests social support' },
];

export const pathways: Pathway[] = [
  { id: 'pw-care', label: 'Diagnosis to community support', description: 'How a person moves from first contact into supported treatment.', edges: ['e-phc-disp', 'e-disp-ngo', 'e-ngo-patient', 'e-disp-patient'] },
  { id: 'pw-signal', label: 'Continuity signal to action', description: 'How a missed-dose signal reaches the people who can act on it.', edges: ['e-ngo-disp', 'e-ntc-disp', 'e-disp-patient', 'e-ngo-patient'] },
  { id: 'pw-money', label: 'Funding today', description: 'Who pays for the support package now.', edges: ['e-funders-ngo', 'e-akimat-ngo', 'e-moh-ntc'] },
  { id: 'pw-future', label: 'Funding after transition', description: 'The proposed domestic route through state social contracting.', edges: ['e-moh-ngo', 'e-akimat-ngo', 'e-ngo-patient'] },
];

// ──────────────────── 10. Impact, costs, evidence pack ────────────────────

export const outcomes: OutcomePoint[] = [
  { q: 'Q4 2024', supported: 77, comparison: 74 },
  { q: 'Q1 2025', supported: 78, comparison: 74 },
  { q: 'Q2 2025', supported: 80, comparison: 74 },
  { q: 'Q3 2025', supported: 83, comparison: 75 },
  { q: 'Q4 2025', supported: 84, comparison: 74 },
  { q: 'Q1 2026', supported: 86, comparison: 75 },
  { q: 'Q2 2026', supported: 87, comparison: 76 },
  { q: 'Q3 2026', supported: 88, comparison: 75 },
];

/** Indicative USD per patient per treatment course. Placeholders for discussion, not a costing. */
export const costs: CostItem[] = [
  { id: 'vouchers', label: 'Transport and food vouchers', value: 120 },
  { id: 'navigator', label: 'Peer navigation', value: 70 },
  { id: 'psycho', label: 'Psychosocial support', value: 55 },
  { id: 'vot', label: 'Video-observed treatment', value: 35 },
  { id: 'coord', label: 'Coordination and data', value: 30 },
];

export const impact = {
  /** Indicative cost of re-treating one person who stops treatment (placeholder). */
  retreatmentCost: 4800,
  annualProgrammeCost: 393000, // indicative, all lines
  peopleSupportedPerYear: 1270,
};

export const evidenceStatements = [
  'In this synthetic scenario, supported patients complete treatment more often than the comparison cohort (88% vs 75%).',
  'The indicative cost of support (about USD 310 per person) is small next to the cost of re-treating someone who stops treatment.',
  'Three of the four support services depend on an external grant that ends within 7 months.',
  'A domestic social-contracting line would let akimats and the Ministry fund NGOs directly.',
];

export const evidencePack = {
  title: 'Community TB support: the case for a domestic financing line',
  audience: 'Prepared for the parliamentary committee on social policy (illustrative)',
  asks: [
    'Create a budget line for community TB support under the state social order from the next fiscal cycle.',
    'Allow akimats to co-fund food and transport support through social procurement.',
    'Ask the Ministry of Health to report continuity outcomes for supported and unsupported cohorts each year.',
  ],
  caveats: [
    'All figures in this pack are synthetic and for demonstration only.',
    'Costs are indicative placeholders, not a costing.',
    'The comparison cohort is illustrative and not a controlled study.',
  ],
};

export const parliamentaryLink = '/demo/parliamentary-intelligence?view=evidence';
