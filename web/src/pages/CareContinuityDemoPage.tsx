import { CareContinuityApp } from '../demo/cc/CareContinuityApp';

// Demo app (route: /demo/care-continuity). Not in the menu. Full-screen,
// patient-facing counterpart to /demo/parliamentary-intelligence for the same
// Kazakhstan scenario. All data is synthetic: see ../demo/careContinuityScenario.ts.
// Components live in ../demo/cc/; navigation state is in URL search params
// (?view=alerts&item=al-3).
export function CareContinuityDemoPage() {
  return <CareContinuityApp />;
}
