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
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2;
const LABEL_RADIUS = RADIUS * 0.62;

function polarPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

type Props = {
  compact?: boolean;
};

export function UseOfFundsChart({ compact = false }: Props) {
  let cumulativeDeg = -90;

  const slices = SLICES.map((s) => {
    const startDeg = cumulativeDeg;
    const sweepDeg = (s.pct / 100) * 360;
    const endDeg = startDeg + sweepDeg;
    cumulativeDeg = endDeg;

    const start = polarPoint(startDeg, RADIUS);
    const end = polarPoint(endDeg, RADIUS);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    const path = `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    const label = polarPoint(startDeg + sweepDeg / 2, LABEL_RADIUS);

    return { ...s, path, label };
  });

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
          {slices.map((s) => (
            <path key={s.key} d={s.path} fill={s.color} stroke="var(--color-surface)" strokeWidth="2" />
          ))}
          {slices.map((s) => (
            <text key={`${s.key}-pct`} x={s.label.x} y={s.label.y} className="uof-pie-pct">
              {s.pct}%
            </text>
          ))}
        </svg>

        <ul className="uof-legend" role="list">
          {SLICES.map((s) => (
            <li className="uof-legend-row" key={s.key}>
              <span className="uof-legend-swatch" style={{ background: s.color }} aria-hidden="true" />
              <span className="uof-legend-label"><T k={s.labelKey} /></span>
            </li>
          ))}
        </ul>
      </div>

      <p className="uof-chart-caveat"><T k="uof-chart-caveat" /></p>
    </div>
  );
}
