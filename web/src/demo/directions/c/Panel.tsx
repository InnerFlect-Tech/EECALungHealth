import { useId } from 'react';
import { institutions, sectors, type PolicyOption } from '../../kazakhstanScenario';
import {
  actorById, asks, evidenceById, gainFor, pct, positions, QUESTION_NUMBER, questionById, shortDate,
  STANCE_LABEL, stanceOf, supportFor, THRESHOLD, TOTAL_INFLUENCE, type ChamberStance,
} from './data';
import type { Layout } from './geometry';

const slug = (s: ChamberStance) => s.replace(' ', '-');
const sectorLabel = new Map(sectors.map((s) => [s.id, s.label]));
const instShort = new Map(institutions.map((i) => [i.id, i.short]));
const CONF: Record<string, string> = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' };

/* ------------------------------------------------------------------ citations */

function Cite({ id, n, onPeek }: { id: string; n: number; onPeek: (id: string | null) => void }) {
  const tip = useId();
  const ev = evidenceById.get(id);
  if (!ev) return null;
  return (
    <span className="dc-citewrap">
      <button
        type="button"
        className="dc-cite"
        aria-describedby={tip}
        aria-label={`Source ${n}`}
        onMouseEnter={() => onPeek(id)}
        onMouseLeave={() => onPeek(null)}
        onFocus={() => onPeek(id)}
        onBlur={() => onPeek(null)}
      >
        {n}
      </button>
      <span role="tooltip" id={tip} className="dc-tip">
        <span className="dc-tip-meta">
          [{n}] {ev.source} · {CONF[ev.confidence]} · {shortDate(ev.date)}
        </span>
        <span className="dc-tip-title">{ev.title}</span>
        <span className="dc-tip-body">{ev.summary}</span>
      </span>
    </span>
  );
}

function Cites({ ids, order, onPeek }: { ids: string[]; order: string[]; onPeek: (id: string | null) => void }) {
  if (!ids.length) return null;
  return (
    <sup className="dc-cites">
      {ids.map((id) => (
        <Cite key={id} id={id} n={order.indexOf(id) + 1} onPeek={onPeek} />
      ))}
    </sup>
  );
}

/* ------------------------------------------------------------------ actor panel */

