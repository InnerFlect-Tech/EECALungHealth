// Design direction C, "Chamber". The home screen is the room where the
// decision is made: a hemicycle of positions, a majority meter and a
// "what would it take" panel for each actor. Stub data only.

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { issue, options, recommendedStep, type OptionId } from '../kazakhstanScenario';
import { actorById, longDate, pct, STANCE_LABEL, STANCES, supportFor, type ChamberStance } from './c/data';
import { computeLayout, easeInOut, lerpLayout, type Layout } from './c/geometry';
import { Hemicycle } from './c/Hemicycle';
import { Meter } from './c/Meter';
import { ActorPanel, WhipPanel } from './c/Panel';
import './c.css';

const DURATION = 1100;
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&display=swap';

function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

function useChamberFonts() {
  useEffect(() => {
    if (document.querySelector(`link[data-dc-font]`)) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = 'anonymous';
    pre.dataset.dcFont = '';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    link.dataset.dcFont = '';
    document.head.append(pre, link);
    return () => {
      pre.remove();
      link.remove();
    };
  }, []);
}

const slug = (s: ChamberStance) => s.replace(' ', '-');
const supports = Object.fromEntries(options.map((o) => [o.id, supportFor(o.id)])) as Record<OptionId, number>;
const LEADING = options.reduce((best, o) => (supports[o.id] > supports[best.id] ? o : best), options[0]).id;
const NONE: Record<OptionId, string[]> = { A: [], B: [], C: [] };

