import { Fragment, useEffect, useRef, type KeyboardEvent } from 'react';
import { Mark } from './marks';
import { KIND_LABEL, TODAY, sittings, type SittingKind } from './sittings';
import { daysBetween, fmtDay, fmtDayMonth, fmtMonth, fmtWeekday, fmtYear, plural } from './format';

const LEGEND: { kind: SittingKind; label: string }[] = [
  { kind: 'committee', label: 'Committee' },
  { kind: 'hearing', label: 'Hearing' },
  { kind: 'plenary', label: 'Plenary' },
  { kind: 'budget', label: 'Budget cycle' },
  { kind: 'decision', label: 'Decision' },
];

interface Props {
  selected: number;
  onSelect: (index: number) => void;
}

/** The sitting spine: every sitting and procedural event on one horizontal line, today marked. */
export function Spine({ selected, onSelect }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const firstFuture = sittings.findIndex((s) => s.date >= TODAY);

  // Keep the selected sitting in view inside the spine (never scrolls the page).
  useEffect(() => {
    const box = scroller.current;
    const tab = tabs.current[selected];
    if (!box || !tab) return;
    const left = tab.offsetLeft - box.clientWidth / 2 + tab.offsetWidth / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }, [selected]);

  const move = (to: number) => {
    const i = Math.max(0, Math.min(sittings.length - 1, to));
    onSelect(i);
    tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowLeft: selected - 1,
      ArrowRight: selected + 1,
      Home: 0,
      End: sittings.length - 1,
    };
    if (e.key in map && !e.altKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      move(map[e.key]);
    }
  };

  return (
    <section className="db-spine" aria-label="Sittings and procedural events">
      <div className="db-spine-head db-wrap">
        <h2 className="db-spine-title">
          Sittings and procedural events <span className="db-spine-range">Sep 2026 – Mar 2027</span>
        </h2>
        <ul className="db-legend" aria-label="Legend">
          {LEGEND.map((l) => (
            <li key={l.kind}><span className={`db-node db-node--${l.kind}`} aria-hidden="true" />{l.label}</li>
          ))}
        </ul>
        <p className="db-spine-keys"><kbd>←</kbd><kbd>→</kbd> move between sittings</p>
      </div>
      <div className="db-spine-scroll" ref={scroller}>
        <div className="db-spine-track" role="tablist" aria-label="Sittings" aria-orientation="horizontal" onKeyDown={onKeyDown}>
          {sittings.map((s, i) => {
            const past = s.date < TODAY;
            const next = i === firstFuture;
            const nextDate = i === firstFuture - 1 ? TODAY : sittings[i + 1]?.date;
            const ready = s.items.filter((it) => it.readiness === 'ready').length;
            const isSel = i === selected;
            return (
              <Fragment key={s.ref}>
                {next && (
                  <div className="db-today" aria-hidden="true">
                    <span className="db-today-label">Today</span>
                    <span className="db-today-date">{fmtDayMonth(TODAY)}</span>
                  </div>
                )}
                <button
                  ref={(el) => { tabs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`db-tab-${s.ref}`}
                  aria-selected={isSel}
                  aria-controls="db-agenda"
                  tabIndex={isSel ? 0 : -1}
                  className={`db-tab db-tab--${past ? 'past' : 'future'} db-tab--${s.kind}${next ? ' db-tab--next' : ''}`}
                  onClick={() => move(i)}
                  aria-label={`${s.ref}, ${KIND_LABEL[s.kind]}, ${fmtDayMonth(s.date)} ${fmtYear(s.date)}: ${s.short}. ${past ? 'Held' : `${ready} of ${s.items.length} items ready`}`}
                >
                  <span className="db-tab-top">
                    <span className="db-tab-ref">{s.ref}</span>
                    {next && <span className="db-tab-flag">Next</span>}
                  </span>
                  <span className="db-tab-date">
                    <span className="db-tab-day">{fmtDay(s.date)}</span>
                    <span className="db-tab-mon">{fmtMonth(s.date)} {fmtYear(s.date)}<br />{fmtWeekday(s.date)} {s.time}</span>
                  </span>
                  <span className="db-tab-kind">{KIND_LABEL[s.kind]}</span>
                  <span className="db-tab-short">{s.short}</span>
                  <span className="db-tab-line">
                    <span className={`db-node db-node--${s.kind}`} />
                    {nextDate && <span className="db-tab-gap">{daysBetween(s.date, nextDate)} d</span>}
                  </span>
                  <span className="db-tab-tally">
                    {s.items.map((it, n) => <Mark key={n} state={it.readiness} held={past} />)}
                    <span className="db-tab-count">{past ? `Held · ${plural(s.items.length, 'item')}` : `${ready}/${s.items.length}${s.items.length < 9 ? ' ready' : ''}`}</span>
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
