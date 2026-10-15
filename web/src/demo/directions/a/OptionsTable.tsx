// Table 1: the options set as a ruled comparison table, like a committee
// report annex. Selecting a column records the committee's preference.

import { useState, type ReactNode } from 'react';
import { criteria, options } from '../../kazakhstanScenario';
import type { OptionId, PolicyOption } from '../../kazakhstanScenario';
import { cx, refOf, usePaper } from './model';

const MAX = 5 * criteria.reduce((sum, c) => sum + c.defaultWeight, 0);
const weighted = (o: PolicyOption) => criteria.reduce((sum, c) => sum + o.scores[c.id] * c.defaultWeight, 0);
const best = Math.max(...options.map(weighted));

function Pips({ n }: { n: number }) {
  return (
    <span className="da-pips" role="img" aria-label={`${n} of 5`}>
      <span className="da-pips-n" aria-hidden="true">{n}</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cx('da-pip', i <= n && 'is-on')} aria-hidden="true" />
      ))}
    </span>
  );
}

export function OptionsTable() {
  const { s, setPreference } = usePaper();
  const [hover, setHover] = useState<OptionId | null>(null);

  const cell = (o: PolicyOption, content: ReactNode, extra?: string) => (
    <td
      key={o.id}
      className={cx('da-col', s.preference === o.id && 'is-pref', hover === o.id && 'is-hover', extra)}
      onMouseEnter={() => setHover(o.id)}
      onMouseLeave={() => setHover(null)}
      onClick={() => setPreference(o.id)}
    >
      {content}
    </td>
  );

  const row = (label: ReactNode, render: (o: PolicyOption) => ReactNode, extra?: string) => (
    <tr className={extra}>
      <th scope="row">{label}</th>
      {options.map((o) => cell(o, render(o)))}
    </tr>
  );

  return (
    <figure className="da-figure">
      <figcaption className="da-caption">
        <span className="da-sc da-caption-n">Table 1</span>
        <span>
          Financing options compared. Indicative figures; scores run from 1 (weak) to 5 (strong), weighted as agreed by
          members. Select a column to record the committee’s preference.
        </span>
      </figcaption>
      <table className={cx('da-table', s.preference && 'has-pref')}>
        <thead>
          <tr>
            <td className="da-table-corner" />
            {options.map((o) => (
              <th
                key={o.id}
                scope="col"
                className={cx('da-col', s.preference === o.id && 'is-pref', hover === o.id && 'is-hover')}
                onMouseEnter={() => setHover(o.id)}
                onMouseLeave={() => setHover(null)}
              >
                <button type="button" className="da-colhead" aria-pressed={s.preference === o.id} onClick={() => setPreference(o.id)}>
                  <span className="da-sc">Option {o.id}</span>
                  <span className="da-colhead-t">{o.short}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {row('Indicative cost, KZT bn a year', (o) => (
            <span className="da-num">
              {((o.costRange[0] + o.costRange[1]) / 2).toFixed(1)}
              <span className="da-range"> ({o.costRange[0].toFixed(1)}–{o.costRange[1].toFixed(1)})</span>
            </span>
          ))}
          {row('Time to operate', (o) => <span className="da-num">{o.months[0]}–{o.months[1]} months</span>)}
        </tbody>
        <tbody>
          <tr className="da-tr-group">
            <th scope="colgroup" colSpan={4}>
              <span className="da-sc">Assessment against criteria</span> <span className="da-dim">(weight)</span>
            </th>
          </tr>
          {criteria.map((c) => (
            <tr key={c.id}>
              <th scope="row" title={c.help}>
                {c.label} <span className="da-dim da-num">×{c.defaultWeight}</span>
              </th>
              {options.map((o) => cell(o, <Pips n={o.scores[c.id]} />))}
            </tr>
          ))}
          {row(
            'Weighted score',
            (o) => (
              <span className="da-num da-total">
                {weighted(o)} <span className="da-dim">of {MAX}</span>
                {weighted(o) === best && <span className="da-sc da-best"> highest</span>}
              </span>
            ),
            'da-tr-total',
          )}
        </tbody>
        <tbody>
          {row('Principal advantage', (o) => o.advantages[0])}
          {row('Principal risk', (o) => o.risks[0])}
          {row('Evidence', (o) => <span className="da-mono">{o.evidence.map(refOf).join(' ')}</span>)}
        </tbody>
        <tfoot>
          <tr className="da-tr-pref">
            <th scope="row">Committee preference</th>
            {options.map((o) => (
              <td
                key={o.id}
                className={cx('da-col', s.preference === o.id && 'is-pref', hover === o.id && 'is-hover')}
                onMouseEnter={() => setHover(o.id)}
                onMouseLeave={() => setHover(null)}
              >
                <button type="button" className="da-prefbtn" aria-pressed={s.preference === o.id} onClick={() => setPreference(o.id)}>
                  {s.preference === o.id ? (
                    <>
                      <span aria-hidden="true">✓ </span>Preferred
                    </>
                  ) : (
                    <>Prefer {o.id}</>
                  )}
                </button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </figure>
  );
}
