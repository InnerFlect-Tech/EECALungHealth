// Parliamentary Intelligence demo: stub scenario data.
//
// Every figure, date, document, task and stakeholder position in this file is
// invented for demonstration and is NOT official data. Institutions are named
// generically. The only real law named is the Code "On Public Health and the
// Healthcare System" (2020). Costs are indicative.
//
// All stub content for /demo/parliamentary-intelligence lives here so that real
// answers gathered in meetings can be swapped in without touching the UI.

export type Confidence = 'high' | 'medium' | 'low';
export type EvidenceType = 'research' | 'legislation' | 'financing' | 'stakeholder' | 'gap';
export type SourceCategory = 'International' | 'National legislation' | 'Government' | 'Parliament' | 'Civil society' | 'Demo model';
export type Sector = 'parliament' | 'government' | 'technical' | 'subnational' | 'civil' | 'international';
export type Stance = 'supportive' | 'conditional' | 'cautious' | 'not engaged';
export type TaskStatus = 'reviewed' | 'in-progress' | 'awaiting' | 'blocked';
export type Priority = 'high' | 'medium' | 'low';
export type OptionId = 'A' | 'B' | 'C';
export type CriterionId = 'cost' | 'speed' | 'sustainability' | 'reach' | 'feasibility';
export type View = 'dashboard' | 'evidence' | 'brief' | 'stakeholders' | 'tracker';

/** A pointer to something in the app: a view plus an optional item drawer. */
export interface Ref { view: View; item?: string }

export interface Institution {
  id: string;
  name: string;
  short: string;
  sector: Sector;
}

export interface Stage { label: string; date: string; note: string }

export interface Issue {
  ref: string;
  title: string;
  country: string;
  summary: string;
  deadline: string;
  deadlineLabel: string;
  stageIndex: number;
  stages: Stage[];
  leadInstitutionId: string;
  responsible: { institutionId: string; role: string }[];
}

export interface Question {
  id: string;
  text: string;
  context: string;
  ownerId: string;
  priority: Priority;
  raised: string;
  due: string;
  status: 'open' | 'answered';
  answer?: string;
  linkedEvidence: string[];
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  source: string;
  sourceCategory: SourceCategory;
  confidence: Confidence;
  date: string;
  summary: string;
  keyFindings: string[];
  relevance: string;
  linkedOptions: OptionId[];
  inBrief: boolean;
  /** Optional in-app link to related material. */
  link?: { label: string; href: string };
  /** Gaps only: which institution would normally hold this evidence. */
  suggestedOwnerId?: string;
}

export interface Criterion { id: CriterionId; label: string; help: string; defaultWeight: number }

export interface PolicyOption {
  id: OptionId;
  short: string;
  title: string;
  mechanism: string;
  costIndicative: string;
  costRange: [number, number];
  timeline: string;
  months: [number, number];
  scores: Record<CriterionId, number>;
  advantages: string[];
  tradeoffs: string[];
  risks: string[];
  legalBasis: string;
  evidence: string[];
}

export interface StakeholderProfile {
  institutionId: string;
  summary: string;
  responsibilities: string[];
  position: string;
  stance: Stance;
  interest: number;
  influence: number;
  x: number;
  y: number;
  levers: string[];
  links: { label: string; href: string }[];
  /** Matrix view: draw the label to the left of the point. */
  matrixLabelLeft?: boolean;
}

export interface StakeholderLink { from: string; to: string; label: string }

export interface TaskEvent { at: string; text: string }
export interface TaskNote { id: string; at: string; author: string; text: string }

export interface Task {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  status: TaskStatus;
  start: string;
  due: string;
  kind: 'task' | 'evidence-request' | 'decision' | 'milestone';
  history: TaskEvent[];
  notes: TaskNote[];
}

export interface Activity { id: string; at: string; actor: string; text: string; ref?: Ref }
export interface Notification { id: string; at: string; title: string; body: string; ref: Ref; read: boolean }

// ---------------------------------------------------------------------------

export const DEMO_USER = {
  name: 'Demo user',
  role: 'Parliamentary staff (demo user)',
  initials: 'PS',
  unitId: 'secretariat',
};

export const institutions: Institution[] = [
  { id: 'mazhilis', name: 'Mazhilis committee on social and cultural development', short: 'Mazhilis committee', sector: 'parliament' },
  { id: 'senate', name: 'Senate committee on social and cultural development', short: 'Senate committee', sector: 'parliament' },
  { id: 'secretariat', name: 'Committee secretariat', short: 'Committee secretariat', sector: 'parliament' },
  { id: 'research', name: 'Parliamentary research service', short: 'Research service', sector: 'parliament' },
  { id: 'legal', name: 'Committee legal advisers', short: 'Legal advisers', sector: 'parliament' },
  { id: 'moh', name: 'Ministry of Health of the Republic of Kazakhstan', short: 'Ministry of Health', sector: 'government' },
  { id: 'mof', name: 'Ministry of Finance of the Republic of Kazakhstan', short: 'Ministry of Finance', sector: 'government' },
  { id: 'moj', name: 'Ministry of Justice of the Republic of Kazakhstan', short: 'Ministry of Justice', sector: 'government' },
  { id: 'ntc', name: 'National TB centre (national scientific centre for phthisiopulmonology)', short: 'National TB centre', sector: 'technical' },
  { id: 'shif', name: 'Social health insurance fund', short: 'Insurance fund', sector: 'technical' },
  { id: 'akimat', name: 'Regional akimats (local executive bodies)', short: 'Regional akimats', sector: 'subnational' },
  { id: 'ngo', name: 'NGOs and patient groups working on TB', short: 'NGOs & patient groups', sector: 'civil' },
  { id: 'gf', name: 'External funders (e.g. the Global Fund, in transition)', short: 'External funders', sector: 'international' },
  { id: 'who', name: 'WHO country office', short: 'WHO country office', sector: 'international' },
];

