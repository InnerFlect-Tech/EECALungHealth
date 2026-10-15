// Illustrative demo scenario. Every figure, date, document and position here is
// invented for demonstration and is NOT official data.

export type Confidence = 'high' | 'medium' | 'low';
export type EvidenceType = 'research' | 'legislation' | 'financing' | 'stakeholder' | 'gap';
export type Status = 'done' | 'in-progress' | 'awaiting' | 'blocked';

export interface Issue {
  title: string;
  country: string;
  summary: string;
  deadline: string;
  deadlineLabel: string;
  stage: string;
  stageIndex: number;
  stages: string[];
  institutions: { name: string; role: string }[];
  questions: { q: string; owner: string; priority: 'high' | 'medium' }[];
  kpis: { label: string; value: string; note: string }[];
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  source: string;
  sourceType: string;
  confidence: Confidence;
  summary: string;
  relevance: string;
}

export interface Option {
  id: string;
  short: string;
  title: string;
  mechanism: string;
  cost: string;
  costNote: string;
  timeToImplement: string;
  sustainability: 1 | 2 | 3;
  feasibility: 1 | 2 | 3;
  ngoReach: 1 | 2 | 3;
  pros: string[];
  cons: string[];
  risks: string[];
  legalBasis: string;
  recommended?: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  group: 'parliament' | 'government' | 'technical' | 'implementer' | 'civil' | 'funder';
  responsibilities: string[];
  interest: string;
  position: string;
  x: number;
  y: number;
}

export interface TrackerItem {
  id: string;
  title: string;
  owner: string;
  status: Status;
  date: string;
  note: string;
}

export const issue: Issue = {
  title: 'Securing sustainable domestic financing for community-based TB patient support',
  country: 'Republic of Kazakhstan',
  summary:
    'Psychosocial and adherence support for people on TB treatment (including drug-resistant TB) is delivered largely by NGOs, with a significant share historically funded by external grants. As external funding transitions out, parliament is asked to consider how these services can be sustained from domestic sources.',
  deadline: '2027-03-31',
  deadlineLabel: '31 March 2027 (illustrative)',
  stage: 'Options analysis',
  stageIndex: 2,
  stages: ['Issue framing', 'Evidence review', 'Options analysis', 'Committee hearing', 'Decision'],
  institutions: [
    { name: 'Mazhilis Committee on Social and Cultural Development', role: 'Lead committee (illustrative assignment)' },
    { name: 'Ministry of Health of the Republic of Kazakhstan', role: 'Policy owner' },
    { name: 'Ministry of Finance of the Republic of Kazakhstan', role: 'Budget planning' },
  ],
  questions: [
    { q: 'What is the full annual cost of community-based support at national scale?', owner: 'Ministry of Health / national TB centre', priority: 'high' },
    { q: 'Can social contracting through akimat budgets guarantee consistent coverage across regions?', owner: 'Ministry of Finance', priority: 'high' },
    { q: 'Would inclusion in the compulsory social health insurance package require amendments to secondary legislation?', owner: 'Committee legal advisers', priority: 'medium' },
    { q: 'What quality and reporting standards should apply to NGO providers?', owner: 'National TB centre', priority: 'medium' },
  ],
  kpis: [
    { label: 'Evidence items reviewed', value: '9 / 12', note: '3 gaps open' },
    { label: 'Policy options', value: '3', note: '1 recommended' },
    { label: 'Actions awaiting', value: '4', note: '2 with Government' },
    { label: 'Days to deadline', value: '167', note: 'Illustrative' },
  ],
};

