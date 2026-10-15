// Design direction A, "Committee Paper". The interface is the document: a
// living committee paper with numbered paragraphs, a live margin of questions,
// evidence and actions, tracked changes since v0.2, and the options set as a
// formal table. Stub data only (kazakhstanScenario); nothing is persisted.

import { useEffect, useState } from 'react';
import { activity, issue, options, questions, tasks } from '../kazakhstanScenario';
import type { OptionId, TaskStatus } from '../kazakhstanScenario';
import { Chg, Cite, Para, Section } from './a/Paper';
import { OptionsTable } from './a/OptionsTable';
import {
  CHANGES,
  CHANGE_IDS,
  PaperContext,
  STATUS_LABEL,
  cx,
  fmtDate,
  fmtTime,
  initialState,
  instShort,
  refOf,
  type PaperApi,
  type PaperState,
} from './a/model';
import './a.css';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap';

function useFonts() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const add = (rel: string, href: string, cross = false) => {
      const l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      if (cross) l.crossOrigin = '';
      document.head.appendChild(l);
      links.push(l);
    };
    add('preconnect', 'https://fonts.googleapis.com');
    add('preconnect', 'https://fonts.gstatic.com', true);
    add('stylesheet', FONT_HREF);
    return () => links.forEach((l) => l.remove());
  }, []);
}

const VERSION = 'v0.3';
const PAPER_DATE = '2026-10-15';

function stamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${PAPER_DATE}T${hh}:${mm}:00`;
}

export default function DirectionA() {
  useFonts();
  const [s, set] = useState<PaperState>(initialState);

  const log = (actor: string, text: string) => (st: PaperState): PaperState => ({
    ...st,
    log: [{ id: `l-${st.log.length + 1}`, at: stamp(), actor, text, fresh: true }, ...st.log],
  });
  const me = 'Committee secretariat';

  const api: PaperApi = {
    s,
    toggleNote: (id) => set((st) => ({ ...st, open: { ...st.open, [id]: !st.open[id] } })),
    jumpTo: (id) => {
      set((st) => ({ ...st, open: { ...st.open, [id]: true } }));
      requestAnimationFrame(() => {
        const el = document.getElementById(`da-note-${id}`);
        if (!el) return;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        el.querySelector<HTMLButtonElement>('.da-note-head')?.focus({ preventScroll: true });
      });
    },
    setHot: (id) => set((st) => (st.hot === id ? st : { ...st, hot: id })),
    resolveChange: (id, to) =>
      set((st) =>
        log(me, `${to === 'accepted' ? 'accepted' : 'rejected'} the change by ${instShort(CHANGES[id].by)} (${fmtDate(CHANGES[id].at, { year: false })})`)({
          ...st,
          hot: null,
          changes: { ...st.changes, [id]: to },
        }),
      ),
    setQuestion: (id, status) =>
      set((st) =>
        log(me, `marked ${refOf(id)} as ${status === 'answered' ? 'answered' : 'open'}`)({ ...st, qStatus: { ...st.qStatus, [id]: status } }),
      ),
    assignQuestion: (id, owner) =>
      set((st) => log(me, `assigned ${refOf(id)} to ${instShort(owner)}`)({ ...st, qOwner: { ...st.qOwner, [id]: owner } })),
    setTask: (id, status: TaskStatus) =>
      set((st) =>
        log(me, `marked ${refOf(id)} “${tasks.find((t) => t.id === id)?.title}” as ${STATUS_LABEL[status].toLowerCase()}`)({
          ...st,
          tStatus: { ...st.tStatus, [id]: status },
        }),
      ),
    assignTask: (id, owner) =>
      set((st) => log(me, `assigned ${refOf(id)} to ${instShort(owner)}`)({ ...st, tOwner: { ...st.tOwner, [id]: owner } })),
    requestGap: (id) => set((st) => log(me, `requested the evidence for ${refOf(id)}`)({ ...st, requested: { ...st.requested, [id]: true } })),
    toggleBrief: (id) =>
      set((st) =>
        log(me, `${st.inBrief[id] ? 'removed' : 'added'} ${refOf(id)} ${st.inBrief[id] ? 'from' : 'to'} the members’ brief`)({
          ...st,
          inBrief: { ...st.inBrief, [id]: !st.inBrief[id] },
        }),
      ),
    setPreference: (id: OptionId) =>
      set((st) => {
        const next = st.preference === id ? null : id;
        const o = options.find((x) => x.id === id)!;
        return log('Committee', next ? `recorded a preference for Option ${id} (${o.short.toLowerCase()})` : `withdrew its preference for Option ${id}`)({
          ...st,
          preference: next,
        });
      }),
  };

  const pending = CHANGE_IDS.filter((c) => s.changes[c] === 'pending');
  const openQs = questions.filter((q) => s.qStatus[q.id] === 'open');
  const stage = issue.stages[issue.stageIndex];
  const next = issue.stages[issue.stageIndex + 1];
  const pref = options.find((o) => o.id === s.preference);

  const acceptAll = () =>
    set((st) =>
      log(me, `accepted all ${pending.length} remaining changes`)({
        ...st,
        changes: Object.fromEntries(CHANGE_IDS.map((c) => [c, st.changes[c] === 'pending' ? 'accepted' : st.changes[c]])),
      }),
    );

  return (
    <PaperContext.Provider value={api}>
      <div className={cx('da-root', s.showChanges && 'is-tracking')}>
        {/* Running head: reference, procedural status, tracked-changes switch */}
        <div className="da-runhead">
          <div className="da-runhead-in">
            <p className="da-rh-ref da-mono">
              {issue.ref} · {VERSION}
            </p>
            <p className="da-status">
              <span className="da-status-stage">
                Stage {issue.stageIndex + 1} of {issue.stages.length}
              </span>
              <span className="da-sep"> · </span>
              <strong className="da-sc da-status-now">{stage.label}</strong>
              {next && (
                <>
                  <span className="da-sep"> — </span>
                  <span className="da-status-next">
                    next: <span className="da-sc">{next.label}</span>, {fmtDate(next.date, { year: false })}
                  </span>
                </>
              )}
            </p>
            <div className="da-rh-tools">
              <button
                type="button"
                role="switch"
                aria-checked={s.showChanges}
                className="da-switch"
                onClick={() => set((st) => ({ ...st, showChanges: !st.showChanges, hot: null }))}
              >
                <span className="da-switch-box" aria-hidden="true" />
                <span>Show changes since v0.2</span>
                <span className="da-mono da-switch-n">{pending.length}</span>
              </button>
              {s.showChanges && pending.length > 1 && (
                <button type="button" className="da-act" onClick={acceptAll}>
                  Accept all
                </button>
              )}
            </div>
          </div>
        </div>

        <article className="da-paper" aria-labelledby="da-title">
          {/* Masthead */}
          <header className="da-row da-mast">
            <span className="da-pnum" />
            <div className="da-mast-main">
              <p className="da-classline da-sc">Illustrative · demo data · not an official document</p>
              <p className="da-house da-sc">Mazhilis committee on social and cultural development</p>
              <p className="da-refline">
                <span className="da-mono">{issue.ref}</span>
                <span className="da-sc">Committee paper</span>
                <span className="da-mono">
                  {VERSION} · {fmtDate(PAPER_DATE, { long: true })}
                </span>
              </p>
              <h1 id="da-title" className="da-h1">
                {issue.title}
              </h1>
              <p className="da-standfirst">
                {issue.country}. Paper by the Committee secretariat with the Parliamentary research service, for
                consideration by members ahead of the committee hearing on {fmtDate(next?.date ?? issue.deadline, { long: true })}.
              </p>
              <nav className="da-contents" aria-label="Contents">
                <span className="da-sc">Contents</span>
                <ol>
                  <li><a href="#da-s1"><span className="da-num">1</span> The issue</a></li>
                  <li><a href="#da-s2"><span className="da-num">2</span> Questions</a></li>
                  <li><a href="#da-s3"><span className="da-num">3</span> Evidence</a></li>
                  <li><a href="#da-s4"><span className="da-num">4</span> Options</a></li>
                  <li><a href="#da-s5"><span className="da-num">5</span> Recommendation</a></li>
                  <li><a href="#da-annex-a"><span className="da-num">A</span> Actions</a></li>
                  <li><a href="#da-annex-b"><span className="da-num">B</span> Record</a></li>
                </ol>
              </nav>
            </div>
            <aside className="da-margin da-control" aria-label="Document control">
              <p className="da-sc da-control-h">Document control</p>
              <dl>
                <dt>Reference</dt>
                <dd className="da-mono">{issue.ref}</dd>
                <dt>Version</dt>
                <dd>
                  <span className="da-mono">{VERSION}</span> draft, supersedes <span className="da-mono">v0.2</span>
                </dd>
                <dt>Lead</dt>
                <dd>{instShort(issue.leadInstitutionId)}</dd>
                <dt>Report due</dt>
                <dd>{issue.deadlineLabel}</dd>
                <dt>Open</dt>
                <dd>
                  {openQs.length} questions · {pending.length} changes
                </dd>
                <dt>Status</dt>
                <dd>Illustrative · demo data</dd>
              </dl>
            </aside>
          </header>

          <Section num="1" id="da-s1" title="The issue">
            <Para num="1.1">
              <p>{issue.summary}</p>
            </Para>
            <Para num="1.2">
              <p>
                Responsibility is shared.{' '}
                {issue.responsible.map((r, i) => (
                  <span key={r.institutionId}>
                    ({String.fromCharCode(97 + i)}) <em>{instShort(r.institutionId)}</em>: {r.role.charAt(0).toLowerCase() + r.role.slice(1)}
                    {i < issue.responsible.length - 1 ? '; ' : '.'}
                  </span>
                ))}
              </p>
            </Para>
            <Para num="1.3" changes={['c1']}>
              <p>
                External co-financing of community components is due to decline before a domestic mechanism is in place,
                so the timing of the decision matters as much as its content. The committee is asked to report by{' '}
                <Chg id="c1" />.
              </p>
            </Para>
          </Section>

          <Section num="2" id="da-s2" title="Questions before the committee">
            <Para num="2.1">
              <p>
                Six questions have been put to Government, the committee’s advisers and external partners.{' '}
                {openQs.length === 0
                  ? 'All have now been answered.'
                  : `${openQs.length === 1 ? 'One remains' : `${spell(openQs.length)} remain`} open; each is tracked in the margin with its owner and due date.`}
              </p>
            </Para>
            {questions.map((q, i) => {
              const answered = s.qStatus[q.id] === 'answered';
              return (
                <Para key={q.id} num={`2.${i + 2}`} notes={[q.id]}>
                  <p className={cx(answered && 'da-answered')}>
                    The committee asks the <em>{instShort(s.qOwner[q.id])}</em>: {q.text}
                    <Cite id={q.id} /> <span className="da-qctx">{q.context}</span>
                    {answered && (
                      <span className="da-answer">
                        {' '}
                        <span className="da-sc">Answer.</span> {q.answer ?? `Recorded as answered on ${fmtDate(PAPER_DATE)}; text to be filed by the owner.`}
                      </span>
                    )}
                  </p>
                </Para>
              );
            })}
          </Section>

          <Section num="3" id="da-s3" title="Evidence considered">
            <Para num="3.1" notes={['ev-2', 'ev-1', 'ev-3']}>
              <p>
                International guidance treats patient support as part of the standard of care rather than an optional
                add-on
                <Cite id="ev-2" />, and the evidence associates adherence and psychosocial support with higher treatment
                success, especially for drug-resistant TB
                <Cite id="ev-1" />. Households affected by TB face high indirect costs even where treatment itself is
                free
                <Cite id="ev-3" />.
              </p>
            </Para>
            <Para num="3.2" notes={['ev-6', 'ev-7', 'ev-9', 'ev-8']}>
              <p>
                The Code “On Public Health and the Healthcare System” (2020) defines the two main financing channels
                <Cite id="ev-6" />. A separate mechanism allows central and local authorities to contract NGOs
                <Cite id="ev-7" />, though its application to TB patient support needs confirmation. The insurance
                benefits package is set by secondary legislation
                <Cite id="ev-9" />, and any new republican budget programme follows the annual budget cycle
                <Cite id="ev-8" />.
              </p>
            </Para>
            <Para num="3.3" notes={['ev-10', 'ev-11', 'ev-12']} changes={['c2']}>
              <p>
                No agreed national costing exists. The only figure available is an illustrative range of KZT 1.5–2.5 bn a
                year
                <Chg id="c2" />
                <Cite id="ev-10" />. External support for community components will decline over the transition period
                <Cite id="ev-11" />, and regions differ widely in the budget and staff they can give to social procurement
                <Cite id="ev-12" />.
              </p>
            </Para>
            <Para num="3.4" notes={['ev-5', 'ev-4']}>
              <p>
                Elsewhere in the region, social contracting works best with multi-year contracts, clear standards and
                timely payment
                <Cite id="ev-5" />. A synthetic dataset shows the kind of outcome reporting a contracting mechanism could
                require of providers
                <Cite id="ev-4" />.
              </p>
            </Para>
            <Para num="3.5" notes={['ev-13', 'ev-14', 'ev-15']}>
              <p>
                NGOs and patient groups put predictable multi-year funding first
                <Cite id="ev-13" />. Regional administrations support local delivery but ask for national standards and
                earmarked funding
                <Cite id="ev-14" />. The national TB centre offers to set minimum standards and to host outcome reporting
                <Cite id="ev-15" />.
              </p>
            </Para>
            <Para num="3.6" notes={['ev-16', 'ev-17', 'ev-18']} changes={['c3']}>
              <p>
                Three gaps remain: an official costing of the community package
                <Cite id="ev-16" />, outcome data from domestically funded services
                <Cite id="ev-17" />, and a ruling on whether non-medical support can be reimbursed under insurance
                <Cite id="ev-18" />.
                <Chg id="c3" />
              </p>
            </Para>
          </Section>

          <Section num="4" id="da-s4" title="Options">
            <Para num="4.1" changes={['c4']}>
              <p>
                Three options are before the committee. Each would fund the same service package against a national
                minimum standard; they differ in channel, cost, speed and durability. <Chg id="c4" />
              </p>
            </Para>
            {options.map((o, i) => (
              <Para key={o.id} num={`4.${i + 2}`}>
                <p>
                  <span className="da-runin">
                    Option {o.id}. {o.title}.
                  </span>{' '}
                  {o.mechanism}{' '}
                  <span className="da-basis">
                    <span className="da-sc">Legal basis.</span> {o.legalBasis}
                  </span>
                </p>
              </Para>
            ))}
            <Para num="4.5" wide>
              <OptionsTable />
            </Para>
            <Para num="4.6">
              <p className={cx('da-prefline', pref && 'is-set')} aria-live="polite">
                {pref ? (
                  <>
                    The committee has indicated a preference for <strong>Option {pref.id}, {pref.short.toLowerCase()}</strong>.
                    The preference is minuted in Annex B and does not bind the committee before the hearing.
                  </>
                ) : (
                  <>The committee has not yet indicated a preference. Members may record one by selecting a column of Table 1.</>
                )}
              </p>
            </Para>
          </Section>

          <Section num="5" id="da-s5" title="Recommendation">
            <Para num="5.1" changes={['c5', 'c6', 'c7']}>
              <p>
                The secretariat recommends that the committee ask the lead committee to request a joint Ministry of Health
                and Ministry of Finance costing
                <Chg id="c5" />, then hold a hearing with Government <Chg id="c6" />.
                <Chg id="c7" />
              </p>
            </Para>
            <Para num="5.2" notes={['t-5', 't-6', 't-8']}>
              <p>The committee is invited to:</p>
              <ol className="da-invited">
                <li>
                  <span className="da-lt">(a)</span>
                  <span> note the evidence in section 3 and the gaps set out in paragraph 3.6;</span>
                </li>
                <li>
                  <span className="da-lt">(b)</span>
                  <span> agree to request a joint costing of the community package
                  <Cite id="t-5" />;</span>
                </li>
                <li>
                  <span className="da-lt">(c)</span>
                  <span> agree to seek a legal opinion on social contracting for TB support
                  <Cite id="t-6" />; and</span>
                </li>
                <li>
                  <span className="da-lt">(d)</span>
                  <span> agree the hearing with Government on {fmtDate(issue.stages[3].date, { long: true })}
                  <Cite id="t-8" />.</span>
                </li>
              </ol>
            </Para>
          </Section>

          <Section num="A" id="da-annex-a" title="Annex A · Schedule of actions">
            <Para num="A.1" wide>
              <table className="da-sched">
                <caption className="da-visually-hidden">Schedule of actions</caption>
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Action</th>
                    <th scope="col">Lead</th>
                    <th scope="col">Due</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => {
                    const st = s.tStatus[t.id];
                    return (
                      <tr key={t.id} className={cx(`is-${st}`)}>
                        <td className="da-mono da-sched-n">{refOf(t.id)}</td>
                        <td className="da-sched-t">{t.title}</td>
                        <td className="da-sched-o">{instShort(s.tOwner[t.id])}</td>
                        <td className="da-sched-d da-num">{fmtDate(t.due)}</td>
                        <td className="da-sched-s">
                          <span className="da-sc">{STATUS_LABEL[st]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Para>
          </Section>

          <Section num="B" id="da-annex-b" title="Annex B · Record of proceedings">
            <Para num="B.1">
              <ol className="da-record" aria-live="polite">
                {s.log.map((l) => (
                  <li key={l.id} className="is-fresh">
                    <time className="da-mono" dateTime={l.at}>
                      {fmtDate(l.at)} {fmtTime(l.at)}
                    </time>
                    <span>
                      {l.actor} {l.text}. <span className="da-sc da-acc">This sitting</span>
                    </span>
                  </li>
                ))}
                {activity.map((a) => (
                  <li key={a.id}>
                    <time className="da-mono" dateTime={a.at}>
                      {fmtDate(a.at)} {fmtTime(a.at)}
                    </time>
                    <span>
                      {a.actor} {a.text}.
                    </span>
                  </li>
                ))}
                <li>
                  <time className="da-mono" dateTime="2026-10-01">1 Oct 2026 09:00</time>
                  <span>
                    Version <span className="da-mono">v0.2</span> circulated to members (illustrative).
                  </span>
                </li>
              </ol>
            </Para>
          </Section>

          <footer className="da-row da-foot">
            <span className="da-pnum" />
            <div>
              <p className="da-end da-sc">End of paper</p>
              <p className="da-foot-line">
                <span className="da-mono">
                  {issue.ref} · {VERSION}
                </span>
                <span className="da-sc">Illustrative · demo data</span>
              </p>
              <p className="da-foot-note">
                Every figure, date, document and position in this paper is invented for demonstration and is not official
                data. Institutions are named generically.
              </p>
            </div>
            <div className="da-margin" />
          </footer>
        </article>
      </div>
    </PaperContext.Provider>
  );
}

function spell(n: number): string {
  return ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n] ?? String(n);
}