export const sectors: { id: Sector; label: string }[] = [
  { id: 'parliament', label: 'Parliament' },
  { id: 'government', label: 'Government' },
  { id: 'technical', label: 'Technical agencies' },
  { id: 'subnational', label: 'Subnational' },
  { id: 'civil', label: 'Civil society' },
  { id: 'international', label: 'International' },
];

export const issue: Issue = {
  ref: 'PI-2026-014',
  title: 'Sustainable domestic financing for community-based TB patient support',
  country: 'Republic of Kazakhstan',
  summary:
    'Psychosocial and adherence support for people on TB treatment, including drug-resistant TB, is delivered largely by NGOs and has historically relied on external grants. As that funding transitions out, the committee is asked to recommend how these services can be sustained from domestic sources without gaps in care.',
  deadline: '2027-03-31T18:00:00+05:00',
  deadlineLabel: '31 March 2027 (illustrative)',
  stageIndex: 2,
  stages: [
    { label: 'Issue framing', date: '2026-09-02', note: 'Issue note circulated to members' },
    { label: 'Evidence review', date: '2026-10-05', note: 'International and national evidence compiled' },
    { label: 'Options analysis', date: '2026-11-15', note: 'Options A, B and C under comparison' },
    { label: 'Committee hearing', date: '2027-02-10', note: 'Hearing with Government representatives' },
    { label: 'Decision', date: '2027-03-31', note: 'Committee recommendation adopted' },
  ],
  leadInstitutionId: 'mazhilis',
  responsible: [
    { institutionId: 'mazhilis', role: 'Lead committee (illustrative assignment)' },
    { institutionId: 'moh', role: 'Policy owner for TB services' },
    { institutionId: 'mof', role: 'Budget planning and fiscal impact' },
    { institutionId: 'akimat', role: 'Local budgets and social contracting' },
    { institutionId: 'ntc', role: 'Technical standards and programme data' },
  ],
};

export const questions: Question[] = [
  {
    id: 'q-1', priority: 'high', ownerId: 'moh', raised: '2026-09-12', due: '2026-11-20', status: 'open',
    text: 'What is the full annual cost of community-based TB support at national scale?',
    context: 'Members need an agreed figure before any budget line or contracting volume can be proposed. The only figure available is an illustrative range from a demo costing model.',
    linkedEvidence: ['ev-10', 'ev-16', 'ev-12'],
  },
  {
    id: 'q-2', priority: 'high', ownerId: 'mof', raised: '2026-09-12', due: '2026-11-30', status: 'open',
    text: 'Can social contracting through akimat budgets guarantee consistent coverage across all regions?',
    context: 'Option B depends on regional capacity to commission NGOs. Members asked whether minimum coverage can be guaranteed, and how shortfalls in low-capacity regions would be met.',
    linkedEvidence: ['ev-7', 'ev-12', 'ev-14'],
  },
  {
    id: 'q-3', priority: 'medium', ownerId: 'legal', raised: '2026-09-20', due: '2026-12-15', status: 'open',
    text: 'Would inclusion in the compulsory social health insurance package require changes to secondary legislation?',
    context: 'Option C would make community support a reimbursable service. Legal advisers are asked to confirm which instruments would need amending and the likely timeline.',
    linkedEvidence: ['ev-6', 'ev-9', 'ev-18'],
  },
  {
    id: 'q-4', priority: 'medium', ownerId: 'ntc', raised: '2026-09-26', due: '2026-12-01', status: 'open',
    text: 'What quality and reporting standards should apply to NGO providers?',
    context: 'Whichever channel is chosen, the committee wants a common minimum standard so outcomes can be compared across regions and providers.',
    linkedEvidence: ['ev-2', 'ev-15', 'ev-13'],
  },
  {
    id: 'q-5', priority: 'high', ownerId: 'gf', raised: '2026-10-01', due: '2026-11-10', status: 'open',
    text: 'On what timeline will external co-financing of community components decline?',
    context: 'The transition schedule sets the latest date by which a domestic mechanism must be operational to avoid a gap in services.',
    linkedEvidence: ['ev-11'],
  },
  {
    id: 'q-6', priority: 'low', ownerId: 'research', raised: '2026-09-05', due: '2026-10-01', status: 'answered',
    text: 'What does international guidance recommend for TB patient support?',
    context: 'Background question to establish the normative basis for the service package.',
    answer: 'International guidance recommends health education, counselling, and material and psychological support as part of people-centred TB care. Summary filed by the research service (illustrative).',
    linkedEvidence: ['ev-1', 'ev-2'],
  },
];