export const evidence: EvidenceItem[] = [
  { id: 'e1', type: 'research', title: 'Treatment outcomes with and without community adherence support', source: 'Systematic reviews (WHO-cited literature)', sourceType: 'Peer-reviewed synthesis', confidence: 'high', summary: 'International evidence associates patient-centred adherence and psychosocial support with improved treatment success and fewer losses to follow-up.', relevance: 'Supports the case that services are worth sustaining.' },
  { id: 'e2', type: 'research', title: 'WHO consolidated guidelines on tuberculosis: treatment and care', source: 'World Health Organization', sourceType: 'International guideline', confidence: 'high', summary: 'Recommends health education, counselling and material and psychological support for people with TB.', relevance: 'Normative basis for the service package.' },
  { id: 'e3', type: 'legislation', title: 'Code "On Public Health and the Healthcare System" (2020)', source: 'Republic of Kazakhstan', sourceType: 'Primary legislation', confidence: 'high', summary: 'Framework law governing healthcare delivery, the guaranteed volume of free medical care and compulsory social health insurance.', relevance: 'Determines which financing channels are legally available.' },
  { id: 'e4', type: 'legislation', title: 'Legal framework for state social contracting with NGOs', source: 'National legislation (described generically)', sourceType: 'Primary legislation', confidence: 'medium', summary: 'Kazakhstan has a legal mechanism allowing central and local authorities to contract NGOs for social services.', relevance: 'Basis for Option B; applicability to TB support needs legal confirmation.' },
  { id: 'e5', type: 'financing', title: 'Indicative annual cost of national community support', source: 'Demo costing model', sourceType: 'Illustrative estimate', confidence: 'low', summary: 'Illustrative range only: KZT 1.5–2.5 bn per year depending on coverage and package scope.', relevance: 'Needed to size any budget line; must be replaced by an official costing.' },
  { id: 'e6', type: 'financing', title: 'External grant transition timeline', source: 'Funder transition planning (generic)', sourceType: 'Programme document', confidence: 'medium', summary: 'External support for community components is expected to decline over the transition period, with co-financing commitments increasing.', relevance: 'Defines the urgency of the decision.' },
  { id: 'e7', type: 'stakeholder', title: 'Civil society consultation summary', source: 'Demo consultation', sourceType: 'Stakeholder input', confidence: 'medium', summary: 'NGO and patient-group participants (illustrative) prioritise predictable multi-year contracts and simple reporting.', relevance: 'Informs design of any contracting mechanism.' },
  { id: 'e8', type: 'stakeholder', title: 'Regional implementer perspective', source: 'Demo interviews', sourceType: 'Stakeholder input', confidence: 'low', summary: 'Illustrative: regions differ widely in capacity to run social procurement.', relevance: 'Risk for a decentralised option.' },
  { id: 'e9', type: 'gap', title: 'No official national costing of the community package', source: 'Evidence gap', sourceType: 'Gap', confidence: 'low', summary: 'An agreed costing is required before a budget line can be proposed.', relevance: 'Blocks precise budget proposals.' },
  { id: 'e10', type: 'gap', title: 'Outcome data from domestically funded pilots', source: 'Evidence gap', sourceType: 'Gap', confidence: 'low', summary: 'Little published data on outcomes when services are funded domestically rather than by grants.', relevance: 'Weakens value-for-money arguments.' },
  { id: 'e11', type: 'gap', title: 'Insurance-package eligibility for non-medical services', source: 'Evidence gap', sourceType: 'Gap', confidence: 'medium', summary: 'Unclear whether psychosocial support delivered by NGOs can be reimbursed under current rules.', relevance: 'Key uncertainty for Option C.' },
];

export const options: Option[] = [
  {
    id: 'A', short: 'State budget line', title: 'Dedicated line in the republican health budget',
    mechanism: 'Ministry of Health receives a ring-fenced allocation and contracts providers centrally.',
    cost: 'KZT 2.0 bn / yr', costNote: 'Indicative, illustrative only', timeToImplement: '12–18 months (next budget cycle)',
    sustainability: 2, feasibility: 2, ngoReach: 2,
    pros: ['Visible, protected allocation', 'Uniform national standards', 'Clear accountability to parliament'],
    cons: ['Subject to annual budget negotiation', 'Central procurement may crowd out small NGOs'],
    risks: ['Allocation cut in fiscal tightening', 'Delay if missed in the budget cycle'],
    legalBasis: 'Budget law procedure; no new primary legislation expected (to be confirmed).',
  },
  {
    id: 'B', short: 'Social contracting', title: 'Social contracting of NGOs through local akimat budgets',
    mechanism: 'Regional akimats commission NGOs under the state social contracting mechanism, with national standards.',
    cost: 'KZT 1.6 bn / yr', costNote: 'Indicative, illustrative only', timeToImplement: '6–12 months',
    sustainability: 2, feasibility: 3, ngoReach: 3,
    pros: ['Uses an existing legal mechanism', 'Keeps services close to communities', 'Builds on NGO experience'],
    cons: ['Uneven regional capacity', 'Short contract cycles'],
    risks: ['Coverage gaps in low-capacity regions', 'Fragmented reporting'],
    legalBasis: 'Existing social contracting framework; may need a ministerial standard for TB support.',
    recommended: true,
  },
  {
    id: 'C', short: 'Insurance package', title: 'Integration into the compulsory social health insurance package',
    mechanism: 'Community support becomes a reimbursable service under compulsory social health insurance.',
    cost: 'KZT 2.4 bn / yr', costNote: 'Indicative, illustrative only', timeToImplement: '18–30 months',
    sustainability: 3, feasibility: 1, ngoReach: 1,
    pros: ['Most durable, rules-based financing', 'Linked to clinical pathways'],
    cons: ['NGOs may struggle to meet provider accreditation', 'Coverage limited to insured people'],
    risks: ['Excludes uninsured patients', 'Long regulatory process'],
    legalBasis: 'Likely requires amendments to secondary legislation on the insurance package.',
  },
];

