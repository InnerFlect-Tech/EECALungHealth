// Russian translation overlay for the consultation form.
// Keeps formSchema.ts as the English source of truth; this maps each English
// UI string -> Russian. Strings not present here fall back to English.
//
// ⚠️ Draft translation – needs native-speaker review (Alesia) before public use.

import type { Lang } from './I18nProvider';
import type { FormField, FormStep } from '../lib/formSchema';

const M: Record<string, string> = {
  // ── Consultation hero (ConsultationPage) ──────────────────────────────
  'Regional Stakeholder Insights':
    'Мнения региональных заинтересованных сторон',
  'Your input will shape': 'Ваш вклад определит,',
  'what gets built first.': 'что будет создано в первую очередь.',
  'Across Eastern Europe and Central Asia, health systems are under pressure – from geopolitical disruption, funding transitions, displacement of populations, and strained supply chains. When treatment continuity breaks down, the consequences are clinical, political, and irreversible.':
    'В Восточной Европе и Центральной Азии системы здравоохранения испытывают давление – из-за геополитических потрясений, изменений в финансировании, перемещения населения и нарушений в цепочках поставок. Когда непрерывность лечения нарушается, последствия являются клиническими, политическими и необратимыми.',
  'The EECA Lung Health Hub is a proposed regional platform designed to help parliamentarians, community organizations, and partners coordinate faster, legislate smarter, and protect care continuity – especially for the most vulnerable populations.':
    'Хаб лёгочного здоровья ВЕЦА – это предлагаемая региональная платформа, призванная помочь парламентариям, общественным организациям и партнёрам быстрее координировать действия, принимать более продуманные законы и защищать непрерывность медицинской помощи – особенно для наиболее уязвимых групп населения.',
  '7–10 minutes': '7–10 минут',
  'No individual patient data collected': 'Индивидуальные данные пациентов не собираются',
  'All responses inform product decisions': 'Все ответы влияют на решения о продукте',
  'Your perspective, not your budget': 'Ваше мнение, а не ваш бюджет',
  'Learn more about the Hub': 'Узнать больше о Хабе',
  'Your input will shape what gets built first.': 'Ваш вклад определит, что будет создано в первую очередь.',
  'A 7–10 minute survey that helps us to understand your situation.': 'Опрос на 7–10 минут, который поможет нам понять вашу ситуацию.',
  'Privacy and consent:': 'Конфиденциальность и согласие:',
  'Your responses are collected for internal strategic planning and product design purposes only. No individual patient data is requested or collected at any point. Aggregated, anonymized findings may be shared with core project partners. By completing this form, you consent to this use. Contact details, if provided, are used only for follow-up related to this initiative.':
    'Ваши ответы собираются исключительно для внутреннего стратегического планирования и проектирования продукта. Индивидуальные данные пациентов не запрашиваются и не собираются. Агрегированные обезличенные результаты могут быть переданы ключевым партнёрам проекта. Заполняя эту форму, вы соглашаетесь с таким использованием. Контактные данные, если они указаны, используются только для последующей связи в рамках этой инициативы.',

  // ── Wizard chrome (StepWizard) ────────────────────────────────────────
  'Step': 'Шаг',
  'of': 'из',
  'Back': 'Назад',
  'Continue': 'Продолжить',
  'Submit': 'Отправить',
  'Submitting…': 'Отправка…',
  'Consultation': 'Консультация',
  'Some questions refer to the Hub’s concept and its three core functions. You can open the full Concept Note at any point:':
    'Некоторые вопросы касаются концепции Хаба и его трёх основных функций. Вы можете открыть полную концепцию в любой момент:',
  'Thank you.': 'Спасибо.',
  'Your input goes directly to the team designing the EECA Lung Health Hub. No response will be shared publicly without your consent. If you indicated willingness to be contacted, you will hear from us within two weeks.':
    'Ваш ответ направляется напрямую команде, разрабатывающей Хаб лёгочного здоровья ВЕЦА. Ни один ответ не будет опубликован без вашего согласия. Если вы выразили готовность к контакту, мы свяжемся с вами в течение двух недель.',
  'Questions or direct contact:': 'Вопросы или прямой контакт:',

  // ── FieldRenderer literals ────────────────────────────────────────────
  'Optional': 'Необязательно',
  '– Select –': '– Выберите –',
  'Click to rank. Click again to remove.': 'Нажмите, чтобы присвоить ранг. Нажмите ещё раз, чтобы убрать.',

  // ── STEP_LABELS (progress bar) ────────────────────────────────────────
  'Your perspective': 'Ваша позиция',
  'Country & role': 'Страна и роль',
  'Urgency': 'Срочность',
  'Key risks': 'Ключевые риски',
  'Pillar priorities': 'Приоритеты компонентов',
  'Migration & continuity': 'Миграция и непрерывность',
  'Your contribution': 'Ваш вклад',
  'Follow-up': 'Последующая связь',
  'Access breakdown': 'Сбои в доступе',
  'Early warning': 'Раннее оповещение',
  'Displaced populations': 'Перемещённые группы',
  'Community features': 'Функции для сообществ',
  'Documents': 'Документы',
  'Legislative bottlenecks': 'Законодательные барьеры',
  'Digital tools': 'Цифровые инструменты',
  'MP portal': 'Портал для депутатов',
  'Migration intelligence': 'Миграционная аналитика',
  'Design priorities': 'Приоритеты дизайна',
  'Org profile': 'Профиль организации',
  'Funding transition': 'Изменение финансирования',
  'Evidence & systems': 'Доказательства и системы',
  'Pilot & funding': 'Пилот и финансирование',
  'Governance standards': 'Стандарты управления',
  'Health security': 'Безопасность здоровья',
  'Cross-border & MVP': 'Трансграничность и MVP',
  'Open response': 'Открытый ответ',

  // ── Step tags ─────────────────────────────────────────────────────────
  'Identification': 'Идентификация',
  'Your profile': 'Ваш профиль',
  'Risk landscape': 'Ландшафт рисков',
  'Priorities': 'Приоритеты',
  'Community · Access': 'Сообщество · Доступ',
  'Community · Early warning': 'Сообщество · Раннее оповещение',
  'Community · Displaced populations': 'Сообщество · Перемещённые группы',
  'Community · Features': 'Сообщество · Функции',
  'Community · Documents': 'Сообщество · Документы',
  'Parliamentary · Bottlenecks': 'Парламент · Барьеры',
  'Parliamentary · Legislative tools': 'Парламент · Законодательные инструменты',
  'Parliamentary · Portal': 'Парламент · Портал',
  'Parliamentary · Migration intelligence': 'Парламент · Миграционная аналитика',
  'Parliamentary · Design priorities': 'Парламент · Приоритеты дизайна',
  'Partner · Organization': 'Партнёр · Организация',
  'Partner · Funding transition': 'Партнёр · Изменение финансирования',
  'Partner · Evidence & systems': 'Партнёр · Доказательства и системы',
  'Partner · Pilot & Development': 'Партнёр · Пилот и разработка',
  'Partner · Governance': 'Партнёр · Управление',
  'Closing · Health security': 'Завершение · Безопасность здоровья',
  'Completion · Regional Collaboration & Pilot Priorities': 'Завершение · Региональное сотрудничество и приоритеты пилотного внедрения Хаба',
  'Closing · Open response': 'Завершение · Открытый ответ',

  // ── Step titles & hints ───────────────────────────────────────────────
  'Which perspective are you responding from?': 'С какой позиции вы отвечаете?',
  'Your selection determines which questions follow. All tracks include a shared section and targeted questions for your role.':
    'Ваш выбор определяет дальнейшие вопросы. Все направления включают общий раздел и целевые вопросы для вашей роли.',
  'Country and primary role': 'Страна и основная роль',
  'This helps us map responses geographically and by sector. Unlike the perspective you chose in step 1 (which tailors the questions), this is your specific professional role.':
    'Это помогает нам распределить ответы по странам и секторам. В отличие от позиции, выбранной на шаге 1 (которая настраивает вопросы), здесь указывается ваша конкретная профессиональная роль.',
  'How urgent is the need for a coordinated regional mechanism to support lung health and continuity of care in your context?':
    'Насколько острой является потребность в скоординированном региональном механизме обеспечения здоровья лёгких и непрерывности оказания помощи в вашем контексте?',
  'What are the three greatest risks to the continuity of lung health services in your context at present?':
    'Каковы три основных риска для непрерывности оказания услуг в области здоровья лёгких в вашем контексте в настоящее время?',
  'Select up to three risks that are most relevant to your context right now.':
    'Выберите до трёх рисков, наиболее актуальных для вашего контекста сейчас.',
  'Please rank the four core Hub functions in order of priority for your context (1 = highest)':
    'Расположите четыре основные функции Хаба по приоритету для вашего контекста (1 = высший)',
  'Click each pillar in order of priority. Click an already-ranked item to remove its rank.':
    'Нажимайте на компоненты в порядке приоритета. Нажмите на уже ранжированный элемент, чтобы убрать ранг.',
  'To what extent do population displacement and migration disrupt access to and continuity of lung health care in your context?':
    'В какой степени перемещение населения и миграция создают препятствия для обеспечения непрерывного доступа к помощи в области здоровья лёгких в вашем контексте?',
  'Are you in a position to contribute any of the following to this initiative?':
    'Можете ли вы внести что-либо из перечисленного в эту инициативу?',
  'Select all that apply. This is not a commitment – it helps us understand what is available.':
    'Отметьте все подходящие варианты. Это не обязательство – это помогает понять, что доступно.',
  'Would you be willing to be contacted for a follow-up conversation of up to 30 minutes?':
    'Согласны ли вы на последующий разговор продолжительностью до 30 минут?',
  'Your contact details will be used only for follow-up related to this initiative, with your explicit permission.':
    'Ваши контактные данные будут использованы только для последующей связи в рамках этой инициативы и с вашего явного согласия.',
  'Where does access to lung health care most commonly break down in your experience or community?':
    'Где, по вашему опыту или в вашем сообществе, чаще всего нарушается доступ к помощи при лёгочных заболеваниях?',
  'Community signals and feedback channels': 'Сигналы сообщества и каналы обратной связи',
  'Migrant, refugee, and displaced community access to care': 'Доступ к помощи для мигрантов, беженцев и вынужденно перемещённых лиц',
  'If this Hub were built, which functions would be most useful for communities/organisations like yours?':
    'Если бы этот Хаб был создан, какие функции были бы наиболее полезны для сообществ/организаций, подобных вашему?',
  'Rank in order of usefulness (1 = most useful).': 'Расположите по полезности (1 = наиболее полезно).',
  'Optional document upload': 'Загрузка документов (необязательно)',
  "If you have any reports, documented cases, or community assessments (excluding any personally identifiable patient information) that are relevant to this research or could support the rationale for the Hub's future work, please upload them here. PDF, DOCX, XLSX. Max 10MB.":
    'Если у вас имеются отчёты, документация по отдельным случаям или результаты оценки сообществ (без персональных данных пациентов), которые могут быть использованы в рамках исследования или послужить обоснованием для дальнейшей работы Хаба, пожалуйста, загрузите их здесь. PDF, DOCX, XLSX. Макс. 10 МБ.',
  'Which of the following currently block or delay health legislation in your parliament or ministry?':
    'Что из перечисленного сейчас блокирует или задерживает законодательство в области здравоохранения в вашем парламенте или министерстве?',
  'Comparative law database and AI-assisted policy tools':
    'База сравнительного законодательства и инструменты анализа политики с ИИ',
  'Secure MP portal and legislative timing': 'Защищённый портал для депутатов и сроки законотворчества',
  'Health Security & Migration Intelligence': 'Безопасность здоровья и миграционная аналитика',
  'What would make this platform genuinely useful to you?': 'Что сделало бы эту платформу действительно полезной для вас?',
  'Organization type': 'Тип организации',
  'Funding transition risks': 'Риски при изменении финансирования',
  'Evidence requirements and existing platforms': 'Требования к доказательствам и существующие платформы',
  'Support for pilot implementation and early product development': 'Поддержка в реализации пилота и ранней разработке продукта',
  'Governance, privacy and trust requirements': 'Требования к управлению, конфиденциальности и доверию',
  'Continuity-of-care intelligence and crisis readiness': 'Аналитика непрерывности помощи и готовность к кризисам',
  'Regional Collaboration and Hub Pilot Priorities': 'Региональное сотрудничество и приоритеты пилотного внедрения Хаба',
  'Is there anything critical we have not asked?': 'Есть ли что-то важное, о чём мы не спросили?',
  'Optional – max 100 words. Often the most valuable input.':
    'Необязательно – до 100 слов. Часто это самый ценный вклад.',

  // ── Field labels & placeholders ───────────────────────────────────────
  'Which country or region are you responding from?': 'Из какой страны или региона вы отвечаете?',
  'Which of the following best describes your primary role?': 'Что из перечисленного лучше всего описывает вашу основную роль?',
  'Which track is closest to your perspective?': 'Какое направление ближе всего к вашей позиции?',
  'Other risk (please specify)': 'Другой риск (уточните)',
  'Please share your name and preferred contact method': 'Укажите ваше имя и предпочтительный способ связи',
  'Name': 'Имя',
  'Your name': 'Ваше имя',
  'Email address': 'Адрес электронной почты',
  'Organization': 'Организация',
  'Organization name': 'Название организации',
  'Preferred language for follow-up': 'Предпочтительный язык для связи',
  'e.g. English, Russian': 'напр. английский, русский',
  'In your experience, does your community identify problems with medicine access, treatment interruption, or health service breakdown before official systems do?':
    'По вашему опыту, выявляет ли ваше сообщество проблемы с доступом к лекарствам, перерывами в лечении или сбоями в медицинских услугах раньше, чем официальные системы?',
  'Does feedback from patients and communities currently reach lawmakers or health ministry decision-makers in any reliable way?':
    'Доходит ли сейчас обратная связь от пациентов и сообществ до законодателей или лиц, принимающих решения в министерстве здравоохранения, надёжным образом?',
  'Are people from migrant or displaced communities in your area losing access to TB or lung health treatment as a result of their movement?':
    'Теряют ли люди из числа мигрантов или перемещённых сообществ в вашем регионе доступ к лечению туберкулёза или лёгочных заболеваний в результате перемещения?',
  'Are you aware if any affected community experienced interruptions in access to TB or lung health medicines in the past 12 months?':
    'Известно ли вам о случаях, когда какое-либо затронутое сообщество сталкивалось с перебоями в доступе к лекарствам от туберкулёза или лёгочных заболеваний за последние 12 месяцев?',
  'What support would be most useful for civil society organizations to engage effectively?':
    'Какая поддержка была бы наиболее полезна организациям гражданского общества для эффективного участия?',
  'Upload documents (optional)': 'Загрузить документы (необязательно)',
  'Would access to a searchable database of health legislation from across EECA countries be useful for your work?':
    'Был бы полезен для вашей работы доступ к поисковой базе законодательства в сфере здравоохранения стран ВЕЦА?',
  'Scope of legislation you would need access to': 'Объём законодательства, к которому вам нужен доступ',
  'Would you or your team use an AI-assisted tool that analyzes proposed health amendments and compares them to regional standards?':
    'Использовали бы вы или ваша команда инструмент с ИИ, который анализирует предлагаемые поправки в сфере здравоохранения и сравнивает их с региональными стандартами?',
  'What conditions would be required for you to trust and use AI-generated policy analysis?':
    'Какие условия необходимы, чтобы вы доверяли и использовали анализ политики, созданный с помощью ИИ?',
  'Would you use a secure, invitation-only digital portal designed specifically for parliamentarians?':
    'Использовали бы вы защищённый цифровой портал по приглашению, созданный специально для парламентариев?',
  'Are there upcoming legislative windows, budget cycles, or political deadlines in the next 12 months?':
    'Есть ли в ближайшие 12 месяцев предстоящие законодательные окна, бюджетные циклы или политические сроки?',
  'How useful would access to a regional early warning system – one that helps identify risks of disruptions in the availability and supply of TB and lung health medicines, as well as other threats to continuity of treatment – be for your work?':
    'Насколько полезным для вашей работы был бы доступ к региональной системе раннего предупреждения, которая помогает выявлять риски перебоев в поставках лекарственных препаратов для лечения ТБ и заболеваний лёгких и другие угрозы непрерывности лечения?',
  'What single thing would make this platform genuinely useful to you – something you would actually open and rely on? (max 100 words)':
    'Что одно сделало бы эту платформу действительно полезной для вас – чем вы бы реально пользовались и на что полагались? (до 100 слов)',
  'Share your honest perspective…': 'Поделитесь вашим искренним мнением…',
  'Upload draft legislation, policy briefs, or committee reports (optional). PDF, DOCX. Max 10MB.':
    'Загрузите проекты законов, аналитические записки или отчёты комитетов (необязательно). PDF, DOCX. Макс. 10 МБ.',
  'Which best describes your organization?': 'Что лучше всего описывает вашу организацию?',
  'How serious are funding gaps for TB and lung health programs in your countries, especially as donor support decreases or ends?':
    'Насколько серьёзны пробелы в финансировании программ по туберкулёзу и лёгочному здоровью в ваших странах, особенно по мере сокращения или прекращения донорской поддержки?',
  'What key evidence or criteria would your organization look for when assessing a platform like the EECA Hub?':
    'Какие ключевые доказательства или критерии искала бы ваша организация при оценке платформы, подобной Хабу ВЕЦА?',
  'Does your organization already use dashboards, analytical platforms, or legislative tracking tools relevant to this region?':
    'Использует ли ваша организация дашборды, аналитические платформы или инструменты отслеживания законодательства, относящиеся к этому региону?',
  'Briefly describe existing digital tools and whether integration would be useful':
    'Кратко опишите существующие цифровые инструменты и была бы ли полезна интеграция',
  'Would your organization be willing to support or co-facilitate a pilot of the Hub in one or more EECA countries?':
    'Готова ли ваша организация поддержать или совместно провести пилот Хаба в одной или нескольких странах ВЕЦА?',
  'Which countries would you prioritize for a pilot?': 'Какие страны вы бы приоритизировали для пилота?',
  'From a funding perspective, which Hub component would be easiest to support in the next 12–18 months?':
    'С точки зрения финансирования, какой компонент Хаба было бы проще всего поддержать в ближайшие 12–18 месяцев?',
  'What rules, safeguards, or trust standards would the Hub need to meet before your organization could engage or support it?':
    'Каким правилам, гарантиям или стандартам доверия должен соответствовать Хаб, прежде чем ваша организация сможет участвовать или поддержать его?',
  'How useful would a regional early warning system be – one that helps identify risks of patients losing access to treatment and alerts decision-makers early?':
    'Насколько полезной для вашей работы была бы региональная система раннего предупреждения, которая помогает выявлять риски потери доступа пациентов к лечению и своевременно информирует лиц, принимающих решения?',
  'How prepared is the health system in your country or region to maintain TB and lung health services during a major crisis?':
    'Насколько система здравоохранения в вашей стране или регионе готова поддерживать услуги по туберкулёзу и лёгочному здоровью во время крупного кризиса?',
  'Is there currently any functional mechanism for cross-border coordination on TB or lung health continuity between your country and neighbors?':
    'Существует ли сейчас работающий механизм трансграничной координации по непрерывности помощи при туберкулёзе или лёгочных заболеваниях между вашей страной и соседями?',
  'If the Hub were launching with one core feature in the next 6 months, rank by priority (1 = highest)':
    'Если бы Хаб запускался с одной ключевой функцией в ближайшие 6 месяцев, расположите по приоритету (1 = высший)',
  'Share any additional context, concerns, or priorities…':
    'Поделитесь любым дополнительным контекстом, опасениями или приоритетами…',

  // ── Countries & roles ─────────────────────────────────────────────────
  'Armenia': 'Армения',
  'Azerbaijan': 'Азербайджан',
  'Georgia': 'Грузия',
  'Kazakhstan': 'Казахстан',
  'Kyrgyzstan': 'Кыргызстан',
  'Moldova': 'Молдова',
  'Tajikistan': 'Таджикистан',
  'Ukraine': 'Украина',
  'Uzbekistan': 'Узбекистан',
  'Multi-country / Regional': 'Несколько стран / Региональный',
  'Other': 'Другое',
  'Community health worker or patient advocate': 'Общественный медработник или защитник прав пациентов',
  'Civil society / NGO / advocacy organization': 'Гражданское общество / НКО / правозащитная организация',
  'Member of Parliament or parliamentary staff': 'Депутат парламента или сотрудник аппарата',
  'Government official (Ministry of Health or other)': 'Государственный служащий (Минздрав или иное)',
  'National TB or lung health program officer': 'Сотрудник национальной программы по ТБ или лёгочному здоровью',
  'International bilateral/multilateral donor (UN agency, Global Fund, etc.)': 'Международная организация двухсторонней/многосторонней помощи (агентство ООН, Глобальный Фонд и др.)',
  'Private foundation or philanthropic organization': 'Частный фонд или благотворительная организация',
  'Academic or research institution': 'Академическое или исследовательское учреждение',
  'Implementation partner or technical assistance provider': 'Партнёр по реализации или поставщик технической помощи',
  'Media or communications': 'СМИ или коммуникации',

  // ── Option labels & subs ──────────────────────────────────────────────
  'Representative of the community / patient / civil society representative':
    'Представитель сообщества / пациент / представитель гражданского общества',
  'Community health workers, patient advocates, NGOs, advocacy organizations':
    'Общественные медработники, защитники прав пациентов, НКО, правозащитные организации',
  'Member of Parliament / parliamentary staff / policy-maker':
    'Депутат / сотрудник аппарата / разработчик политики',
  'MPs, parliamentary staff, government officials, policy advisors':
    'Депутаты, сотрудники аппарата, госслужащие, советники по политике',
  'Institutional partner / donor / foundation / technical partner':
    'Институциональный партнёр / донор / фонд / технический партнёр',
  'UN agencies, bilateral and multilateral donors, foundations, implementation partners':
    'Агентства ООН, доноры двухсторонней и многосторонней помощи, фонды, партнёры по реализации',
  'Other (please describe briefly)': 'Другое (кратко опишите)',
  'Media, researchers, or others with a relevant perspective':
    'СМИ, исследователи или другие лица с релевантной позицией',
  'Community / civil society': 'Сообщество / гражданское общество',
  'Parliament / policy-maker': 'Парламент / разработчик политики',
  'Institutional partner / donor': 'Институциональный партнёр / донор',

  'Critical': 'Критическая',
  'Action is needed now; current systems are failing or at serious risk':
    'Действия нужны сейчас; текущие системы дают сбой или под серьёзной угрозой',
  'High': 'Высокая',
  'Significant gaps exist; things could deteriorate quickly': 'Существуют значительные пробелы; ситуация может быстро ухудшиться',
  'Moderate': 'Умеренная',
  'Gaps exist but the situation is stable for now': 'Пробелы есть, но пока ситуация стабильна',
  'Low': 'Низкая',
  'Current systems are functioning adequately': 'Текущие системы функционируют адекватно',
  "I don't have enough information to assess": 'У меня недостаточно информации для оценки',

  'Disruptions to medicine supply chains or procurement': 'Нарушения в цепочках поставок или закупках лекарственных средств',
  'Population displacement across or within borders': 'Перемещение населения через государственные границы или внутри страны',
  'Loss of donor funding or funding transition': 'Потеря донорского финансирования или его переходный период',
  'Weak or inadequate enabling legislation': 'Недостаточная или отсутствующая нормативно-правовая база',
  'Fragmented health data and weak health information systems': 'Фрагментированные данные о здоровье и слабые системы медицинской информации',
  'Political instability or government transitions': 'Политическая нестабильность или смена правительства',
  'Shortages of or displacement of the health workforce': 'Нехватка медицинских кадров или их перемещение',
  'Interruptions in treatment for patients affected by mobility or displacement': 'Перебои в лечении пациентов в связи с миграцией или вынужденным перемещением',
  'Drug resistance resulting from interrupted or inconsistent treatment': 'Лекарственная резистентность вследствие прерывания или непоследовательного лечения',
  'Lack of cross-border coordination mechanisms': 'Отсутствие механизмов трансграничной координации',
  'Inadequate community or civil society engagement': 'Недостаточное вовлечение сообществ или гражданского общества',
  'Other (please specify)': 'Другое (уточните)',

  'Legislative Intelligence Platform': 'Законодательная интеллектуальная платформа',
  'A secure regional platform for accessing, comparing, and co-developing legislation, policy frameworks, and model legal provisions':
    'Защищённая региональная платформа для доступа, сравнения и совместной разработки законодательства, политических рамок и типовых правовых норм',
  'AI-Powered Policy & Collaboration': 'Политика и сотрудничество на основе ИИ',
  'A secure space for MPs to identify opportunities for policy exchange, technical collaboration, and shared learning based on legislation, financing, health system performance, and emerging priorities':
    'Защищённое пространство, где депутаты могут находить возможности для обмена политическим опытом, технического сотрудничества и совместного обучения на основе законодательства, финансирования, показателей систем здравоохранения и актуальных приоритетов',
  'Health Security & Continuity of Care': 'Безопасность здоровья и непрерывность помощи',
  'An early warning and decision-support platform that monitors risks to continuity of care – including displacement, funding transitions, medicine shortages, and health system disruptions':
    'Платформа раннего предупреждения и поддержки принятия решений, отслеживающая риски для непрерывности помощи – включая перемещение населения, изменения финансирования, дефицит лекарств и сбои в системе здравоохранения',
  'AI Lung Health App': 'ИИ-приложение по здоровью лёгких',
  'An AI assistant that provides evidence-based guidance, supports policy and programme implementation, connects users with regional resources, and facilitates access to trusted lung health information':
    'ИИ-ассистент, предоставляющий научно обоснованные рекомендации, поддерживающий реализацию политики и программ, соединяющий пользователей с региональными ресурсами и облегчающий доступ к достоверной информации о здоровье лёгких',

  'Major issue': 'Серьёзная проблема',
  'Significant numbers of displaced people are losing or interrupting treatment':
    'Значительное число перемещённых людей теряют доступ к лечению или прерывают его',
  'Emerging issue': 'Назревающая проблема',
  'We are seeing early signs; it is not yet a crisis': 'Видны ранние признаки; это пока не кризис',
  'Moderate issue': 'Умеренная проблема',
  'Displacement exists but is managed reasonably well': 'Перемещение есть, но управляется достаточно хорошо',
  'Not a significant issue in our context': 'В нашем контексте это не значимая проблема',
  "I don't have enough data/visibility to answer": 'У меня нет достаточных данных, чтобы ответить',

  'Aggregated or de-identified health outcome data': 'Агрегированные или обезличенные данные о результатах лечения',
  'Legislative documents, amendments, or draft laws': 'Законодательные документы, поправки или проекты законов',
  'Existing policy briefs or research reports': 'Существующие аналитические записки или исследовательские отчёты',
  'Contact networks (MPs, health officials, community leaders)': 'Контактные сети (депутаты, чиновники здравоохранения, лидеры сообществ)',
  'Institutional expertise for technical advisory input': 'Институциональная экспертиза для технических консультаций',
  'Financial support or co-funding': 'Финансовая поддержка или софинансирование',
  'Pilot country or site access': 'Доступ к пилотной стране или площадке',
  'None of the above at this stage': 'Ничего из перечисленного на данном этапе',
  'I need more information before committing': 'Мне нужно больше информации, прежде чем брать обязательства',

  'Yes – please contact me': 'Да – пожалуйста, свяжитесь со мной',
  'Maybe – I would like to know more first': 'Возможно – сначала я хотел бы узнать больше',
  'No – I prefer to remain anonymous': 'Нет – предпочитаю остаться анонимным',

  'When people move between cities or regions within a country': 'Когда люди перемещаются между городами или регионами внутри страны',
  'When people cross international borders': 'Когда люди пересекают международные границы',
  'When funding changes and clinics reduce services': 'Когда меняется финансирование и клиники сокращают услуги',
  'When medicine supply is interrupted': 'Когда прерываются поставки лекарств',
  'When documentation (ID, residence permit) is missing or expired': 'Когда документы (удостоверение, вид на жительство) отсутствуют или просрочены',
  'When language or cultural barriers prevent engagement': 'Когда языковые или культурные барьеры мешают обращению',
  'When healthcare workers are unavailable or displaced': 'Когда медработники недоступны или перемещены',
  'When treatment protocols differ between locations': 'Когда протоколы лечения различаются между регионами',
  "When health records don't transfer between facilities": 'Когда медицинские записи не передаются между учреждениями',

  'Yes – Communities are the first to recognize emerging issues': 'Да – сообщества первыми замечают возникающие проблемы',
  'Sometimes – it depends on the issue': 'Иногда – зависит от проблемы',
  'No – official systems usually detect problems first': 'Нет – обычно проблемы первыми выявляют официальные системы',
  "We don't have a reliable way to know either way": 'У нас нет надёжного способа это определить',
  'Yes – there are formal and functioning channels': 'Да – есть формальные и работающие каналы',
  'Partially – some channels exist but they are slow or inconsistent': 'Частично – некоторые каналы есть, но они медленные или непоследовательные',
  'Rarely – feedback reaches decision-makers informally at best': 'Редко – обратная связь в лучшем случае доходит неформально',
  'No – there is no effective channel we are aware of': 'Нет – нам неизвестно об эффективном канале',
  "I don't know": 'Не знаю',

  'Yes – this is happening on a regular basis': 'Да – это происходит регулярно',
  'There are specific cases we are aware of': 'Нам известны отдельные случаи',
  'Possibly – we suspect it but have no confirmed data': 'Возможно – мы подозреваем, но подтверждённых данных нет',
  'Not that we have observed': 'Мы такого не наблюдали',
  'This is not applicable in our context': 'В нашем контексте это неприменимо',
  'Yes – significant interruptions': 'Да – значительные перебои',
  'Yes – minor or temporary interruptions': 'Да – незначительные или временные перебои',
  'No – supply has been consistent': 'Нет – поставки были стабильными',
  "I don't have reliable information on this": 'У меня нет надёжной информации по этому вопросу',

  'A channel to report access problems directly to decision-makers': 'Канал для сообщения о проблемах доступа напрямую лицам, принимающим решения',
  'Alerts when medicine supply or service availability changes': 'Оповещения об изменениях в поставках лекарств или доступности услуг',
  'Information about legal rights and access entitlements': 'Информация о юридических правах и правах на доступ',
  'Visibility into which laws and policies affect your community': 'Понимание того, какие законы и политики влияют на ваше сообщество',
  'A way to be consulted on legislation before it is finalized': 'Возможность участвовать в обсуждении законодательства до его окончательного принятия',
  'Real-time information about treatment continuity options': 'Информация в реальном времени о вариантах непрерывности лечения',
  'Training on how to use digital health advocacy tools': 'Обучение использованию цифровых инструментов для защиты здоровья',
  'Legal literacy on TB and lung health policy': 'Правовая грамотность по политике в области ТБ и лёгочного здоровья',
  'Support for documenting and reporting treatment access issues': 'Поддержка в документировании и сообщении о проблемах доступа к лечению',
  'Guidance on how to engage with parliamentary processes': 'Рекомендации по участию в парламентских процессах',
  'Translation and language support': 'Перевод и языковая поддержка',
  'Technical support for using the platform': 'Техническая поддержка при использовании платформы',
  'None – we have sufficient capacity': 'Ничего – у нас достаточно возможностей',

  'Insufficient technical evidence or comparative data': 'Недостаточно технических доказательств или сравнительных данных',
  'Lack of comparative examples from other EECA countries': 'Отсутствие сравнительных примеров из других стран ВЕЦА',
  'No budget analysis or fiscal notes attached to proposals': 'Отсутствие бюджетного анализа или финансовых обоснований к предложениям',
  'Slow inter-ministerial coordination': 'Медленная межведомственная координация',
  'Political disagreement within coalition or majority': 'Политические разногласия внутри коалиции или большинства',
  'Limited legislative drafting capacity': 'Ограниченные возможности для разработки законопроектов',
  'Lack of community or patient-group input': 'Отсутствие вклада сообществ или групп пациентов',
  'Unclear legal compatibility with regional frameworks': 'Неясная правовая совместимость с региональными рамками',
  'No dedicated health committee capacity': 'Отсутствие профильного комитета по здравоохранению',

  'Very useful – I would use it regularly': 'Очень полезно – я бы пользовался этим регулярно',
  'Somewhat useful – I would use it for specific situations': 'Отчасти полезно – я бы использовал в отдельных случаях',
  "Uncertain – it depends on how it's designed": 'Не уверен – зависит от того, как это сделано',
  'Unlikely to be useful in my context': 'Вряд ли будет полезно в моём контексте',
  'I would not use it personally but colleagues might': 'Сам бы не использовал, но коллеги могли бы',
  'General health legislation': 'Общее законодательство в сфере здравоохранения',
  'Lung health-specific legislation': 'Законодательство, специфичное для лёгочного здоровья',
  'Communicable diseases beyond lung health': 'Инфекционные заболевания помимо лёгочных',
  'Non-communicable diseases (NCDs)': 'Неинфекционные заболевания (НИЗ)',
  'Public health and prevention policies': 'Политика общественного здоровья и профилактики',
  'Pharmaceutical regulation and access to medicines': 'Регулирование фармацевтики и доступ к лекарствам',
  'Health workforce and service delivery': 'Медицинские кадры и оказание услуг',
  'Yes – this would be genuinely useful': 'Да – это было бы действительно полезно',
  'Possibly – with the right governance and transparency conditions': 'Возможно – при правильных условиях управления и прозрачности',
  "Uncertain – I'd need to see it in practice": 'Не уверен – нужно увидеть это на практике',
  'Unlikely – I prefer human analysis': 'Маловероятно – предпочитаю анализ человеком',
  'No': 'Нет',
  'Transparency about data sources used': 'Прозрачность используемых источников данных',
  'Human review before any output is relied upon': 'Проверка человеком, прежде чем полагаться на результат',
  'Clear indication of confidence level or uncertainty': 'Чёткое указание уровня уверенности или неопределённости',
  'Institutional endorsement (WHO, regional body, etc.)': 'Институциональное одобрение (ВОЗ, региональный орган и т. д.)',
  'Data held on sovereign or national infrastructure': 'Данные размещены на суверенной или национальной инфраструктуре',
  'User training and onboarding': 'Обучение и адаптация пользователей',
  'A clear audit trail for all outputs': 'Чёткий аудиторский след для всех результатов',

  'Yes – I would use it actively': 'Да – я бы активно пользовался',
  'Possibly – if the security and governance conditions were right': 'Возможно – при подходящих условиях безопасности и управления',
  "I'm uncertain – I'd need more information": 'Я не уверен – нужно больше информации',
  "No – I wouldn't use it": 'Нет – я бы не пользовался',
  'Budget allocation or supplementary budget process': 'Распределение бюджета или процесс дополнительного бюджета',
  'Health law revision or new national health strategy': 'Пересмотр закона о здравоохранении или новая национальная стратегия здоровья',
  'TB or infectious disease program renewal': 'Обновление программы по ТБ или инфекционным заболеваниям',
  'Parliamentary election cycle creating urgency': 'Цикл парламентских выборов, создающий срочность',
  'EU accession or international treaty compliance process': 'Процесс вступления в ЕС или соблюдения международных договоров',
  'Global Fund transition planning': 'Планирование перехода Глобального фонда',
  'No clear window in the near term': 'Чёткого окна в ближайшей перспективе нет',
  "I'm not sure": 'Я не уверен',
  'Very useful – it would directly support timely decision-making': 'Очень полезно – это напрямую поддержит своевременные решения',
  'Somewhat useful – helpful in specific crisis situations': 'Отчасти полезно – помогает в отдельных кризисных ситуациях',
  'Uncertain – depends on how the system is designed and delivered': 'Не уверен – зависит от того, как система устроена и предоставляется',
  'Not very useful – limited relevance to my role or context': 'Не очень полезно – мало релевантно для моей роли или контекста',
  'Not useful at all': 'Совсем не полезно',

  'UN agency or affiliated body (WHO, IOM, UNAIDS, etc.)': 'Агентство ООН или аффилированный орган (ВОЗ, МОМ, ЮНЭЙДС и др.)',
  'Multilateral or bilateral organization': 'Многосторонняя или двусторонняя организация',
  'International philanthropic foundation': 'Международный благотворительный фонд',
  'National foundation or state development fund': 'Национальный фонд или государственный фонд развития',
  'Regional health organization': 'Региональная организация здравоохранения',
  'Academic or research institution with implementation role': 'Академическое или исследовательское учреждение с ролью в реализации',
  'Implementation partner / technical assistance provider': 'Партнёр по реализации / поставщик технической помощи',
  'Civil society organisation/affected community': 'Организация гражданского общества / затронутое сообщество',
  'None of the above': 'Ничего из перечисленного',
  'Very serious – urgent action is needed': 'Очень серьёзно – нужны срочные действия',
  'Serious – action will be needed soon': 'Серьёзно – действия понадобятся скоро',
  'Moderate – should be monitored': 'Умеренно – следует отслеживать',
  'Low – not a priority issue': 'Низко – не приоритетный вопрос',
  'Not relevant in my context': 'Не релевантно в моём контексте',
  'Proof-of-concept pilot in at least one country': 'Пилот-доказательство концепции хотя бы в одной стране',
  'Letters of intent or endorsement from national governments': 'Письма о намерениях или одобрении от национальных правительств',
  'Independent technical review or validation': 'Независимая техническая экспертиза или валидация',
  'Demonstrated parliamentary engagement or uptake': 'Подтверждённое участие или вовлечённость парламента',
  'Clear governance, privacy, and data security standards': 'Чёткие стандарты управления, конфиденциальности и безопасности данных',
  'Evidence of community co-design and civil society engagement': 'Доказательства совместного дизайна с сообществами и вовлечения гражданского общества',
  'Cost-effectiveness or value-for-money analysis': 'Анализ экономической эффективности или соотношения цены и качества',
  'Alignment with existing regional or global frameworks': 'Соответствие существующим региональным или глобальным рамкам',
  'We would support based on current information': 'Мы бы поддержали на основе текущей информации',
  'Yes – and we would be open to integration or interoperability': 'Да – и мы открыты к интеграции или совместимости',
  'Yes – but they are proprietary or restricted': 'Да – но они проприетарные или с ограниченным доступом',
  'We use basic tools but nothing purpose-built for this region': 'Мы используем базовые инструменты, но ничего специально для этого региона',
  'No – we rely on manual reporting': 'Нет – мы полагаемся на ручную отчётность',
  'Yes – we are actively looking for initiatives to support': 'Да – мы активно ищем инициативы для поддержки',
  'Possibly – subject to governance and feasibility review': 'Возможно – при условии анализа управления и осуществимости',
  'Maybe – we would need to see a detailed proposal': 'Возможно – нам нужно было бы увидеть детальное предложение',
  'Unlikely at this stage': 'Маловероятно на данном этапе',
  'Legislative platform / MP Sovereignty Portal': 'Законодательная платформа / Суверенный портал для депутатов',
  'AI-driven bilateral diplomacy and country matching system': 'Двусторонняя дипломатия на основе ИИ и система сопоставления стран',
  'Health security and continuity-of-care crisis intelligence layer': 'Аналитический уровень кризисов для безопасности здоровья и непрерывности помощи',
  'The full integrated platform': 'Полная интегрированная платформа',
  'Uncertain': 'Не уверен',
  'ISO 27001 or equivalent information security standard': 'ISO 27001 или эквивалентный стандарт информационной безопасности',
  'GDPR or equivalent data protection compliance': 'Соответствие GDPR или эквивалентным нормам защиты данных',
  'WHO digital health framework alignment': 'Соответствие концепции цифрового здравоохранения ВОЗ',
  'No individual or identifiable patient data collection': 'Отказ от сбора индивидуальных или идентифицируемых данных пациентов',
  'Independent governance board or oversight body': 'Независимый совет управления или надзорный орган',
  'Annual third-party audit': 'Ежегодный сторонний аудит',
  'Sovereign data hosting in-country or in-region': 'Суверенное размещение данных в стране или регионе',
  'Open-source or auditable codebase': 'Открытый или поддающийся аудиту исходный код',
  'Other – please specify': 'Другое – уточните',

  'Very useful – this is a critical gap': 'Очень полезно – это критический пробел',
  'Useful – this would complement existing systems': 'Полезно – это дополнило бы существующие системы',
  'Uncertain – it depends on how the data is collected and governed': 'Не уверен – зависит от того, как данные собираются и управляются',
  'Of limited use in my context': 'Ограниченно полезно в моём контексте',
  'Well prepared – systems and protocols are in place': 'Хорошо подготовлена – системы и протоколы существуют',
  'Partially prepared – some systems exist but gaps remain': 'Частично подготовлена – некоторые системы есть, но пробелы остаются',
  'Poorly prepared – we would struggle in a major crisis': 'Плохо подготовлена – в крупном кризисе нам было бы трудно',
  'Not prepared – there are no meaningful contingency mechanisms': 'Не подготовлена – значимых механизмов на случай ЧС нет',
  'Yes – formal agreements are in place and functioning': 'Да – формальные соглашения существуют и работают',
  'Partial – informal coordination exists in some cases': 'Частично – в некоторых случаях есть неформальная координация',
  'Very limited – coordination is ad hoc at best': 'Очень ограниченно – координация в лучшем случае разовая',
  'No – no meaningful cross-border mechanism exists': 'Нет – значимого трансграничного механизма не существует',

  'Comparative EECA health legislation database (searchable, multi-country)': 'Сравнительная база законодательства ВЕЦА в сфере здравоохранения (поисковая, многострановая)',
  'AI-assisted amendment drafting and analysis tool for MPs': 'Инструмент с ИИ для разработки и анализа поправок для депутатов',
  'Country matching and bilateral mission recommendation system': 'Система сопоставления стран и рекомендаций по двусторонним миссиям',
  'Continuity-of-care risk alerts for displaced populations': 'Оповещения о рисках непрерывности помощи для перемещённых групп',
  'Emergency legal measure templates for cross-border health crises': 'Шаблоны экстренных правовых мер для трансграничных кризисов здоровья',
  'Civil society feedback integration with legislative drafting': 'Интеграция обратной связи гражданского общества в разработку законов',
  'Real-time medicine supply disruption monitoring': 'Мониторинг перебоев в наличии и поставках лекарственных препаратов в режиме реального времени',

  // ── Audience pages (AudiencePage.tsx) ─────────────────────────────────
  'For policymakers': 'Для политиков',
  'For partners': 'Для партнёров',
  'For donors': 'Для доноров',
  'Act with certainty. See it delivered.': 'Действуйте с уверенностью. Увидьте результат.',
  'A governed platform to build on.': 'Управляемая платформа для развития.',
  'Fund proof, not promises.': 'Финансируйте доказанное, а не обещания.',
  'Move from commitment to enacted, financed policy in weeks – with governed, human-reviewed tools and the backing of a proven regional parliamentary network.':
    'От намерения до принятой и профинансированной политики – за недели, с управляемыми, проверяемыми людьми инструментами и поддержкой проверенной региональной парламентской сети.',
  'Bring your technology, diagnostics, or capital into a proven, standards-based regional health system – with a clearly defined role and measurable impact.':
    'Внедрите свои технологии, диагностику или капитал в проверенную, стандартизированную региональную систему здравоохранения – с чётко определённой ролью и измеримым результатом.',
  'Back a de-risked, phased model that delivers a working result in one country before scaling to nine – with transparent governance and measurable outcomes.':
    'Поддержите поэтапную модель со сниженным риском, которая даёт работающий результат в одной стране, прежде чем масштабироваться на девять – с прозрачным управлением и измеримыми результатами.',
  'Book a consultation': 'Записаться на консультацию',
  'Explore a partnership': 'Обсудить партнёрство',
  'Request the concept note': 'Запросить концепт-ноту',
  'Backed by nine national caucuses – active since 2014.': 'Поддержано девятью национальными парламентскими группами – действуют с 2014 года.',
  'Standards-based, human-reviewed, sovereign by design.': 'Стандартизировано, проверяется людьми, суверенно по своей архитектуре.',
  'Each phase proven before the next is funded.': 'Каждый этап доказан прежде, чем финансируется следующий.',

  'What you get': 'Что вы получаете',
  'What partnership includes': 'Что включает партнёрство',
  'What your funding delivers': 'Что даёт ваше финансирование',
  'A secure, invitation-only MP portal to draft and share laws and amendments':
    'Защищённый портал для депутатов (только по приглашению) для разработки и обмена законами и поправками',
  'AI-assisted drafting & comparative-law intelligence (human-reviewed)':
    'Разработка при помощи ИИ и сравнительно-правовая аналитика (с проверкой человеком)',
  'Decision briefs and budget-impact notes, ready for committee':
    'Аналитические записки и оценки бюджетного эффекта, готовые для комитета',
  'A peer network of nine national caucuses and former-MP advisors':
    'Сеть из девяти национальных парламентских групп и советников – бывших депутатов',
  'Defined integration points across the Engine, Bridge and Shield':
    'Чётко определённые точки интеграции в Engine, Bridge и Shield',
  'Co-financing and partnership frameworks': 'Механизмы совместного финансирования и партнёрства',
  'A live pilot pathway from proof to regional scale': 'Живой пилотный путь от доказательства к региональному масштабу',
  'Association with a trusted parliamentary network': 'Ассоциация с надёжной парламентской сетью',
  'A live, working solution in a first country – the proof unit':
    'Работающее решение в первой стране – единица доказательства',
  'Transparent governance, reporting and independent oversight':
    'Прозрачное управление, отчётность и независимый надзор',
  'A replicable, scalable model for regional health sovereignty':
    'Тиражируемая, масштабируемая модель регионального суверенитета здравоохранения',
  'Full budget and terms – available on request': 'Полный бюджет и условия – предоставляются по запросу',
  'Built around what you need.': 'Создано вокруг ваших потребностей.',

  'Turn your decision into delivered care.': 'Превратите своё решение в оказанную помощь.',
  'Start a confidential conversation about your country.': 'Начните конфиденциальный разговор о вашей стране.',
  'Build with a proven regional platform.': 'Стройте на основе проверенной региональной платформы.',
  "Let's discuss where your organisation fits.": 'Обсудим, где найдётся место вашей организации.',
  'Invest in a working model of health sovereignty.': 'Инвестируйте в работающую модель суверенитета здравоохранения.',
  'See the results before scale – request the concept note.': 'Увидьте результаты до масштабирования – запросите концепт-ноту.',
  'Back to overview': 'Назад к обзору',
  'Read the Concept Note': 'Прочитать концепт-ноту',
  'Open the Concept Note': 'Открыть концепт-ноту',
  'Take the Survey': 'Пройти опрос',

  'patients in scope': 'пациентов в фокусе',
  'national caucuses': 'национальных парламентских групп',
  'network active since': 'сеть действует с',

  // Policymakers body
  'Draft': 'Разработка',
  'Coordinate': 'Согласование',
  'Enact': 'Принятие',
  'Deliver': 'Реализация',
  'AI-assisted, human-reviewed drafting in a secure MP portal.': 'Разработка с ИИ и проверкой человеком в защищённом портале депутата.',
  'Evidence, comparative law and stakeholders aligned.': 'Согласованы доказательная база, сравнительное право и заинтересованные стороны.',
  'Tabled, debated and passed – tracked in the app.': 'Внесено, обсуждено и принято – с отслеживанием в приложении.',
  'Turned into financed, operational care.': 'Превращено в финансируемую, работающую помощь.',
  'Certainty': 'Уверенность',
  'Sovereignty': 'Суверенитет',
  'Low risk': 'Низкий риск',
  'Draft, compare and table legislation faster – AI assistance that is transparent and human-reviewed at every step.':
    'Разрабатывайте, сравнивайте и вносите законопроекты быстрее – ИИ-помощь, прозрачная и проверяемая человеком на каждом шаге.',
  'Own your national health agenda as external funding recedes, on sovereign, in-region infrastructure.':
    'Владейте своей национальной повесткой здравоохранения по мере сокращения внешнего финансирования – на суверенной, региональной инфраструктуре.',
  'People decide, not machines. Full audit trail, no personal exposure, no unproven "AI breakthroughs".':
    'Решают люди, а не машины. Полный аудиторский след, отсутствие персональных рисков, никаких недоказанных «прорывов ИИ».',
  'The lag': 'Разрыв во времени',
  'You have the will. The system has the lag.': 'У вас есть воля. У системы – разрыв во времени.',
  'An average parliamentarian faces a deluge of legislation, and complex health policy stalls between commitment and action – for months, sometimes years. Donors withdraw, systems fragment, patients wait. The Hub closes that gap.':
    'Средний парламентарий сталкивается с потоком законодательных инициатив, и сложная политика здравоохранения застревает между намерением и действием – на месяцы, а иногда и годы. Доноры уходят, системы фрагментируются, пациенты ждут. Хаб закрывает этот разрыв.',
  'Conventional path': 'Обычный путь',
  'Months–years': 'Месяцы–годы',
  'With the Hub': 'С Хабом',
  'Weeks': 'Недели',
  'high-burden countries that raised domestic TB budgets had an active caucus':
    'стран с высоким бременем ТБ, увеличивших внутреннее финансирование, имели действующую парламентскую группу',
  'The execution loop': 'Цикл исполнения',
  'From your decision to delivered care.': 'От вашего решения до оказанной помощи.',
  'Why it matters to you': 'Почему это важно для вас',

  // Partners body
  'Technology, diagnostics or capital': 'Технологии, диагностика или капитал',
  'Innovation, R&D and know-how': 'Инновации, НИОКР и ноу-хау',
  'Distribution and supply-chain reach': 'Охват дистрибуции и цепочек поставок',
  'Access to expanding regional health markets': 'Доступ к растущим региональным рынкам здравоохранения',
  'ESG/SDG-aligned, reportable impact': 'Отчётное воздействие, соответствующее ESG/ЦУР',
  'ISO 27001-grade security': 'Безопасность уровня ISO 27001',
  'GDPR-equivalent protection': 'Защита данных на уровне GDPR',
  'Human-in-the-loop review': 'Проверка с участием человека',
  'Sovereign, in-region hosting': 'Суверенный региональный хостинг',
  'Scope your role': 'Определите свою роль',
  'Integrate': 'Интеграция',
  'Scale': 'Масштабирование',
  'Identify integration points across the Engine, Bridge and Shield.': 'Определите точки интеграции в Engine, Bridge и Shield.',
  'Plug in under governed, standards-based frameworks with human oversight.':
    'Подключайтесь в рамках управляемых, стандартизированных механизмов с человеческим надзором.',
  'Move from a proven pilot to nine-country regional reach.': 'Перейдите от проверенного пилота к региональному охвату девяти стран.',
  'The opportunity': 'Возможность',
  'A region rebuilding its health systems – and it needs you.': 'Регион перестраивает свои системы здравоохранения – и ему нужны вы.',
  'As external funding recedes, Eastern Europe & Central Asia is building self-reliant health infrastructure. Technology, diagnostics and capital with a governed home can lead here – this is shared value, not charity.':
    'По мере сокращения внешнего финансирования Восточная Европа и Центральная Азия строит самодостаточную инфраструктуру здравоохранения. Технологии, диагностика и капитал с управляемым «домом» могут здесь лидировать – это общая ценность, а не благотворительность.',
  'What you bring': 'Что вы приносите',
  'What you gain': 'Что вы получаете',
  'Governed by design': 'Управляемость заложена в архитектуре',
  'Credibility, built in.': 'Доверие встроено изначально.',
  'How you engage': 'Как вы участвуете',
  'Three steps to a defined role.': 'Три шага к чётко определённой роли.',

  // Civil society hero + body
  'For civil society': 'Для гражданского общества',
  'Your evidence, reaching the people who can act on it.': 'Ваши доказательства – доходят до тех, кто может по ним действовать.',
  'The Hub creates a direct link between affected communities and political decision-makers – so community-generated evidence, recommendations and requests reach the politicians who have the mandate and resources to act.':
    'Хаб создаёт прямую связь между пострадавшими сообществами и политическими лицами, принимающими решения – чтобы доказательства, рекомендации и запросы сообществ доходили до депутатов, обладающих полномочиями и ресурсами для действий.',
  'A standing seat on the Civil Society Council – not a one-time submission.': 'Постоянное место в Совете гражданского общества – а не разовое обращение.',
  'What this creates for you': 'Что это даёт вам',
  'A direct channel from community evidence to the MPs who can act on it': 'Прямой канал от доказательств сообщества к депутатам, способным по ним действовать',
  'Your priorities turned into legislative asks – not just recommendations': 'Ваши приоритеты становятся законодательными запросами – а не просто рекомендациями',
  'A seat on the Civil Society Council – standing oversight, not a one-off submission': 'Место в Совете гражданского общества – постоянный надзор, а не разовое обращение',
  'Aggregated, non-identifiable reporting – no individual patient data ever exposed': 'Агрегированная, обезличенная отчётность – индивидуальные данные пациентов никогда не раскрываются',
  'Visible tracking of your input, from submission through to policy or budget outcome': 'Видимое отслеживание вашего обращения – от подачи до политического или бюджетного результата',
  'Turn lived experience into legal and financial commitment.': 'Превратите личный опыт в юридические и финансовые обязательства.',
  "Share what your community needs – we'll make sure it reaches decision-makers who can act on it.":
    'Расскажите, что нужно вашему сообществу – мы позаботимся, чтобы это дошло до тех, кто может действовать.',
  'The implementation gap': 'Разрыв во внедрении',
  'Communities know what is needed. The system does not hear it.': 'Сообщества знают, что нужно. Система их не слышит.',
  'Affected communities generate evidence, recommendations and requests – but too often that knowledge never reaches the politicians who have the mandate and resources to act on it: adopting or amending legislation, shaping policy, or allocating public budgets.':
    'Пострадавшие сообщества собирают доказательства, формируют рекомендации и запросы – но слишком часто эти знания так и не доходят до политиков, обладающих полномочиями и ресурсами для действий: принятия или изменения законов, формирования политики или выделения бюджета.',
  'What often happens': 'Что происходит обычно',
  'Community evidence collected, but goes unheard': 'Доказательства сообщества собраны, но остаются неуслышанными',
  'Recommendations shared informally, with no political owner': 'Рекомендации передаются неформально, без политического ответственного',
  'Requests lost between advocacy and the legislative process': 'Запросы теряются между адвокацией и законодательным процессом',
  'What the Hub ensures': 'Что обеспечивает Хаб',
  'A direct link to the MPs with the mandate to act': 'Прямая связь с депутатами, обладающими полномочиями действовать',
  'Evidence translated into legislative asks': 'Доказательства становятся законодательными запросами',
  'Tracked from submission through to policy or budget outcome': 'Отслеживается от подачи до политического или бюджетного результата',
  'The mechanism': 'Механизм',
  'From lived experience to legal commitment.': 'От личного опыта до юридических обязательств.',
  'Share': 'Подача',
  'Community-generated evidence, recommendations and requests submitted through the Hub.': 'Доказательства, рекомендации и запросы сообщества, поданные через Хаб.',
  'Reach': 'Доставка',
  'Routed directly to the parliamentarians and caucuses with the mandate to act.': 'Направляются напрямую депутатам и парламентским группам, обладающим полномочиями действовать.',
  'Commit': 'Обязательство',
  'Translated into legislative asks – new laws, amendments or policy changes.': 'Превращаются в законодательные запросы – новые законы, поправки или изменения политики.',
  'Fund': 'Финансирование',
  'Backed by budget allocation and tracked through to delivered care.': 'Подкрепляется выделением бюджета и отслеживается вплоть до оказанной помощи.',
  'Beyond a voice': 'Больше, чем просто голос',
  'This is not consultation theatre – it is a mechanism that turns community priorities into political commitments, legal frameworks and concrete financial resources.':
    'Это не имитация консультаций – это механизм, превращающий приоритеты сообщества в политические обязательства, правовые рамки и конкретные финансовые ресурсы.',
  'Protected by design': 'Защита заложена в архитектуре',
  'Aggregated, non-identifiable data only. No individual patient data is ever requested or exposed.':
    'Только агрегированные, обезличенные данные. Индивидуальные данные пациентов никогда не запрашиваются и не раскрываются.',
  'Structured oversight': 'Структурированный надзор',
  'A seat on the Civil Society Council gives your organisation a standing role in governance – not just a one-time submission.':
    'Место в Совете гражданского общества даёт вашей организации постоянную роль в управлении – а не просто разовое обращение.',

  // Donors body
  'Foundation': 'Фундамент',
  'Replication': 'Тиражирование',
  'Regional platform': 'Региональная платформа',
  'Scale & integration': 'Масштаб и интеграция',
  'A working solution, live in one country – the proof unit.': 'Работающее решение, запущенное в одной стране – единица доказательства.',
  'The proven playbook, stamped country by country.': 'Проверенный план действий, тиражируемый по странам.',
  'The full application across the region.': 'Полноценное применение по всему региону.',
  'Nine-country coverage, sustainability, hand-off.': 'Охват девяти стран, устойчивость, передача управления.',
  'vulnerable patients protected': 'уязвимых пациентов под защитой',
  'countries the model can reach': 'стран, которые может охватить модель',
  'human-reviewed, governed decisions': 'решений, проверяемых людьми и управляемых',
  'The moment': 'Момент',
  'Proof matters more than promises.': 'Доказательства важнее обещаний.',
  'Global donors are stepping back just as the need peaks – and funders now reward evidence, not pilots that never scale. The Hub delivers a working result in a single country first, so your capital backs a proven unit, then replicates it.':
    'Глобальные доноры отступают именно тогда, когда потребность достигает пика – и финансирующие организации теперь вознаграждают доказательства, а не пилоты, которые никогда не масштабируются. Хаб сначала даёт работающий результат в одной стране, поэтому ваш капитал поддерживает проверенную единицу, а затем тиражирует её.',
  'Needed 2026–28': 'Требуется на 2026–28',
  'Pledged so far': 'Обещано на сегодня',
  'The de-risked ladder': 'Лестница со сниженным риском',
  'Each rung proven before the next is funded.': 'Каждая ступень доказана прежде, чем финансируется следующая.',
  'A donor never funds a promise – only a repeat of something already working.':
    'Донор никогда не финансирует обещание – только повторение того, что уже работает.',
  'Measured impact': 'Измеренное воздействие',

  // ── Contact page (ContactPage.tsx) ────────────────────────────────────
  'Contact': 'Контакты',
  "Let's talk.": 'Давайте поговорим.',
  "The fastest way to reach us is the consultation form – it routes your message to the right person on our team. Partner and funding discussions are handled in confidence.":
    'Самый быстрый способ связаться с нами – форма консультации: она направит ваше сообщение нужному человеку в команде. Обсуждения партнёрства и финансирования ведутся конфиденциально.',
  'Or email us directly:': 'Или напишите нам напрямую:',
  'Donors': 'Доноры',
  'Funders and foundations.': 'Финансирующие организации и фонды.',
};

