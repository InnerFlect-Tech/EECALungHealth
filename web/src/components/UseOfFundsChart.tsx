import { T } from '../i18n/I18nProvider';

type Slice = {
  key: 'engine' | 'bridge' | 'shield' | 'gov';
  pct: number;
  labelKey: string;
  color: string;
};

const SLICES: Slice[] = [
  { key: 'engine', pct: 40, labelKey: 'funders-uof-a-lab', color: 'var(--color-primary)' },
  { key: 'bridge', pct: 25, labelKey: 'funders-uof-b-lab', color: 'var(--color-navy)' },
  { key: 'shield', pct: 20, labelKey: 'funders-uof-c-lab', color: 'var(--teal-bright)' },
  { key: 'gov', pct: 15, labelKey: 'funders-uof-d-lab', color: 'var(--color-navy-light)' },
];

const SIZE = 220;
const STROKE = 34;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  compact?: boolean;
};

export function UseOfFundsChart({ compact = false }: Props) {
  let cumulativePct = 0;

  return (
    <div className={`uof-chart${compact ? ' is-compact' : ''}`}>
      <div className="uof-chart-head">
        <p className="eyebrow"><T k="funders-uof-eyebrow" /></p>
        <h2 className="uof-chart-title"><T k="funders-uof-title" /></h2>
        <p className="uof-chart-lead"><T k="funders-uof-lead" /></p>
      </div>

      <div className="uof-chart-body">
        <svg
          className="uof-pie"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Use of funds by programme pillar"
        >
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {SLICES.map((s) => {
              const dash = (s.pct / 100) * CIRCUMFERENCE;
              const offset = -((cumulativePct / 100) * CIRCUMFERENCE);
              cumulativePct += s.pct;
              return (
                <circle
                  key={s.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </g>
        </svg>

        <ul className="uof-legend" role="list">
          {SLICES.map((s) => (
            <li className="uof-legend-row" key={s.key}>
              <span className="uof-legend-swatch" style={{ background: s.color }} aria-hidden="true" />
              <span className="uof-legend-label"><T k={s.labelKey} /></span>
              <span className="uof-legend-pct">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="uof-chart-caveat"><T k="uof-chart-caveat" /></p>
    </div>
  );
}