export const evidence: EvidenceItem[] = [
  {
    id: 'ev-1', type: 'research', title: 'Treatment outcomes with and without community adherence support',
    source: 'Systematic reviews cited in international guidance', sourceCategory: 'International', confidence: 'high', date: '2026-09-14',
    summary: 'International evidence associates patient-centred adherence and psychosocial support with higher treatment success and fewer losses to follow-up, especially for drug-resistant TB.',
    keyFindings: ['Support packages are consistently associated with better adherence', 'Effects are largest for people facing social or economic barriers', 'Benefits depend on continuity: interrupted support loses most of its effect'],
    relevance: 'Supports the case that the services are worth sustaining with domestic funds.', linkedOptions: ['A', 'B', 'C'], inBrief: true,
  },
  {
    id: 'ev-2', type: 'research', title: 'WHO consolidated guidelines on TB: treatment and patient care',
    source: 'World Health Organization', sourceCategory: 'International', confidence: 'high', date: '2026-09-10',
    summary: 'Recommends health education, counselling, and material and psychological support for people with TB as part of people-centred care.',
    keyFindings: ['Patient support is part of the standard of care, not an optional add-on', 'Support should be offered throughout treatment', 'Community providers are recognised as delivery partners'],
    relevance: 'Normative basis for the service package in all three options.', linkedOptions: ['A', 'B', 'C'], inBrief: true,
  },
  {
    id: 'ev-3', type: 'research', title: 'Costs borne by TB-affected households',
    source: 'Regional patient cost survey literature', sourceCategory: 'International', confidence: 'medium', date: '2026-09-18',
    summary: 'Households affected by TB in the region commonly face high indirect costs (lost income, travel) even where treatment itself is free.',
    keyFindings: ['Indirect costs often exceed direct medical costs', 'Material support reduces the risk of treatment interruption', 'Costs are highest for drug-resistant TB because treatment is longer'],
    relevance: 'Explains why support services reduce loss to follow-up.', linkedOptions: ['B', 'C'], inBrief: false,
  },
  {
    id: 'ev-4', type: 'research', title: 'Community programme outcomes (synthetic)',
    source: 'EECA Hub care-continuity demo dataset', sourceCategory: 'Demo model', confidence: 'low', date: '2026-10-08',
    summary: 'A synthetic dataset showing how retention and treatment completion could be tracked for people supported by community providers. Not real patient data.',
    keyFindings: ['Shows the kind of outcome reporting a contracting mechanism could require', 'Illustrates retention tracking across referral steps', 'All figures are synthetic'],
    relevance: 'Demonstrates the monitoring the committee could ask providers to report.', linkedOptions: ['B'], inBrief: false,
    link: { label: 'Open the care-continuity demo (impact view)', href: '/demo/care-continuity?view=impact' },
  },
  {
    id: 'ev-5', type: 'research', title: 'Social contracting for health services: comparison across the region',
    source: 'Comparative policy studies (described generically)', sourceCategory: 'International', confidence: 'medium', date: '2026-09-28',
    summary: 'Several countries in the region fund NGO health services through social contracting. Results depend on multi-year contracts, clear standards and timely payment.',
    keyFindings: ['Annual contract cycles are the most frequently reported weakness', 'National standards reduce regional variation', 'Transparent tendering builds trust with civil society'],
    relevance: 'Design lessons for Option B.', linkedOptions: ['B'], inBrief: true,
  },
  {
    id: 'ev-6', type: 'legislation', title: 'Code "On Public Health and the Healthcare System" (2020)',
    source: 'Republic of Kazakhstan', sourceCategory: 'National legislation', confidence: 'high', date: '2026-09-08',
    summary: 'Framework law governing healthcare delivery, the guaranteed volume of free medical care and compulsory social health insurance.',
    keyFindings: ['Defines the two main financing channels for health services', 'Sets the basis for TB care within the guaranteed volume', 'Further detail is set by secondary legislation'],
    relevance: 'Determines which financing channels are legally available.', linkedOptions: ['A', 'C'], inBrief: true,
  },
  {
    id: 'ev-7', type: 'legislation', title: 'Legal framework for state social contracting with NGOs',
    source: 'National legislation (described generically)', sourceCategory: 'National legislation', confidence: 'medium', date: '2026-09-22',
    summary: 'A legal mechanism allows central and local authorities to contract NGOs to deliver social services.',
    keyFindings: ['Local executive bodies can commission services from their own budgets', 'Applicability to TB patient support needs legal confirmation', 'A ministerial service standard may be needed'],
    relevance: 'Legal basis for Option B.', linkedOptions: ['B'], inBrief: true,
  },
  {
    id: 'ev-8', type: 'legislation', title: 'Budget procedure for new republican budget programmes',
    source: 'Budget legislation (described generically)', sourceCategory: 'National legislation', confidence: 'medium', date: '2026-09-24',
    summary: 'New budget programmes follow the annual budget cycle and require a justification and costing from the administering ministry.',
    keyFindings: ['Requests are due early in the budget planning cycle', 'A costing is a precondition', 'Allocations are reviewed annually'],
    relevance: 'Timeline constraint for Option A.', linkedOptions: ['A'], inBrief: false,
  },
  {
    id: 'ev-9', type: 'legislation', title: 'Secondary rules defining the insurance benefits package',
    source: 'Secondary legislation (described generically)', sourceCategory: 'National legislation', confidence: 'medium', date: '2026-09-30',
    summary: 'The list of services reimbursed under compulsory social health insurance is set by secondary legislation and tariff rules.',
    keyFindings: ['Adding a service requires a tariff and provider rules', 'Providers must meet accreditation requirements', 'Changes follow an annual review cycle'],
    relevance: 'Main legal pathway for Option C.', linkedOptions: ['C'], inBrief: false,
  },
  {
    id: 'ev-10', type: 'financing', title: 'Indicative annual cost of national community support',
    source: 'Demo costing model', sourceCategory: 'Demo model', confidence: 'low', date: '2026-10-02',
    summary: 'Illustrative range only: KZT 1.5–2.5 bn per year, depending on coverage and package scope. Indicative, not an official estimate.',
    keyFindings: ['Staff costs are the largest component in the model', 'Coverage of drug-resistant TB drives most of the variation', 'Must be replaced by an official costing'],
    relevance: 'Needed to size any budget line or contracting volume.', linkedOptions: ['A', 'B', 'C'], inBrief: true,
  },
  {
    id: 'ev-11', type: 'financing', title: 'External grant transition timeline',
    source: 'Funder transition planning (generic)', sourceCategory: 'International', confidence: 'medium', date: '2026-09-16',
    summary: 'External support for community components is expected to decline over the transition period while domestic co-financing commitments increase.',
    keyFindings: ['Community components are among the last to transition', 'Co-financing commitments rise year on year', 'A gap appears if no domestic mechanism is ready in time'],
    relevance: 'Defines the urgency of the decision.', linkedOptions: ['A', 'B', 'C'], inBrief: true,
  },
  {
    id: 'ev-12', type: 'financing', title: 'Regional budget capacity for social procurement',
    source: 'Illustrative regional budget review', sourceCategory: 'Government', confidence: 'low', date: '2026-10-06',
    summary: 'Illustrative: regions differ widely in the budget and staff they can dedicate to social procurement.',
    keyFindings: ['A minority of regions already contract NGOs for health-related services', 'Smaller regions report limited procurement capacity', 'Earmarked transfers could equalise capacity'],
    relevance: 'Main risk for Option B.', linkedOptions: ['B'], inBrief: false,
  },
  {
    id: 'ev-13', type: 'stakeholder', title: 'Civil society consultation summary',
    source: 'Demo consultation with NGOs and patient groups', sourceCategory: 'Civil society', confidence: 'medium', date: '2026-10-05',
    summary: 'Participants (illustrative) prioritise predictable multi-year funding, simple reporting and a voice in setting service standards.',
    keyFindings: ['Multi-year contracts were the top priority', 'Reporting burden is a concern for small NGOs', 'Peer-support roles should be recognised'],
    relevance: 'Informs the design of any contracting mechanism.', linkedOptions: ['B', 'C'], inBrief: true,
  },
  {
    id: 'ev-14', type: 'stakeholder', title: 'Regional implementer interviews',
    source: 'Demo interviews with regional health administrations', sourceCategory: 'Government', confidence: 'low', date: '2026-10-07',
    summary: 'Illustrative: regional administrations support local delivery but ask for national standards and earmarked funding.',
    keyFindings: ['Willingness depends on earmarked funding', 'Requests for a model contract and service standard', 'Concern about staff turnover in NGOs'],
    relevance: 'Feasibility signal for Option B.', linkedOptions: ['B'], inBrief: false,
  },
  {
    id: 'ev-15', type: 'stakeholder', title: 'Technical position of the national TB centre',
    source: 'Demo technical note', sourceCategory: 'Government', confidence: 'medium', date: '2026-10-09',
    summary: 'Illustrative: the national TB centre supports continued community support and offers to set minimum standards and reporting indicators.',
    keyFindings: ['Supports a national minimum service standard', 'Can host outcome reporting', 'Neutral between financing channels'],
    relevance: 'Source for quality standards in all options.', linkedOptions: ['A', 'B', 'C'], inBrief: false,
  },
  {
    id: 'ev-16', type: 'gap', title: 'No official national costing of the community package',
    source: 'Evidence gap', sourceCategory: 'Parliament', confidence: 'low', date: '2026-10-02',
    summary: 'An agreed costing from the Ministry of Health and Ministry of Finance is required before a budget line or contract volume can be proposed.',
    keyFindings: ['Blocks precise budget proposals', 'Affects all three options'],
    relevance: 'Blocks the recommendation.', linkedOptions: ['A', 'B', 'C'], inBrief: false, suggestedOwnerId: 'moh',
  },
  {
    id: 'ev-17', type: 'gap', title: 'Outcome data from domestically funded services',
    source: 'Evidence gap', sourceCategory: 'Parliament', confidence: 'low', date: '2026-10-04',
    summary: 'Little published data on outcomes when community support is funded domestically rather than by grants.',
    keyFindings: ['Weakens value-for-money arguments', 'Could be filled by regional pilots'],
    relevance: 'Weakens the value-for-money case.', linkedOptions: ['B'], inBrief: false, suggestedOwnerId: 'ntc',
  },
  {
    id: 'ev-18', type: 'gap', title: 'Insurance eligibility of non-medical support services',
    source: 'Evidence gap', sourceCategory: 'Parliament', confidence: 'medium', date: '2026-10-06',
    summary: 'It is unclear whether psychosocial support delivered by NGOs can be reimbursed under current insurance rules.',
    keyFindings: ['Key uncertainty for Option C', 'Needs a legal and tariff opinion'],
    relevance: 'Key uncertainty for Option C.', linkedOptions: ['C'], inBrief: false, suggestedOwnerId: 'shif',
  },
];

