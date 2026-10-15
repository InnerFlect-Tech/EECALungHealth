import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  costs, evidencePack, evidenceStatements, funding, impact, kpis, meta, outcomes, parliamentaryLink, stages,
} from '../../careContinuityScenario';
import { BarList, Donut, LineChart } from '../charts';
import { Icon } from '../icons';
import { fmtInt, fmtUsd, last } from '../model';
import { Modal } from '../overlay';
import { useToast } from '../store';
import { Card, PageHeader, Stat, Tag } from '../ui';

const COST_COLORS: Record<string, string> = {
  vouchers: 'var(--cc-svc-vouchers)',
  navigator: 'var(--cc-svc-navigator)',
  psycho: 'var(--cc-svc-psycho)',
  vot: 'var(--cc-svc-vot)',
  coord: 'var(--cc-gray)',
};

const perPerson = costs.reduce((s, c) => s + c.value, 0);
const lastQ = last(outcomes);
const final = stages[stages.length - 1];
const extraCompleted = final.retained - final.retainedUnsupported; // per 100 people
const costPerExtra = Math.round((perPerson * 100) / extraCompleted);

const STEPS = ['Collecting outcomes from 14 districts', 'Applying indicative costs', 'Drafting the summary and asks', 'Formatting for the committee'];

function EvidencePackModal({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const ready = step >= STEPS.length;

  useEffect(() => {
    if (ready) return;
    const h = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 350 : 420);
    return () => window.clearTimeout(h);
  }, [step, ready]);

  const body = `In this synthetic scenario, ${lastQ.supported}% of people receiving community support completed TB treatment, against ${lastQ.comparison}% in the comparison cohort. Support costs an indicative ${fmtUsd(perPerson)} per person. The external grant that funds most of it ends in ${kpis[3].value} months.`;
  const summary = `${evidencePack.title}. ${body}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast('Summary copied to clipboard');
    } catch {
      toast('Copy is not available in this browser', 'warn');
    }
  };

  return (
    <Modal
      size="lg"
      title={ready ? 'Evidence pack ready' : 'Generating evidence pack…'}
      description={ready ? 'Preview of the generated pack for the parliamentary committee. Synthetic data.' : 'Pulling programme data into a briefing for decision-makers.'}
      onClose={onClose}
      footer={ready ? (
        <>
          <button type="button" className="cc-btn" onClick={copy}><Icon name="copy" size={15} /> Copy summary</button>
          <button type="button" className="cc-btn" onClick={() => toast('PDF export is switched off in the demo', 'info')}><Icon name="download" size={15} /> Download PDF</button>
          <Link to={parliamentaryLink} className="cc-btn cc-btn-primary"><Icon name="external" size={15} /> Open in Parliamentary Intelligence</Link>
        </>
      ) : undefined}
    >
      {!ready ? (
        <ol className="cc-gen-steps" aria-live="polite">
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'is-done' : i === step ? 'is-now' : ''}>
              <span className="cc-gen-dot" aria-hidden="true">{i < step ? <Icon name="check" size={12} /> : null}</span>
              {s}
            </li>
          ))}
        </ol>
      ) : (
        <article className="cc-pack" aria-label="Evidence pack preview">
          <header className="cc-pack-head">
            <div className="cc-pack-brand">
              <img src="/assets/images/brand/logo-mark-color.png" alt="" width={22} height={22} />
              <span>{meta.hub} · Evidence pack</span>
            </div>
            <div className="cc-pack-tags">
              <Tag tone="warn">Draft</Tag>
              <Tag tone="synthetic">Synthetic data</Tag>
            </div>
          </header>
          <h3 className="cc-pack-title">{evidencePack.title}</h3>
          <p className="cc-pack-aud">{evidencePack.audience} · {meta.asOfLabel}</p>

          <h4>Summary</h4>
          <p>{body}</p>

          <h4>Key figures</h4>
          <div className="cc-pack-figs">
            <div><strong className="cc-num">{lastQ.supported}%</strong><span>treatment success with support</span></div>
            <div><strong className="cc-num">{lastQ.comparison}%</strong><span>comparison cohort</span></div>
            <div><strong className="cc-num">{fmtUsd(perPerson)}</strong><span>indicative cost per person</span></div>
            <div><strong className="cc-num">{kpis[3].value} mo</strong><span>external funding left</span></div>
          </div>

          <h4>Treatment success over time</h4>
          <LineChart
            labels={outcomes.map((o) => o.q)}
            series={[
              { id: 's', name: 'Supported', values: outcomes.map((o) => o.supported), color: 'var(--cc-accent-2)' },
              { id: 'c', name: 'Comparison', values: outcomes.map((o) => o.comparison), color: 'var(--cc-gray)', dashed: true },
            ]}
            min={70} max={92} ticks={[70, 80, 90]} height={170}
            format={(v) => `${Math.round(v)}%`}
            band
            ariaLabel="Treatment success over time, supported versus comparison cohort."
          />

          <h4>What we ask</h4>
          <ol className="cc-pack-asks">
            {evidencePack.asks.map((a) => <li key={a}>{a}</li>)}
          </ol>

          <h4>Funding at risk</h4>
          <table className="cc-pack-table">
            <thead><tr><th scope="col">Line</th><th scope="col">Status</th><th scope="col" className="cc-r">Indicative / yr</th></tr></thead>
            <tbody>
              {funding.filter((f) => f.annualUsd > 0).map((f) => (
                <tr key={f.id}><td>{f.label}</td><td>{f.status === 'ending' ? 'Ending' : f.status === 'pending' ? 'Pending' : 'Secured'}</td><td className="cc-r cc-num">{fmtUsd(f.annualUsd)}</td></tr>
              ))}
            </tbody>
          </table>

          <h4>Caveats</h4>
          <ul className="cc-pack-caveats">
            {evidencePack.caveats.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </article>
      )}
    </Modal>
  );
}

export function Impact() {
  const [packOpen, setPackOpen] = useState(false);

  return (
    <div className="cc-view">
      <PageHeader
        title="Impact & evidence"
        subtitle="What community support achieves, what it costs, and the evidence it produces for the budget decision. All figures are synthetic; costs are indicative."
        actions={(
          <button type="button" className="cc-btn cc-btn-primary" onClick={() => setPackOpen(true)}>
            <Icon name="sparkle" size={16} /> Generate evidence pack for parliament
          </button>
        )}
      />

      <div className="cc-stats cc-stats-4 cc-card cc-stats-card">
        <Stat label="Treatment success, supported" value={`${lastQ.supported}%`} hint={`vs ${lastQ.comparison}% comparison · ${lastQ.q}`} tone="good" />
        <Stat label="More people completing" value={`+${extraCompleted} per 100`} hint="supported vs comparison cohort" />
        <Stat label="Cost per person (indicative)" value={fmtUsd(perPerson)} hint="per full treatment course" />
        <Stat label="Cost per extra completion (indicative)" value={fmtUsd(costPerExtra)} hint={`vs ~${fmtUsd(impact.retreatmentCost)} to re-treat one person`} />
      </div>

      <div className="cc-grid cc-grid-2-1">
        <Card id="im-out" title="Treatment success over time" subtitle="Share of each quarterly cohort completing treatment (synthetic).">
          <LineChart
            labels={outcomes.map((o) => o.q)}
            series={[
              { id: 's', name: 'Supported cohort', values: outcomes.map((o) => o.supported), color: 'var(--cc-accent-2)' },
              { id: 'c', name: 'Comparison cohort', values: outcomes.map((o) => o.comparison), color: 'var(--cc-gray)', dashed: true },
            ]}
            min={70}
            max={92}
            ticks={[70, 75, 80, 85, 90]}
            format={(v) => `${Math.round(v)}%`}
            band
            ariaLabel={`Treatment success by quarter. Supported cohort rises from ${outcomes[0].supported}% to ${lastQ.supported}%; comparison cohort stays near ${lastQ.comparison}%.`}
          />
        </Card>
        <Card id="im-cost" title="Cost per person" subtitle="Indicative breakdown, USD per treatment course." actions={<Tag tone="warn">Indicative</Tag>}>
          <Donut
            slices={costs.map((c) => ({ id: c.id, label: c.label, value: c.value, color: COST_COLORS[c.id] }))}
            centerLabel="per person"
            format={(v) => `$${fmtInt(v)}`}
            size={180}
          />
        </Card>
      </div>

      <div className="cc-grid cc-grid-1-1">
        <Card id="im-compare" title="Support vs the cost of stopping treatment" subtitle="Indicative, per person. Placeholder values for discussion, not a costing." actions={<Tag tone="warn">Indicative</Tag>}>
          <BarList
            items={[
              { id: 'sup', label: 'Community support package', value: perPerson, color: 'var(--cc-accent-2)' },
              { id: 'extra', label: 'Support cost per extra completion', value: costPerExtra, color: 'var(--cc-svc-vouchers)' },
              { id: 'ret', label: 'Re-treating one person who stops', value: impact.retreatmentCost, color: 'var(--cc-high)' },
            ]}
            format={(v) => fmtUsd(v)}
          />
          <p className="cc-fine">Annual cost of the full support package across {fmtInt(impact.peopleSupportedPerYear)} people: about {fmtUsd(impact.annualProgrammeCost)} (indicative).</p>
        </Card>

        <Card id="im-evidence" title="What this tells the budget decision" subtitle={meta.question}>
          <ol className="cc-evidence">
            {evidenceStatements.map((e) => <li key={e}>{e}</li>)}
          </ol>
          <div className="cc-evidence-cta">
            <button type="button" className="cc-btn cc-btn-primary" onClick={() => setPackOpen(true)}>
              <Icon name="sparkle" size={16} /> Generate evidence pack
            </button>
            <Link to={parliamentaryLink} className="cc-link-btn">How parliament uses it <Icon name="arrow-right" size={14} /></Link>
          </div>
        </Card>
      </div>

      {packOpen && <EvidencePackModal onClose={() => setPackOpen(false)} />}
    </div>
  );
}
