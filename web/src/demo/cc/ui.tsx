import type { ReactNode } from 'react';
import type { AlertStatus, CaseStatus, RiskLevel, Severity } from '../careContinuityScenario';
import { Icon } from './icons';
import { ALERT_STATUS_LABEL, CASE_STATUS_LABEL, RISK_LABEL, SEVERITY_LABEL, type IconName } from './model';

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="cc-page-head">
      <div>
        {eyebrow && <div className="cc-page-eyebrow">{eyebrow}</div>}
        <h1 className="cc-page-title">{title}</h1>
        {subtitle && <p className="cc-page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="cc-page-actions">{actions}</div>}
    </div>
  );
}

export function Card({ title, subtitle, actions, children, className = '', id, flush }: {
  title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; id?: string; flush?: boolean;
}) {
  return (
    <section className={`cc-card ${flush ? 'cc-card-flush' : ''} ${className}`} aria-labelledby={title && id ? `${id}-h` : undefined}>
      {(title || actions) && (
        <header className="cc-card-head">
          <div>
            {title && <h2 className="cc-card-title" id={id ? `${id}-h` : undefined}>{title}</h2>}
            {subtitle && <p className="cc-card-sub">{subtitle}</p>}
          </div>
          {actions && <div className="cc-card-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`cc-sev cc-sev-${severity}`}><i aria-hidden="true" />{SEVERITY_LABEL[severity]}</span>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return <span className={`cc-sev cc-sev-${risk}`}><i aria-hidden="true" />{RISK_LABEL[risk]}</span>;
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return <span className={`cc-status cc-status-${status}`}>{ALERT_STATUS_LABEL[status]}</span>;
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return <span className={`cc-status cc-cstatus-${status}`}>{CASE_STATUS_LABEL[status]}</span>;
}

export function Tag({ children, tone = 'neutral', icon }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'warn' | 'bad' | 'good' | 'synthetic'; icon?: IconName }) {
  return <span className={`cc-tag cc-tag-${tone}`}>{icon && <Icon name={icon} size={12} />}{children}</span>;
}

export function Delta({ text, good }: { text: string; good: boolean }) {
  return <span className={`cc-delta ${good ? 'is-good' : 'is-bad'}`}>{text}</span>;
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'bad' | 'warn' | 'good' }) {
  return (
    <div className={`cc-stat ${tone ? `cc-stat-${tone}` : ''}`}>
      <div className="cc-stat-label">{label}</div>
      <div className="cc-stat-value cc-num">{value}</div>
      {hint && <div className="cc-stat-hint">{hint}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { id: T; label: ReactNode }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="cc-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={value === o.id ? 'is-on' : ''}
          onClick={() => onChange(o.id)}
          onKeyDown={(e) => {
            const i = options.findIndex((x) => x.id === value);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); onChange(options[(i + 1) % options.length].id); }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); onChange(options[(i - 1 + options.length) % options.length].id); }
          }}
          tabIndex={value === o.id ? 0 : -1}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SyntheticNote({ children }: { children: ReactNode }) {
  return (
    <div className="cc-synthetic" role="note">
      <Icon name="info" size={16} />
      <span>{children}</span>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="cc-empty">
      <Icon name="search" size={22} />
      <p className="cc-empty-title">{title}</p>
      {children && <p className="cc-empty-text">{children}</p>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="cc-field">
      <span className="cc-field-label">{label}</span>
      {children}
      {hint && <span className="cc-field-hint">{hint}</span>}
    </label>
  );
}
