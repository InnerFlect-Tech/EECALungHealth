import { criteria, options } from '../kazakhstanScenario';
import type { CriterionId, PolicyOption } from '../kazakhstanScenario';

export interface Ranked { option: PolicyOption; score: number; rank: number }

/** Weighted score on a 0–100 scale: Σ(weight × score) / (5 × Σ weight). */
export function scoreOption(o: PolicyOption, weights: Record<CriterionId, number>) {
  const total = criteria.reduce((s, c) => s + weights[c.id], 0);
  if (!total) return 0;
  const sum = criteria.reduce((s, c) => s + weights[c.id] * o.scores[c.id], 0);
  return Math.round((sum / (5 * total)) * 100);
}

export function rankOptions(weights: Record<CriterionId, number>): Ranked[] {
  return options
    .map((o) => ({ option: o, score: scoreOption(o, weights), rank: 0 }))
    .sort((a, b) => b.score - a.score || a.option.id.localeCompare(b.option.id))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