export function tr(text: string | undefined | null, lang: Lang): string {
  if (!text) return text ?? '';
  if (lang !== 'ru') return text;
  return M[text] ?? text;
}

function trField(f: FormField, lang: Lang): FormField {
  return {
    ...f,
    label: tr(f.label, lang),
    hint: f.hint ? tr(f.hint, lang) : f.hint,
    placeholder: f.placeholder ? tr(f.placeholder, lang) : f.placeholder,
    options: f.options?.map((o) => ({ ...o, label: tr(o.label, lang), sub: o.sub ? tr(o.sub, lang) : o.sub })),
    fields: f.fields?.map((sub) => trField(sub, lang)),
  };
}

export function localizeStep(step: FormStep, lang: Lang): FormStep {
  if (lang !== 'ru') return step;
  return {
    ...step,
    title: tr(step.title, lang),
    tag: tr(step.tag, lang),
    hint: step.hint ? tr(step.hint, lang) : step.hint,
    fields: step.fields.map((f) => trField(f, lang)),
  };
}

// Localize the dynamic validation messages returned by validateStep().
export function localizeError(msg: string | null, lang: Lang): string | null {
  if (!msg || lang !== 'ru') return msg;
  let m: RegExpMatchArray | null;
  if ((m = msg.match(/^Please answer: (.*)$/))) return `Пожалуйста, ответьте: ${tr(m[1], lang)}`;
  if ((m = msg.match(/^Please complete ranking for: (.*)$/))) return `Пожалуйста, завершите ранжирование: ${tr(m[1], lang)}`;
  if ((m = msg.match(/^Please select at most (\d+) options\.$/))) return `Пожалуйста, выберите не более ${m[1]} вариантов.`;
  if ((m = msg.match(/^Please limit your response to (\d+) words\.$/))) return `Пожалуйста, ограничьте ответ ${m[1]} словами.`;
  if (msg === 'Please select your respondent type to continue.') return 'Пожалуйста, выберите тип респондента, чтобы продолжить.';
  return msg;
}
