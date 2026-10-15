import { useMemo } from 'react';
import { districts, regions, workerRoles, type Phase, type RiskLevel } from '../../careContinuityScenario';
import { Icon } from '../icons';
import { PHASE_LABEL, dayDiff, districtById, districtLabel, fmtDate, regionById, relDay } from '../model';
import { useNav } from '../nav';
import { useDemo } from '../store';
import { CaseStatusBadge, Empty, PageHeader, RiskBadge, SyntheticNote, Tag } from '../ui';

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export function Caseload() {
  const { params, set, open } = useNav();
  const { cases } = useDemo();
  const q = params.get('q') ?? '';
  const district = params.get('district') ?? '';
  const phase = (params.get('phase') ?? '') as Phase | '';
  const risk = (params.get('risk') ?? '') as RiskLevel | '';
  const worker = params.get('worker') ?? '';
  const quick = params.get('status') ?? '';

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return cases
      .filter((c) => !t || `${c.id} ${districtLabel(c.districtId)} ${c.worker} ${c.flags.join(' ')}`.toLowerCase().includes(t))
      .filter((c) => !district || c.districtId === district || (district.startsWith('rg-') && districts.find((d) => d.id === c.districtId)?.regionId === district))
      .filter((c) => !phase || c.phase === phase)
      .filter((c) => !risk || c.risk === risk)
      .filter((c) => !worker || c.worker === worker)
      .filter((c) => !quick || (quick === 'follow-up' ? c.status === 'follow-up' : quick === 'due' ? c.nextFollowUp !== null && dayDiff(c.nextFollowUp) <= 1 : quick === 'escalated' ? c.escalated : true))
      .sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk] || a.adherence - b.adherence);
  }, [cases, q, district, phase, risk, worker, quick]);

  const counts = {
    all: cases.length,
    followUp: cases.filter((c) => c.status === 'follow-up').length,
    due: cases.filter((c) => c.nextFollowUp !== null && dayDiff(c.nextFollowUp) <= 1).length,
    escalated: cases.filter((c) => c.escalated).length,
  };
  const anyFilter = q || district || phase || risk || worker || quick;
  const upd = (k: string, v: string) => set({ [k]: v || null }, { replace: true });

  return (
    <div className="cc-view">
      <SyntheticNote>
        <strong>Synthetic records for demonstration, no real patients.</strong> IDs, age bands, histories and adherence calendars are generated. No names or identifying details are stored.
      </SyntheticNote>

      <PageHeader
        title="Caseload"
        subtitle={<>{cases.length} synthetic people on treatment, assigned to outreach workers by role. Sorted by risk, then by doses taken.</>}
      />

      <div className="cc-quick" role="group" aria-label="Quick filters">
        {[
          { id: '', label: 'All cases', n: counts.all },
          { id: 'follow-up', label: 'Needs follow-up', n: counts.followUp },
          { id: 'due', label: 'Follow-up due by tomorrow', n: counts.due },
          { id: 'escalated', label: 'Escalated', n: counts.escalated },
        ].map((f) => (
          <button key={f.id || 'all'} type="button" aria-pressed={quick === f.id} className={`cc-quick-btn ${quick === f.id ? 'is-on' : ''}`} onClick={() => upd('status', f.id)}>
            {f.label} <span className="cc-num">{f.n}</span>
          </button>
        ))}
      </div>

      <div className="cc-filters">
        <div className="cc-input-icon">
          <Icon name="search" size={15} />
          <input type="search" aria-label="Search cases" placeholder="Search ID, district, worker…" value={q} onChange={(e) => upd('q', e.target.value)} />
        </div>
        <select aria-label="Filter by district" value={district} onChange={(e) => upd('district', e.target.value)}>
          <option value="">All districts</option>
          {regions.map((r) => (
            <optgroup key={r.id} label={r.name}>
              <option value={r.id}>All of {r.name}</option>
              {districts.filter((d) => d.regionId === r.id).map((d) => <option key={d.id} value={d.id}>{districtLabel(d.id)}</option>)}
            </optgroup>
          ))}
        </select>
        <select aria-label="Filter by treatment phase" value={phase} onChange={(e) => upd('phase', e.target.value)}>
          <option value="">All phases</option>
          {(Object.keys(PHASE_LABEL) as Phase[]).map((p) => <option key={p} value={p}>{PHASE_LABEL[p]}</option>)}
        </select>
        <select aria-label="Filter by risk" value={risk} onChange={(e) => upd('risk', e.target.value)}>
          <option value="">All risk levels</option>
          <option value="high">High risk</option>
          <option value="medium">Medium risk</option>
          <option value="low">Low risk</option>
        </select>
        <select aria-label="Filter by outreach worker" value={worker} onChange={(e) => upd('worker', e.target.value)}>
          <option value="">All outreach workers</option>
          {workerRoles.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        {anyFilter && (
          <button type="button" className="cc-btn cc-btn-ghost" onClick={() => set({ q: null, district: null, phase: null, risk: null, worker: null, status: null }, { replace: true })}>
            <Icon name="x" size={14} /> Clear
          </button>
        )}
      </div>

      <section className="cc-card cc-card-flush" aria-label="Synthetic caseload">
        <div className="cc-table-meta">
          <span><strong className="cc-num">{filtered.length}</strong> of {cases.length} synthetic cases</span>
          <Tag tone="synthetic" icon="info">Synthetic</Tag>
        </div>
        {filtered.length === 0 ? (
          <Empty title="No cases match these filters">Try clearing a filter or searching for “SYN-01”.</Empty>
        ) : (
          <div className="cc-table-wrap">
            <table className="cc-table cc-table-click cc-table-cards cc-table-dense">
              <thead>
                <tr>
                  <th scope="col">Case</th>
                  <th scope="col">District</th>
                  <th scope="col">Phase</th>
                  <th scope="col">Risk</th>
                  <th scope="col">Doses taken</th>
                  <th scope="col">Last contact</th>
                  <th scope="col">Next follow-up</th>
                  <th scope="col">Assigned</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const due = c.nextFollowUp ? dayDiff(c.nextFollowUp) : null;
                  const stale = -dayDiff(c.lastContact);
                  return (
                    <tr key={c.id} onClick={() => open(c.id)}>
                      <th scope="row" data-label="Case">
                        <button type="button" className="cc-row-link cc-mono cc-nowrap" onClick={(e) => { e.stopPropagation(); open(c.id); }}>{c.id}</button>
                        <span className="cc-cell-sub cc-nowrap">Age {c.ageBand}{c.escalated ? ' · escalated' : ''}</span>
                      </th>
                      <td data-label="District" className="cc-nowrap">District {districtById.get(c.districtId)?.letter}<span className="cc-cell-sub">{regionById.get(districtById.get(c.districtId)!.regionId)?.name}</span></td>
                      <td data-label="Phase" className="cc-nowrap">{PHASE_LABEL[c.phase]} <span className="cc-cell-sub">Month {c.month}</span></td>
                      <td data-label="Risk"><RiskBadge risk={c.risk} /></td>
                      <td data-label="Doses taken" className={`cc-num cc-strong ${c.adherence < 80 ? 'cc-neg' : c.adherence < 88 ? 'cc-warn' : ''}`}>{c.adherence}%</td>
                      <td data-label="Last contact" className={`cc-nowrap ${stale >= 7 ? 'cc-neg' : ''}`}>{relDay(c.lastContact)}</td>
                      <td data-label="Next follow-up" className={`cc-nowrap ${due !== null && due <= 1 ? 'cc-strong' : ''}`}>{c.nextFollowUp ? <>{relDay(c.nextFollowUp)}<span className="cc-cell-sub">{fmtDate(c.nextFollowUp)}</span></> : '—'}</td>
                      <td data-label="Assigned" className="cc-nowrap">{c.worker}</td>
                      <td data-label="Status"><CaseStatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
