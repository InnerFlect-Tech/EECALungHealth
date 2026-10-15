import { useRef, type KeyboardEvent } from 'react';
import type { PolicyOption } from '../../kazakhstanScenario';
import { actorById, STANCE_LABEL, type ChamberStance } from './data';
import {
  arcPath, CX, CY, labelPositions, MAJ_A, MAJ_ID, polar, R_IN, R_OUT, SEAT_R, sectorPath, VB_H, VB_W, type Layout,
} from './geometry';

const slug = (s: ChamberStance) => s.replace(' ', '-');

interface Props {
  layout: Layout;
  option: PolicyOption;
  secured: readonly string[];
  hovered: string | null;
  selected: string | null;
  compact: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function Hemicycle({ layout, option, secured, hovered, selected, compact, onHover, onSelect }: Props) {
  const nodes = useRef(new Map<string, SVGGElement>());
  const active = hovered ?? selected;
  const labels = labelPositions(layout);
  const vb = compact ? '168 50 864 466' : `0 0 ${VB_W} ${VB_H}`;
  const [vx, vy, vw, vh] = vb.split(' ').map(Number);
  const pctX = (x: number) => `${((x - vx) / vw) * 100}%`;
  const pctY = (y: number) => `${((y - vy) / vh) * 100}%`;

  const [mx0, my0] = polar(MAJ_A, R_IN - 6);
  const [mx1, my1] = polar(MAJ_A, R_OUT + 18);
  const [mlx, mly] = polar(MAJ_A, R_OUT + 36);

  const readoutId = active;
  const readoutActor = readoutId ? actorById.get(readoutId) : null;

  function move(e: KeyboardEvent<SVGGElement>, id: string) {
    const i = layout.order.indexOf(id);
    let next: string | undefined;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = layout.order[i - 1];
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = layout.order[i + 1];
    else if (e.key === 'Home') next = layout.order[0];
    else if (e.key === 'End') next = layout.order[layout.order.length - 1];
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
      return;
    }
    if (next) {
      e.preventDefault();
      nodes.current.get(next)?.focus();
    }
  }

