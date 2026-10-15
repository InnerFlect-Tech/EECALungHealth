// Inline-SVG charts with hover/focus tooltips. No chart library.
import { useState } from 'react';
import type { ReactNode } from 'react';

function Tip({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <div className="pi-tip" role="status" style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}>
      {children}
    </div>
  );
}

// --- Financing transition: stacked bars + need line ---------------------------

export function TransitionChart({ data, need }: { data: { year: string; external: number; domestic: number }[]; need: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 220, padL = 36, padR = 12, padT = 18, padB = 28;
  const max = 2.2;
  const iw = W - padL - padR, ih = H - padT - padB;
  const bw = iw / data.length;
  const y = (v: number) => padT + ih - (v / max) * ih;
  const ticks = [0, 0.5, 1, 1.5, 2];
  return (
    <div className="pi-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrative financing of community TB support by year, external versus domestic, in KZT billions">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="pi-grid-line" />
            <text x={padL - 8} y={y(t) + 4} className="pi-axis" textAnchor="end">{t.toFixed(1)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * bw + bw * 0.22;
          const w = bw * 0.56;
          const gap = Math.max(0, need - d.external - d.domestic);
          return (
            <g
              key={d.year}
              className={`pi-bar-group${hover === i ? ' is-hover' : ''}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${d.year}: external ${d.external} bn, domestic ${d.domestic} bn, gap ${gap.toFixed(1)} bn`}
            >
              <rect x={padL + i * bw} y={padT} width={bw} height={ih} fill="transparent" />
              <rect x={x} y={y(d.domestic)} width={w} height={ih - (y(d.domestic) - padT)} rx={3} className="pi-bar-domestic" />
              <rect x={x} y={y(d.domestic + d.external)} width={w} height={(d.external / max) * ih - 2} rx={3} className="pi-bar-external" />
              {gap > 0.05 && <rect x={x} y={y(need)} width={w} height={(gap / max) * ih - 2} rx={3} className="pi-bar-gap" />}
              <text x={x + w / 2} y={H - 8} className="pi-axis" textAnchor="middle">{d.year}</text>
            </g>
          );
        })}
        <line x1={padL} x2={W - padR} y1={y(need)} y2={y(need)} className="pi-need-line" />
        <text x={W - padR} y={y(need) - 6} className="pi-axis pi-axis-strong" textAnchor="end">Estimated need (indicative)</text>
      </svg>
      {hover !== null && (() => {
        const d = data[hover];
        const gap = Math.max(0, need - d.external - d.domestic);
        return (
          <Tip x={padL + hover * bw + bw / 2} y={y(d.external + d.domestic + gap)} w={W} h={H}>
            <strong>{d.year}</strong>
            <span><i className="pi-key pi-key-external" />External <b>{d.external.toFixed(1)}</b></span>
            <span><i className="pi-key pi-key-domestic" />Domestic <b>{d.domestic.toFixed(1)}</b></span>
            <span><i className="pi-key pi-key-gap" />Unfunded <b>{gap.toFixed(1)}</b></span>
          </Tip>
        );
      })()}
      <div className="pi-legend">
        <span><i className="pi-key pi-key-external" />External grants</span>
        <span><i className="pi-key pi-key-domestic" />Domestic</span>
        <span><i className="pi-key pi-key-gap" />Unfunded gap</span>
        <span className="pi-legend-note">KZT bn / yr · illustrative</span>
      </div>
    </div>
  );
}

// --- Radar: options across criteria -----------------------------------------

export function Radar({ axes, series }: {
  axes: { id: string; label: string }[];
  series: { id: string; label: string; values: number[]; className: string; highlight?: boolean }[];
}) {
  const [hover, setHover] = useState<{ s: number; a: number } | null>(null);
  const W = 340, H = 300, cx = W / 2, cy = H / 2 + 6, R = 104;
  const n = axes.length;
  const pt = (i: number, v: number) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(ang) * R * (v / 5), cy + Math.sin(ang) * R * (v / 5)] as const;
  };
  return (
    <div className="pi-chart pi-radar">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Radar chart of option scores by criterion (1 to 5)">
        {[1, 2, 3, 4, 5].map((r) => (
          <polygon key={r} className="pi-radar-ring" points={axes.map((_, i) => pt(i, r).join(',')).join(' ')} />
        ))}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 5);
          const [lx, ly] = pt(i, 6.15);
          return (
            <g key={a.id}>
              <line x1={cx} y1={cy} x2={x} y2={y} className="pi-radar-spoke" />
              <text x={lx} y={ly + 4} className="pi-axis pi-axis-strong" textAnchor={Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'}>{a.label}</text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <g key={s.id} className={`pi-radar-series ${s.className}${s.highlight ? ' is-top' : ''}`}>
            <polygon points={s.values.map((v, i) => pt(i, v).join(',')).join(' ')} />
            {s.values.map((v, i) => {
              const [x, y] = pt(i, v);
              return (
                <circle
                  key={i} cx={x} cy={y} r={hover?.s === si && hover.a === i ? 6 : 3.5}
                  onMouseEnter={() => setHover({ s: si, a: i })} onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </g>
        ))}
      </svg>
      {hover && (() => {
        const [x, y] = pt(hover.a, series[hover.s].values[hover.a]);
        return (
          <Tip x={x} y={y} w={W} h={H}>
            <strong>{series[hover.s].label}</strong>
            <span>{axes[hover.a].label}: <b>{series[hover.s].values[hover.a]} / 5</b></span>
          </Tip>
        );
      })()}
    </div>
  );
}

// --- Donut ------------------------------------------------------------------

export function Donut({ data, label, onSelect }: {
  data: { id: string; label: string; value: number; className: string }[]; label: string; onSelect?: (id: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 42, C = 2 * Math.PI * R;
  const offsets = data.map((_, i) => data.slice(0, i).reduce((s, d) => s + (d.value / total) * C, 0));
  const active = data.find((d) => d.id === hover);
  return (
    <div className="pi-donut">
      <svg viewBox="0 0 120 120" role="img" aria-label={label}>
        <circle cx="60" cy="60" r={R} className="pi-donut-track" />
        {data.map((d, i) => {
          const len = (d.value / total) * C;
          const off = offsets[i];
          return (
            <circle
              key={d.id}
              cx="60" cy="60" r={R}
              className={`pi-donut-seg ${d.className}${hover && hover !== d.id ? ' is-dim' : ''}`}
              strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`}
              strokeDashoffset={-off}
              transform="rotate(-90 60 60)"
              onMouseEnter={() => setHover(d.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(d.id)}
            />
          );
        })}
        <text x="60" y="58" textAnchor="middle" className="pi-donut-num">{active ? active.value : total}</text>
        <text x="60" y="74" textAnchor="middle" className="pi-donut-cap">{active ? active.label : 'items'}</text>
      </svg>
    </div>
  );
}
