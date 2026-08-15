import type { FormAnswers, FormField, FieldOption } from '../../lib/formSchema';
import { useI18n } from '../../i18n/I18nProvider';
import { tr } from '../../i18n/formRu';

type Props = {
  field: FormField;
  value: unknown;
  answers: FormAnswers;
  onChange: (id: string, value: unknown) => void;
  entryCards?: boolean;
};

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

export function FieldRenderer({ field, value, answers, onChange, entryCards }: Props) {
  const { lang } = useI18n();
  if (field.showWhen && !field.showWhen(answers)) return null;

  if (field.type === 'group' && field.fields) {
    return (
      <div className="cond-wrap vis">
        {field.label && (
          <label className="c-field-label">
            {field.label}
            {field.optional && <span className="opt">{tr('Optional', lang)}</span>}
          </label>
        )}
        <div className="input-row">
          {field.fields.map((sub: FormField) => (
            <div className="c-field" key={sub.id}>
              <FieldRenderer
                field={sub}
                value={answers[sub.id]}
                answers={answers}
                onChange={onChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const labelEl = field.label ? (
    <label className="c-field-label" htmlFor={field.id}>
      {field.label}
      {field.required && <span className="req">*</span>}
      {field.optional && <span className="opt">{tr('Optional', lang)}</span>}
    </label>
  ) : null;

  if (field.type === 'radio') {
    const selected = str(value);
    const cards = field.options ?? [];
    const isUrgency = field.id === 'q3_urgency';
    const isEntry = field.id === 'q0_type' || entryCards;

    if (isUrgency) {
      return (
        <div className="c-field">
          {labelEl}
          <div className="u-cards">
            {cards.map((opt: FieldOption) => (
              <label key={opt.value} className={`u-card${selected === opt.value ? ' sel' : ''}`}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={selected === opt.value}
                  onChange={() => onChange(field.id, opt.value)}
                />
                {opt.dot && <span className={`u-dot ${opt.dot === 'cr' ? 'cr' : opt.dot === 'hi' ? 'hi' : opt.dot === 'mo' ? 'mo' : opt.dot === 'lo' ? 'lo' : 'un'}`} />}
                <span className="u-text">
                  <strong>{opt.label}</strong>
                  {opt.sub && <> – {opt.sub}</>}
                </span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    const cardClass = isEntry ? 'r-cards entry-cards' : field.options && field.options.length > 4 ? 's-cards' : 'r-cards';
    const itemClass = cardClass.startsWith('s') ? 's-card' : 'r-card';

    return (
      <div className="c-field">
        {labelEl}
        <div className={cardClass}>
          {cards.map((opt: FieldOption) => (
            <label key={opt.value} className={`${itemClass}${selected === opt.value ? ' sel' : ''}`}>
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => onChange(field.id, opt.value)}
              />
              {itemClass === 's-card' ? (
                <div className="s-card-text">{opt.label}</div>
              ) : (
                <div className="r-card-body">
                  <strong>{opt.label}</strong>
                  {opt.sub && <span>{opt.sub}</span>}
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const selected = arr(value);
    const toggle = (v: string) => {
      let next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
      if (field.maxSelect && next.length > field.maxSelect) {
        next = next.slice(-field.maxSelect);
      }
      onChange(field.id, next);
    };

    return (
      <div className="c-field">
        {labelEl}
        <div className="c-cards">
          {(field.options ?? []).map((opt: FieldOption) => (
            <label key={opt.value} className={`c-card${selected.includes(opt.value) ? ' sel' : ''}`}>
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              <span className="c-card-text">{opt.label}</span>
            </label>
          ))}
        </div>
        {field.maxSelect && (
          <p className="max-note">
            {lang === 'ru'
              ? `Выберите до ${field.maxSelect} вариантов.`
              : `Select up to ${field.maxSelect} options.`}
          </p>
        )}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="c-field">
        {labelEl}
        <select
          id={field.id}
          className="f-select"
          value={str(value)}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          <option value="">{tr('– Select –', lang)}</option>
          {(field.options ?? []).map((opt: FieldOption) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'rank') {
    const ranked = arr(value);
    const count = field.rankCount ?? 3;
    const options = field.options ?? [];

    const toggleRank = (v: string) => {
      const idx = ranked.indexOf(v);
      if (idx >= 0) {
        onChange(field.id, ranked.filter((x) => x !== v));
      } else if (ranked.length < count) {
        onChange(field.id, [...ranked, v]);
      }
    };

    return (
      <div className="c-field">
        {labelEl}
        <div className="rank-wrap">
          {options.map((opt: FieldOption) => {
            const rank = ranked.indexOf(opt.value) + 1;
            return (
              <div
                key={opt.value}
                className="rank-item"
                data-rank={rank > 0 ? rank : undefined}
                role="button"
                tabIndex={0}
                onClick={() => toggleRank(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleRank(opt.value);
                  }
                }}
              >
                <span className="rank-badge">{rank > 0 ? rank : '–'}</span>
                <div className="rank-body">
                  <strong>{opt.label}</strong>
                  {opt.sub && <span>{opt.sub}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="rank-hint">{tr('Click to rank. Click again to remove.', lang)}</p>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="c-field">
        {labelEl}
        <textarea
          id={field.id}
          className="f-textarea"
          value={str(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'text') {
    return (
      <div className="c-field">
        {labelEl}
        <input
          id={field.id}
          type="text"
          className="f-input"
          value={str(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'file') {
    const file = value instanceof File ? value : null;
    return (
      <div className="c-field">
        {labelEl}
        <input
          id={field.id}
          type="file"
          accept={field.accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            onChange(field.id, f ?? null);
          }}
        />
        {file && (
          <p className="max-note">
            {lang === 'ru' ? 'Выбрано' : 'Selected'}: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{' '}
            {lang === 'ru' ? 'МБ' : 'MB'})
          </p>
        )}
        {field.maxSizeMB && (
          <p className="max-note">
            {lang === 'ru' ? `Макс. ${field.maxSizeMB} МБ.` : `Max ${field.maxSizeMB}MB.`} {field.accept}
          </p>
        )}
      </div>
    );
  }

  return null;
}
