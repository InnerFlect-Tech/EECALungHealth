import { actors, edges, pathways, type Actor, type Edge } from '../../careContinuityScenario';
import { Icon } from '../icons';
import { EDGE_KIND } from '../model';
import { useNav } from '../nav';
import { Card, PageHeader } from '../ui';

const W = 720, H = 650, C = { x: 360, y: 325 };
const RING = { care: 172, system: 266 };

function pos(id: string) {
  if (id === 'patient') return C;
  const a = actors.find((x) => x.id === id)!;
  const rad = (a.angle * Math.PI) / 180;
  const r = RING[a.ring];
  return { x: C.x + r * Math.sin(rad), y: C.y - r * Math.cos(rad) };
}

const pillWidth = (a: Actor) => Math.round(a.short.length * 7.4 + 30);

function edgeGeom(e: Edge) {
  const p0 = pos(e.from), p1 = pos(e.to);
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const startPad = e.from === 'patient' ? 52 : 22;
  const endPad = e.to === 'patient' ? 56 : 26;
  const s = { x: p0.x + ux * startPad, y: p0.y + uy * startPad };
  const t = { x: p1.x - ux * endPad, y: p1.y - uy * endPad };
  // Bend away from the centre so edges do not crowd the patient node. When two
  // edges link the same pair in both directions, the second bends less.
  const reverse = edges.find((x) => x.from === e.to && x.to === e.from);
  const second = reverse ? edges.indexOf(reverse) < edges.indexOf(e) : false;
  const midX = (s.x + t.x) / 2, midY = (s.y + t.y) / 2;
  const px = -uy, py = ux;
  const outward = Math.sign((midX - C.x) * px + (midY - C.y) * py) || 1;
  const touchesPatient = e.from === 'patient' || e.to === 'patient';
  const bend = touchesPatient ? 0 : (second ? 0.05 : 0.2) * len * outward;
  const m = { x: midX + px * bend, y: midY + py * bend };
  // Label position: middle of the curve, or nearer the actor for patient links.
  const k = touchesPatient ? 0.42 : 0.5;
  const mid = {
    x: (1 - k) ** 2 * s.x + 2 * (1 - k) * k * m.x + k * k * t.x,
    y: (1 - k) ** 2 * s.y + 2 * (1 - k) * k * m.y + k * k * t.y,
  };
  return { d: `M${s.x.toFixed(1)},${s.y.toFixed(1)} Q${m.x.toFixed(1)},${m.y.toFixed(1)} ${t.x.toFixed(1)},${t.y.toFixed(1)}`, mid };
}

