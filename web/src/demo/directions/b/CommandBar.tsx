import { useId, useState, type KeyboardEvent } from 'react';
import { normalizeRef, refIndex, type RefEntry } from './sittings';

const KIND: Record<RefEntry['kind'], string> = {
  issue: 'Issue',
  sitting: 'Sitting',
  item: 'Agenda item',
  question: 'Question',
  evidence: 'Evidence',
  task: 'Task',
  option: 'Option',
};

const SUGGESTED = ['Q-04', 'EV-12', 'T-07', 'CS-04/7', 'OPT-B', 'PI-2026-014'];

function search(raw: string): RefEntry[] {
  const q = raw.trim();
  if (!q) return SUGGESTED.map((r) => refIndex.find((e) => e.ref === r)).filter((e): e is RefEntry => !!e);
  const norm = normalizeRef(q);
  const compact = q.toUpperCase().replace(/[\s-]/g, '');
  const words = q.toLowerCase();
  const score = (e: RefEntry) => {
    if (e.ref === norm) return 0;
    if (e.ref.startsWith(norm) || e.ref.replace(/-/g, '').startsWith(compact)) return 1;
    if (e.label.toLowerCase().includes(words)) return 2;
    return 9;
  };
  return refIndex
    .map((e) => ({ e, s: score(e) }))
    .filter((x) => x.s < 9)
    .sort((a, b) => a.s - b.s)
    .slice(0, 8)
    .map((x) => x.e);
}

interface Props {
  onClose: () => void;
  /** Returns false when the reference is not on the order paper. */
  onGo: (ref: string) => boolean;
}

/** Slim "Go to reference…" bar, opened with "/". */
export function CommandBar({ onClose, onGo }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [miss, setMiss] = useState<string | null>(null);
  const listId = useId();
  const results = search(query);
  const current = results[Math.min(active, results.length - 1)];

  const go = (ref: string) => {
    if (!onGo(ref)) setMiss(normalizeRef(ref) || ref);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const exact = normalizeRef(query);
      if (query.trim() && refIndex.some((r) => r.ref === exact)) go(exact);
      else if (current) go(current.ref);
      else if (query.trim()) go(query);
    }
  };

  return (
    <div className="db-cmd-layer">
      <div className="db-cmd-scrim" onClick={onClose} aria-hidden="true" />
      <div className="db-cmd" role="dialog" aria-modal="true" aria-label="Go to reference">
        <div className="db-wrap db-cmd-inner">
          <label className="db-cmd-label" htmlFor="db-cmd-input">Go to reference</label>
          <input
            id="db-cmd-input"
            className="db-cmd-input"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="Q-04, EV-12, T-07, CS-04/7, PI-2026-014…"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={current ? `${listId}-${current.ref}` : undefined}
            aria-describedby="db-cmd-hint"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); setMiss(null); }}
            onKeyDown={onKeyDown}
          />
          <span className="db-cmd-esc" aria-hidden="true"><kbd>Esc</kbd></span>
          <p id="db-cmd-hint" className="db-cmd-hint" role="status">
            {miss
              ? <>No reference <code>{miss}</code> on the order paper. References look like <code>Q-04</code>, <code>EV-12</code>, <code>T-07</code>, <code>CS-04/7</code>.</>
              : query.trim() ? `${results.length} matching ${results.length === 1 ? 'reference' : 'references'}` : 'Suggested references'}
          </p>
          {results.length > 0 && (
            <ul className="db-cmd-list" id={listId} role="listbox" aria-label="References">
              {results.map((r, i) => (
                <li
                  key={r.ref}
                  id={`${listId}-${r.ref}`}
                  role="option"
                  aria-selected={r === current}
                  className="db-cmd-opt"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.ref)}
                >
                  <span className="db-ref">{r.ref}</span>
                  <span className="db-cmd-kind">{KIND[r.kind]}</span>
                  <span className="db-cmd-text">{r.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