export const criteria: Criterion[] = [
  { id: 'cost', label: 'Cost', help: 'Lower indicative annual cost to the public budget scores higher', defaultWeight: 4 },
  { id: 'speed', label: 'Speed', help: 'How quickly services can be funded without a gap', defaultWeight: 3 },
  { id: 'sustainability', label: 'Sustainability', help: 'How durable and protected the funding is over time', defaultWeight: 3 },
  { id: 'reach', label: 'Reach', help: 'How many people and regions the services reach', defaultWeight: 4 },
  { id: 'feasibility', label: 'Political feasibility', help: 'Likelihood of agreement across Parliament and Government', defaultWeight: 3 },
];

export const options: PolicyOption[] = [
  {
    id: 'A', short: 'State budget line', title: 'Dedicated line in the republican health budget',
    mechanism: 'The Ministry of Health receives a ring-fenced allocation and contracts providers centrally against a national service standard.',
    costIndicative: 'KZT 2.0 bn / yr (indicative)', costRange: [1.8, 2.2],
    timeline: '12–18 months (next budget cycle)', months: [12, 18],
    scores: { cost: 2, speed: 3, sustainability: 3, reach: 4, feasibility: 4 },
    advantages: ['Visible, protected allocation that Parliament can track', 'Uniform national standards', 'Clear accountability through budget hearings'],
    tradeoffs: ['Subject to annual budget negotiation', 'Central procurement may crowd out small NGOs'],
    risks: ['Allocation cut during fiscal tightening', 'A year lost if the budget window is missed'],
    legalBasis: 'Budget procedure; no new primary legislation expected (to be confirmed).',
    evidence: ['ev-6', 'ev-8', 'ev-10'],
  },
  {
    id: 'B', short: 'Social contracting', title: 'Social contracting of NGOs through local akimat budgets',
    mechanism: 'Regional akimats commission NGOs under the state social contracting mechanism, following a national standard and model contract.',
    costIndicative: 'KZT 1.6 bn / yr (indicative)', costRange: [1.4, 1.8],
    timeline: '6–12 months', months: [6, 12],
    scores: { cost: 4, speed: 4, sustainability: 2, reach: 4, feasibility: 4 },
    advantages: ['Uses an existing legal mechanism', 'Keeps services close to communities', 'Builds on existing NGO experience'],
    tradeoffs: ['Uneven regional capacity', 'Short contract cycles unless multi-year contracts are allowed'],
    risks: ['Coverage gaps in low-capacity regions', 'Fragmented reporting without a national standard'],
    legalBasis: 'Existing social contracting framework; a ministerial service standard may be needed.',
    evidence: ['ev-5', 'ev-7', 'ev-12', 'ev-13'],
  },
  {
    id: 'C', short: 'Insurance package', title: 'Inclusion in the compulsory social health insurance package',
    mechanism: 'Community support becomes a reimbursable service under compulsory social health insurance, paid per case to accredited providers.',
    costIndicative: 'KZT 2.4 bn / yr (indicative)', costRange: [2.1, 2.7],
    timeline: '18–30 months', months: [18, 30],
    scores: { cost: 3, speed: 1, sustainability: 5, reach: 3, feasibility: 2 },
    advantages: ['Most durable, rules-based financing', 'Linked to clinical pathways', 'Not exposed to annual budget negotiation'],
    tradeoffs: ['NGOs may struggle to meet provider accreditation', 'Coverage limited to insured people unless exemptions apply'],
    risks: ['Uninsured patients excluded', 'Long regulatory process risks a gap during transition'],
    legalBasis: 'Likely requires amendments to secondary legislation on the insurance package.',
    evidence: ['ev-6', 'ev-9', 'ev-18'],
  },
];

