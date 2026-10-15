// Hemicycle geometry for Direction C. Pure functions, no React.

import type { OptionId } from '../../kazakhstanScenario';
import { actors, STANCES, stanceOf, supportFor, THRESHOLD, type ChamberStance } from './data';

export const VB_W = 1200;
export const VB_H = 520;
export const CX = 600;
export const CY = 488;
export const R_IN = 188;
export const R_OUT = 404;
export const ROWS = 11;
export const SEAT_R = 8.4;
const AISLE = (2.6 * Math.PI) / 180;
export const MAJ_A = Math.PI * (1 - THRESHOLD);
export const MAJ_ID = '__majority';

export const ROW_RADII = Array.from({ length: ROWS }, (_, i) => R_IN + (i * (R_OUT - R_IN)) / (ROWS - 1));
const SUM_R = ROW_RADII.reduce((s, r) => s + r, 0);

export interface Seat { a: number; r: number }

export interface Layout {
  /** Actor ids in seating order, left to right. */
  order: string[];
  stance: Record<string, ChamberStance>;
  /** Seat polar positions, per actor, index-stable. */
  seats: Record<string, Seat[]>;
  /** Angular extent of each cluster [start, end], radians, start > end. */
  wedges: Record<string, [number, number]>;
  support: number;
}

export function computeLayout(option: OptionId, secured: readonly string[]): Layout {
  const stance: Record<string, ChamberStance> = {};
  for (const a of actors) stance[a.id] = stanceOf(option, a.id, secured);

  const ordered = [...actors].sort((x, y) => {
    const d = STANCES.indexOf(stance[x.id]) - STANCES.indexOf(stance[y.id]);
    if (d !== 0) return d;
    // Actors secured in a simulation sit at the inner edge of their new bloc,
    // so they visibly cross the floor rather than jump to the far wall.
    const sx = secured.includes(x.id) ? 1 : 0;
    const sy = secured.includes(y.id) ? 1 : 0;
    if (sx !== sy) return sx - sy;
    if (y.influence !== x.influence) return y.influence - x.influence;
    return x.id.localeCompare(y.id);
  });

  const totalSeats = ordered.reduce((s, a) => s + a.seats, 0);
  const available = Math.PI - AISLE * (ordered.length - 1);
  const seats: Record<string, Seat[]> = {};
  const wedges: Record<string, [number, number]> = {};

  let a0 = Math.PI;
  for (const actor of ordered) {
    const span = (available * actor.seats) / totalSeats;
    const a1 = a0 - span;
    // Seats per row in proportion to the row's radius (largest remainder).
    const raw = ROW_RADII.map((r) => (actor.seats * r) / SUM_R);
    const counts = raw.map(Math.floor);
    let rest = actor.seats - counts.reduce((s, c) => s + c, 0);
    const byFrac = raw.map((v, i) => [v - Math.floor(v), i] as const).sort((p, q) => q[0] - p[0] || q[1] - p[1]);
    for (let k = 0; rest > 0; k = (k + 1) % byFrac.length, rest--) counts[byFrac[k][1]]++;

    const list: Seat[] = [];
    counts.forEach((c, row) => {
      for (let j = 0; j < c; j++) list.push({ a: a0 - (span * (j + 0.5)) / c, r: ROW_RADII[row] });
    });
    list.sort((p, q) => q.a - p.a || p.r - q.r);
    seats[actor.id] = list;
    wedges[actor.id] = [a0, a1];
    a0 = a1 - AISLE;
  }

  return { order: ordered.map((a) => a.id), stance, seats, wedges, support: supportFor(option, secured) };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolate seat positions in polar space, so seats sweep around the chamber. */
export function lerpLayout(from: Layout, to: Layout, t: number): Layout {
  if (t >= 1) return to;
  const seats: Record<string, Seat[]> = {};
  const wedges: Record<string, [number, number]> = {};
  for (const id of to.order) {
    const f = from.seats[id];
    seats[id] = to.seats[id].map((s, i) => ({ a: lerp(f[i].a, s.a, t), r: lerp(f[i].r, s.r, t) }));
    wedges[id] = [lerp(from.wedges[id][0], to.wedges[id][0], t), lerp(from.wedges[id][1], to.wedges[id][1], t)];
  }
  return { order: to.order, stance: to.stance, seats, wedges, support: lerp(from.support, to.support, t) };
}

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function polar(a: number, r: number): [number, number] {
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

/** Annular sector path between two angles. */
export function sectorPath(a0: number, a1: number, r0: number, r1: number): string {
  const [x0, y0] = polar(a0, r1);
  const [x1, y1] = polar(a1, r1);
  const [x2, y2] = polar(a1, r0);
  const [x3, y3] = polar(a0, r0);
  const large = a0 - a1 > Math.PI ? 1 : 0;
  return `M${x0} ${y0} A${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`;
}

export function arcPath(a0: number, a1: number, r: number): string {
  const [x0, y0] = polar(a0, r);
  const [x1, y1] = polar(a1, r);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
}

export interface LabelPos { id: string; x: number; y: number; ax: number; ay: number; side: 'l' | 'r' }

/** Outside labels with simple vertical de-overlap on each side of the chamber. */
export function labelPositions(layout: Layout, gap = 31): LabelPos[] {
  const out: LabelPos[] = [];
  const rLabel = R_OUT + 34;
  for (const id of layout.order) {
    const [a0, a1] = layout.wedges[id];
    const m = (a0 + a1) / 2;
    const [ax, ay] = polar(m, R_OUT + 12);
    const [x, y] = polar(m, rLabel);
    out.push({ id, x, y, ax, ay, side: m > Math.PI / 2 ? 'l' : 'r' });
  }
  {
    const [ax, ay] = polar(MAJ_A, R_OUT + 18);
    const [x, y] = polar(MAJ_A, rLabel);
    out.push({ id: MAJ_ID, x, y, ax, ay, side: 'r' });
  }
  for (const side of ['l', 'r'] as const) {
    const list = out.filter((l) => l.side === side).sort((p, q) => p.y - q.y);
    for (let i = 1; i < list.length; i++) if (list[i].y - list[i - 1].y < gap) list[i].y = list[i - 1].y + gap;
    const maxY = CY - 6;
    if (list.length && list[list.length - 1].y > maxY) {
      list[list.length - 1].y = maxY;
      for (let i = list.length - 2; i >= 0; i--) if (list[i + 1].y - list[i].y < gap) list[i].y = list[i + 1].y - gap;
    }
  }
  return out;
}
