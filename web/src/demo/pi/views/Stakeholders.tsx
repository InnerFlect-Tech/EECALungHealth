import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import * as S from '../../kazakhstanScenario';
import type { Sector, StakeholderProfile } from '../../kazakhstanScenario';
import { Icon } from '../Icon';
import { PageHeader, Segmented, StanceBadge } from '../ui';
import { initials, useNav } from '../store';
import { useMediaQuery } from '../hooks';

const inst = (id: string) => S.institutions.find((i) => i.id === id)!;
const sectorOf = (p: StakeholderProfile) => inst(p.institutionId).sector;
const sectorLabel = (s: Sector) => S.sectors.find((x) => x.id === s)?.label ?? s;
const usedSectors = S.sectors.filter((s) => S.stakeholderProfiles.some((p) => sectorOf(p) === s.id));

function keyActivate(fn: () => void) {
  return (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } };
}

/** Splits a label into at most two lines for SVG text. */
function lines(label: string): string[] {
  if (label.length <= 16) return [label];
  const words = label.split(' ');
  let a = '';
  while (words.length && (a + ' ' + words[0]).trim().length <= 16) a = `${a} ${words.shift()}`.trim();
  return [a, words.join(' ')];
}

function Network({ visible, selected, onPick, compact }: { visible: Set<string>; selected: string | null; onPick: (id: string) => void; compact: boolean }) {
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? selected;
  const pos = Object.fromEntries(S.stakeholderProfiles.map((p) => [p.institutionId, p]));
  const connected = new Set(focus ? S.stakeholderLinks.filter((l) => l.from === focus || l.to === focus).flatMap((l) => [l.from, l.to]) : []);
  return (
    <svg className="pi-net" viewBox={compact ? '30 20 960 620' : '80 20 860 600'} role="group" aria-label="Stakeholder network. Select a node to open details.">
      <defs>
        <pattern id="pi-dotgrid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" className="pi-dotgrid" /></pattern>
      </defs>
      <rect x="0" y="0" width="1000" height="660" fill="url(#pi-dotgrid)" />
      {S.stakeholderLinks.map((l) => {
        if (!visible.has(l.from) || !visible.has(l.to)) return null;
        const a = pos[l.from], b = pos[l.to];
        const on = focus && (l.from === focus || l.to === focus);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        return (
          <g key={`${l.from}-${l.to}`} className={`pi-edge${on ? ' is-on' : ''}${focus && !on ? ' is-dim' : ''}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            {on && (
              <g className="pi-edge-label">
                <rect x={mx - l.label.length * 3.4 - 8} y={my - 11} width={l.label.length * 6.8 + 16} height={22} rx={11} />
                <text x={mx} y={my + 4} textAnchor="middle">{l.label}</text>
              </g>
            )}
          </g>
        );
      })}
      {S.stakeholderProfiles.map((p) => {
        if (!visible.has(p.institutionId)) return null;
        const i = inst(p.institutionId);
        const r = 14 + p.influence * 1.8;
        const isSel = selected === p.institutionId;
        const dim = focus && focus !== p.institutionId && !connected.has(p.institutionId);
        const ls = lines(i.short);
        return (
          <g
            key={p.institutionId}
            className={`pi-node pi-sector-${i.sector}${isSel ? ' is-selected' : ''}${dim ? ' is-dim' : ''}`}
            transform={`translate(${p.x} ${p.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${i.short}, ${sectorLabel(i.sector)}, position ${p.stance}`}
            aria-pressed={isSel}
            onClick={() => onPick(p.institutionId)}
            onKeyDown={keyActivate(() => onPick(p.institutionId))}
            onMouseEnter={() => setHover(p.institutionId)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(p.institutionId)}
            onBlur={() => setHover(null)}
          >
            <circle className="pi-node-halo" r={r + 7} />
            <circle className="pi-node-circle" r={r} />
            <text className="pi-node-initials" y={5} textAnchor="middle">{initials(i.short)}</text>
            <text className="pi-node-label" y={r + 4} textAnchor="middle">{ls.map((t, k) => <tspan key={k} x={0} dy={k ? '1.15em' : '1em'}>{t}</tspan>)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Matrix({ visible, selected, onPick }: { visible: Set<string>; selected: string | null; onPick: (id: string) => void }) {
  const W = 800, H = 560, pad = 56;
  const x = (v: number) => pad + ((v - 0.5) / 10) * (W - pad * 1.5);
  const y = (v: number) => H - pad - ((v - 0.5) / 10) * (H - pad * 1.6);
  const midX = x(5.5), midY = y(5.5);
  const quads = [
    { label: 'Keep satisfied', sub: 'High influence · lower interest', x: pad + 14, y: pad / 2 + 22, a: 'start' },
    { label: 'Manage closely', sub: 'High influence · high interest', x: W - pad / 2 - 14, y: pad / 2 + 22, a: 'end' },
    { label: 'Monitor', sub: 'Lower influence · lower interest', x: pad + 14, y: H - pad - 30, a: 'start' },
    { label: 'Keep informed', sub: 'Lower influence · high interest', x: W - pad / 2 - 14, y: H - pad - 30, a: 'end' },
  ] as const;
  return (
    <svg className="pi-matrix" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Interest and influence matrix. Select a point to open details.">
      <rect x={pad} y={pad / 2} width={midX - pad} height={midY - pad / 2} className="pi-quad pi-quad-1" />
      <rect x={midX} y={pad / 2} width={W - pad / 2 - midX} height={midY - pad / 2} className="pi-quad pi-quad-2" />
      <rect x={pad} y={midY} width={midX - pad} height={H - pad - midY} className="pi-quad pi-quad-3" />
      <rect x={midX} y={midY} width={W - pad / 2 - midX} height={H - pad - midY} className="pi-quad pi-quad-4" />
      {quads.map((q) => (
        <g key={q.label} className="pi-quad-label">
          <text x={q.x} y={q.y} textAnchor={q.a}>{q.label}</text>
          <text x={q.x} y={q.y + 16} textAnchor={q.a} className="pi-quad-sub">{q.sub}</text>
        </g>
      ))}
      <line x1={pad} x2={W - pad / 2} y1={H - pad} y2={H - pad} className="pi-axis-line" />
      <line x1={pad} x2={pad} y1={pad / 2} y2={H - pad} className="pi-axis-line" />
      <text x={(W + pad / 2) / 2} y={H - 18} textAnchor="middle" className="pi-axis pi-axis-strong">Interest in the issue →</text>
      <text x={18} y={H / 2} textAnchor="middle" className="pi-axis pi-axis-strong" transform={`rotate(-90 18 ${H / 2})`}>Influence over the decision →</text>
      {S.stakeholderProfiles.map((p) => {
        if (!visible.has(p.institutionId)) return null;
        const i = inst(p.institutionId);
        const pt = { px: x(p.interest), py: y(p.influence) };
        const isSel = selected === p.institutionId;
        const right = !p.matrixLabelLeft;
        return (
          <g
            key={p.institutionId}
            className={`pi-mpoint pi-sector-${i.sector}${isSel ? ' is-selected' : ''}`}
            transform={`translate(${pt.px} ${pt.py})`}
            role="button" tabIndex={0}
            aria-label={`${i.short}: interest ${p.interest} of 10, influence ${p.influence} of 10`}
            aria-pressed={isSel}
            onClick={() => onPick(p.institutionId)}
            onKeyDown={keyActivate(() => onPick(p.institutionId))}
          >
            <circle r={isSel ? 10 : 8} className="pi-node-circle" />
            <text x={right ? 14 : -14} y={4} textAnchor={right ? 'start' : 'end'} className="pi-mpoint-label">{i.short}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Stakeholders() {
  const nav = useNav();
  const compact = useMediaQuery('(max-width: 899px)');
  const [sectors, setSectors] = useState<Set<Sector>>(() => new Set(usedSectors.map((s) => s.id)));
  const mode = nav.mode === 'matrix' ? 'matrix' : 'network';
  const visible = new Set(S.stakeholderProfiles.filter((p) => sectors.has(sectorOf(p))).map((p) => p.institutionId));
  const selected = nav.item?.startsWith('sh-') ? nav.item.slice(3) : null;
  const pick = (id: string) => nav.open(`sh-${id}`);
  const toggle = (s: Sector) => setSectors((cur) => {
    const next = new Set(cur);
    if (next.has(s)) next.delete(s); else next.add(s);
    return next.size ? next : new Set(usedSectors.map((x) => x.id));
  });
  const list = S.stakeholderProfiles.filter((p) => visible.has(p.institutionId)).sort((a, b) => b.influence - a.influence);

  return (
    <div className="pi-view">
      <PageHeader
        eyebrow="Stakeholder map"
        title="Who decides, who delivers"
        subtitle="Institutions involved in financing community TB support, how they connect and where they stand. Positions are illustrative."
        actions={(
          <Segmented
            label="Map view"
            value={mode}
            onChange={(v) => nav.setMode(v === 'matrix' ? 'matrix' : null)}
            options={[{ id: 'network', label: 'Network', icon: 'network' }, { id: 'matrix', label: 'Interest / influence', icon: 'grid' }]}
          />
        )}
      />

      <div className="pi-chips pi-sector-filter" role="group" aria-label="Filter by sector">
        <span className="pi-filter-label"><Icon name="filter" />Sectors</span>
        {usedSectors.map((s) => (
          <button key={s.id} type="button" className={`pi-chip pi-chip-sector pi-sector-${s.id}`} aria-pressed={sectors.has(s.id)} onClick={() => toggle(s.id)}>
            <i className="pi-sector-dot" aria-hidden="true" />{s.label}
          </button>
        ))}
      </div>

      <div className="pi-map-layout">
        <section className="pi-card pi-map-card" aria-label={mode === 'matrix' ? 'Interest and influence matrix' : 'Stakeholder network'}>
          <div className="pi-map-scroll">
            {mode === 'matrix'
              ? <Matrix visible={visible} selected={selected} onPick={pick} />
              : <Network visible={visible} selected={selected} onPick={pick} compact={compact} />}
          </div>
          <div className="pi-map-foot">
            <span className="pi-muted-xs">{mode === 'matrix' ? 'Scores are illustrative judgements (1–10).' : 'Node size reflects influence. Hover a node to see relationships.'}</span>
            <span className="pi-legend">
              {usedSectors.map((s) => <span key={s.id}><i className={`pi-sector-dot pi-sector-${s.id}`} />{s.label}</span>)}
            </span>
          </div>
        </section>

        <section className="pi-card pi-sh-list" aria-labelledby="pi-sh-title">
          <div className="pi-card-head"><h2 id="pi-sh-title">Stakeholders</h2><span className="pi-muted-sm">{list.length}</span></div>
          <ul>
            {list.map((p) => {
              const i = inst(p.institutionId);
              return (
                <li key={p.institutionId}>
                  <button type="button" className={selected === p.institutionId ? 'is-selected' : ''} onClick={() => pick(p.institutionId)}>
                    <i className={`pi-sector-dot pi-sector-${i.sector}`} aria-hidden="true" />
                    <span className="pi-sh-main">
                      <strong>{i.short}</strong>
                      <span>{sectorLabel(i.sector)} · influence {p.influence}/10</span>
                    </span>
                    <StanceBadge stance={p.stance} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
