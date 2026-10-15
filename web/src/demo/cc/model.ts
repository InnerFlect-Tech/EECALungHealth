// Derived data, lookups and formatters for the Care Continuity demo.
// Pure functions over ../careContinuityScenario.ts. No React here.

import {
  actors, alerts, caseRecords, districts, meta, regions, services,
  type AlertStatus, type AlertType, type CaseStatus, type District, type Phase,
  type Edge, type Region, type RegionId, type RiskLevel, type ServiceId, type Severity, type ViewId,
} from '../careContinuityScenario';

export const VIEWS: { id: ViewId; label: string; icon: IconName; blurb: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'home', blurb: 'Programme health at a glance' },
  { id: 'regions', label: 'Regions & districts', icon: 'map', blurb: 'Where support is working and where it is not' },
  { id: 'journey', label: 'Patient journey', icon: 'route', blurb: 'From diagnosis to completion' },
  { id: 'caseload', label: 'Caseload', icon: 'users', blurb: 'Synthetic records for demonstration' },
  { id: 'alerts', label: 'Continuity alerts', icon: 'bell', blurb: 'Signals that need action' },
  { id: 'map', label: 'Service map', icon: 'network', blurb: 'Who acts around the patient' },
  { id: 'impact', label: 'Impact & evidence', icon: 'chart', blurb: 'Outcomes, costs and the evidence pack' },
];

export type IconName =
  | 'home' | 'map' | 'route' | 'users' | 'bell' | 'network' | 'chart' | 'search' | 'x' | 'menu'
  | 'chevron-right' | 'chevron-down' | 'arrow-up' | 'arrow-down' | 'arrow-right' | 'external' | 'check'
  | 'alert' | 'clock' | 'phone' | 'calendar' | 'flag' | 'message' | 'user' | 'reset' | 'logout'
  | 'file' | 'copy' | 'download' | 'sparkle' | 'filter' | 'plus' | 'info' | 'pin' | 'wallet' | 'pill' | 'truck';

export const VIEW_IDS = VIEWS.map((v) => v.id);
export const viewLabel = (id: ViewId) => VIEWS.find((v) => v.id === id)?.label ?? 'Overview';

// ── Lookups ──
export const regionById = new Map<RegionId, Region>(regions.map((r) => [r.id, r]));
export const districtById = new Map<string, District>(districts.map((d) => [d.id, d]));
export const serviceById = new Map(services.map((s) => [s.id, s]));
export const actorById = new Map(actors.map((a) => [a.id, a]));
export const baseAlertById = new Map(alerts.map((a) => [a.id, a]));
export const baseCaseById = new Map(caseRecords.map((c) => [c.id, c]));

export const last = <T,>(arr: T[]) => arr[arr.length - 1];

export function districtLabel(id: string) {
  const d = districtById.get(id);
  if (!d) return id;
  return `${regionById.get(d.regionId)?.name} · District ${d.letter}`;
}
export function districtShort(id: string) {
  const d = districtById.get(id);
  if (!d) return id;
  return `${regionById.get(d.regionId)?.short} ${d.letter}`;
}

/** Caseload per worker as a share of the recommended maximum (1 = at capacity). */
export const districtLoad = (d: District) => d.cohort / (d.workers * d.capacityPerWorker);

export interface RegionStats {
  region: Region;
  districts: District[];
  cohort: number;
  adherence: number;
  adherenceSeries: number[];
  ltfu: number;
  workers: number;
  load: number;
}

export function regionStats(id: RegionId): RegionStats {
  const region = regionById.get(id)!;
  const ds = districts.filter((d) => d.regionId === id);
  const cohort = ds.reduce((s, d) => s + d.cohort, 0);
  const weighted = (f: (d: District) => number) => ds.reduce((s, d) => s + f(d) * d.cohort, 0) / cohort;
  const adherenceSeries = ds[0].adherence.map((_, i) => Math.round(weighted((d) => d.adherence[i]) * 10) / 10);
  const workers = ds.reduce((s, d) => s + d.workers, 0);
  return {
    region, districts: ds, cohort,
    adherence: last(adherenceSeries),
    adherenceSeries,
    ltfu: Math.round(weighted((d) => d.ltfu) * 10) / 10,
    workers,
    load: cohort / ds.reduce((s, d) => s + d.workers * d.capacityPerWorker, 0),
  };
}
export const allRegionStats = regions.map((r) => regionStats(r.id));

// ── Labels ──
export const SEVERITY_LABEL: Record<Severity, string> = { high: 'High', medium: 'Medium', low: 'Low' };
export const RISK_LABEL: Record<RiskLevel, string> = { high: 'High risk', medium: 'Medium risk', low: 'Low risk' };
export const TYPE_LABEL: Record<AlertType, string> = {
  'missed-doses': 'Missed doses',
  'stock-out': 'Stock-out risk',
  migration: 'Migration or displacement',
  'funding-gap': 'Funding gap',
};
export const ALERT_STATUS_LABEL: Record<AlertStatus, string> = { new: 'New', acknowledged: 'Acknowledged', assigned: 'Assigned', resolved: 'Resolved' };
export const PHASE_LABEL: Record<Phase, string> = { start: 'Treatment start', intensive: 'Intensive', continuation: 'Continuation', completion: 'Completion' };
export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  active: 'Active', 'follow-up': 'Needs follow-up', paused: 'Paused', completed: 'Completed', transferred: 'Transferred',
};
export const SERVICE_COLOR: Record<ServiceId, string> = {
  navigator: 'var(--cc-svc-navigator)',
  psycho: 'var(--cc-svc-psycho)',
  vouchers: 'var(--cc-svc-vouchers)',
  vot: 'var(--cc-svc-vot)',
};

// ── Formatting ──
export const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
export const fmtPct = (n: number, digits = 0) => `${n.toFixed(digits)}%`;
export const fmtUsd = (n: number) => `USD ${Math.round(n).toLocaleString('en-US')}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}
/** Whole days from the demo's "today" (meta.asOf) to `iso`. Negative = in the past. */
export function dayDiff(iso: string) {
  const [ay, am, ad] = meta.asOf.split('-').map(Number);
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ay, am - 1, ad)) / 86400000);
}
export function relDay(iso: string) {
  const n = dayDiff(iso);
  if (n === 0) return 'Today';
  if (n === -1) return 'Yesterday';
  if (n === 1) return 'Tomorrow';
  return n < 0 ? `${-n} days ago` : `In ${n} days`;
}
export const agoLabel = (days: number) => (days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`);

/** Colours and labels for service-map edges. */
export const EDGE_KIND: Record<Edge['kind'], { label: string; color: string }> = {
  referral: { label: 'Referral', color: 'var(--cc-accent-2)' },
  support: { label: 'Direct support', color: 'var(--cc-navy)' },
  funding: { label: 'Funding', color: 'var(--cc-svc-vouchers)' },
  policy: { label: 'Policy and standards', color: 'var(--cc-svc-psycho)' },
  data: { label: 'Data and signals', color: 'var(--cc-svc-vot)' },
};

