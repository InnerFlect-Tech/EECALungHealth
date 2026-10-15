// Direction C, "Chamber": stub layer on top of the shared scenario.
//
// The per-option stances, the notes and the "what would move them" asks below
// are INVENTED for the design review. They are illustrative only and are not
// anyone's recorded position. Everything else comes from kazakhstanScenario.ts.

import {
  evidence,
  institutions,
  questions,
  stakeholderProfiles,
  type EvidenceItem,
  type Institution,
  type OptionId,
  type Question,
  type StakeholderProfile,
} from '../../kazakhstanScenario';

export type ChamberStance = 'supportive' | 'conditional' | 'cautious' | 'not engaged' | 'opposed';

/** Seating order, left of the chamber to right. */
export const STANCES: ChamberStance[] = ['supportive', 'conditional', 'cautious', 'not engaged', 'opposed'];

/** How much of an actor's influence counts towards the motion. */
export const STANCE_WEIGHT: Record<ChamberStance, number> = {
  supportive: 1,
  conditional: 0.5,
  cautious: 0,
  'not engaged': 0,
  opposed: 0,
};

export const STANCE_LABEL: Record<ChamberStance, string> = {
  supportive: 'Supportive',
  conditional: 'Conditional',
  cautious: 'Cautious',
  'not engaged': 'Not engaged',
  opposed: 'Opposed',
};

export const THRESHOLD = 0.6;
export const SEATS_PER_INFLUENCE = 5;

export interface Position { stance: ChamberStance; note: string; cites: string[] }

const p = (stance: ChamberStance, note: string, cites: string[] = []): Position => ({ stance, note, cites });

/** Illustrative stance of each actor on each option (stub, invented). */
export const positions: Record<OptionId, Record<string, Position>> = {
  A: {
    mazhilis: p('supportive', 'Favours a protected line that Parliament can follow through budget hearings.', ['ev-8']),
    senate: p('not engaged', 'No position recorded; a budget line would reach the Senate only through the budget law.'),
    moh: p('supportive', 'Would administer the line and contract providers against a national standard.', ['ev-6', 'ev-15']),
    mof: p('opposed', 'Resists a new republican programme while no agreed costing exists.', ['ev-8', 'ev-16']),
    moj: p('not engaged', 'No legal question put to the ministry under this option.'),
    ntc: p('supportive', 'Uniform national standards suit central contracting.', ['ev-15']),
    shif: p('not engaged', 'The insurance fund has no role in a budget-line model.'),
    akimat: p('cautious', 'Central procurement would bypass regional contracting and local knowledge.', ['ev-14']),
    ngo: p('conditional', 'Supportive if central procurement does not crowd out small NGOs.', ['ev-13']),
    gf: p('supportive', 'A visible domestic line meets co-financing expectations.', ['ev-11']),
    who: p('supportive', 'Consistent with people-centred care and the guidance on patient support.', ['ev-2']),
  },
  B: {
    mazhilis: p('supportive', 'Sees social contracting as the fastest route that avoids a gap in services.', ['ev-11', 'ev-7']),
    senate: p('not engaged', 'Will see the question only if a law changes; no position yet.'),
    moh: p('supportive', 'Supportive if a national standard governs every regional contract.', ['ev-15', 'ev-5']),
    mof: p('cautious', 'Wants an agreed costing and a limit on new transfers to regions before committing.', ['ev-16', 'ev-12']),
    moj: p('not engaged', 'A legal opinion on social contracting has been requested and is not yet given.', ['ev-7']),
    ntc: p('supportive', 'Offers to set the minimum standard and host outcome reporting.', ['ev-15']),
    shif: p('not engaged', 'Social contracting sits outside the insurance package.'),
    akimat: p('conditional', 'Willing if funding is earmarked; procurement capacity varies widely by region.', ['ev-12', 'ev-14']),
    ngo: p('supportive', 'Builds on existing NGO delivery; the priority is multi-year contracts.', ['ev-13', 'ev-5']),
    gf: p('supportive', 'Keeps community delivery intact through the transition.', ['ev-11']),
    who: p('supportive', 'Guidance recognises community providers as delivery partners.', ['ev-2']),
  },
  C: {
    mazhilis: p('conditional', 'Values durable financing but fears a gap during a long rule change.', ['ev-9', 'ev-11']),
    senate: p('not engaged', 'No position recorded.'),
    moh: p('conditional', 'Would have to propose the package change; timing is uncertain.', ['ev-9', 'ev-6']),
    mof: p('cautious', 'Less exposure for the budget, but the effect on contributions is unknown.', ['ev-10']),
    moj: p('not engaged', 'Secondary legislation would be needed; not yet consulted.', ['ev-9']),
    ntc: p('supportive', 'Links patient support to clinical pathways.', ['ev-15', 'ev-1']),
    shif: p('opposed', 'Does not reimburse non-medical services under current rules.', ['ev-18', 'ev-9']),
    akimat: p('not engaged', 'No regional role once services are paid through insurance.'),
    ngo: p('cautious', 'Provider accreditation could exclude small NGOs.', ['ev-13', 'ev-9']),
    gf: p('conditional', 'Durable, but likely too slow for the transition timeline.', ['ev-11']),
    who: p('supportive', 'Rules-based financing aligns with the guidance.', ['ev-2']),
  },
};