export function ServiceMap() {
  const { item, params, open, set } = useNav();
  const selected = item?.startsWith('ac-') ? item : null;
  const pathwayId = params.get('pathway');
  const pathway = pathways.find((p) => p.id === pathwayId) ?? null;

  const activeEdges = new Set<string>(
    pathway ? pathway.edges : selected ? edges.filter((e) => e.from === selected || e.to === selected).map((e) => e.id) : [],
  );
  const activeNodes = new Set<string>();
  edges.forEach((e) => { if (activeEdges.has(e.id)) { activeNodes.add(e.from); activeNodes.add(e.to); } });
  if (selected) activeNodes.add(selected);
  const focusMode = activeEdges.size > 0;

  return (
    <div className="cc-view">
      <PageHeader
        title="Service map"
        subtitle="Who acts around a person on TB treatment. Inner ring: direct care. Outer ring: policy, oversight and funding. Select a node for responsibilities and contact points, or a pathway to trace it."
      />
      <div className="cc-grid cc-grid-map">
        <Card id="sm-map" className="cc-card-map" flush>
          <div className="cc-map-box">
            <svg viewBox={`0 0 ${W} ${H}`} className="cc-map" role="group" aria-label="Service map of actors around the patient">
              <defs>
                {Object.entries(EDGE_KIND).map(([k, v]) => (
                  <marker key={k} id={`cc-arrow-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,1 L9,5 L0,9 z" style={{ fill: v.color }} />
                  </marker>
                ))}
              </defs>
              <circle cx={C.x} cy={C.y} r={RING.care} className="cc-map-ring" />
              <circle cx={C.x} cy={C.y} r={RING.system} className="cc-map-ring cc-map-ring-outer" />
              <text x={C.x} y={C.y + RING.care - 10} textAnchor="middle" className="cc-map-ring-label">DIRECT CARE</text>
              <text x={C.x} y={C.y - RING.system + 18} textAnchor="middle" className="cc-map-ring-label">POLICY · OVERSIGHT · FUNDING</text>

              {edges.map((e) => {
                const g = edgeGeom(e);
                const on = activeEdges.has(e.id);
                return (
                  <path
                    key={e.id}
                    d={g.d}
                    className={`cc-edge ${on ? 'is-on' : ''} ${focusMode && !on ? 'is-dim' : ''} ${on && pathway ? 'is-flow' : ''}`}
                    style={{ stroke: EDGE_KIND[e.kind].color }}
                    markerEnd={`url(#cc-arrow-${e.kind})`}
                  />
                );
              })}

              <g className="cc-map-patient">
                <circle cx={C.x} cy={C.y} r={50} />
                <text x={C.x} y={C.y - 3} textAnchor="middle">Person on</text>
                <text x={C.x} y={C.y + 14} textAnchor="middle">treatment</text>
              </g>

              {actors.map((a) => {
                const p = pos(a.id);
                const w = pillWidth(a);
                const on = selected === a.id;
                const lit = activeNodes.has(a.id);
                return (
                  <g
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={`${a.name}. ${a.role}. Open details.`}
                    className={`cc-node cc-node-${a.ring} ${on ? 'is-on' : ''} ${focusMode && !lit ? 'is-dim' : ''}`}
                    onClick={() => open(a.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(a.id); } }}
                  >
                    <rect x={p.x - w / 2} y={p.y - 18} width={w} height={36} rx={18} />
                    <text x={p.x} y={p.y + 5} textAnchor="middle">{a.short}</text>
                  </g>
                );
              })}

              {pathway && edges.filter((e) => activeEdges.has(e.id)).map((e, i) => {
                const g = edgeGeom(e);
                const label = `${pathway.edges.indexOf(e.id) + 1}. ${e.label}`;
                const w = label.length * 6.1 + 16;
                return (
                  <g key={e.id} className="cc-edge-label" style={{ ['--i' as string]: i }}>
                    <rect x={g.mid.x - w / 2} y={g.mid.y - 11} width={w} height={22} rx={11} style={{ stroke: EDGE_KIND[e.kind].color }} />
                    <text x={g.mid.x} y={g.mid.y + 4} textAnchor="middle">{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        <div className="cc-stack">
          <Card id="sm-paths" title="Referral and funding pathways" subtitle="Trace how people, signals and money move.">
            <ul className="cc-path-list">
              {pathways.map((p) => {
                const on = pathway?.id === p.id;
                return (
                  <li key={p.id}>
                    <button type="button" aria-pressed={on} className={`cc-path ${on ? 'is-on' : ''}`} onClick={() => set({ pathway: on ? null : p.id, item: null }, { replace: true })}>
                      <span className="cc-path-top">
                        <Icon name="route" size={15} />
                        <strong>{p.label}</strong>
                        <span className="cc-path-steps cc-num">{p.edges.length} steps</span>
                      </span>
                      <span className="cc-path-desc">{p.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card id="sm-legend" title="Legend">
            <ul className="cc-edge-legend">
              {Object.entries(EDGE_KIND).map(([k, v]) => (
                <li key={k}><i style={{ background: v.color }} />{v.label}</li>
              ))}
            </ul>
            <p className="cc-fine">Actors and contact points are generic roles, not named organisations or people.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
