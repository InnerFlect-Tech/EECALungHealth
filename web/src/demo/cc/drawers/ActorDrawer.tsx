import { edges, funding, pathways } from '../../careContinuityScenario';
import { Icon } from '../icons';
import { EDGE_KIND, actorById, fmtUsd } from '../model';
import { Drawer } from '../overlay';
import { useNav } from '../nav';
import { Tag } from '../ui';

const nameOf = (id: string) => (id === 'patient' ? 'Person on treatment' : actorById.get(id)?.name ?? id);

export function ActorDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { open, set } = useNav();
  const a = actorById.get(id)!;
  const out = edges.filter((e) => e.from === id);
  const inc = edges.filter((e) => e.to === id);
  const paths = pathways.filter((p) => p.edges.some((eid) => { const e = edges.find((x) => x.id === eid)!; return e.from === id || e.to === id; }));
  const linked = (other: string) => other !== 'patient' ? (
    <button type="button" className="cc-link-btn" onClick={() => open(other)}>{nameOf(other)}</button>
  ) : <span>{nameOf(other)}</span>;

  return (
    <Drawer
      itemKey={id}
      eyebrow={a.ring === 'care' ? 'Direct care' : 'Policy, oversight and funding'}
      title={a.name}
      meta={<Tag>{a.role}</Tag>}
      onClose={onClose}
    >
      <h3 className="cc-h3">Responsibilities</h3>
      <ul className="cc-bullets">
        {a.responsibilities.map((r) => <li key={r}>{r}</li>)}
      </ul>

      <h3 className="cc-h3">Contact points <span className="cc-muted-inline">· generic roles</span></h3>
      <ul className="cc-contacts">
        {a.contacts.map((c) => (
          <li key={c.label}>
            <span className="cc-contact-icon" aria-hidden="true"><Icon name="user" size={14} /></span>
            <div><strong>{c.label}</strong><span>{c.how}</span></div>
          </li>
        ))}
      </ul>

      <h3 className="cc-h3">Links to other actors</h3>
      <ul className="cc-links">
        {out.map((e) => (
          <li key={e.id}>
            <i style={{ background: EDGE_KIND[e.kind].color }} aria-hidden="true" />
            <span><strong>{e.label}</strong> → {linked(e.to)}</span>
            <span className="cc-links-kind">{EDGE_KIND[e.kind].label}</span>
          </li>
        ))}
        {inc.map((e) => (
          <li key={e.id}>
            <i style={{ background: EDGE_KIND[e.kind].color }} aria-hidden="true" />
            <span>{linked(e.from)} → <strong>{e.label.charAt(0).toLowerCase() + e.label.slice(1)}</strong></span>
            <span className="cc-links-kind">{EDGE_KIND[e.kind].label}</span>
          </li>
        ))}
      </ul>

      {paths.length > 0 && (
        <>
          <h3 className="cc-h3">Pathways through this actor</h3>
          <div className="cc-path-chips">
            {paths.map((p) => (
              <button key={p.id} type="button" className="cc-chip" onClick={() => set({ pathway: p.id, item: null })}>
                <Icon name="route" size={13} /> {p.label}
              </button>
            ))}
          </div>
        </>
      )}

      {id === 'ac-ngo' && (
        <>
          <h3 className="cc-h3">How this actor is funded</h3>
          <ul className="cc-funding-list">
            {funding.filter((f) => f.id !== 'f-vot').map((f) => (
              <li key={f.id}>
                <span className={`cc-fstatus cc-fstatus-${f.status}`}>{f.status === 'ending' ? 'Ending' : f.status === 'pending' ? 'Pending' : 'Secured'}</span>
                <div className="cc-funding-text">
                  <span className="cc-funding-label">{f.label}</span>
                  <span className="cc-funding-detail">{f.detail}{f.annualUsd ? ` ${fmtUsd(f.annualUsd)}/yr (indicative).` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Drawer>
  );
}