export const recommendation = {
  text: 'Ask the lead committee to request a joint Ministry of Health / Ministry of Finance costing and a legal opinion on Option B, while scoping Option C as a medium-term pathway.',
  step: 'Committee hearing with Government representatives',
  owner: 'Mazhilis Committee on Social and Cultural Development (illustrative)',
};

export const stakeholders: Stakeholder[] = [
  { id: 'mazhilis', name: 'Mazhilis committee', group: 'parliament', x: 25, y: 14, responsibilities: ['Reviews draft laws and budget', 'Holds hearings with Government', 'Can issue parliamentary inquiries'], interest: 'High', position: 'Leading the review (illustrative)' },
  { id: 'senate', name: 'Senate committee', group: 'parliament', x: 75, y: 14, responsibilities: ['Approves or returns laws adopted by the Mazhilis', 'Regional representation perspective'], interest: 'Medium', position: 'Not yet engaged (illustrative)' },
  { id: 'moh', name: 'Ministry of Health', group: 'government', x: 22, y: 45, responsibilities: ['TB policy and clinical standards', 'Defines the guaranteed volume of care', 'Prepares health budget requests'], interest: 'High', position: 'Supportive in principle (illustrative)' },
  { id: 'mof', name: 'Ministry of Finance', group: 'government', x: 78, y: 45, responsibilities: ['Budget planning and execution', 'Assesses fiscal impact of new lines'], interest: 'Medium', position: 'Requests costing before commitment (illustrative)' },
  { id: 'ntc', name: 'National TB centre', group: 'technical', x: 50, y: 30, responsibilities: ['Technical guidance and data', 'Programme monitoring', 'Training of providers'], interest: 'High', position: 'Supportive (illustrative)' },
  { id: 'akimat', name: 'Regional akimats', group: 'implementer', x: 18, y: 78, responsibilities: ['Local budgets and social contracting', 'Regional health administration'], interest: 'Medium', position: 'Varies by region (illustrative)' },
  { id: 'ngo', name: 'NGOs & patient groups', group: 'civil', x: 50, y: 82, responsibilities: ['Deliver adherence and psychosocial support', 'Represent patient voice'], interest: 'Very high', position: 'Strongly supportive (illustrative)' },
  { id: 'fund', name: 'External funders (e.g. Global Fund, in transition)', group: 'funder', x: 82, y: 78, responsibilities: ['Co-finances community components during transition', 'Sets co-financing expectations'], interest: 'Medium', position: 'Encourages domestic uptake (illustrative)' },
];

export const links: [string, string][] = [
  ['mazhilis', 'senate'], ['mazhilis', 'moh'], ['mazhilis', 'mof'], ['moh', 'ntc'], ['moh', 'mof'],
  ['moh', 'akimat'], ['ntc', 'ngo'], ['akimat', 'ngo'], ['fund', 'ngo'], ['fund', 'moh'],
];

export const tracker: TrackerItem[] = [
  { id: 't1', title: 'Issue note circulated to committee members', owner: 'Committee secretariat', status: 'done', date: '2026-09-02', note: 'Illustrative' },
  { id: 't2', title: 'Evidence review of international guidance', owner: 'Parliamentary research service', status: 'done', date: '2026-09-20', note: 'Illustrative' },
  { id: 't3', title: 'Civil society consultation', owner: 'Committee secretariat', status: 'done', date: '2026-10-05', note: 'Illustrative' },
  { id: 't4', title: 'Options paper (A, B, C) drafted', owner: 'Health-policy adviser', status: 'in-progress', date: '2026-10-30', note: 'Illustrative' },
  { id: 't5', title: 'Joint costing of community package', owner: 'Ministry of Health / Ministry of Finance', status: 'awaiting', date: '2026-12-01', note: 'Requested; not yet received' },
  { id: 't6', title: 'Legal opinion on social contracting for TB support', owner: 'Ministry of Justice / committee legal advisers', status: 'awaiting', date: '2026-12-15', note: 'Illustrative' },
  { id: 't7', title: 'Insurance-package eligibility analysis', owner: 'Insurance fund (generic)', status: 'blocked', date: '2027-01-20', note: 'Depends on costing' },
  { id: 't8', title: 'Committee hearing with Government', owner: 'Mazhilis committee', status: 'awaiting', date: '2027-02-10', note: 'Illustrative' },
];
