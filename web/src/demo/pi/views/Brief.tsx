import { useState } from 'react';
import * as S from '../../kazakhstanScenario';
import type { OptionId } from '../../kazakhstanScenario';
import { Icon } from '../Icon';
import { Radar } from '../charts';
import { RecommendModal } from '../modals';
import { ConfidenceMeter, OwnerChip, PageHeader, TypeBadge } from '../ui';
import { instName, useDemo, useNav } from '../store';
import { fmtDate, fmtDateTime, useNow } from '../format';
import { rankOptions } from '../scoring';

function Dots({ n }: { n: number }) {
  return (
    <span className="pi-dots" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
    </span>
  );
}

function Weights() {
  const { state, dispatch } = useDemo();
  const ranked = rankOptions(state.weights);
  const max = Math.max(...ranked.map((r) => r.score), 1);
  const changed = S.criteria.some((c) => state.weights[c.id] !== c.defaultWeight);
  return (
    <section className="pi-card pi-weights" aria-labelledby="pi-w-title">
      <div className="pi-card-head">
        <h2 id="pi-w-title"><Icon name="sliders" />Criteria weights</h2>
        <button type="button" className="pi-link-btn" onClick={() => dispatch({ type: 'resetWeights' })} disabled={!changed}>Reset</button>
      </div>
      <p className="pi-muted-sm">Adjust how much each criterion matters. Options re-score and re-rank live.</p>
      <div className="pi-ranking" aria-live="polite">
        <h3>Ranking</h3>
        <ol>
          {ranked.map((r) => (
            <li key={r.option.id} className={r.rank === 1 ? 'is-top' : ''}>
              <span className={`pi-opt-badge pi-opt-${r.option.id}`}>{r.option.id}</span>
              <span className="pi-rank-main">
                <span className="pi-rank-label">{r.option.short}</span>
                <span className="pi-rank-bar" aria-hidden="true"><i className={`pi-opt-fill-${r.option.id}`} style={{ width: `${(r.score / max) * 100}%` }} /></span>
              </span>
              <b className="pi-num">{r.score}</b>
            </li>
          ))}
        </ol>
      </div>
      <div className="pi-sliders">
        {S.criteria.map((c) => (
          <div className="pi-slider" key={c.id}>
            <label htmlFor={`pi-w-${c.id}`}><span>{c.label}</span><b className="pi-num">{state.weights[c.id]}</b></label>
            <input
              id={`pi-w-${c.id}`}
              type="range" min={0} max={5} step={1}
              value={state.weights[c.id]}
              onChange={(e) => dispatch({ type: 'setWeight', id: c.id, value: Number(e.target.value) })}
              aria-describedby={`pi-w-${c.id}-h`}
              style={{ ['--pct' as string]: `${(state.weights[c.id] / 5) * 100}%` }}
            />
            <span className="pi-slider-help" id={`pi-w-${c.id}-h`}>{c.help}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Brief() {
  const { state } = useDemo();
  const nav = useNav();
  const now = useNow();
  const [recommend, setRecommend] = useState<OptionId | true | null>(null);
  const ranked = rankOptions(state.weights);
  const top = ranked[0];
  const scoreOf = (id: OptionId) => ranked.find((r) => r.option.id === id)!;
  const cited = S.evidence.filter((e) => state.inBrief.includes(e.id));
  const decision = state.decision;
  const decided = decision ? S.options.find((o) => o.id === decision.optionId)! : null;

  return (
    <div className="pi-view pi-brief-view">
      <PageHeader
        eyebrow="Decision brief"
        title="Options for sustaining community TB support"
        subtitle="A living brief for the lead committee. Weights, evidence and the recommendation update as the team works."
        actions={(
          <>
            <button type="button" className="pi-btn" onClick={() => window.print()}><Icon name="print" />Export brief</button>
            <button type="button" className="pi-btn pi-btn-primary" onClick={() => setRecommend(true)}><Icon name="flag" />Recommend option</button>
          </>
        )}
      />

      <div className="pi-brief-layout">
        <article className="pi-doc" aria-label="Decision brief document">
          <header className="pi-doc-head">
            <div className="pi-doc-meta-top">
              <span>{S.issue.ref} · Draft v0.3</span>
              {decided ? <span className="pi-status pi-status-reviewed"><i aria-hidden="true" />Recommendation recorded</span> : <span className="pi-status pi-status-in-progress"><i aria-hidden="true" />Draft</span>}
            </div>
            <h2 className="pi-doc-title">Sustainable domestic financing for community-based TB patient support</h2>
            <dl className="pi-doc-meta">
              <div><dt>Prepared for</dt><dd>{instName(S.issue.leadInstitutionId)}</dd></div>
              <div><dt>Prepared by</dt><dd>Committee secretariat (demo)</dd></div>
              <div><dt>Country</dt><dd>{S.issue.country}</dd></div>
              <div><dt>Decision deadline</dt><dd>{S.issue.deadlineLabel}</dd></div>
            </dl>
            <p className="pi-doc-note"><Icon name="info" />Illustrative demo. Figures, dates and positions are stub data; all costs are indicative.</p>
          </header>

          <section className="pi-doc-sec">
            <h3><span>1</span>Problem</h3>
            <p>{S.issue.summary}</p>
            <p>Without a domestic mechanism in place before external co-financing declines, people on long treatment courses risk losing adherence and psychosocial support part-way through, which is associated with lower treatment success.</p>
          </section>

          <section className="pi-doc-sec">
            <h3><span>2</span>Context</h3>
            <p>The Code “On Public Health and the Healthcare System” (2020) sets out two main financing channels for health services: the guaranteed volume of free medical care and compulsory social health insurance. A separate framework allows central and local authorities to contract NGOs for social services. No official national costing of the community package exists yet.</p>
            <div className="pi-doc-cited">
              <div className="pi-doc-cited-head">
                <h4>Evidence cited in this brief <span className="pi-count">{cited.length}</span></h4>
                <button type="button" className="pi-link-btn pi-noprint" onClick={() => nav.go({ view: 'evidence' })}>Manage evidence <Icon name="arrowRight" /></button>
              </div>
              {cited.length ? (
                <ul>
                  {cited.map((e) => (
                    <li key={e.id}>
                      <button type="button" onClick={() => nav.go({ view: 'evidence', item: e.id })}>
                        <TypeBadge type={e.type} />
                        <span>{e.title}</span>
                        <ConfidenceMeter level={e.confidence} label={false} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="pi-muted-sm">No evidence pinned. Use “Add to brief” in the evidence workspace.</p>}
            </div>
          </section>

          <section className="pi-doc-sec">
            <h3><span>3</span>Policy options</h3>
            <div className="pi-opt-cards">
              {S.options.map((o) => {
                const r = scoreOf(o.id);
                return (
                  <div key={o.id} className={`pi-opt-card${r.rank === 1 ? ' is-top' : ''}${decision?.optionId === o.id ? ' is-chosen' : ''}`}>
                    <div className="pi-opt-card-head">
                      <span className={`pi-opt-badge pi-opt-${o.id}`}>{o.id}</span>
                      <span className="pi-opt-rank">{decision?.optionId === o.id ? 'Recommended' : r.rank === 1 ? 'Top ranked' : `Rank ${r.rank}`}</span>
                    </div>
                    <h4>{o.title}</h4>
                    <p className="pi-opt-mech">{o.mechanism}</p>
                    <dl className="pi-opt-facts">
                      <div><dt>Cost</dt><dd className="pi-num">{o.costIndicative}</dd></div>
                      <div><dt>Timeline</dt><dd>{o.timeline}</dd></div>
                      <div><dt>Main risk</dt><dd>{o.risks[0]}</dd></div>
                      <div><dt>Trade-off</dt><dd>{o.tradeoffs[0]}</dd></div>
                    </dl>
                    <div className="pi-opt-score">
                      <span>Weighted score</span>
                      <b className="pi-num">{r.score}</b>
                    </div>
                    <button type="button" className="pi-btn pi-btn-sm pi-noprint" onClick={() => nav.open(`opt-${o.id}`)}>Details</button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pi-doc-sec">
            <h3><span>4</span>Comparison</h3>
            <div className="pi-table-scroll">
              <table className="pi-compare">
                <thead>
                  <tr>
                    <th scope="col"><span className="pi-sr">Criterion</span></th>
                    {S.options.map((o) => (
                      <th scope="col" key={o.id} className={scoreOf(o.id).rank === 1 ? 'is-top' : ''}>
                        <span className={`pi-opt-badge pi-opt-${o.id}`}>{o.id}</span> {o.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Indicative cost</th>{S.options.map((o) => <td key={o.id} className="pi-num">{o.costIndicative}</td>)}</tr>
                  <tr><th scope="row">Timeline</th>{S.options.map((o) => <td key={o.id}>{o.timeline}</td>)}</tr>
                  <tr><th scope="row">Legal basis</th>{S.options.map((o) => <td key={o.id}>{o.legalBasis}</td>)}</tr>
                  <tr><th scope="row">Advantages</th>{S.options.map((o) => <td key={o.id}><ul>{o.advantages.map((x) => <li key={x}>{x}</li>)}</ul></td>)}</tr>
                  <tr><th scope="row">Trade-offs</th>{S.options.map((o) => <td key={o.id}><ul>{o.tradeoffs.map((x) => <li key={x}>{x}</li>)}</ul></td>)}</tr>
                  <tr><th scope="row">Risks</th>{S.options.map((o) => <td key={o.id}><ul>{o.risks.map((x) => <li key={x}>{x}</li>)}</ul></td>)}</tr>
                  {S.criteria.map((c) => (
                    <tr key={c.id} className="pi-compare-score">
                      <th scope="row">{c.label} <small>weight {state.weights[c.id]}</small></th>
                      {S.options.map((o) => <td key={o.id}><Dots n={o.scores[c.id]} /></td>)}
                    </tr>
                  ))}
                  <tr className="pi-compare-total">
                    <th scope="row">Weighted score</th>
                    {S.options.map((o) => {
                      const r = scoreOf(o.id);
                      return <td key={o.id} className={r.rank === 1 ? 'is-top' : ''}><b className="pi-num">{r.score}</b> <small>#{r.rank}</small></td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="pi-doc-sec pi-doc-radar">
            <h3><span>5</span>How the options score</h3>
            <div className="pi-radar-wrap">
              <Radar
                axes={S.criteria.map((c) => ({ id: c.id, label: c.label === 'Political feasibility' ? 'Feasibility' : c.label }))}
                series={S.options.map((o) => ({ id: o.id, label: `Option ${o.id}: ${o.short}`, values: S.criteria.map((c) => o.scores[c.id]), className: `pi-radar-${o.id}`, highlight: top.option.id === o.id }))}
              />
              <div className="pi-radar-text">
                <p>Scores run from 1 (weak) to 5 (strong) on each criterion and are illustrative judgements for discussion, not modelled results.</p>
                <ul className="pi-legend pi-legend-col">
                  {S.options.map((o) => <li key={o.id}><i className={`pi-key pi-opt-key-${o.id}`} />Option {o.id}: {o.short}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section className="pi-doc-sec">
            <h3><span>6</span>Recommendation</h3>
            {decided && decision ? (
              <div className="pi-rec is-recorded">
                <div className="pi-rec-head"><span className={`pi-opt-badge pi-opt-${decided.id}`}>{decided.id}</span><strong>{decided.title}</strong></div>
                <p>{decision.rationale || 'Recommendation recorded from the decision brief.'}</p>
                <p className="pi-muted-sm">Recorded {fmtDateTime(decision.at)} by {S.DEMO_USER.role}.</p>
                <div className="pi-rec-actions pi-noprint">
                  <button type="button" className="pi-btn pi-btn-sm" onClick={() => nav.go({ view: 'tracker', item: decision.taskId })}>View in tracker</button>
                  <button type="button" className="pi-link-btn" onClick={() => setRecommend(true)}>Change</button>
                </div>
              </div>
            ) : (
              <div className="pi-rec">
                <p>Under the current weights, <strong>Option {top.option.id} ({top.option.short})</strong> ranks first with a score of {top.score}. {top.option.id === 'B' ? 'It uses an existing legal mechanism and can be in place before external co-financing declines, provided a national standard and earmarked funding address regional capacity.' : 'Adjust the weights to test how robust this ranking is.'}</p>
                <button type="button" className="pi-btn pi-btn-primary pi-noprint" onClick={() => setRecommend(top.option.id)}><Icon name="flag" />Recommend Option {top.option.id}</button>
              </div>
            )}
          </section>

          <section className="pi-doc-sec">
            <h3><span>7</span>Recommended next procedural step</h3>
            <div className="pi-next-step">
              <div className="pi-next-icon" aria-hidden="true"><Icon name="calendar" size={20} /></div>
              <div>
                <strong>{S.recommendedStep.title}</strong>
                <p>{S.recommendedStep.text}</p>
                <div className="pi-next-meta"><OwnerChip id={S.recommendedStep.ownerId} /><span>Target {fmtDate(S.recommendedStep.date)}</span></div>
              </div>
            </div>
          </section>

          <footer className="pi-doc-foot">Generated {fmtDate(new Date(now).toISOString())} from the EECA Hub Parliamentary Intelligence demo. Stub data, illustrative only.</footer>
        </article>

        <aside className="pi-brief-rail" aria-label="Scoring controls">
          <Weights />
        </aside>
      </div>
      {recommend && <RecommendModal initial={recommend === true ? undefined : recommend} onClose={() => setRecommend(null)} />}
    </div>
  );
}