export const recommendedStep = {
  title: 'Committee hearing with Government representatives',
  text: 'Ask the lead committee to request a joint Ministry of Health and Ministry of Finance costing and a legal opinion on social contracting, then hold a hearing with Government before the budget planning window closes. Scope the insurance pathway as a medium-term option.',
  ownerId: 'mazhilis',
  date: '2027-02-10',
};

export const stakeholderProfiles: StakeholderProfile[] = [
  {
    institutionId: 'mazhilis', x: 500, y: 90, interest: 9, influence: 9, stance: 'supportive', matrixLabelLeft: true,
    summary: 'Lead committee reviewing the issue (illustrative assignment).',
    responsibilities: ['Reviews draft laws and the republican budget', 'Holds hearings with Government', 'Can issue parliamentary inquiries'],
    position: 'Leading the review; wants a costed recommendation before the budget window (illustrative).',
    levers: ['Hearing', 'Parliamentary inquiry', 'Budget amendments'],
    links: [{ label: 'Open decision brief', href: '?view=brief' }],
  },
  {
    institutionId: 'senate', x: 800, y: 70, interest: 5, influence: 7, stance: 'not engaged',
    summary: 'Upper chamber committee; reviews laws adopted by the Mazhilis.',
    responsibilities: ['Approves or returns laws adopted by the Mazhilis', 'Brings a regional representation perspective'],
    position: 'Not yet engaged (illustrative).',
    levers: ['Review of adopted laws', 'Regional oversight'],
    links: [],
  },
  {
    institutionId: 'moh', x: 330, y: 270, interest: 10, influence: 8, stance: 'supportive', matrixLabelLeft: true,
    summary: 'Policy owner for TB services and the guaranteed volume of care.',
    responsibilities: ['TB policy and clinical standards', 'Defines the guaranteed volume of free care', 'Prepares health budget requests'],
    position: 'Supportive in principle; prefers national standards whichever channel is chosen (illustrative).',
    levers: ['Service standards', 'Budget requests', 'Benefits package proposals'],
    links: [{ label: 'Open costing question', href: '?view=dashboard&item=q-1' }],
  },
  {
    institutionId: 'mof', x: 670, y: 270, interest: 5, influence: 10, stance: 'cautious',
    summary: 'Budget planning and fiscal impact assessment.',
    responsibilities: ['Budget planning and execution', 'Assesses the fiscal impact of new budget lines', 'Rules on transfers to regions'],
    position: 'Requests an agreed costing before any commitment (illustrative).',
    levers: ['Budget ceilings', 'Earmarked transfers'],
    links: [{ label: 'Open coverage question', href: '?view=dashboard&item=q-2' }],
  },
  {
    institutionId: 'moj', x: 860, y: 200, interest: 3, influence: 5, stance: 'not engaged',
    summary: 'Provides legal opinions on draft regulations.',
    responsibilities: ['Legal review of draft regulations', 'Opinions on applicability of existing frameworks'],
    position: 'Not yet engaged (illustrative).',
    levers: ['Legal opinion'],
    links: [],
  },
  {
    institutionId: 'ntc', x: 500, y: 360, interest: 9, influence: 6, stance: 'supportive', matrixLabelLeft: true,
    summary: 'Technical lead for the national TB programme.',
    responsibilities: ['Technical guidance and programme data', 'Monitoring of treatment outcomes', 'Training of providers'],
    position: 'Supportive; offers to set minimum standards and host reporting (illustrative).',
    levers: ['Standards', 'Programme data', 'Provider training'],
    links: [{ label: 'Open standards question', href: '?view=dashboard&item=q-4' }],
  },
  {
    institutionId: 'shif', x: 860, y: 400, interest: 4, influence: 7, stance: 'cautious', matrixLabelLeft: true,
    summary: 'Administers compulsory social health insurance (generic).',
    responsibilities: ['Purchases services within the insurance package', 'Sets provider accreditation and payment rules'],
    position: 'Cautious about adding non-medical services to the package (illustrative).',
    levers: ['Tariffs', 'Accreditation rules'],
    links: [{ label: 'Open insurance gap', href: '?view=evidence&item=ev-18' }],
  },
  {
    institutionId: 'akimat', x: 250, y: 480, interest: 7, influence: 7, stance: 'conditional',
    summary: 'Local executive bodies with their own budgets.',
    responsibilities: ['Local budgets and social contracting', 'Regional health administration'],
    position: 'Willing if funding is earmarked; capacity varies by region (illustrative).',
    levers: ['Local social contracts', 'Regional health budgets'],
    links: [{ label: 'Open regional capacity evidence', href: '?view=evidence&item=ev-12' }],
  },
  {
    institutionId: 'ngo', x: 500, y: 560, interest: 10, influence: 4, stance: 'supportive', matrixLabelLeft: true,
    summary: 'Deliver adherence and psychosocial support today.',
    responsibilities: ['Deliver adherence and psychosocial support', 'Represent the patient voice', 'Run peer-support networks'],
    position: 'Strongly supportive; priority is predictable multi-year funding (illustrative).',
    levers: ['Service delivery', 'Public advocacy', 'Consultation input'],
    links: [{ label: 'Open consultation summary', href: '?view=evidence&item=ev-13' }],
  },
  {
    institutionId: 'gf', x: 760, y: 540, interest: 7, influence: 5, stance: 'supportive',
    summary: 'External co-financing of community components, in transition.',
    responsibilities: ['Co-finances community components during transition', 'Sets co-financing expectations'],
    position: 'Encourages domestic uptake before support declines (illustrative).',
    levers: ['Transition planning', 'Co-financing conditions'],
    links: [{ label: 'Open transition timeline', href: '?view=evidence&item=ev-11' }],
  },
  {
    institutionId: 'who', x: 150, y: 330, interest: 6, influence: 4, stance: 'supportive',
    summary: 'Normative guidance and technical assistance.',
    responsibilities: ['Normative guidance on TB care', 'Technical assistance to the Ministry of Health'],
    position: 'Supports people-centred care including patient support (illustrative).',
    levers: ['Technical assistance', 'Guidance'],
    links: [{ label: 'Open WHO guidance summary', href: '?view=evidence&item=ev-2' }],
  },
];

