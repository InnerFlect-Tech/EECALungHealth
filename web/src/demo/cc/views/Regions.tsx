import { useMemo, useState } from 'react';
import { districts, regions, type District, type RegionId } from '../../careContinuityScenario';
import { Meter, Sparkline } from '../charts';
import { Icon } from '../icons';
import { allRegionStats, districtLabel, districtLoad, fmtInt, last, regionById } from '../model';
import { useNav } from '../nav';
import { useDemo } from '../store';
import { Card, PageHeader, Segmented } from '../ui';

type Metric = 'adherence' | 'cohort' | 'ltfu' | 'load';
type SortKey = 'name' | 'cohort' | 'adherence' | 'change' | 'ltfu' | 'load' | 'alerts';

const METRICS: { id: Metric; label: string; legend: [string, string]; worseHigh: boolean }[] = [
  { id: 'adherence', label: 'Doses taken', legend: ['84%', '95%'], worseHigh: false },
  { id: 'cohort', label: 'Cohort', legend: ['65', '121'], worseHigh: false },
  { id: 'ltfu', label: 'Loss to follow-up', legend: ['2.4%', '6.8%'], worseHigh: true },
  { id: 'load', label: 'Outreach load', legend: ['70%', '115%'], worseHigh: true },
];

const metricValue = (d: District, m: Metric) =>
  m === 'adherence' ? last(d.adherence) : m === 'cohort' ? d.cohort : m === 'ltfu' ? d.ltfu : districtLoad(d) * 100;

const metricText = (d: District, m: Metric) =>
  m === 'adherence' ? `${last(d.adherence).toFixed(0)}%` : m === 'cohort' ? `${d.cohort}` : m === 'ltfu' ? `${d.ltfu.toFixed(1)}%` : `${Math.round(districtLoad(d) * 100)}%`;

// Tile positions (col, row) in a schematic layout. Not a geographic map.
const TILE_POS: Record<string, [number, number]> = {
  'ds-north-a': [2, 0], 'ds-north-b': [3, 0], 'ds-north-c': [2, 1], 'ds-north-d': [3, 1],
  'ds-west-a': [0, 1], 'ds-west-b': [0, 2], 'ds-west-c': [1, 2],
  'ds-east-a': [5, 1], 'ds-east-b': [5, 2], 'ds-east-c': [4, 2],
  'ds-south-a': [2, 3], 'ds-south-b': [3, 3], 'ds-south-c': [2, 4], 'ds-south-d': [3, 4],
};
const REGION_LABEL_POS: Record<RegionId, [number, number, 'start' | 'middle' | 'end']> = {
  'rg-north': [3, -0.12, 'middle'],
  'rg-west': [0, 0.72, 'start'],
  'rg-east': [6, 0.72, 'end'],
  'rg-south': [3, 5.3, 'middle'],
};

// Sequential scale: calm teal (best) → sand → red (worst).
const STOPS: [number, number, number][] = [[207, 233, 228], [244, 220, 170], [204, 75, 56]];
function heat(t: number) {
  const seg = t < 0.5 ? 0 : 1;
  const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const [a, b] = [STOPS[seg], STOPS[seg + 1]];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
}

