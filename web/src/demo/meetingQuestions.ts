// Questions for the 15 October 2026 team meeting. Each answer is tagged with
// the demo view it will update, so the notes can be fed straight back into
// /demo/parliamentary-intelligence and /demo/care-continuity.

export type Feed =
  | 'PI · Dashboard'
  | 'PI · Evidence'
  | 'PI · Brief'
  | 'PI · Stakeholders'
  | 'PI · Tracker'
  | 'CC · Overview'
  | 'CC · Journey'
  | 'CC · Alerts'
  | 'CC · Service map'
  | 'CC · Impact'
  | 'Pitch'
  | 'Validation plan';

export interface Question {
  id: string;
  q: string;
  why: string;
  feeds: Feed[];
  core?: boolean; // must be answered today
}

export interface Slot {
  id: string;
  time: string;
  title: string;
  lead: string;
  part: 'first' | 'second';
  goal: string;
  questions: Question[];
}

export const MEETING = {
  date: '15 October 2026',
  title: 'Questions to answer today',
  intro:
    'Answers from the first part of the meeting go straight into the two demos. Questions marked "Core" are the minimum we need before the 13:45 app session.',
};

export const SLOTS: Slot[] = [
  {
    id: 's1',
    time: '11:15–11:45',
    title: 'Introductions, priorities and alignment',
    lead: 'All',
    part: 'first',
    goal: 'Agree what success looks like in six months, so both demos show the right outcome.',
    questions: [
      { id: 's1q1', q: 'What does each person want EECA to achieve in the next six months? Name one concrete result each.', why: 'Sets the headline result each demo must point to.', feeds: ['PI · Dashboard', 'CC · Overview'], core: true },
      { id: 's1q2', q: 'Which one country do we start in, and why that one?', why: 'Both demos use Kazakhstan as a placeholder. If we pick another country, both change.', feeds: ['PI · Dashboard', 'CC · Overview'], core: true },
      { id: 's1q3', q: 'What would make us stop or change direction by December?', why: 'Defines the kill criteria for the six-week validation.', feeds: ['Validation plan'] },
      { id: 's1q4', q: 'How much time can each person actually commit per week until the end of November?', why: 'Decides how much of the demos we can turn into something real.', feeds: ['Validation plan'] },
    ],
  },
  {
    id: 's2',
    time: '11:45–12:15',
    title: 'Mission and objectives',
    lead: 'Alesia',
    part: 'first',
    goal: 'Name the one problem EECA solves better than anyone else, in words a partner would repeat.',
    questions: [
      { id: 's2q1', q: 'What specific problem does EECA solve that existing organisations (Global TB Caucus, WHO Europe, the Global Fund, national TB programmes, NGOs) do not?', why: 'This becomes the "problem" panel of the decision brief.', feeds: ['PI · Brief', 'Pitch'], core: true },
      { id: 's2q2', q: 'Is the first problem a financing decision, a legislative change, or keeping patients in care? Choose one to lead with.', why: 'Decides which demo leads: parliamentary (PI) or patient-facing (CC).', feeds: ['PI · Dashboard', 'CC · Overview'], core: true },
      { id: 's2q3', q: 'Tell one real example (anonymised) where a decision stalled or a patient lost support. What happened, and who could have acted?', why: 'Replaces the illustrative scenario with a true story.', feeds: ['PI · Evidence', 'CC · Journey'] },
      { id: 's2q4', q: 'Which claims on the website can we prove today: the WHO Europe alignment, the "working alpha", the nine caucuses?', why: 'The audit marked these as unverified. Anything we cannot prove comes off.', feeds: ['Pitch'] },
    ],
  },
  {
    id: 's3',
    time: '12:15–12:45',
    title: 'Stakeholders, partners and ambassadors',
    lead: 'All',
    part: 'first',
    goal: 'Separate the user, the decision-maker, the payer and the implementer, with names where possible.',
    questions: [
      { id: 's3q1', q: 'Who is the actual daily user: an MP, parliamentary staff, a ministry analyst, an NGO case manager?', why: 'Decides whose screen the demo is designed around.', feeds: ['PI · Stakeholders', 'CC · Service map'], core: true },
      { id: 's3q2', q: 'Who makes the decision, who pays, and who implements? Name an institution for each.', why: 'Fills in the responsibilities on both stakeholder maps.', feeds: ['PI · Stakeholders', 'CC · Service map'], core: true },
      { id: 's3q3', q: 'Which three people or institutions could we talk to in the next two weeks to test this?', why: 'They become the first owners in the decision tracker.', feeds: ['PI · Tracker', 'Validation plan'], core: true },
      { id: 's3q4', q: 'Who are potential ambassadors (former MPs, patient leaders), and what would we ask each of them to do?', why: 'Adds the advisory and civil-society nodes.', feeds: ['PI · Stakeholders'] },
      { id: 's3q5', q: 'Which stakeholder could block this, and why?', why: 'Becomes the main risk in the brief.', feeds: ['PI · Brief'] },
    ],
  },
  {
    id: 's4',
    time: '12:45–13:15',
    title: 'One-page pitch review',
    lead: 'All',
    part: 'first',
    goal: 'One sentence of value per audience, and the figures we will stand behind.',
    questions: [
      { id: 's4q1', q: 'Complete the sentence for each audience: "For [MPs / ministries / funders / civil society], EECA helps them [do what] so that [result]."', why: 'This becomes the subtitle of each demo and of each audience page.', feeds: ['Pitch', 'PI · Dashboard', 'CC · Overview'], core: true },
      { id: 's4q2', q: 'Which three numbers do we lead with, and what is the source of each?', why: 'Replaces the illustrative figures with real ones in the demo key indicators.', feeds: ['PI · Evidence', 'CC · Impact'], core: true },
      { id: 's4q3', q: 'What does $100K buy in the first six months, item by item?', why: 'Gives the costs in the decision brief options.', feeds: ['PI · Brief', 'CC · Impact'] },
      { id: 's4q4', q: 'What is missing or unclear in the current one-pager?', why: 'A list of changes for the pitch.', feeds: ['Pitch'] },
    ],
  },
  {
    id: 's5',
    time: '13:45–14:10',
    title: 'App demo and discussion',
    lead: 'Indias, Jonas',
    part: 'second',
    goal: 'Choose which demo solves a real, recurring problem, and for whom.',
    questions: [
      { id: 's5q1', q: 'Which demo solves a real, recurring problem: parliamentary decision support, community care continuity, or a hybrid?', why: 'Decides which demo becomes the product focus.', feeds: ['Validation plan'], core: true },
      { id: 's5q2', q: 'Who would use it every week, and what would they stop doing because of it?', why: 'Tests whether anyone has a real reason to use it.', feeds: ['Validation plan'] },
      { id: 's5q3', q: 'What is the one screen we should show a partner first?', why: 'Sets the order of the demo walk-through.', feeds: ['Pitch'] },
      { id: 's5q4', q: 'What data would the real version need, and who holds it?', why: 'Tests feasibility of the evidence and alert views.', feeds: ['PI · Evidence', 'CC · Alerts'] },
    ],
  },
  {
    id: 's6',
    time: '14:10–14:30',
    title: 'Business pitch and attracting partners',
    lead: 'All',
    part: 'second',
    goal: 'Know why a funder picks EECA over an alternative.',
    questions: [
      { id: 's6q1', q: 'Why would an institution fund this instead of an existing alternative (direct NGO grants, WHO technical assistance, consultancy)?', why: 'This is the core of the pitch.', feeds: ['Pitch'], core: true },
      { id: 's6q2', q: 'Who pays after the first funder, and how does it become domestically financed?', why: 'Shows whether the model is sustainable.', feeds: ['PI · Brief', 'Pitch'] },
      { id: 's6q3', q: 'Which two funders do we approach first, and through whom?', why: 'Gives the first actions for the tracker.', feeds: ['PI · Tracker'] },
    ],
  },
  {
    id: 's7',
    time: '14:30–15:00',
    title: 'Conclusions and next steps',
    lead: 'All',
    part: 'second',
    goal: 'Leave with a six-week plan with owners and dates.',
    questions: [
      { id: 's7q1', q: 'What exactly will we validate in six weeks, and how will we know it worked?', why: 'The validation plan.', feeds: ['Validation plan'], core: true },
      { id: 's7q2', q: 'Who owns each action, and by what date?', why: 'Fills the decision tracker with real owners.', feeds: ['PI · Tracker'], core: true },
      { id: 's7q3', q: 'What changes to the pitch, the website and the demos do we agree today?', why: 'My work list after the meeting.', feeds: ['Pitch'] },
    ],
  },
];
