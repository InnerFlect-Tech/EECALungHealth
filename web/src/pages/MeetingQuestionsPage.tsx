import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { useNoIndex } from '../lib/useNoIndex';
import { MEETING, SLOTS, type Feed } from '../demo/meetingQuestions';
import '../audit.css';
import '../meeting.css';

// Internal working page for the 15 Oct 2026 meeting (route: /meeting/2026-10-15).
// Unlinked and noindex. Answers stay in this browser (localStorage) until
// exported as Markdown and fed back into the two demos.

const STORE = 'eeca-meeting-2026-10-15';
type Answers = Record<string, string>;

function load(): Answers {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? '{}') as Answers;
  } catch {
    return {};
  }
}

function feedClass(f: Feed) {
  if (f.startsWith('PI')) return 'mq-feed mq-feed-pi';
  if (f.startsWith('CC')) return 'mq-feed mq-feed-cc';
  return 'mq-feed';
}

function toMarkdown(answers: Answers) {
  const lines = [`# EECA meeting answers, ${MEETING.date}`, ''];
  for (const s of SLOTS) {
    lines.push(`## ${s.time} · ${s.title} (${s.lead})`, '');
    for (const q of s.questions) {
      lines.push(`**${q.q}**`, `_Feeds: ${q.feeds.join(', ')}_`, '', (answers[q.id] ?? '').trim() || '(no answer)', '');
    }
  }
  return lines.join('\n');
}

export function MeetingQuestionsPage() {
  useNoIndex('Meeting questions, 15 Oct 2026 • EECA Lung Health Hub');
  const [answers, setAnswers] = useState<Answers>(load);
  const [scope, setScope] = useState<'first' | 'all'>('first');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(answers)); } catch { /* storage unavailable */ }
  }, [answers]);

  const slots = scope === 'first' ? SLOTS.filter((s) => s.part === 'first') : SLOTS;
  const core = useMemo(() => SLOTS.flatMap((s) => s.questions.filter((q) => q.core)), []);
  const coreDone = core.filter((q) => answers[q.id]?.trim()).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(answers));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: use download */ }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([toMarkdown(answers)], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EECA_meeting_answers_2026-10-15.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      <section className="audit-hero">
        <div className="container audit-hero-inner">
          <p className="audit-eyebrow">Team meeting · {MEETING.date}</p>
          <h1>{MEETING.title}</h1>
          <p className="audit-lead">{MEETING.intro}</p>
          <div className="mq-demos">
            Feeds into: <Link to="/demo/parliamentary-intelligence" className="mq-feed mq-feed-pi">PI · Parliamentary Intelligence</Link>
            <Link to="/demo/care-continuity" className="mq-feed mq-feed-cc">CC · Care Continuity</Link>
          </div>
        </div>
      </section>

      <div className="mq-bar">
        <div className="container mq-bar-inner">
          <div className="mq-toggle" role="group" aria-label="Which questions">
            <button type="button" aria-pressed={scope === 'first'} onClick={() => setScope('first')}>First part · 11:15–13:15</button>
            <button type="button" aria-pressed={scope === 'all'} onClick={() => setScope('all')}>Full agenda</button>
          </div>
          <p className="mq-progress" aria-live="polite">
            <strong>{coreDone}/{core.length}</strong> core answered
            <span className="mq-progress-track"><span style={{ width: `${(coreDone / core.length) * 100}%` }} /></span>
          </p>
          <div className="mq-actions">
            <button type="button" className="btn mq-copy" onClick={copy}>{copied ? 'Copied' : 'Copy answers'}</button>
            <button type="button" className="btn btn-primary" onClick={download}>Download .md</button>
          </div>
        </div>
      </div>

      <section className="section mq-section">
        <div className="container mq-list">
          {slots.map((s, i) => (
            <article key={s.id} className="mq-slot" id={s.id}>
              <header className="mq-slot-head">
                <span className="mq-time">{s.time}</span>
                <div>
                  <h2><span className="mq-num">{i + 1}</span>{s.title}</h2>
                  <p className="mq-meta">Lead: {s.lead} · {s.goal}</p>
                </div>
              </header>
              <ol className="mq-questions">
                {s.questions.map((q) => (
                  <li key={q.id} className={answers[q.id]?.trim() ? 'is-answered' : undefined}>
                    <label htmlFor={q.id} className="mq-q">
                      {q.core && <span className="mq-core">Core</span>}
                      {q.q}
                    </label>
                    <p className="mq-why">{q.why}</p>
                    <div className="mq-feeds">{q.feeds.map((f) => <span key={f} className={feedClass(f)}>{f}</span>)}</div>
                    <textarea
                      id={q.id}
                      rows={2}
                      placeholder="Answer, decision or owner…"
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  </li>
                ))}
              </ol>
            </article>
          ))}
          <p className="mq-note">
            Answers are saved only in this browser. When the session ends, use <em>Download .md</em> and send the file
            back so the demos can be rebuilt with the real answers.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
