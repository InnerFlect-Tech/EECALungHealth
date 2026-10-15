// Direction B, "Order Paper": the sitting calendar.
//
// The sittings, their dates and their orders of business are invented for this
// design review and are plainly illustrative. Everything they point at
// (questions, evidence, tasks, options) is the existing stub data in
// ../../kazakhstanScenario.ts.

import {
  evidence,
  institutions,
  issue,
  options,
  questions,
  tasks,
  type OptionId,
} from '../../kazakhstanScenario';

export type SittingKind = 'committee' | 'hearing' | 'plenary' | 'budget' | 'decision';
export type Readiness = 'ready' | 'awaiting' | 'blocked';
export type StampKind = 'RECEIVED' | 'LAID' | 'DEFERRED' | 'AGREED' | 'BLOCKED' | 'ANSWERED';

export interface AgendaItem {
  /** Order-paper wording, e.g. "Questions to the Ministry of Finance". */
  title: string;
  /** Procedural rubric shown after an em dash, e.g. "for decision". */
  rubric?: string;
  /** Institution responsible for the item. */
  ownerId: string;
  readiness: Readiness;
  /** Institution being waited on (defaults to the owner). */
  awaitingId?: string;
  stamp?: StampKind;
  /** Clerk's note, in the voice of the order paper. */
  note: string;
  questions?: string[];
  evidence?: string[];
  tasks?: string[];
  options?: OptionId[];
}

export interface Sitting {
  ref: string;
  kind: SittingKind;
  /** ISO date (local, Astana). */
  date: string;
  time: string;
  /** Short label shown on the spine. */
  short: string;
  place: string;
  items: AgendaItem[];
}

export const KIND_LABEL: Record<SittingKind, string> = {
  committee: 'Committee sitting',
  hearing: 'Committee hearing',
  plenary: 'Plenary sitting',
  budget: 'Budget deadline',
  decision: 'Decision deadline',
};

/** The review is dated 15 October 2026; "today" is fixed so the demo reads the same for everyone. */
export const TODAY = '2026-10-15';

const ROOM = 'Committee room, Mazhilis (illustrative)';