export const stakeholderLinks: StakeholderLink[] = [
  { from: 'mazhilis', to: 'senate', label: 'Legislative process' },
  { from: 'mazhilis', to: 'moh', label: 'Oversight and hearings' },
  { from: 'mazhilis', to: 'mof', label: 'Budget review' },
  { from: 'mazhilis', to: 'moj', label: 'Legal opinions' },
  { from: 'moh', to: 'mof', label: 'Budget requests' },
  { from: 'moh', to: 'ntc', label: 'Technical guidance' },
  { from: 'moh', to: 'shif', label: 'Benefits package' },
  { from: 'moh', to: 'akimat', label: 'Regional health administration' },
  { from: 'mof', to: 'akimat', label: 'Transfers to regions' },
  { from: 'akimat', to: 'ngo', label: 'Social contracts' },
  { from: 'ntc', to: 'ngo', label: 'Training and standards' },
  { from: 'shif', to: 'ngo', label: 'Provider accreditation (potential)' },
  { from: 'gf', to: 'ngo', label: 'Grant funding (declining)' },
  { from: 'gf', to: 'moh', label: 'Co-financing agreement' },
  { from: 'who', to: 'moh', label: 'Technical assistance' },
  { from: 'who', to: 'ntc', label: 'Normative guidance' },
];

