import { useMemo, useState } from 'react';
import * as S from '../../kazakhstanScenario';
import type { Confidence, EvidenceItem, EvidenceType, SourceCategory } from '../../kazakhstanScenario';
import { Icon } from '../Icon';
import { Donut } from '../charts';
import { NewTaskModal } from '../modals';
import { ConfidenceMeter, Empty, PageHeader, TypeBadge } from '../ui';
import { stamp, typeLabel, useDemo, useNav, useToast } from '../store';
import { fmtDate } from '../format';

type SortKey = 'title' | 'type' | 'confidence' | 'date';
const TYPES: EvidenceType[] = ['research', 'legislation', 'financing', 'stakeholder', 'gap'];
const CONF_RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };
const SOURCES: SourceCategory[] = ['International', 'National legislation', 'Government', 'Parliament', 'Civil society', 'Demo model'];

export function Evidence() {
  const { state, dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const [type, setType] = useState<EvidenceType | 'all'>('all');
  const [conf, setConf] = useState<Confidence | 'all'>('all');
  const [source, setSource] = useState<SourceCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'date', dir: -1 });
  const [request, setRequest] = useState<EvidenceItem | 'new' | null>(null);

  const rows = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return S.evidence
      .filter((e) => (type === 'all' || e.type === type) && (conf === 'all' || e.confidence === conf) && (source === 'all' || e.sourceCategory === source))
      .filter((e) => terms.every((t) => `${e.title} ${e.summary} ${e.source}`.toLowerCase().includes(t)))
      .sort((a, b) => {
        const c = sort.key === 'title' ? a.title.localeCompare(b.title)
          : sort.key === 'type' ? a.type.localeCompare(b.type)
            : sort.key === 'confidence' ? CONF_RANK[a.confidence] - CONF_RANK[b.confidence]
              : a.date.localeCompare(b.date);
        return c * sort.dir;
      });
  }, [type, conf, source, q, sort]);

  const gaps = S.evidence.filter((e) => e.type === 'gap');
  const requested = (e: EvidenceItem) => state.tasks.some((t) => t.kind === 'evidence-request' && t.title === e.title);
  const filtered = type !== 'all' || conf !== 'all' || source !== 'all' || q !== '';
  const counts = Object.fromEntries(TYPES.map((t) => [t, S.evidence.filter((e) => e.type === t).length])) as Record<EvidenceType, number>;

  const th = (key: SortKey, label: string) => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="pi-th-btn" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === 'date' || key === 'confidence' ? -1 : 1 }))}>
        {label}<Icon name="sort" size={13} className={sort.key === key ? 'is-on' : ''} />
      </button>
    </th>
  );

  return (
    <div className="pi-view">
      <PageHeader
        eyebrow="Evidence workspace"
        title="Evidence base"
        subtitle="Research, legislation, financing and stakeholder input compiled for the committee. Click a row to see findings, confidence and links to the policy options."
        actions={<button type="button" className="pi-btn pi-btn-primary" onClick={() => setRequest('new')}><Icon name="send" />Request evidence</button>}
      />

      <div className="pi-ev-top">
        <section className="pi-card pi-ev-summary" aria-label="Evidence summary">
          <Donut
            label="Evidence items by type"
            data={TYPES.map((t) => ({ id: t, label: typeLabel[t], value: counts[t], className: `pi-seg-${t}` }))}
            onSelect={(id) => setType(id as EvidenceType)}
          />
          <ul className="pi-ev-legend">
            {TYPES.map((t) => (
              <li key={t}><button type="button" onClick={() => setType(type === t ? 'all' : t)} aria-pressed={type === t}><i className={`pi-key pi-seg-${t}`} />{typeLabel[t]}<b>{counts[t]}</b></button></li>
            ))}
          </ul>
          <dl className="pi-ev-stats">
            <div><dt>In decision brief</dt><dd>{state.inBrief.length}</dd></div>
            <div><dt>High confidence</dt><dd>{S.evidence.filter((e) => e.confidence === 'high').length}</dd></div>
            <div><dt>Open gaps</dt><dd>{gaps.filter((g) => !requested(g)).length}</dd></div>
          </dl>
        </section>

        <section className="pi-card pi-gaps" aria-labelledby="pi-gaps-title">
          <div className="pi-card-head">
            <h2 id="pi-gaps-title"><Icon name="alert" className="pi-gap-ico" />Evidence gaps</h2>
            <span className="pi-muted-sm">{gaps.length} identified</span>
          </div>
          <ul className="pi-gap-list">
            {gaps.map((g) => {
              const done = requested(g);
              return (
                <li key={g.id}>
                  <button type="button" className="pi-gap-main" onClick={() => nav.open(g.id)}>
                    <strong>{g.title}</strong>
                    <span>{g.relevance}</span>
                  </button>
                  {done ? (
                    <span className="pi-status pi-status-awaiting"><i aria-hidden="true" />Requested</span>
                  ) : (
                    <button type="button" className="pi-btn pi-btn-sm" onClick={() => setRequest(g)}>Request</button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="pi-card pi-table-card" aria-label="Evidence table">
        <div className="pi-toolbar">
          <div className="pi-input-icon">
            <Icon name="search" />
            <input type="search" className="pi-input" placeholder="Filter evidence…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter evidence by text" />
          </div>
          <div className="pi-chips" role="group" aria-label="Filter by type">
            <button type="button" className="pi-chip" aria-pressed={type === 'all'} onClick={() => setType('all')}>All <span>{S.evidence.length}</span></button>
            {TYPES.map((t) => (
              <button key={t} type="button" className="pi-chip" aria-pressed={type === t} onClick={() => setType(type === t ? 'all' : t)}>
                <i className={`pi-key pi-seg-${t}`} />{typeLabel[t]} <span>{counts[t]}</span>
              </button>
            ))}
          </div>
          <div className="pi-toolbar-selects">
            <select className="pi-input pi-select-sm" value={conf} onChange={(e) => setConf(e.target.value as Confidence | 'all')} aria-label="Filter by confidence">
              <option value="all">Any confidence</option>
              <option value="high">High confidence</option>
              <option value="medium">Medium confidence</option>
              <option value="low">Low confidence</option>
            </select>
            <select className="pi-input pi-select-sm" value={source} onChange={(e) => setSource(e.target.value as SourceCategory | 'all')} aria-label="Filter by source">
              <option value="all">All sources</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {filtered && <button type="button" className="pi-link-btn" onClick={() => { setType('all'); setConf('all'); setSource('all'); setQ(''); }}>Clear</button>}
          </div>
        </div>

        <p className="pi-sr" aria-live="polite">{rows.length} evidence items shown</p>
        {rows.length ? (
          <div className="pi-table-scroll">
            <table className="pi-table">
              <thead>
                <tr>
                  {th('title', 'Evidence')}
                  {th('type', 'Type')}
                  {th('confidence', 'Confidence')}
                  <th scope="col">Options</th>
                  {th('date', 'Added')}
                  <th scope="col"><span className="pi-th-plain">Brief</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const inBrief = state.inBrief.includes(e.id);
                  return (
                    <tr key={e.id} className={nav.item === e.id ? 'is-selected' : ''} onClick={() => nav.open(e.id)}>
                      <td className="pi-td-title">
                        <button type="button" className="pi-row-btn" onClick={(ev) => { ev.stopPropagation(); nav.open(e.id); }}>{e.title}</button>
                        <span className="pi-td-sub">{e.source}</span>
                      </td>
                      <td data-label="Type"><TypeBadge type={e.type} /></td>
                      <td data-label="Confidence"><ConfidenceMeter level={e.confidence} /></td>
                      <td data-label="Options">
                        <span className="pi-opt-chips">{e.linkedOptions.map((o) => <span key={o} className={`pi-opt-badge pi-opt-${o}`}>{o}</span>)}</span>
                      </td>
                      <td data-label="Added" className="pi-num">{fmtDate(e.date, { year: false })}</td>
                      <td data-label="Brief">
                        <button
                          type="button"
                          className={`pi-pin${inBrief ? ' is-on' : ''}`}
                          aria-pressed={inBrief}
                          aria-label={`${inBrief ? 'Remove from' : 'Add to'} decision brief: ${e.title}`}
                          title={inBrief ? 'In decision brief' : 'Add to decision brief'}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            dispatch({ type: 'toggleBrief', id: e.id, ...stamp() });
                            toast({ title: inBrief ? 'Removed from brief' : 'Added to brief', body: e.title, tone: 'info', action: { label: 'Open brief', ref: { view: 'brief' } } });
                          }}
                        >
                          <Icon name={inBrief ? 'check' : 'plus'} size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty icon="search" title="No evidence matches these filters">Try clearing a filter or searching for another term.</Empty>
        )}
        <div className="pi-table-foot">
          <span>{rows.length} of {S.evidence.length} items</span>
          <span className="pi-muted-xs">All items are illustrative stub data</span>
        </div>
      </section>

      {request && (
        <NewTaskModal
          heading="Request evidence"
          kind="evidence-request"
          status="awaiting"
          title={request === 'new' ? '' : request.title}
          ownerId={request === 'new' ? 'moh' : request.suggestedOwnerId}
          description={request === 'new' ? '' : request.summary}
          source={request === 'new' ? 'the evidence workspace' : 'an evidence gap'}
          onClose={() => setRequest(null)}
        />
      )}
    </div>
  );
}
