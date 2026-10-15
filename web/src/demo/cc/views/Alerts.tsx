import type { AlertType, Severity } from '../../careContinuityScenario';
import { Icon } from '../icons';
import { SEVERITY_LABEL, TYPE_LABEL, agoLabel, type IconName } from '../model';
import { useNav } from '../nav';
import { useDemo } from '../store';
import { AlertStatusBadge, Empty, PageHeader, SeverityBadge, Segmented } from '../ui';

const SEV_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
const TYPE_ICON: Record<AlertType, IconName> = { 'missed-doses': 'pill', 'stock-out': 'truck', migration: 'route', 'funding-gap': 'wallet' };
type StatusFilter = 'open' | 'resolved' | 'all';

export function Alerts() {
  const { params, set, open, item } = useNav();
  const { alerts } = useDemo();
  const status = (params.get('status') as StatusFilter | null) ?? 'open';
  const sevParam = params.get('severity');
  const sevs = new Set((sevParam ? sevParam.split(',') : []) as Severity[]);
  const type = (params.get('type') ?? '') as AlertType | '';

  const byStatus = alerts.filter((a) => (status === 'all' ? true : status === 'open' ? a.status !== 'resolved' : a.status === 'resolved'));
  const list = byStatus
    .filter((a) => sevs.size === 0 || sevs.has(a.severity))
    .filter((a) => !type || a.type === type)
    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.detectedDaysAgo - b.detectedDaysAgo);

  const toggleSev = (s: Severity) => {
    const next = new Set(sevs);
    if (next.has(s)) next.delete(s); else next.add(s);
    set({ severity: next.size ? [...next].join(',') : null }, { replace: true });
  };

  const openCount = alerts.filter((a) => a.status !== 'resolved').length;
  const unassigned = alerts.filter((a) => a.status === 'new').length;

  return (
    <div className="cc-view">
      <PageHeader
        title="Continuity alerts"
        subtitle={<>{openCount} open signals, {unassigned} not yet acknowledged. Signals are aggregated by district or region; no individual records are shown here.</>}
      />

      <div className="cc-type-tiles">
        {(Object.keys(TYPE_LABEL) as AlertType[]).map((t) => {
          const n = alerts.filter((a) => a.type === t && a.status !== 'resolved').length;
          const on = type === t;
          return (
            <button key={t} type="button" aria-pressed={on} className={`cc-type-tile ${on ? 'is-on' : ''}`} onClick={() => set({ type: on ? null : t }, { replace: true })}>
              <span className={`cc-type-icon cc-type-${t}`} aria-hidden="true"><Icon name={TYPE_ICON[t]} size={16} /></span>
              <span className="cc-type-text">
                <span className="cc-type-label">{TYPE_LABEL[t]}</span>
                <span className="cc-type-n cc-num">{n} open</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="cc-toolbar">
        <Segmented<StatusFilter>
          label="Alert status"
          value={status}
          options={[{ id: 'open', label: 'Open' }, { id: 'resolved', label: 'Resolved' }, { id: 'all', label: 'All' }]}
          onChange={(v) => set({ status: v === 'open' ? null : v }, { replace: true })}
        />
        <div className="cc-chip-group" role="group" aria-label="Filter by severity">
          {(['high', 'medium', 'low'] as Severity[]).map((s) => (
            <button key={s} type="button" aria-pressed={sevs.has(s)} className={`cc-chip cc-chip-${s} ${sevs.has(s) ? 'is-on' : ''}`} onClick={() => toggleSev(s)}>
              <i aria-hidden="true" />{SEVERITY_LABEL[s]} <span className="cc-num">{byStatus.filter((a) => a.severity === s).length}</span>
            </button>
          ))}
        </div>
        <select aria-label="Filter by alert type" value={type} onChange={(e) => set({ type: e.target.value || null }, { replace: true })}>
          <option value="">All types</option>
          {(Object.keys(TYPE_LABEL) as AlertType[]).map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </select>
      </div>

      <section className="cc-card cc-card-flush" aria-label="Alert queue">
        <div className="cc-table-meta">
          <span><strong className="cc-num">{list.length}</strong> {list.length === 1 ? 'alert' : 'alerts'} in queue</span>
          <span className="cc-fine">Sorted by severity, then newest first</span>
        </div>
        {list.length === 0 ? (
          <Empty title="Queue is clear">No alerts match these filters.</Empty>
        ) : (
          <ul className="cc-queue">
            {list.map((a) => (
              <li key={a.id}>
                <button type="button" className={`cc-queue-row cc-queue-${a.severity} ${item === a.id ? 'is-current' : ''} ${a.status === 'resolved' ? 'is-resolved' : ''}`} onClick={() => open(a.id)}>
                  <span className={`cc-type-icon cc-type-${a.type}`} aria-hidden="true"><Icon name={TYPE_ICON[a.type]} size={16} /></span>
                  <span className="cc-queue-main">
                    <span className="cc-queue-title">
                      <span className="cc-queue-id cc-mono">{a.id.toUpperCase()}</span>
                      {a.title}
                    </span>
                    <span className="cc-queue-sub">{a.scope} · {TYPE_LABEL[a.type]} · {a.affected.people} people affected</span>
                  </span>
                  <span className="cc-queue-meta">
                    <SeverityBadge severity={a.severity} />
                    <AlertStatusBadge status={a.status} />
                    <span className="cc-queue-assignee">{a.assignee ?? 'Unassigned'}</span>
                    <span className="cc-queue-age">{agoLabel(a.detectedDaysAgo)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