function TileMap({ metric, regionFilter, onPick }: { metric: Metric; regionFilter: RegionId | 'all'; onPick: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const m = METRICS.find((x) => x.id === metric)!;
  const vals = districts.map((d) => metricValue(d, metric));
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const CELL = 78, TILE = 70, PADX = 14, PADY = 44;
  const W = PADX * 2 + CELL * 6 - (CELL - TILE);
  const H = PADY * 2 + CELL * 5 - (CELL - TILE);
  const shade = (v: number) => {
    const t = (v - lo) / (hi - lo || 1);
    return m.worseHigh ? t : 1 - t; // 0 = best, 1 = worst
  };
  const hd = hover ? districts.find((d) => d.id === hover) : null;
  return (
    <div className="cc-tilemap">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`District tiles coloured by ${m.label.toLowerCase()}. Schematic layout, not a map.`}>
        {regions.map((r) => {
          const [cx, cy, anchor] = REGION_LABEL_POS[r.id];
          return (
            <text key={r.id} x={PADX + cx * CELL - (anchor === 'end' ? CELL - TILE : 0)} y={PADY + cy * CELL - 6} textAnchor={anchor} className="cc-tile-region">
              {r.name}
            </text>
          );
        })}
        {districts.map((d) => {
          const [c, r] = TILE_POS[d.id];
          const x = PADX + c * CELL, y = PADY + r * CELL;
          const t = shade(metricValue(d, metric));
          const dim = regionFilter !== 'all' && d.regionId !== regionFilter;
          const bad = t > 0.72;
          return (
            <g
              key={d.id}
              role="button"
              tabIndex={dim ? -1 : 0}
              aria-label={`${districtLabel(d.id)}: ${m.label} ${metricText(d, metric)}. Open district.`}
              className={`cc-tile ${dim ? 'is-dim' : ''} ${hover === d.id ? 'is-hover' : ''}`}
              onClick={() => onPick(d.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(d.id); } }}
              onPointerEnter={() => setHover(d.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(d.id)}
              onBlur={() => setHover(null)}
            >
              <rect x={x} y={y} width={TILE} height={TILE} rx={10} style={{ fill: heat(t) }} />
              <text x={x + 10} y={y + 22} className={`cc-tile-letter ${bad ? 'on-dark' : ''}`}>{regionById.get(d.regionId)?.short.charAt(0)}{d.letter}</text>
              <text x={x + 10} y={y + TILE - 12} className={`cc-tile-val ${bad ? 'on-dark' : ''}`}>{metricText(d, metric)}</text>
            </g>
          );
        })}
      </svg>
      <div className="cc-tilemap-foot">
        <div className="cc-tile-legend" aria-hidden="true">
          <span>{m.worseHigh ? m.legend[0] : m.legend[1]}</span>
          <i />
          <span>{m.worseHigh ? m.legend[1] : m.legend[0]}</span>
        </div>
        <span className="cc-tilemap-hint">
          {hd ? <><strong>{districtLabel(hd.id)}</strong> · {m.label} {metricText(hd, metric)} · {hd.cohort} people</> : 'Hover or focus a tile. Schematic layout, not a map.'}
        </span>
      </div>
    </div>
  );
}

