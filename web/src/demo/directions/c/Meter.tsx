import type { OptionId, PolicyOption } from '../../kazakhstanScenario';
import { actorById, pct, THRESHOLD } from './data';

interface Props {
  option: PolicyOption;
  /** Animated value currently shown, 0..1. */
  shown: number;
  /** Settled value with the simulation applied. */
  target: number;
  /** Value with no simulation. */
  real: number;
  others: { id: OptionId; value: number }[];
  secured: readonly string[];
  onReset: () => void;
}

export function Meter({ option, shown, target, real, others, secured, onReset }: Props) {
  const base = Math.min(shown, real);
  const sim = Math.max(0, shown - real);
  const gap = THRESHOLD - target;
  const clears = gap <= 0;
  const names = secured.map((id) => actorById.get(id)!.inst.short);

  return (
    <section className="dc-meter" aria-labelledby="dc-meter-title">
      <div className="dc-meter-head">
        <p className={`dc-meter-num${clears ? ' is-clear' : ''}`} aria-hidden="true">
          {Math.round(shown * 100)}
          <span>%</span>
        </p>
        <div className="dc-meter-copy">
          <h2 id="dc-meter-title" className="dc-meter-title">
            Weighted support for Option {option.id}
          </h2>
          <p className={`dc-meter-status${clears ? ' is-clear' : ''}`}>
            {clears
              ? `Clears the majority line by ${pct(-gap, 1)} points`
              : `${pct(gap, 1)} points short of the majority line`}
            {secured.length > 0 && <span className="dc-meter-was"> · {pct(real, 1)}% before simulation</span>}
          </p>
        </div>
      </div>

      <div
        className="dc-meter-bar"
        role="meter"
        aria-label={`Weighted support for Option ${option.id}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(target * 100)}
        aria-valuetext={`${pct(target, 1)} percent of weighted influence; majority line at 60 percent`}
      >
        <span className="dc-meter-track" />
        <span className="dc-meter-fill" style={{ width: `${base * 100}%` }} />
        <span className="dc-meter-sim" style={{ left: `${base * 100}%`, width: `${sim * 100}%` }} />
        {others.map((o) => (
          <span key={o.id} className="dc-meter-ghost" style={{ left: `${o.value * 100}%` }} title={`Option ${o.id}: ${pct(o.value)}%`}>
            <span>{o.id}</span>
          </span>
        ))}
        <span className="dc-meter-threshold" style={{ left: `${THRESHOLD * 100}%` }} />
        <span className="dc-meter-thlabel" style={{ left: `calc(${THRESHOLD * 100}% + 10px)` }}>
          Majority line · needs 60% of weighted influence
        </span>
      </div>
      <div className="dc-meter-scale" aria-hidden="true">
        {[0, 100].map((v) => (
          <span key={v} style={{ left: `${v}%` }}>{v}</span>
        ))}
      </div>

      <p className="dc-meter-note">
        Supportive actors count in full, conditional at half. Letters on the bar mark the other options.
        {secured.length > 0 && (
          <>
            {' '}Simulated: {names.join(', ')} secured.{' '}
            <button type="button" className="dc-textbtn" onClick={onReset}>
              Reset simulation
            </button>
          </>
        )}
      </p>
    </section>
  );
}
