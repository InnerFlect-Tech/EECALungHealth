// Date helpers for Direction B. Dates are ISO calendar dates; they are formatted
// in UTC so the day never shifts with the viewer's time zone.

import { institutions } from '../../kazakhstanScenario';
import { TODAY } from './sittings';

const at = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o }).format(at(iso));

export const fmtLong = (iso: string) => `${fmt(iso, { weekday: 'long' })} ${fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' })}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mon = (iso: string) => MON[Number(iso.slice(5, 7)) - 1];
export const fmtDate = (iso: string) => `${Number(iso.slice(8, 10))} ${mon(iso)} ${iso.slice(0, 4)}`;
export const fmtDayMonthYear = (iso: string) => fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' });
export const fmtDayMonth = (iso: string) => `${Number(iso.slice(8, 10))} ${mon(iso)}`;
export const fmtDay = (iso: string) => fmt(iso, { day: 'numeric' });
export const fmtMonth = (iso: string) => mon(iso);
export const fmtYear = (iso: string) => fmt(iso, { year: 'numeric' });
export const fmtWeekday = (iso: string) => fmt(iso, { weekday: 'short' });

/** Whole days from a to b. */
export const daysBetween = (a: string, b: string) => Math.round((at(b).getTime() - at(a).getTime()) / 86_400_000);
export const daysFromToday = (iso: string) => daysBetween(TODAY, iso);

export const inst = (id: string) => institutions.find((i) => i.id === id);
export const instShort = (id: string) => inst(id)?.short ?? id;
export const instName = (id: string) => inst(id)?.name ?? id;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