export default function DirectionC() {
  useChamberFonts();
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const compact = useMedia('(max-width: 720px)');
  const stacked = useMedia('(max-width: 1080px)');

  const [optionId, setOptionId] = useState<OptionId>(LEADING);
  const [secured, setSecured] = useState<Record<OptionId, string[]>>(NONE);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);

  const option = options.find((o) => o.id === optionId)!;
  const sec = secured[optionId];
  const target = useMemo(() => computeLayout(optionId, sec), [optionId, sec]);

  // Animation: event handlers capture the layout on screen as "from"; a rAF
  // loop advances `now` until the transition settles.
  const [anim, setAnim] = useState<{ from: Layout; start: number } | null>(null);
  const [now, setNow] = useState(0);
  const t = anim ? easeInOut(Math.min(1, Math.max(0, (now - anim.start) / DURATION))) : 1;
  const shown = anim ? lerpLayout(anim.from, target, t) : target;

  useEffect(() => {
    if (!anim) return;
    let raf = requestAnimationFrame(function tick(ts) {
      if (ts - anim.start >= DURATION) {
        setAnim(null);
        return;
      }
      setNow(ts);
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [anim]);

  function transition(nextOption: OptionId, nextSecured: Record<OptionId, string[]>) {
    if (!reduced) {
      const start = performance.now();
      setAnim({ from: shown, start });
      setNow(start);
    }
    setOptionId(nextOption);
    setSecured(nextSecured);
  }

  const panelRef = useRef<HTMLElement>(null);
  function select(id: string) {
    setSelected((cur) => (cur === id && !stacked ? null : id));
    setPeek(null);
    if (stacked) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
    }
  }

  function toggleSecure(id: string) {
    const cur = secured[optionId];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    transition(optionId, { ...secured, [optionId]: next });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const real = supports[optionId];
  const others = options.filter((o) => o.id !== optionId).map((o) => ({ id: o.id, value: supportFor(o.id, secured[o.id]) }));

  return (
    <div className="dc-root">
      <header className="dc-mast">
        <p className="dc-mast-brand">
          <span>EECA Lung Health Hub</span>
          <span className="dc-mast-sep" aria-hidden="true" />
          <span className="dc-mast-product">Parliamentary Intelligence</span>
        </p>
        <p className="dc-mast-demo">Illustrative · demo data</p>
      </header>

      <section className="dc-title" aria-labelledby="dc-h1">
        <div className="dc-title-main">
          <p className="dc-eyebrow">
            {issue.ref} · {issue.country}
          </p>
          <h1 id="dc-h1" className="dc-h1">{issue.title}</h1>
        </div>
        <ol className="dc-proc" aria-label="Order of proceedings">
          {issue.stages.map((s, i) => (
            <li
              key={s.label}
              className={i < issue.stageIndex ? 'is-done' : i === issue.stageIndex ? 'is-now' : ''}
              aria-current={i === issue.stageIndex ? 'step' : undefined}
            >
              <span className="dc-proc-label">{s.label}</span>
              <span className="dc-proc-date">{longDate(s.date)}</span>
            </li>
          ))}
        </ol>
      </section>

      <main className="dc-main">
        <section className="dc-chamber" aria-labelledby="dc-chamber-title">
          <div className="dc-chamber-head">
            <h2 id="dc-chamber-title" className="dc-h2">The chamber</h2>
            <fieldset className="dc-motion">
              <legend className="dc-motion-legend">Motion</legend>
              <div className="dc-seg">
                {options.map((o) => (
                  <label key={o.id} className={`dc-seg-item${o.id === optionId ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="dc-option"
                      value={o.id}
                      checked={o.id === optionId}
                      onChange={() => transition(o.id, secured)}
                    />
                    <span className="dc-seg-id">{o.id}</span>
                    <span className="dc-seg-text">
                      <span className="dc-seg-name">{o.short}</span>
                      <span className="dc-seg-meta">
                        {pct(supportFor(o.id, secured[o.id]))}%{o.id === LEADING ? ' · leading' : ''}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <Hemicycle
            layout={shown}
            option={option}
            secured={sec}
            hovered={hovered}
            selected={selected}
            compact={compact}
            onHover={setHovered}
            onSelect={select}
          />
        </section>

        <div className="dc-meter-wrap">
          <Meter
            option={option}
            shown={shown.support}
            target={target.support}
            real={real}
            others={others}
            secured={sec}
            onReset={() => transition(optionId, { ...secured, [optionId]: [] })}
          />
        </div>

        <section className="dc-division" aria-labelledby="dc-division-title">
          <h2 id="dc-division-title" className="dc-h3">
            Division list · Option {option.id}
          </h2>
          <div className="dc-division-cols">
            {STANCES.map((st) => {
              const ids = target.order.filter((id) => target.stance[id] === st);
              const weight = ids.reduce((s, id) => s + actorById.get(id)!.influence, 0);
              return (
                <div key={st} className="dc-division-col">
                  <h3 className={`dc-division-head dc-ink--${slug(st)}`}>
                    <i className={`dc-swatch dc-swatch--${slug(st)}`} aria-hidden="true" />
                    {STANCE_LABEL[st]}
                    <span className="dc-division-count">{weight}</span>
                  </h3>
                  {ids.length ? (
                    <ul>
                      {ids.map((id) => {
                        const a = actorById.get(id)!;
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              className={`dc-division-item${selected === id ? ' is-selected' : ''}${hovered === id ? ' is-hover' : ''}`}
                              onMouseEnter={() => setHovered(id)}
                              onMouseLeave={() => setHovered(null)}
                              onClick={() => select(id)}
                              aria-pressed={selected === id}
                            >
                              <span>{a.inst.short}{sec.includes(id) ? ' *' : ''}</span>
                              <span className="dc-division-inf">{a.influence}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="dc-division-none">None</p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="dc-division-foot">
            Figures are influence on a ten-point scale. {sec.length > 0 && '* simulated. '}Stances per option are illustrative stubs.
            Next sitting: {recommendedStep.title.toLowerCase()}, {longDate(recommendedStep.date)}.
          </p>
        </section>

        <aside className="dc-panel" ref={panelRef} aria-label="What would it take">
          {selected ? (
            <ActorPanel
              key={selected}
              id={selected}
              option={option}
              layout={target}
              secured={sec}
              peek={peek}
              onPeek={setPeek}
              onToggle={toggleSecure}
              onClose={() => setSelected(null)}
            />
          ) : (
            <WhipPanel option={option} secured={sec} onSelect={select} />
          )}
        </aside>
      </main>
    </div>
  );
}
