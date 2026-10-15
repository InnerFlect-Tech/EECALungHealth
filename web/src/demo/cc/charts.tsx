import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

// Inline-SVG charts with hover tooltips. No chart dependency.

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ── Sparkline ──
export function Sparkline({ values, color = 'var(--cc-accent-2)', height = 32, area = true }: { values: number[]; color?: string; height?: number; area?: boolean }) {
  const id = useId().replace(/:/g, '');
  const W = 120;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, 3 + (1 - (v - min) / span) * (height - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const lastPt = pts[pts.length - 1];
  return (
    <svg className="cc-spark" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" height={height} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={`${d} L${W},${height} L0,${height} Z`} fill={`url(#g${id})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2.5} fill={color} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── Line chart ──
export interface Series {
  id: string;
  name: string;
  values: number[];
  color: string;
  dashed?: boolean;
  area?: boolean;
}

interface LineChartProps {
  labels: string[];
  series: Series[];
  min: number;
  max: number;
  ticks: number[];
  format: (v: number) => string;
  height?: number;
  threshold?: { value: number; label: string; tone?: 'warn' | 'target' };
  band?: boolean; // shade the gap between the first two series
  ariaLabel: string;
  legend?: boolean;
}

export function LineChart({ labels, series, min, max, ticks, format, height = 240, threshold, band, ariaLabel, legend = true }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>(560);
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, '');
  const L = 44, R = 14, T = 14, B = 28;
  const n = labels.length;
  const plotW = Math.max(40, width - L - R);
  const step = n > 1 ? plotW / (n - 1) : 0;
  const x = (i: number) => L + i * step;
  const y = (v: number) => T + (1 - (v - min) / (max - min)) * (height - T - B);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const every = Math.max(1, Math.ceil((n * 46) / plotW));
  // Put the threshold label on the side of the line where the early data is not.
  const early = series.flatMap((s) => s.values.slice(0, 3));
  const labelBelow = threshold ? early.reduce((a, v) => a + v, 0) / (early.length || 1) >= threshold.value : false;

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    setHover(clamp(Math.round((px - L) / (step || 1)), 0, n - 1));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setHover((h) => clamp((h ?? -1) + 1, 0, n - 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setHover((h) => clamp((h ?? n) - 1, 0, n - 1)); }
    if (e.key === 'Escape' && hover !== null) { e.stopPropagation(); setHover(null); }
  };

  const tipLeft = hover !== null ? x(hover) : 0;
  const tipAlign = tipLeft > width - 150 ? 'right' : tipLeft < 150 ? 'left' : 'center';

  return (
    <figure className="cc-chart">
      <div
        ref={ref}
        className="cc-chart-box"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel} Use left and right arrow keys to read values.`}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <svg width={width} height={height} className="cc-chart-svg" aria-hidden="true" focusable="false">
          <defs>
            {series.filter((s) => s.area).map((s) => (
              <linearGradient key={s.id} id={`${gid}-${s.id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={width - R} y1={y(t)} y2={y(t)} className="cc-gridline" />
              <text x={L - 10} y={y(t) + 4} textAnchor="end" className="cc-axis">{format(t)}</text>
            </g>
          ))}
          {labels.map((lab, i) => (i % every === 0 || i === n - 1) && (i === n - 1 || n - 1 - i >= every) ? (
            <text key={lab + i} x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} className="cc-axis">{lab}</text>
          ) : null)}
          {band && series.length >= 2 && (
            <path
              d={`${path(series[0].values)} ${[...series[1].values].reverse().map((v, j) => `L${x(n - 1 - j).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} Z`}
              className="cc-band"
            />
          )}
          {threshold && (
            <g className={`cc-threshold cc-threshold-${threshold.tone ?? 'warn'}`}>
              <line x1={L} x2={width - R} y1={y(threshold.value)} y2={y(threshold.value)} />
              <text x={L + 6} y={y(threshold.value) + (labelBelow ? 15 : -6)} textAnchor="start">{threshold.label}</text>
            </g>
          )}
          {series.map((s) => (
            <g key={s.id}>
              {s.area && <path d={`${path(s.values)} L${x(n - 1)},${height - B} L${x(0)},${height - B} Z`} fill={`url(#${gid}-${s.id})`} />}
              <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}
          {series.map((s) => <circle key={s.id} cx={x(n - 1)} cy={y(s.values[n - 1])} r={3.5} fill={s.color} className="cc-endpoint" />)}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={T} y2={height - B} className="cc-guide" />
              {series.map((s) => <circle key={s.id} cx={x(hover)} cy={y(s.values[hover])} r={4.5} fill="#fff" stroke={s.color} strokeWidth={2} />)}
            </g>
          )}
          <rect x={L - step / 2} y={0} width={plotW + step} height={height} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
        </svg>
        {hover !== null && (
          <div className={`cc-tip cc-tip-${tipAlign}`} style={{ left: tipLeft, top: T }}>
            <div className="cc-tip-title">{labels[hover]}</div>
            {series.map((s) => (
              <div key={s.id} className="cc-tip-row">
                <i style={{ background: s.color }} />
                <span>{s.name}</span>
                <strong>{format(s.values[hover])}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
      {legend && (
        <figcaption className="cc-legend">
          {series.map((s) => (
            <span key={s.id}><i className={s.dashed ? 'is-dashed' : ''} style={{ background: s.dashed ? undefined : s.color, borderColor: s.color }} />{s.name}</span>
          ))}
          {threshold && <span><i className="is-threshold" />{threshold.label}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// ── Donut ──
export interface Slice { id: string; label: string; value: number; color: string }

export function Donut({ slices, centerLabel, format, size = 200 }: { slices: Slice[]; centerLabel: string; format: (v: number) => string; size?: number }) {
  const [active, setActive] = useState<string | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const R = 90, r = 60, C = 100;
  const arc = (a0: number, a1: number) => {
    const p = (a: number, rad: number) => [C + rad * Math.sin(a), C - rad * Math.cos(a)];
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r);
    return `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`;
  };
  const gap = 0.012;
  const arcs = slices.map((s, i) => {
    const before = slices.slice(0, i).reduce((sum, x) => sum + x.value, 0);
    const a0 = (before / total) * Math.PI * 2;
    const a1 = ((before + s.value) / total) * Math.PI * 2;
    return { ...s, d: arc(a0 + gap, a1 - gap) };
  });
  const cur = slices.find((s) => s.id === active);
  return (
    <div className="cc-donut">
      <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`${centerLabel}: ${slices.map((s) => `${s.label} ${format(s.value)}`).join(', ')}`}>
        {arcs.map((a) => (
          <path
            key={a.id}
            d={a.d}
            fill={a.color}
            className={`cc-donut-arc${active && active !== a.id ? ' is-dim' : ''}`}
            onPointerEnter={() => setActive(a.id)}
            onPointerLeave={() => setActive(null)}
          />
        ))}
        <text x={C} y={C - 6} textAnchor="middle" className="cc-donut-value">{format(cur ? cur.value : total)}</text>
        <text x={C} y={C + 14} textAnchor="middle" className="cc-donut-label">{cur ? `${Math.round((cur.value / total) * 100)}% of total` : centerLabel}</text>
      </svg>
      <ul className="cc-donut-legend">
        {slices.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={active === s.id ? 'is-on' : ''}
              onPointerEnter={() => setActive(s.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)}
              onBlur={() => setActive(null)}
            >
              <i style={{ background: s.color }} />
              <span>{s.label}</span>
              <strong>{format(s.value)}</strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Horizontal bars (HTML) ──
export function BarList({ items, format, max }: { items: { id: string; label: ReactNode; value: number; color?: string; hint?: string }[]; format: (v: number) => string; max?: number }) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="cc-barlist">
      {items.map((i) => (
        <li key={i.id} title={i.hint}>
          <div className="cc-barlist-head"><span>{i.label}</span><strong className="cc-num">{format(i.value)}</strong></div>
          <div className="cc-barlist-track"><span style={{ width: `${Math.max(2, (i.value / top) * 100)}%`, background: i.color }} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Small meter used in tables (0–100 scale by default). */
export function Meter({ value, max = 100, tone = 'accent' }: { value: number; max?: number; tone?: 'accent' | 'warn' | 'bad' | 'good' }) {
  return (
    <span className={`cc-meter cc-meter-${tone}`} aria-hidden="true">
      <span style={{ width: `${clamp((value / max) * 100, 2, 100)}%` }} />
    </span>
  );
}