export type AskKind = 'Costing' | 'Evidence' | 'Meeting' | 'Legal opinion' | 'Standard' | 'Guarantee';

export interface Ask { kind: AskKind; text: string; cites: string[]; questions: string[] }

const ask = (kind: AskKind, text: string, cites: string[], qs: string[] = []): Ask => ({ kind, text, cites, questions: qs });

/** What would move each actor (stub, invented). */
export const asks: Record<string, Ask[]> = {
  mazhilis: [
    ask('Costing', 'A joint Health and Finance costing to table at the hearing.', ['ev-10', 'ev-16'], ['q-1']),
    ask('Meeting', 'A hearing with Government before the budget planning window closes.', ['ev-8', 'ev-11'], ['q-5']),
  ],
  senate: [
    ask('Meeting', 'An early briefing for the committee chair on regional coverage.', ['ev-12', 'ev-14'], ['q-2']),
    ask('Legal opinion', 'Confirmation that no primary legislation is required.', ['ev-7', 'ev-6'], ['q-3']),
  ],
  moh: [
    ask('Standard', 'Agreement that one national minimum standard applies whichever channel is chosen.', ['ev-15', 'ev-2'], ['q-4']),
    ask('Costing', 'A costing the ministry co-owns with Finance, replacing the demo range.', ['ev-10', 'ev-16'], ['q-1']),
  ],
  mof: [
    ask('Costing', 'An agreed national costing of the community package.', ['ev-10', 'ev-16'], ['q-1']),
    ask('Evidence', 'A design for earmarked transfers that caps exposure in low-capacity regions.', ['ev-12', 'ev-5'], ['q-2']),
    ask('Meeting', 'A meeting at deputy-minister level on the transition schedule.', ['ev-11'], ['q-5']),
  ],
  moj: [
    ask('Legal opinion', 'A formal opinion on whether social contracting covers TB patient support.', ['ev-7', 'ev-6'], ['q-3']),
  ],
  ntc: [
    ask('Standard', 'A mandate to host outcome reporting for all providers.', ['ev-15', 'ev-4'], ['q-4']),
    ask('Evidence', 'Outcome data from domestically funded pilots.', ['ev-17'], []),
  ],
  shif: [
    ask('Evidence', 'A tariff and eligibility analysis for non-medical support.', ['ev-18', 'ev-9'], ['q-3']),
    ask('Standard', 'An accreditation route that NGO providers can realistically meet.', ['ev-13', 'ev-9'], ['q-4']),
  ],
  akimat: [
    ask('Costing', 'Earmarked transfers so that regional budgets are not stretched.', ['ev-12', 'ev-14'], ['q-2']),
    ask('Standard', 'A model contract and national service standard.', ['ev-5', 'ev-7'], ['q-4']),
  ],
  ngo: [
    ask('Guarantee', 'Multi-year contracts instead of annual cycles.', ['ev-13', 'ev-5'], []),
    ask('Standard', 'Reporting proportionate to the size of the provider.', ['ev-13'], ['q-4']),
  ],
  gf: [
    ask('Evidence', 'A domestic mechanism operating before co-financing declines.', ['ev-11'], ['q-5']),
  ],
  who: [
    ask('Evidence', 'A service package aligned with the consolidated guidance.', ['ev-2', 'ev-1'], ['q-6']),
  ],
};

export interface Actor {
  id: string;
  inst: Institution;
  profile: StakeholderProfile;
  influence: number;
  seats: number;
}

const instById = new Map(institutions.map((i) => [i.id, i]));
export const evidenceById = new Map<string, EvidenceItem>(evidence.map((e) => [e.id, e]));
export const questionById = new Map<string, Question>(questions.map((q) => [q.id, q]));

export const actors: Actor[] = stakeholderProfiles.map((profile) => ({
  id: profile.institutionId,
  inst: instById.get(profile.institutionId)!,
  profile,
  influence: profile.influence,
  seats: profile.influence * SEATS_PER_INFLUENCE,
}));

export const actorById = new Map(actors.map((a) => [a.id, a]));
export const TOTAL_INFLUENCE = actors.reduce((s, a) => s + a.influence, 0);

export function stanceOf(option: OptionId, id: string, secured: readonly string[]): ChamberStance {
  return secured.includes(id) ? 'supportive' : positions[option][id].stance;
}

/** Weighted support for an option, 0..1. */
export function supportFor(option: OptionId, secured: readonly string[] = []): number {
  let s = 0;
  for (const a of actors) s += a.influence * STANCE_WEIGHT[stanceOf(option, a.id, secured)];
  return s / TOTAL_INFLUENCE;
}

/** Points (of total influence) gained if this actor were secured. */
export function gainFor(option: OptionId, id: string, secured: readonly string[]): number {
  const a = actorById.get(id)!;
  return (a.influence * (1 - STANCE_WEIGHT[stanceOf(option, id, secured)])) / TOTAL_INFLUENCE;
}

export const QUESTION_NUMBER = new Map(questions.map((q, i) => [q.id, i + 1]));

export function shortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export function longDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function pct(v: number, digits = 0): string {
  return (v * 100).toFixed(digits);
}