const ev = (at: string, text: string): TaskEvent => ({ at, text });

export const tasks: Task[] = [
  {
    id: 't-1', kind: 'milestone', title: 'Issue note circulated to committee members', ownerId: 'secretariat', status: 'reviewed', start: '2026-08-25', due: '2026-09-02',
    description: 'Two-page note framing the issue, the transition timeline and the questions for members.',
    history: [ev('2026-08-25T10:00:00+05:00', 'Created by Committee secretariat'), ev('2026-09-02T16:00:00+05:00', 'Moved to Reviewed')], notes: [],
  },
  {
    id: 't-2', kind: 'task', title: 'Evidence review of international guidance', ownerId: 'research', status: 'reviewed', start: '2026-09-03', due: '2026-09-20',
    description: 'Summary of international guidance and literature on community TB support.',
    history: [ev('2026-09-03T09:30:00+05:00', 'Created by Committee secretariat'), ev('2026-09-20T15:10:00+05:00', 'Moved to Reviewed')],
    notes: [{ id: 'n-1', at: '2026-09-20T15:12:00+05:00', author: 'Parliamentary research service', text: 'Summary filed. Two items flagged as high confidence (illustrative).' }],
  },
  {
    id: 't-3', kind: 'task', title: 'Civil society consultation', ownerId: 'secretariat', status: 'reviewed', start: '2026-09-15', due: '2026-10-05',
    description: 'Round table with NGOs and patient groups on service design and funding priorities.',
    history: [ev('2026-09-15T11:00:00+05:00', 'Created'), ev('2026-10-05T17:30:00+05:00', 'Moved to Reviewed')], notes: [],
  },
  {
    id: 't-4', kind: 'task', title: 'Options paper (A, B, C) drafted', ownerId: 'research', status: 'in-progress', start: '2026-10-01', due: '2026-10-30',
    description: 'Draft decision brief comparing the three financing options against the committee criteria.',
    history: [ev('2026-10-01T09:00:00+05:00', 'Created'), ev('2026-10-08T12:00:00+05:00', 'Moved to In progress')],
    notes: [{ id: 'n-2', at: '2026-10-12T10:20:00+05:00', author: 'Parliamentary research service', text: 'First draft of the compare table done. Costs still indicative.' }],
  },
  {
    id: 't-5', kind: 'evidence-request', title: 'Joint costing of the community package', ownerId: 'moh', status: 'awaiting', start: '2026-10-06', due: '2026-12-01',
    description: 'Request for an agreed national costing from the Ministry of Health and Ministry of Finance.',
    history: [ev('2026-10-06T10:00:00+05:00', 'Request sent to Ministry of Health'), ev('2026-10-06T10:01:00+05:00', 'Moved to Awaiting action')], notes: [],
  },
  {
    id: 't-6', kind: 'evidence-request', title: 'Legal opinion on social contracting for TB support', ownerId: 'moj', status: 'awaiting', start: '2026-10-08', due: '2026-12-15',
    description: 'Opinion on whether the existing social contracting framework covers TB patient support.',
    history: [ev('2026-10-08T14:00:00+05:00', 'Request sent to Ministry of Justice')], notes: [],
  },
  {
    id: 't-7', kind: 'task', title: 'Insurance-package eligibility analysis', ownerId: 'shif', status: 'blocked', start: '2026-10-10', due: '2027-01-20',
    description: 'Analysis of whether non-medical support can be reimbursed under the insurance package.',
    history: [ev('2026-10-10T09:00:00+05:00', 'Created'), ev('2026-10-13T11:00:00+05:00', 'Marked Blocked: depends on costing')],
    notes: [{ id: 'n-3', at: '2026-10-13T11:02:00+05:00', author: 'Committee secretariat', text: 'Blocked until the joint costing is received.' }],
  },
  {
    id: 't-8', kind: 'milestone', title: 'Committee hearing with Government', ownerId: 'mazhilis', status: 'awaiting', start: '2027-01-15', due: '2027-02-10',
    description: 'Hearing with Ministry of Health and Ministry of Finance representatives on the options.',
    history: [ev('2026-10-02T10:00:00+05:00', 'Scheduled (illustrative)')], notes: [],
  },
  {
    id: 't-9', kind: 'task', title: 'Draft inquiry letter on transition timeline', ownerId: 'secretariat', status: 'in-progress', start: '2026-10-12', due: '2026-10-24',
    description: 'Letter asking the Ministry of Health for the agreed transition schedule for community components.',
    history: [ev('2026-10-12T09:00:00+05:00', 'Created')], notes: [],
  },
  {
    id: 't-10', kind: 'task', title: 'Prepare briefing pack for members', ownerId: 'secretariat', status: 'awaiting', start: '2026-10-20', due: '2026-11-05',
    description: 'Members’ pack: decision brief, evidence summary and stakeholder map.',
    history: [ev('2026-10-14T09:00:00+05:00', 'Created')], notes: [],
  },
  {
    id: 't-11', kind: 'task', title: 'Minimum service standard for NGO providers', ownerId: 'ntc', status: 'in-progress', start: '2026-10-09', due: '2026-12-01',
    description: 'Draft minimum standard and reporting indicators for community TB support.',
    history: [ev('2026-10-09T10:00:00+05:00', 'Created'), ev('2026-10-11T10:00:00+05:00', 'Moved to In progress')], notes: [],
  },
];

