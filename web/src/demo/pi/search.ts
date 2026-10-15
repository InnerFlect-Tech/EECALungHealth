import * as S from '../kazakhstanScenario';
import type { Ref } from '../kazakhstanScenario';
import type { DemoState } from './store';
import { instName, statusLabel, typeLabel } from './store';
import type { IconName } from './Icon';

export interface SearchEntry { id: string; kind: string; icon: IconName; title: string; sub: string; ref: Ref; hay: string }

export function buildIndex(state: DemoState): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const q of state.questions) {
    out.push({ id: q.id, kind: 'Question', icon: 'message', title: q.text, sub: `${instName(q.ownerId)} · ${q.status === 'open' ? 'Open' : 'Answered'}`, ref: { view: 'dashboard', item: q.id }, hay: `${q.text} ${q.context} ${instName(q.ownerId)}` });
  }
  for (const e of S.evidence) {
    out.push({ id: e.id, kind: 'Evidence', icon: 'evidence', title: e.title, sub: `${typeLabel[e.type]} · ${e.source}`, ref: { view: 'evidence', item: e.id }, hay: `${e.title} ${e.summary} ${e.source} ${e.type} ${e.keyFindings.join(' ')}` });
  }
  for (const o of S.options) {
    out.push({ id: `opt-${o.id}`, kind: 'Option', icon: 'scale', title: `Option ${o.id}: ${o.title}`, sub: o.costIndicative, ref: { view: 'brief', item: `opt-${o.id}` }, hay: `option ${o.id} ${o.title} ${o.short} ${o.mechanism}` });
  }
  for (const p of S.stakeholderProfiles) {
    const inst = S.institutions.find((i) => i.id === p.institutionId)!;
    out.push({ id: `sh-${inst.id}`, kind: 'Stakeholder', icon: 'building', title: inst.short, sub: p.summary, ref: { view: 'stakeholders', item: `sh-${inst.id}` }, hay: `${inst.name} ${inst.short} ${p.summary} ${p.responsibilities.join(' ')}` });
  }
  for (const t of state.tasks) {
    out.push({ id: t.id, kind: 'Task', icon: 'tracker', title: t.title, sub: `${statusLabel[t.status]} · ${instName(t.ownerId)}`, ref: { view: 'tracker', item: t.id }, hay: `${t.title} ${t.description} ${instName(t.ownerId)}` });
  }
  return out;
}

export function search(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of index) {
    const hay = e.hay.toLowerCase();
    const title = e.title.toLowerCase();
    if (!terms.every((t) => hay.includes(t))) continue;
    let s = 0;
    for (const t of terms) { if (title.includes(t)) s += 3; if (title.startsWith(t)) s += 2; }
    scored.push({ e, s });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}