export function Regions() {
  const { set, open, params } = useNav();
  const { alerts } = useDemo();
  const [metric, setMetric] = useState<Metric>('adherence');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'adherence', dir: 1 });
  const regionFilter = (params.get('region') as RegionId | null) ?? 'all';

  const rows = useMemo(() => {
    const openAlertsFor = (id: string) => alerts.filter((a) => a.status !== 'resolved' && a.districtIds.includes(id)).length;
    const list = districts.filter((d) => regionFilter === 'all' || d.regionId === regionFilter).map((d) => ({
      d,
      name: districtLabel(d.id),
      adherence: last(d.adherence),
      change: last(d.adherence) - d.adherence[8],
      load: districtLoad(d),
      alerts: openAlertsFor(d.id),
    }));
    const val = (r: (typeof list)[number]) => (sort.key === 'name' ? r.name : sort.key === 'cohort' ? r.d.cohort : sort.key === 'ltfu' ? r.d.ltfu : r[sort.key]);
    return list.sort((a, b) => {
      const va = val(a), vb = val(b);
      return (typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)) * sort.dir;
    });
  }, [regionFilter, sort, alerts]);

  const header = (key: SortKey, label: string, right = false, hideSm = false) => {
    const active = sort.key === key;
    return (
      <th scope="col" className={`${right ? 'cc-r' : ''} ${hideSm ? 'cc-hide-sm' : ''}`} aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
        <button type="button" className={`cc-sort ${active ? 'is-on' : ''}`} onClick={() => setSort({ key, dir: active ? (sort.dir === 1 ? -1 : 1) : key === 'name' ? 1 : -1 })}>
          {label}
          <Icon name={active && sort.dir === 1 ? 'arrow-up' : 'arrow-down'} size={12} />
        </button>
      </th>
    );
  };

  const total = districts.reduce((s, d) => s + d.cohort, 0);
  const overCap = districts.filter((d) => districtLoad(d) > 1).length;

  return (
    <div className="cc-view">
      <PageHeader
        title="Regions & districts"
        subtitle={<>{regions.length} regions · {districts.length} districts · {fmtInt(total)} people supported. {overCap} districts have outreach workers above recommended caseload.</>}
      />

      <div className="cc-toolbar">
        <Segmented
          label="Filter by region"
          value={regionFilter}
          options={[{ id: 'all', label: 'All regions' }, ...regions.map((r) => ({ id: r.id, label: r.short }))]}
          onChange={(v) => set({ region: v === 'all' ? null : v }, { replace: true })}
        />
      </div>

      <div className="cc-grid cc-grid-1-1">
        <Card
          id="rg-tiles"
          title="District tiles"
          subtitle="Colour shows the selected measure. Select a tile to open the district."
          actions={<Segmented label="Measure" value={metric} options={METRICS.map((m) => ({ id: m.id, label: m.label }))} onChange={setMetric} />}
          className="cc-card-tiles"
        >
          <TileMap metric={metric} regionFilter={regionFilter} onPick={open} />
        </Card>

        <div className="cc-region-cards">
          {allRegionStats.filter((r) => regionFilter === 'all' || r.region.id === regionFilter).map((r) => (
            <button key={r.region.id} type="button" className="cc-region-card" onClick={() => open(r.region.id)}>
              <div className="cc-region-card-top">
                <span className="cc-region-card-name">{r.region.name}</span>
                <Icon name="chevron-right" size={16} />
              </div>
              <div className="cc-region-card-stats">
                <span><strong className="cc-num">{fmtInt(r.cohort)}</strong> people</span>
                <span><strong className="cc-num">{r.adherence.toFixed(0)}%</strong> doses</span>
                <span><strong className="cc-num">{r.ltfu.toFixed(1)}%</strong> LTFU</span>
              </div>
              <Sparkline values={r.adherenceSeries} height={28} color={r.adherence < 89 ? 'var(--cc-med)' : 'var(--cc-accent-2)'} />
              <span className="cc-region-card-setting">{r.region.setting}</span>
            </button>
          ))}
        </div>
      </div>

      <Card id="rg-table" title="Districts" subtitle="Select a column to sort. Select a row to open the district." flush>
        <div className="cc-table-wrap">
          <table className="cc-table cc-table-click cc-table-cards">
            <thead>
              <tr>
                {header('name', 'District')}
                {header('cohort', 'Cohort', true)}
                {header('adherence', 'Doses taken')}
                {header('change', 'Δ 3 mo', true, true)}
                {header('ltfu', 'LTFU', true)}
                {header('load', 'Outreach load')}
                {header('alerts', 'Alerts', true)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.d.id} onClick={() => open(r.d.id)}>
                  <th scope="row" data-label="District">
                    <button type="button" className="cc-row-link" onClick={(e) => { e.stopPropagation(); open(r.d.id); }}>{r.name}</button>
                    <span className="cc-cell-sub">{r.d.setting} · {r.d.workers} outreach workers</span>
                  </th>
                  <td className="cc-r cc-num" data-label="Cohort">{r.d.cohort}</td>
                  <td data-label="Doses taken">
                    <span className="cc-meter-cell">
                      <Meter value={r.adherence - 70} max={30} tone={r.adherence < 85 ? 'bad' : r.adherence < 89 ? 'warn' : 'accent'} />
                      <span className="cc-num">{r.adherence.toFixed(0)}%</span>
                    </span>
                  </td>
                  <td className={`cc-r cc-num cc-hide-sm ${r.change < 0 ? 'cc-neg' : 'cc-pos'}`} data-label="Change">{r.change > 0 ? '+' : ''}{r.change.toFixed(1)}</td>
                  <td className={`cc-r cc-num ${r.d.ltfu >= 5.5 ? 'cc-neg' : ''}`} data-label="LTFU">{r.d.ltfu.toFixed(1)}%</td>
                  <td data-label="Outreach load">
                    <span className="cc-meter-cell">
                      <Meter value={r.load * 100} max={120} tone={r.load > 1 ? 'bad' : r.load > 0.9 ? 'warn' : 'good'} />
                      <span className="cc-num">{Math.round(r.load * 100)}%</span>
                    </span>
                  </td>
                  <td className="cc-r" data-label="Alerts"><span className={`cc-count ${r.alerts ? 'is-hot' : ''}`}>{r.alerts}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
