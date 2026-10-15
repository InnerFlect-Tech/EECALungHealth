import { lazy, Suspense, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNoIndex } from '../lib/useNoIndex';
import '../demo/directions/directions.css';

// Internal design review page (route: /demo/design-directions). Three design
// directions for the Parliamentary Intelligence dashboard, same stub data,
// shown one at a time with a switcher. Unlinked and noindex.

const DIRECTIONS = [
  {
    id: 'a',
    name: 'Committee Paper',
    line: 'The interface is the document. A living committee paper with numbered paragraphs, margin annotations for every action, and tracked changes as the core interaction.',
    Comp: lazy(() => import('../demo/directions/DirectionA')),
  },
  {
    id: 'b',
    name: 'Order Paper',
    line: 'Organised around parliamentary procedure. The sitting calendar is the navigation spine, and everything hangs off the next sitting.',
    Comp: lazy(() => import('../demo/directions/DirectionB')),
  },
  {
    id: 'c',
    name: 'Chamber',
    line: 'Spatial and political. A hemicycle of positions is the home screen, with a majority meter and a "what would it take" panel for each actor.',
    Comp: lazy(() => import('../demo/directions/DirectionC')),
  },
] as const;

export function DesignDirectionsPage() {
  useNoIndex('Design directions • EECA Lung Health Hub');
  const [params, setParams] = useSearchParams();
  const active = DIRECTIONS.find((d) => d.id === params.get('d'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active?.id]);

  return (
    <div className="dd-root">
      <nav className="dd-switcher" aria-label="Design directions">
        <Link to="/demo/design-directions" className="dd-brand">Design directions</Link>
        <div className="dd-tabs" role="tablist">
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={active?.id === d.id}
              onClick={() => setParams({ d: d.id })}
            >
              <span className="dd-letter">{d.id.toUpperCase()}</span>
              <span className="dd-name">{d.name}</span>
            </button>
          ))}
        </div>
        <Link to="/demo/parliamentary-intelligence" className="dd-current">Current demo ↗</Link>
      </nav>

      {active ? (
        <Suspense fallback={<div className="dd-loading">Loading…</div>}>
          <active.Comp />
        </Suspense>
      ) : (
        <main className="dd-index">
          <p className="dd-eyebrow">Design review · 15 October 2026</p>
          <h1>Three directions for the parliamentary demo</h1>
          <p className="dd-lead">
            Each option redesigns the same screen, the Parliamentary Intelligence dashboard, with the same stub data, so
            only the design and the user experience differ. Pick one and it becomes the pattern for both demos.
          </p>
          <div className="dd-cards">
            {DIRECTIONS.map((d) => (
              <button key={d.id} type="button" className="dd-card" onClick={() => setParams({ d: d.id })}>
                <span className="dd-card-letter">{d.id.toUpperCase()}</span>
                <span className="dd-card-name">{d.name}</span>
                <span className="dd-card-line">{d.line}</span>
                <span className="dd-card-go">View direction {d.id.toUpperCase()} →</span>
              </button>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
