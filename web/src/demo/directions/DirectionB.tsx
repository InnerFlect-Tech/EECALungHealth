// Design direction B, "Order Paper".
// The institution's calendar is the interface: a sitting spine across the top,
// and the order of business for the selected sitting below it.

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { activity, issue, recommendedStep } from '../kazakhstanScenario';
import { Agenda } from './b/Agenda';
import { CommandBar } from './b/CommandBar';
import { Spine } from './b/Spine';
import { KIND_LABEL, TODAY, itemRef, normalizeRef, papersOf, refOf, sittings, type Sitting } from './b/sittings';
import { daysFromToday, fmtDate, fmtDayMonth, fmtDayMonthYear, fmtLong, instName, plural } from './b/format';
import './b.css';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap';

const FIRST_FUTURE = sittings.findIndex((s) => s.date >= TODAY);

const bodyOf = (s: Sitting) =>
  s.kind === 'plenary' ? 'Mazhilis, plenary' : s.kind === 'budget' ? 'Republican budget cycle (Ministry of Finance)' : instName(issue.leadInstitutionId);

const stageAt = (date: string) => {
  // Held sittings fall in the stage of their date; later ones are at least the current stage.
  let idx = 0;
  issue.stages.forEach((st, i) => { if (st.date <= date) idx = i; });
  return date >= TODAY ? Math.max(idx, issue.stageIndex) : idx;
};

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scroll to an element, give it focus and a brief highlight. */
function flash(el: Element | null) {
  if (!(el instanceof HTMLElement)) return;
  if (!el.matches('a, button, input, [tabindex]')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
  el.classList.remove('db-flash');
  void el.offsetWidth;
  el.classList.add('db-flash');
  window.setTimeout(() => el.classList.remove('db-flash'), 2600);
}

export default function DirectionB() {
  const [sel, setSel] = useState(FIRST_FUTURE);
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([`${sittings[FIRST_FUTURE].ref}/2`]));
  const [cmdOpen, setCmdOpen] = useState(false);
  const [announce, setAnnounce] = useState('');
  const lastFocus = useRef<HTMLElement | null>(null);
  const sitting = sittings[sel];

  // IBM Plex, loaded only while this direction is on screen.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    link.dataset.db = 'fonts';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const selectSitting = useCallback((i: number) => {
    const next = Math.max(0, Math.min(sittings.length - 1, i));
    flushSync(() => {
      setSel(next);
      setFilter(null);
    });
    setAnnounce(`${sittings[next].ref}, ${KIND_LABEL[sittings[next].kind]}, ${fmtLong(sittings[next].date)}`);
    // If the reader has scrolled past the top of the agenda, bring it back under the spine.
    const agenda = document.getElementById('db-agenda');
    const spine = document.querySelector('.db-spine');
    if (agenda && spine) {
      const sticky = getComputedStyle(spine).position === 'sticky' ? spine.getBoundingClientRect().bottom : 44;
      const top = agenda.getBoundingClientRect().top;
      if (top < sticky) window.scrollBy({ top: top - sticky - 8, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  }, []);

  const toggle = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const openCmd = useCallback(() => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCmdOpen(true);
  }, []);

  const closeCmd = useCallback(() => {
    setCmdOpen(false);
    lastFocus.current?.focus({ preventScroll: true });
  }, []);

  /** Resolve a reference, bring it on screen and highlight it. False if it is not on the order paper. */
  const jump = useCallback(
    (raw: string): boolean => {
      const ref = normalizeRef(raw);
      if (!ref) return false;

      if (ref === issue.ref) {
        flushSync(() => setCmdOpen(false));
        flash(document.getElementById('db-issue'));
        setAnnounce(`${ref}: ${issue.title}`);
        return true;
      }

      const si = sittings.findIndex((s) => s.ref === ref);
      if (si >= 0) {
        flushSync(() => {
          setCmdOpen(false);
          setSel(si);
          setFilter(null);
        });
        document.getElementById(`db-tab-${ref}`)?.focus({ preventScroll: true });
        flash(document.querySelector('.db-agenda-head'));
        setAnnounce(`${ref}, ${KIND_LABEL[sittings[si].kind]}, ${fmtLong(sittings[si].date)}`);
        return true;
      }

      const im = /^([A-Z]{2}-\d{2})\/(\d+)$/.exec(ref);
      if (im) {
        const i = sittings.findIndex((s) => s.ref === im[1]);
        const n = Number(im[2]);
        if (i < 0 || n < 1 || n > sittings[i].items.length) return false;
        flushSync(() => {
          setCmdOpen(false);
          setSel(i);
          setFilter(null);
          setExpanded((prev) => new Set(prev).add(ref));
        });
        flash(document.querySelector(`#db-agenda [data-item="${ref}"]`));
        setAnnounce(`${ref}: item ${n}, ${sittings[i].items[n - 1].title}`);
        return true;
      }

      // A paper (Q-, EV-, T-, OPT-): prefer the selected sitting, then the next sitting that carries it.
      const hits = sittings.flatMap((s, i) => s.items.map((it, k) => ({ i, n: k + 1, it })).filter(({ it }) => papersOf(it).includes(ref)));
      if (!hits.length) return false;
      const hit = hits.find((h) => h.i === sel) ?? hits.find((h) => sittings[h.i].date >= TODAY) ?? hits[hits.length - 1];
      const key = itemRef(sittings[hit.i], hit.n);
      flushSync(() => {
        setCmdOpen(false);
        setSel(hit.i);
        setFilter(null);
        setExpanded((prev) => new Set(prev).add(key));
      });
      flash(document.querySelector(`#db-agenda [data-item="${key}"] [data-ref="${ref}"]`));
      setAnnounce(`${ref}: on the order paper at ${key}, ${hit.it.title}`);
      return true;
    },
    [sel],
  );

  // Global keys: "/" opens the reference bar; ← → move between sittings.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (cmdOpen || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('input, textarea, select, [contenteditable="true"], [role="tablist"]')) return;
      if (e.key === '/') {
        e.preventDefault();
        openCmd();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        selectSitting(sel + (e.key === 'ArrowLeft' ? -1 : 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdOpen, sel, openCmd, selectSitting]);

  const deadlineDays = daysFromToday(issue.deadline);
  const sittingStage = stageAt(sitting.date);
  const paperCounts = {
    q: new Set(sitting.items.flatMap((it) => it.questions ?? [])).size,
    ev: new Set(sitting.items.flatMap((it) => it.evidence ?? [])).size,
    t: new Set(sitting.items.flatMap((it) => it.tasks ?? [])).size,
  };

  return (
    <div className="db-root">
      <header className="db-mast">
        <div className="db-wrap db-mast-bar">
          <p className="db-brand">
            <span>EECA Lung Health Hub</span>
            <span className="db-brand-sep" aria-hidden="true">/</span>
            <span>Parliamentary Intelligence</span>
            <span className="db-brand-sep" aria-hidden="true">/</span>
            <strong>Order Paper</strong>
          </p>
          <p className="db-demo">Illustrative · demo data</p>
          <button type="button" className="db-goto" onClick={openCmd} aria-keyshortcuts="/">
            <span className="db-goto-long">Go to reference…</span>
            <span className="db-goto-short">Go to…</span>
            <kbd>/</kbd>
          </button>
        </div>
        <div className="db-wrap db-mast-main">
          <div className="db-mast-issue" id="db-issue">
            <p className="db-mast-kicker">
              <span className="db-ref">{issue.ref}</span>
              <span>{issue.country}</span>
              <span>Session 2026–27</span>
            </p>
            <h1 className="db-h1">{issue.title}</h1>
            <p className="db-mast-lead">
              Lead: {instName(issue.leadInstitutionId)}. Now at stage {issue.stageIndex + 1} of {issue.stages.length},{' '}
              <em>{issue.stages[issue.stageIndex].label.toLowerCase()}</em>.
            </p>
          </div>
          <dl className="db-mast-deadline">
            <dt>Decision deadline</dt>
            <dd className="db-mast-date">{fmtDayMonthYear(issue.deadline)}</dd>
            <dd className="db-mast-days"><b>{deadlineDays}</b> days · <button type="button" className="db-ref db-reflink" onClick={() => jump('DL-01')}>DL-01</button></dd>
          </dl>
        </div>
      </header>

      <Spine selected={sel} onSelect={selectSitting} />

      <div className="db-wrap db-main">
        <Agenda
          sitting={sitting}
          index={sel}
          filter={filter}
          onFilter={setFilter}
          expanded={expanded}
          onToggle={toggle}
          onJump={jump}
        />

        <aside className="db-rail" aria-label="Particulars and procedure">
          <section className="db-rail-sec">
            <h2 className="db-label">Particulars of {sitting.ref}</h2>
            <dl className="db-dl">
              <dt>Body</dt><dd>{bodyOf(sitting)}</dd>
              <dt>Business</dt><dd>{KIND_LABEL[sitting.kind]}: {sitting.short}</dd>
              <dt>Date</dt><dd>{fmtLong(sitting.date)}, {sitting.time}</dd>
              <dt>Place</dt><dd>{sitting.place}</dd>
              <dt>Papers</dt><dd>{plural(paperCounts.q, 'question')} · {paperCounts.ev} evidence · {plural(paperCounts.t, 'task')}</dd>
              <dt>Stage</dt><dd>{issue.stages[sittingStage].label}</dd>
            </dl>
          </section>

          <section className="db-rail-sec">
            <h2 className="db-label">Procedure</h2>
            <ol className="db-stages">
              {issue.stages.map((st, i) => (
                <li key={st.label} className={`db-stage${i < issue.stageIndex ? ' db-stage--done' : ''}${i === issue.stageIndex ? ' db-stage--now' : ''}${i === sittingStage ? ' db-stage--sel' : ''}`}>
                  <span className="db-stage-n">{i + 1}</span>
                  <span className="db-stage-body">
                    <span className="db-stage-label">{st.label}{i === issue.stageIndex && <span className="db-stage-now"> · current</span>}</span>
                    <span className="db-stage-note">{st.note}</span>
                  </span>
                  <span className="db-stage-date">{fmtDayMonth(st.date)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="db-rail-sec">
            <h2 className="db-label">Proposed next step</h2>
            <p className="db-next-title">{recommendedStep.title}</p>
            <p className="db-next-text">{recommendedStep.text}</p>
            <p className="db-next-meta">
              {instName(recommendedStep.ownerId)} · {fmtDate(recommendedStep.date)} ·{' '}
              <button type="button" className="db-ref db-reflink" onClick={() => jump('HG-01')}>HG-01</button>
            </p>
          </section>

          <section className="db-rail-sec">
            <h2 className="db-label">Journal of proceedings</h2>
            <ol className="db-journal">
              {activity.map((a) => (
                <li key={a.id}>
                  <span className="db-journal-when">{fmtDayMonth(a.at)} {a.at.slice(11, 16).replace(':', '.')}</span>
                  <span className="db-journal-text">
                    {a.actor} {a.text}
                    {a.ref?.item && (
                      <> <button type="button" className="db-ref db-reflink" onClick={() => jump(refOf(a.ref!.item!))}>{refOf(a.ref.item)}</button></>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="db-rail-sec">
            <h2 className="db-label">Keys</h2>
            <dl className="db-keys">
              <dt><kbd>/</kbd></dt><dd>Go to a reference</dd>
              <dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Previous or next sitting</dd>
              <dt><kbd>Esc</kbd></dt><dd>Close the reference bar</dd>
            </dl>
          </section>
        </aside>
      </div>

      <footer className="db-wrap db-foot">
        <p>Sittings, dates and orders of business are invented for this design review and are illustrative only. Questions, evidence and tasks are the stub data of the Parliamentary Intelligence demo.</p>
      </footer>

      <p className="db-sr" aria-live="polite">{announce}</p>

      {cmdOpen && <CommandBar onClose={closeCmd} onGo={jump} />}
    </div>
  );
}