  return (
    <div className={`dc-hemi${compact ? ' dc-hemi--compact' : ''}`}>
      <div className="dc-hemi-stage" style={{ aspectRatio: `${vw} / ${vh}` }}>
        <svg
          className={`dc-hemi-svg${active ? ' has-active' : ''}`}
          viewBox={vb}
          role="group"
          aria-label={`Chamber of positions on Option ${option.id}, ${option.short}. Seats are sized by influence and ordered from supportive on the left to opposed on the right. Use Tab or the arrow keys to move between actors, Enter to open one.`}
        >
          <path className="dc-hemi-wall" d={arcPath(Math.PI, 0, R_OUT + 22)} />
          <path className="dc-hemi-wall dc-hemi-wall--in" d={arcPath(Math.PI, 0, R_IN - 22)} />
          <line className="dc-hemi-floor" x1={CX - R_OUT - 40} x2={CX + R_OUT + 40} y1={CY + 18} y2={CY + 18} />
          <line className="dc-hemi-dais" x1={CX - 44} x2={CX + 44} y1={CY + 18} y2={CY + 18} />

          {!compact &&
            labels.map((l) => (
              <line
                key={`ld-${l.id}`}
                className={`dc-leader${l.id === MAJ_ID ? ' dc-leader--maj' : ''}${l.id === active ? ' is-active' : ''}${l.id === selected ? ' is-selected' : ''}`}
                x1={l.ax}
                y1={l.ay}
                x2={l.x + (l.side === 'l' ? 6 : -6)}
                y2={l.y}
              />
            ))}

          {layout.order.map((id, idx) => {
            const actor = actorById.get(id)!;
            const stance = layout.stance[id];
            const [a0, a1] = layout.wedges[id];
            const isSim = secured.includes(id);
            const isSel = selected === id;
            const isAct = active === id;
            return (
              <g
                key={id}
                ref={(el) => {
                  if (el) nodes.current.set(id, el);
                  else nodes.current.delete(id);
                }}
                className={`dc-cluster${isAct ? ' is-active' : ''}${isSel ? ' is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${idx + 1} of ${layout.order.length}: ${actor.inst.short}. ${STANCE_LABEL[stance]}${isSim ? ' (simulated)' : ''} on Option ${option.id}. Influence ${actor.influence} of 10.`}
                onMouseEnter={() => onHover(id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(id)}
                onKeyDown={(e) => move(e, id)}
              >
                <path className="dc-wedge" d={sectorPath(a0, a1, R_IN - 16, R_OUT + 16)} />
                {layout.seats[id].map((s, i) => {
                  const [x, y] = polar(s.a, s.r);
                  return (
                    <circle
                      key={i}
                      className={`dc-seat dc-seat--${slug(stance)}${isSim ? ' dc-seat--sim' : ''}`}
                      cx={x}
                      cy={y}
                      r={SEAT_R}
                    />
                  );
                })}
                <path className="dc-rail" d={arcPath(a0, a1, R_OUT + 24)} />
              </g>
            );
          })}

          <line className="dc-majority" x1={mx0} y1={my0} x2={mx1} y2={my1} />
        </svg>

        {compact && (
          <span className="dc-majority-label" style={{ left: pctX(mlx), top: pctY(mly) }} aria-hidden="true">
            60%
          </span>
        )}

        {!compact && (
          <div className="dc-labels" aria-hidden="true">
            {labels.map((l) => {
              if (l.id === MAJ_ID) {
                return (
                  <span key={l.id} className="dc-label dc-label--r dc-label--maj" style={{ left: pctX(l.x), top: pctY(l.y) }}>
                    60% majority line
                  </span>
                );
              }
              const a = actorById.get(l.id)!;
              return (
                <span
                  key={l.id}
                  className={`dc-label dc-label--${l.side}${l.id === active ? ' is-active' : ''}${l.id === selected ? ' is-selected' : ''}${active && l.id !== active && l.id !== selected ? ' is-dim' : ''}`}
                  style={{ left: pctX(l.x), top: pctY(l.y) }}
                  onMouseEnter={() => onHover(l.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(l.id)}
                >
                  {a.inst.short}
                </span>
              );
            })}
          </div>
        )}

        <div
          className="dc-well"
          style={{ left: pctX(CX - R_IN + 20), right: `calc(100% - ${pctX(CX + R_IN - 20)})`, bottom: `${((vy + vh - CY - 6) / vh) * 100}%` }}
          aria-live="polite"
        >
          {readoutActor ? (
            <>
              <span className="dc-well-eyebrow">
                {readoutId === selected && readoutId !== hovered ? 'Selected' : 'Seat'} · influence {readoutActor.influence}
              </span>
              <span className="dc-well-name">{readoutActor.inst.short}</span>
              <span className={`dc-well-stance dc-ink--${slug(layout.stance[readoutActor.id])}`}>
                <i className={`dc-swatch dc-swatch--${slug(layout.stance[readoutActor.id])}`} aria-hidden="true" />
                {STANCE_LABEL[layout.stance[readoutActor.id]]}
                {secured.includes(readoutActor.id) ? ' (simulated)' : ''} on Option {option.id}
              </span>
            </>
          ) : (
            <>
              <span className="dc-well-eyebrow">The motion</span>
              <span className="dc-well-name">Option {option.id}</span>
              <span className="dc-well-stance">{option.short}</span>
            </>
          )}
        </div>
      </div>
      <div className="dc-axis" aria-hidden="true" style={{ paddingLeft: pctX(CX - R_OUT - 22), paddingRight: `calc(100% - ${pctX(CX + R_OUT + 22)})` }}>
        <span>← Supportive</span>
        <span>Opposed →</span>
      </div>
    </div>
  );
}