export const sittings: Sitting[] = [
  {
    ref: 'CS-01', kind: 'committee', date: '2026-09-02', time: '10.00', short: 'Issue framing', place: ROOM,
    items: [
      { title: 'Issue note', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready', stamp: 'AGREED', tasks: ['t-1'],
        note: 'The committee agreed to take up the issue and adopted the issue note as the basis of its inquiry.' },
      { title: 'Commissioning of evidence', rubric: 'international guidance', ownerId: 'research', readiness: 'ready', stamp: 'AGREED', tasks: ['t-2'], questions: ['q-6'],
        note: 'The research service was asked to summarise international guidance on TB patient support.' },
      { title: 'Programme of work', rubric: 'to 31 March 2027', ownerId: 'mazhilis', readiness: 'ready', stamp: 'AGREED',
        note: 'An indicative programme of sittings to the decision deadline was agreed (illustrative).' },
    ],
  },
  {
    ref: 'CS-02', kind: 'committee', date: '2026-09-23', time: '10.00', short: 'Evidence review', place: ROOM,
    items: [
      { title: 'Minutes of the sitting of 2 September', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready', stamp: 'AGREED',
        note: 'Minutes agreed without amendment.' },
      { title: 'Evidence received', rubric: 'international guidance', ownerId: 'research', readiness: 'ready', stamp: 'RECEIVED', evidence: ['ev-1', 'ev-2', 'ev-3'], tasks: ['t-2'], questions: ['q-6'],
        note: 'Summary of international guidance and literature received from the research service.' },
      { title: 'Legislative framework', rubric: 'briefing by legal advisers', ownerId: 'legal', readiness: 'ready', stamp: 'LAID', evidence: ['ev-6', 'ev-7', 'ev-8'],
        note: 'Briefing on the legal channels available for financing laid before the committee.' },
      { title: 'Questions for transmission to Government', rubric: 'for agreement', ownerId: 'mazhilis', readiness: 'ready', stamp: 'AGREED', questions: ['q-1', 'q-2', 'q-3'],
        note: 'Agreed for transmission to the Ministries of Health and Finance and to the committee legal advisers.' },
      { title: 'Civil society consultation', rubric: 'terms of reference', ownerId: 'secretariat', readiness: 'ready', stamp: 'AGREED', tasks: ['t-3'],
        note: 'Round table with NGOs and patient groups agreed for early October.' },
    ],
  },
  {
    ref: 'CS-03', kind: 'committee', date: '2026-10-07', time: '10.00', short: 'Consultation and costing', place: ROOM,
    items: [
      { title: 'Minutes of the sitting of 23 September', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready', stamp: 'AGREED',
        note: 'Minutes agreed without amendment.' },
      { title: 'Evidence received', rubric: 'civil society consultation', ownerId: 'secretariat', readiness: 'ready', stamp: 'RECEIVED', evidence: ['ev-13', 'ev-5'], tasks: ['t-3'],
        note: 'Report of the round table received; regional comparison of social contracting laid alongside it.' },
      { title: 'Indicative costing', rubric: 'demo costing model', ownerId: 'research', readiness: 'ready', stamp: 'LAID', evidence: ['ev-10', 'ev-16', 'ev-11'],
        note: 'Illustrative range laid. Members noted that no official costing exists.' },
      { title: 'Further questions and requests for evidence', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready', stamp: 'AGREED', questions: ['q-4', 'q-5'], tasks: ['t-5', 't-6'],
        note: 'Requests to the Ministry of Health (joint costing) and the Ministry of Justice (legal opinion) agreed.' },
      { title: 'Briefing by the Insurance fund', rubric: 'package eligibility', ownerId: 'shif', readiness: 'ready', stamp: 'DEFERRED', evidence: ['ev-18', 'ev-9'],
        note: 'Deferred at the request of the Insurance fund (illustrative).' },
      { title: 'Options paper', rubric: 'to be commissioned', ownerId: 'research', readiness: 'ready', stamp: 'AGREED', tasks: ['t-4'],
        note: 'Research service to compare Options A, B and C against the committee criteria.' },
    ],
  },
  {
    ref: 'CS-04', kind: 'committee', date: '2026-10-22', time: '10.00', short: 'Ministry questions; options paper', place: ROOM,
    items: [
      { title: 'Minutes of the sitting of 7 October', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready', stamp: 'LAID',
        note: 'Draft minutes circulated with the papers.' },
      { title: 'Questions to the Ministry of Finance', rubric: 'regional coverage under social contracting', ownerId: 'mof', readiness: 'awaiting', questions: ['q-2'], evidence: ['ev-7', 'ev-12'],
        note: 'Written answer requested by 30 November. Members may wish to press for an interim reply before the budget window closes.' },
      { title: 'Questions to the Ministry of Health', rubric: 'national cost of the community package', ownerId: 'moh', readiness: 'awaiting', questions: ['q-1'], tasks: ['t-5'], evidence: ['ev-10', 'ev-16'],
        note: 'The joint costing is the precondition for every option. No reply received since the request of 6 October.' },
      { title: 'Evidence received since the last sitting', ownerId: 'research', readiness: 'ready', stamp: 'RECEIVED', evidence: ['ev-12', 'ev-14', 'ev-15', 'ev-4'],
        note: 'Four items received between 6 and 14 October. Two are rated low confidence.' },
      { title: 'Options paper', rubric: 'first reading, for consideration', ownerId: 'research', readiness: 'ready', stamp: 'LAID', tasks: ['t-4'], options: ['A', 'B', 'C'], evidence: ['ev-10'],
        note: 'First draft of the comparison laid. Costs remain indicative; a decision is expected at CS-05.' },
      { title: 'Budget timetable', rubric: 'note on the 2028 planning window', ownerId: 'mof', readiness: 'awaiting', evidence: ['ev-8', 'ev-11'],
        note: 'Note requested: the date by which a new republican budget programme must be filed.' },
      { title: 'Insurance-package eligibility', rubric: 'report of the Insurance fund', ownerId: 'shif', readiness: 'blocked', tasks: ['t-7'], questions: ['q-3'], evidence: ['ev-18', 'ev-9'],
        note: 'Cannot proceed until the joint costing (T-05) is received.' },
      { title: 'Minimum service standard for NGO providers', rubric: 'progress report', ownerId: 'ntc', readiness: 'ready', tasks: ['t-11'], questions: ['q-4'], evidence: ['ev-15', 'ev-2'],
        note: 'Oral update from the National TB centre on the draft standard and reporting indicators.' },
      { title: 'Correspondence', rubric: 'inquiry letter on the transition timeline, for approval', ownerId: 'secretariat', readiness: 'ready', stamp: 'LAID', tasks: ['t-9'], questions: ['q-5'], evidence: ['ev-11'],
        note: 'Draft letter laid for the Chair’s signature.' },
      { title: 'Legal opinion on social contracting', ownerId: 'moj', readiness: 'awaiting', stamp: 'DEFERRED', tasks: ['t-6'], evidence: ['ev-7'],
        note: 'Opinion not yet received. Proposed to be deferred to CS-05.' },
      { title: 'Date and business of the next sitting', ownerId: 'mazhilis', readiness: 'ready',
        note: 'Proposed: Thursday 12 November 2026 at 10.00, options analysis (CS-05).' },
    ],
  },
  {
    ref: 'CS-05', kind: 'committee', date: '2026-11-12', time: '10.00', short: 'Options analysis', place: ROOM,
    items: [
      { title: 'Minutes of the sitting of 22 October', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'ready',
        note: 'To be circulated with the papers.' },
      { title: 'Options paper', rubric: 'for decision', ownerId: 'research', readiness: 'awaiting', tasks: ['t-4'], options: ['A', 'B', 'C'], evidence: ['ev-1', 'ev-5', 'ev-10'],
        note: 'Final draft due 30 October. The committee will be asked to choose the options to put to Government at the hearing.' },
      { title: 'Questions to external funders', rubric: 'transition timeline', ownerId: 'gf', readiness: 'awaiting', questions: ['q-5'], tasks: ['t-9'], evidence: ['ev-11'],
        note: 'Answer due 10 November, two days before the sitting.' },
      { title: 'Legal opinion on social contracting', rubric: 'deferred from CS-04', ownerId: 'moj', readiness: 'awaiting', stamp: 'DEFERRED', tasks: ['t-6'], evidence: ['ev-7'],
        note: 'Carried over from the previous order of business.' },
      { title: 'Members’ briefing pack', ownerId: 'secretariat', readiness: 'awaiting', tasks: ['t-10'],
        note: 'Decision brief, evidence summary and stakeholder map, due 5 November.' },
      { title: 'Evidence gap', rubric: 'outcomes of domestically funded services', ownerId: 'ntc', readiness: 'awaiting', evidence: ['ev-17', 'ev-4'],
        note: 'The National TB centre is asked whether regional pilots could fill the gap.' },
      { title: 'Date and business of the next sitting', ownerId: 'mazhilis', readiness: 'ready',
        note: 'Proposed: Wednesday 20 January 2027, legal and insurance pathway (CS-06).' },
    ],
  },
  {
    ref: 'BC-01', kind: 'budget', date: '2026-11-30', time: '18.00', short: '2028 budget requests due', place: 'Ministry of Finance (illustrative)',
    items: [
      { title: 'Budget application', rubric: 'new republican programme for community TB support', ownerId: 'moh', readiness: 'awaiting', evidence: ['ev-8'], tasks: ['t-5'],
        note: 'To be filed by the Ministry of Health if Option A is preferred.' },
      { title: 'Agreed national costing', rubric: 'precondition for the application', ownerId: 'moh', readiness: 'blocked', questions: ['q-1'], evidence: ['ev-16', 'ev-10'],
        note: 'No agreed costing exists. Without it the application cannot be filed (EV-08).' },
      { title: 'Fiscal impact and transfers to regions', rubric: 'answer of the Ministry of Finance', ownerId: 'mof', readiness: 'awaiting', questions: ['q-2'], evidence: ['ev-12'],
        note: 'Due the same day as the budget requests.' },
    ],
  },
  {
    ref: 'PL-01', kind: 'plenary', date: '2026-12-10', time: '10.00', short: 'Government hour', place: 'Plenary chamber, Mazhilis (illustrative)',
    items: [
      { title: 'Oral question to the Minister of Health', rubric: 'continuity of TB patient support during transition', ownerId: 'moh', readiness: 'awaiting', questions: ['q-5', 'q-1'], evidence: ['ev-11'],
        note: 'Tabled by a committee member (illustrative).' },
      { title: 'Written question to the Minister of Finance', rubric: 'earmarked transfers to regions', ownerId: 'mof', readiness: 'awaiting', questions: ['q-2'], evidence: ['ev-12'],
        note: 'Follow-up if no answer is received by 30 November.' },
      { title: 'Statement by the committee Chair', rubric: 'progress of the inquiry', ownerId: 'mazhilis', readiness: 'ready', evidence: ['ev-1', 'ev-2'],
        note: 'Short statement on the case for sustaining services.' },
    ],
  },
  {
    ref: 'CS-06', kind: 'committee', date: '2027-01-20', time: '10.00', short: 'Legal and insurance pathway', place: ROOM,
    items: [
      { title: 'Insurance-package eligibility', rubric: 'report of the Insurance fund', ownerId: 'shif', readiness: 'blocked', tasks: ['t-7'], questions: ['q-3'], evidence: ['ev-18', 'ev-9'],
        note: 'Still blocked on the joint costing.' },
      { title: 'Minimum service standard', rubric: 'for agreement', ownerId: 'ntc', readiness: 'awaiting', tasks: ['t-11'], questions: ['q-4'], evidence: ['ev-15', 'ev-13'],
        note: 'Final draft expected 1 December.' },
      { title: 'Legal pathway for Option C', rubric: 'note by legal advisers', ownerId: 'legal', readiness: 'awaiting', questions: ['q-3'], evidence: ['ev-6', 'ev-9'], options: ['C'],
        note: 'Which secondary instruments would need amending, and how long it would take.' },
      { title: 'Arrangements for the hearing with Government', ownerId: 'mazhilis', readiness: 'ready', tasks: ['t-8'],
        note: 'Witnesses: Ministry of Health and Ministry of Finance (illustrative).' },
    ],
  },
  {
    ref: 'HG-01', kind: 'hearing', date: '2027-02-10', time: '10.00', short: 'Hearing with Government', place: ROOM,
    items: [
      { title: 'Evidence from the Ministry of Health', ownerId: 'moh', readiness: 'awaiting', questions: ['q-1'], tasks: ['t-5'], evidence: ['ev-10'],
        note: 'Witnesses to be confirmed.' },
      { title: 'Evidence from the Ministry of Finance', ownerId: 'mof', readiness: 'awaiting', questions: ['q-2'], evidence: ['ev-8', 'ev-12'],
        note: 'Witnesses to be confirmed.' },
      { title: 'Examination of Options A, B and C', ownerId: 'research', readiness: 'awaiting', options: ['A', 'B', 'C'], tasks: ['t-4'],
        note: 'Members question witnesses against the committee criteria.' },
      { title: 'Proposed next step', rubric: 'motion of the lead committee', ownerId: 'mazhilis', readiness: 'ready', tasks: ['t-8'],
        note: 'Ask the lead committee to request a joint Ministry of Health and Ministry of Finance costing and a legal opinion on social contracting, then hold a hearing with Government before the budget planning window closes.' },
    ],
  },
  {
    ref: 'DL-01', kind: 'decision', date: '2027-03-31', time: '18.00', short: 'Recommendation adopted', place: ROOM,
    items: [
      { title: 'Committee recommendation', rubric: 'for decision', ownerId: 'mazhilis', readiness: 'awaiting', options: ['A', 'B', 'C'],
        note: 'The committee adopts its recommendation on domestic financing.' },
      { title: 'Report to the Mazhilis', rubric: 'for agreement', ownerId: 'secretariat', readiness: 'awaiting', tasks: ['t-10'],
        note: 'Report and recommendation laid before the chamber.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reference grammar

const pad = (n: string) => n.padStart(2, '0');

/** 'q-4' → 'Q-04', 'ev-12' → 'EV-12', 't-7' → 'T-07'. */
export function refOf(id: string): string {
  const m = /^([a-z]+)-(\d+)$/.exec(id);
  return m ? `${m[1].toUpperCase()}-${pad(m[2])}` : id.toUpperCase();
}

export const optionRef = (id: OptionId) => `OPT-${id}`;
export const itemRef = (s: Sitting, n: number) => `${s.ref}/${n}`;

/** Accepts loose input ("q4", "ev 12", "cs4.3", "option b") and returns the canonical reference. */
export function normalizeRef(raw: string): string {
  const s = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!s) return '';
  let m = /^PI-?(\d{4})-?(\d{1,3})$/.exec(s);
  if (m) return `PI-${m[1]}-${m[2].padStart(3, '0')}`;
  m = /^(?:OPT|OPTION)-?([ABC])$/.exec(s);
  if (m) return `OPT-${m[1]}`;
  m = /^(CS|HG|PL|BC|DL)-?(\d{1,2})(?:[/.](\d{1,2}))?$/.exec(s);
  if (m) return `${m[1]}-${pad(m[2])}${m[3] ? `/${Number(m[3])}` : ''}`;
  m = /^(Q|EV|T)-?(\d{1,2})$/.exec(s);
  if (m) return `${m[1]}-${pad(m[2])}`;
  return s;
}

export interface RefEntry {
  ref: string;
  kind: 'issue' | 'sitting' | 'item' | 'question' | 'evidence' | 'task' | 'option';
  label: string;
}

const instShort = (id: string) => institutions.find((i) => i.id === id)?.short ?? id;

export const refIndex: RefEntry[] = [
  { ref: issue.ref, kind: 'issue', label: issue.title },
  ...sittings.flatMap((s) => [
    { ref: s.ref, kind: 'sitting' as const, label: `${KIND_LABEL[s.kind]} · ${s.short}` },
    ...s.items.map((it, i) => ({ ref: itemRef(s, i + 1), kind: 'item' as const, label: `${it.title}${it.rubric ? ` — ${it.rubric}` : ''}` })),
  ]),
  ...questions.map((q) => ({ ref: refOf(q.id), kind: 'question' as const, label: `${q.text} (${instShort(q.ownerId)})` })),
  ...evidence.map((e) => ({ ref: refOf(e.id), kind: 'evidence' as const, label: e.title })),
  ...tasks.map((t) => ({ ref: refOf(t.id), kind: 'task' as const, label: t.title })),
  ...options.map((o) => ({ ref: optionRef(o.id), kind: 'option' as const, label: o.title })),
];

/** Every paper reference an agenda item carries (Q-, EV-, T-, OPT-). */
export function papersOf(item: AgendaItem): string[] {
  return [
    ...(item.questions ?? []).map(refOf),
    ...(item.evidence ?? []).map(refOf),
    ...(item.tasks ?? []).map(refOf),
    ...(item.options ?? []).map(optionRef),
  ];
}