export const activity: Activity[] = [
  { id: 'a-1', at: '2026-10-14T16:20:00+05:00', actor: 'Parliamentary research service', text: 'added evidence “Technical position of the national TB centre”', ref: { view: 'evidence', item: 'ev-15' } },
  { id: 'a-2', at: '2026-10-14T11:05:00+05:00', actor: 'Committee secretariat', text: 'created task “Prepare briefing pack for members”', ref: { view: 'tracker', item: 't-10' } },
  { id: 'a-3', at: '2026-10-13T11:00:00+05:00', actor: 'Committee secretariat', text: 'marked “Insurance-package eligibility analysis” as Blocked', ref: { view: 'tracker', item: 't-7' } },
  { id: 'a-4', at: '2026-10-12T10:20:00+05:00', actor: 'Parliamentary research service', text: 'commented on “Options paper (A, B, C) drafted”', ref: { view: 'tracker', item: 't-4' } },
  { id: 'a-5', at: '2026-10-08T14:00:00+05:00', actor: 'Committee secretariat', text: 'requested a legal opinion from the Ministry of Justice', ref: { view: 'tracker', item: 't-6' } },
  { id: 'a-6', at: '2026-10-05T17:30:00+05:00', actor: 'Committee secretariat', text: 'completed the civil society consultation', ref: { view: 'evidence', item: 'ev-13' } },
];

export const notifications: Notification[] = [
  { id: 'n-a', at: '2026-10-15T08:40:00+05:00', title: 'Deadline approaching', body: 'Inquiry letter on transition timeline is due 24 Oct.', ref: { view: 'tracker', item: 't-9' }, read: false },
  { id: 'n-b', at: '2026-10-14T16:20:00+05:00', title: 'New evidence added', body: 'Technical position of the national TB centre', ref: { view: 'evidence', item: 'ev-15' }, read: false },
  { id: 'n-c', at: '2026-10-13T11:00:00+05:00', title: 'Task blocked', body: 'Insurance-package eligibility analysis depends on the costing.', ref: { view: 'tracker', item: 't-7' }, read: false },
  { id: 'n-d', at: '2026-10-10T09:15:00+05:00', title: 'Question overdue soon', body: 'Transition timeline question is due 10 Nov.', ref: { view: 'dashboard', item: 'q-5' }, read: true },
];

/** Illustrative financing transition, KZT bn per year. Not official data. */
export const financingTransition: { year: string; external: number; domestic: number }[] = [
  { year: '2024', external: 1.6, domestic: 0.2 },
  { year: '2025', external: 1.4, domestic: 0.3 },
  { year: '2026', external: 1.1, domestic: 0.5 },
  { year: '2027', external: 0.6, domestic: 0.6 },
  { year: '2028', external: 0.2, domestic: 0.7 },
];