interface ActorProps {
  id: string;
  option: PolicyOption;
  layout: Layout;
  secured: readonly string[];
  peek: string | null;
  onPeek: (id: string | null) => void;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function ActorPanel({ id, option, layout, secured, peek, onPeek, onToggle, onClose }: ActorProps) {
  const actor = actorById.get(id)!;
  const pos = positions[option.id][id];
  const isSim = secured.includes(id);
  const stance = stanceOf(option.id, id, secured);
  const actorAsks = asks[id] ?? [];

  const order: string[] = [];
  const add = (ids: string[]) => ids.forEach((e) => !order.includes(e) && order.push(e));
  add(pos.cites);
  actorAsks.forEach((a) => add(a.cites));

  // Seat numbers, counted from the left of the chamber.
  let first = 1;
  for (const o of layout.order) {
    if (o === id) break;
    first += actorById.get(o)!.seats;
  }
  const last = first + actor.seats - 1;

  const now = supportFor(option.id, secured);
  const without = secured.filter((s) => s !== id);
  const withIt = [...without, id];
  const before = supportFor(option.id, without);
  const after = supportFor(option.id, withIt);
  const already = pos.stance === 'supportive';
  const crosses = before < THRESHOLD && after >= THRESHOLD;

  const effect = already
    ? `Already supportive of Option ${option.id}. Nothing to secure here; keep them informed.`
    : isSim
      ? `Simulated. Option ${option.id} stands at ${pct(now)}%${now >= THRESHOLD ? ', above the majority line' : `, ${pct(THRESHOLD - now, 1)} points short`}. Their seats are drawn as rings until the position is confirmed.`
      : `Would move Option ${option.id} from ${pct(before)}% to ${pct(after)}%${crosses ? ' and carry it over the majority line' : after >= THRESHOLD ? '' : `, still ${pct(THRESHOLD - after, 1)} points short`}.`;

  return (
    <article className="dc-panel-body" aria-labelledby="dc-actor-name">
      <header className="dc-actor-head">
        <p className="dc-eyebrow">
          {sectorLabel.get(actor.inst.sector)} · Seats {first}–{last} of {layout.order.reduce((s, o) => s + actorById.get(o)!.seats, 0)}
        </p>
        <h2 id="dc-actor-name" className="dc-actor-name">{actor.inst.short}</h2>
        <p className="dc-actor-full">{actor.inst.name}</p>
        <button type="button" className="dc-close" onClick={onClose} aria-label="Close and return to the whip’s count">
          Close <kbd>Esc</kbd>
        </button>
      </header>

      <dl className="dc-facts">
        <div>
          <dt>Stance on Option {option.id}</dt>
          <dd className={`dc-ink--${slug(stance)}`}>
            <i className={`dc-swatch dc-swatch--${slug(stance)}${isSim ? ' dc-swatch--sim' : ''}`} aria-hidden="true" />
            {STANCE_LABEL[stance]}
            {isSim && <span className="dc-sim-tag"> simulated · recorded as {STANCE_LABEL[pos.stance].toLowerCase()}</span>}
          </dd>
        </div>
        <div>
          <dt>Influence</dt>
          <dd>
            <span className="dc-ticks" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} className={i < actor.influence ? 'on' : ''} />
              ))}
            </span>
            {actor.influence} of 10 · {pct(actor.influence / TOTAL_INFLUENCE, 1)}% of the room
          </dd>
        </div>
      </dl>

      <section className="dc-sec">
        <h3 className="dc-sec-title">Responsibility</h3>
        <ul className="dc-plain">
          {actor.profile.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="dc-sec">
        <h3 className="dc-sec-title">Current position</h3>
        <p className="dc-claim dc-claim--lead">
          {pos.note}
          <Cites ids={pos.cites} order={order} onPeek={onPeek} />
        </p>
      </section>

      <section className="dc-sec">
        <h3 className="dc-sec-title">What would it take</h3>
        <ol className="dc-asks">
          {actorAsks.map((a, i) => (
            <li key={i} className="dc-ask">
              <span className="dc-ask-kind">{a.kind}</span>
              <p className="dc-claim">
                {a.text}
                <Cites ids={a.cites} order={order} onPeek={onPeek} />
              </p>
              {a.questions.length > 0 && (
                <ul className="dc-addressed" aria-label="Addressed by">
                  {a.questions.map((qid) => {
                    const q = questionById.get(qid)!;
                    return (
                      <li key={qid}>
                        <span className="dc-q-ref">Q{QUESTION_NUMBER.get(qid)}</span>
                        <span className="dc-q-text">{q.text}</span>
                        <span className="dc-q-meta">
                          {q.status === 'open' ? 'Open' : 'Answered'} · {instShort.get(q.ownerId)} · due {shortDate(q.due)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className={`dc-sim${isSim ? ' is-on' : ''}${already ? ' is-off' : ''}`}>
        <button
          type="button"
          role="switch"
          aria-checked={isSim}
          disabled={already}
          className="dc-switch"
          onClick={() => onToggle(id)}
          aria-describedby="dc-sim-effect"
        >
          <span className="dc-switch-track" aria-hidden="true">
            <span className="dc-switch-thumb" />
          </span>
          <span className="dc-switch-label">Simulate: secure this actor</span>
        </button>
        <p id="dc-sim-effect" className="dc-sim-effect" aria-live="polite">{effect}</p>
      </section>

      {order.length > 0 && (
        <section className="dc-sec dc-notes">
          <h3 className="dc-sec-title">Sources</h3>
          <ol>
            {order.map((eid, i) => {
              const ev = evidenceById.get(eid)!;
              return (
                <li key={eid} className={peek === eid ? 'is-peek' : ''}>
                  <span className="dc-note-n">{i + 1}</span>
                  <span>
                    <span className="dc-note-title">{ev.title}</span>
                    <span className="dc-note-meta">
                      {ev.source} · {CONF[ev.confidence]}
                      {ev.type === 'gap' ? ' · evidence gap' : ''}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ whip's count */

interface WhipProps {
  option: PolicyOption;
  secured: readonly string[];
  onSelect: (id: string) => void;
}

export function WhipPanel({ option, secured, onSelect }: WhipProps) {
  const now = supportFor(option.id, secured);
  const gap = THRESHOLD - now;
  const rows = [...actorById.values()]
    .map((a) => ({ a, gain: gainFor(option.id, a.id, secured), stance: stanceOf(option.id, a.id, secured), sim: secured.includes(a.id) }))
    .filter((r) => r.gain > 0.0001 || r.sim)
    .sort((x, y) => y.gain - x.gain || y.a.influence - x.a.influence);
  const maxGain = Math.max(...rows.map((r) => r.gain), 0.01);

  return (
    <article className="dc-panel-body" aria-labelledby="dc-whip-title">
      <header className="dc-actor-head">
        <p className="dc-eyebrow">Whip’s count · Option {option.id}</p>
        <h2 id="dc-whip-title" className="dc-actor-name">Where the votes are</h2>
      </header>
      <p className="dc-whip-lead">
        Option {option.id} holds <strong>{pct(now, 1)}%</strong> of weighted influence against a 60% majority line.{' '}
        {gap > 0
          ? `It needs ${pct(gap, 1)} more points, marked by the tick on each bar. A bar in brass carries the motion on its own.`
          : 'It clears the line. These actors would widen the margin.'}
      </p>
      <ol className="dc-swing">
        {rows.map(({ a, gain, stance, sim }) => {
          const carries = gap > 0 && gain >= gap;
          return (
            <li key={a.id}>
              <button type="button" className="dc-swing-row" onClick={() => onSelect(a.id)}>
                <span className="dc-swing-name">{a.inst.short}</span>
                <span className={`dc-swing-stance dc-ink--${slug(stance)}`}>
                  <i className={`dc-swatch dc-swatch--${slug(stance)}${sim ? ' dc-swatch--sim' : ''}`} aria-hidden="true" />
                  {sim ? 'Secured (simulated)' : STANCE_LABEL[stance]}
                </span>
                <span className={`dc-swing-gain${carries ? ' is-carry' : ''}`}>
                  {sim ? '—' : `+${pct(gain, 1)}`}
                </span>
                <span className="dc-swing-bar" aria-hidden="true">
                  <span className={carries ? 'is-carry' : ''} style={{ width: `${(gain / maxGain) * 100}%` }} />
                  {gap > 0 && <i style={{ left: `${(gap / maxGain) * 100}%` }} />}
                </span>
                {carries && <span className="dc-sr"> Carries the motion alone.</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="dc-whip-foot">Select any seat in the chamber to see what it would take.</p>
    </article>
  );
}

