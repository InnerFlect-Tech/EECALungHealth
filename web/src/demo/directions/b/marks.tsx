import type { Readiness, StampKind } from './sittings';

/** A small rubber-stamp mark used instead of status pills. */
export function Stamp({ kind, tilt = 0 }: { kind: StampKind; tilt?: number }) {
  return (
    <span className={`db-stamp db-stamp--${kind.toLowerCase()}`} style={tilt ? { rotate: `${tilt}deg` } : undefined}>
      {kind}
    </span>
  );
}

/** The square readiness mark: filled = ready, hollow = awaiting, struck = blocked. */
export function Mark({ state, held = false }: { state: Readiness; held?: boolean }) {
  return <span className={`db-mark db-mark--${held ? 'held' : state}`} aria-hidden="true" />;
}
