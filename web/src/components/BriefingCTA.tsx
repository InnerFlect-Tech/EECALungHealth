import { useI18n } from '../i18n/I18nProvider';

type Variant = 'primary' | 'secondary' | 'inline';

const EMAIL = 'alesia.matusevych@globaltbcaucus.org';
const CC = 'hello@innerflect.tech';

function buildMailto(lang: 'en' | 'ru'): string {
  const subject =
    lang === 'ru'
      ? 'Запрос консультации — EECA Lung Health Sovereignty Hub'
      : 'Consultation request — EECA Lung Health Sovereignty Hub';

  const body =
    lang === 'ru'
      ? 'Здравствуйте, Алесия,\n\nМы хотели бы назначить 30-минутную консультацию по EECA Lung Health Sovereignty Hub.\n\nОрганизация:\nИмя:\nРоль:\nУдобное время (следующие 2 недели):\n\nСпасибо.'
      : "Hello Alesia,\n\nWe'd like to schedule a 30-minute consultation on the EECA Lung Health Sovereignty Hub.\n\nOrganisation:\nName:\nRole:\nPreferred times (next 2 weeks):\n\nThanks.";

  const params = new URLSearchParams({
    cc: CC,
    subject,
    body,
  });
  return `mailto:${EMAIL}?${params.toString().replace(/\+/g, '%20')}`;
}

type Props = {
  variant?: Variant;
  labelKey?: string;
  className?: string;
};

export function BriefingCTA({
  variant = 'primary',
  labelKey,
  className,
}: Props) {
  const { lang, t } = useI18n();
  const href = buildMailto(lang);
  const label = t(labelKey ?? 'cta-briefing-primary');

  const classes =
    variant === 'primary'
      ? 'btn btn-primary'
      : variant === 'secondary'
        ? 'btn btn-secondary'
        : 'link-arrow';

  return (
    <a
      href={href}
      className={[classes, className].filter(Boolean).join(' ')}
    >
      {label}
    </a>
  );
}
