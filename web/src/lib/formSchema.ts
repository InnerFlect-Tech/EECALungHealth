export type RespondentType = 'A' | 'B' | 'C' | 'D';
export type FormVariant = 'full';
export type FormAnswers = Record<string, unknown>;

export type FieldOption = {
  value: string;
  label: string;
  sub?: string;
  dot?: 'cr' | 'hi' | 'mo' | 'lo' | 'un';
};

export type FormField = {
  id: string;
  type: 'radio' | 'checkbox' | 'select' | 'rank' | 'text' | 'textarea' | 'file' | 'group';
  label: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  options?: FieldOption[];
  maxSelect?: number;
  rankCount?: number;
  maxLength?: number;
  maxWords?: number;
  accept?: string;
  maxSizeMB?: number;
  placeholder?: string;
  fields?: FormField[];
  showWhen?: (answers: FormAnswers) => boolean;
};

export type FormStep = {
  id: string;
  tag: string;
  title: string;
  hint?: string;
  fields: FormField[];
  showWhen?: (answers: FormAnswers, branch: RespondentType | null) => boolean;
};

export const COUNTRIES = [
  'Armenia',
  'Azerbaijan',
  'Georgia',
  'Kazakhstan',
  'Kyrgyzstan',
  'Moldova',
  'Tajikistan',
  'Ukraine',
  'Uzbekistan',
  'Multi-country / Regional',
  'Other',
] as const;

export const ROLES = [
  'Community health worker or patient advocate',
  'Civil society / NGO / advocacy organization',
  'Member of Parliament or parliamentary staff',
  'Government official (Ministry of Health or other)',
  'National TB or lung health program officer',
  'International bilateral/multilateral donor (UN agency, Global Fund, etc.)',
  'Private foundation or philanthropic organization',
  'Academic or research institution',
  'Implementation partner or technical assistance provider',
  'Media or communications',
  'Other',
] as const;

const opt = (value: string, label: string, sub?: string): FieldOption => ({
  value,
  label,
  sub,
});

const urgencyOptions: FieldOption[] = [
  { value: 'critical', label: 'Critical', sub: 'Action is needed now; current systems are failing or at serious risk', dot: 'cr' },
  { value: 'high', label: 'High', sub: 'Significant gaps exist; things could deteriorate quickly', dot: 'hi' },
  { value: 'moderate', label: 'Moderate', sub: 'Gaps exist but the situation is stable for now', dot: 'mo' },
  { value: 'low', label: 'Low', sub: 'Current systems are functioning adequately', dot: 'lo' },
  { value: 'unknown', label: "I don't have enough information to assess", dot: 'un' },
];

const riskOptions: FieldOption[] = [
  opt('supply', 'Disruptions to medicine supply chains or procurement'),
  opt('displacement', 'Population displacement across or within borders'),
  opt('funding', 'Loss of donor funding or funding transition'),
  opt('legislation', 'Weak or inadequate enabling legislation'),
  opt('data', 'Fragmented health data and weak health information systems'),
  opt('political', 'Political instability or government transitions'),
  opt('workforce', 'Shortages of or displacement of the health workforce'),
  opt('transit', 'Interruptions in treatment for patients affected by mobility or displacement'),
  opt('resistance', 'Drug resistance resulting from interrupted or inconsistent treatment'),
  opt('crossborder', 'Lack of cross-border coordination mechanisms'),
  opt('engagement', 'Inadequate community or civil society engagement'),
  opt('other', 'Other (please specify)'),
];

const pillarOptions: FieldOption[] = [
  {
    value: 'legislative',
    label: 'Legislative Platform',
    sub: 'A secure space for MPs to access, draft, compare, and exchange health legislation, amendments, and policy briefs across the region',
  },
  {
    value: 'diplomacy',
    label: 'AI-Driven Diplomacy',
    sub: 'A system that identifies which countries should exchange experience based on budgets, legislation, health outcomes, and political readiness',
  },
  {
    value: 'continuity',
    label: 'Health Security & Continuity of Care',
    sub: 'An intelligence layer that detects system-level risks during displacement, funding transitions, and supply disruptions — and alerts decision-makers before care is interrupted',
  },
];

const mvpFeatureOptions: FieldOption[] = [
  opt('complaw', 'Comparative EECA health legislation database (searchable, multi-country)'),
  opt('draft', 'AI-assisted amendment drafting and analysis tool for MPs'),
  opt('match', 'Country matching and bilateral mission recommendation system'),
  opt('alerts', 'Continuity-of-care risk alerts for displaced populations'),
  opt('emergency', 'Emergency legal measure templates for cross-border health crises'),
  opt('feedback', 'Civil society feedback integration with legislative drafting'),
];

export function resolveBranch(answers: FormAnswers): RespondentType | null {
  const type = answers.q0_type as RespondentType | undefined;
  if (!type) return null;
  if (type === 'D') {
    const nearest = answers.q0d_nearest as RespondentType | undefined;
    return nearest ?? 'A';
  }
  return type;
}

function sharedSteps(): FormStep[] {
  const profileFields: FormField[] = [
    {
      id: 'q1_country',
      type: 'select',
      label: 'Which country or region are you responding from?',
      required: true,
      options: COUNTRIES.map((c) => opt(c, c)),
    },
    {
      id: 'q2_role',
      type: 'select',
      label: 'Which of the following best describes your primary role?',
      required: true,
      options: ROLES.map((r) => opt(r, r)),
    },
  ];

  const steps: FormStep[] = [
    {
      id: 'entry',
      tag: 'Identification',
      title: 'Which perspective are you responding from?',
      hint: 'Your selection determines which questions follow. All tracks include a shared section and targeted questions for your role.',
      fields: [
        {
          id: 'q0_type',
          type: 'radio',
          label: '',
          required: true,
          options: [
            {
              value: 'A',
              label: 'Representative of the community / patient / civil society representative',
              sub: 'Community health workers, patient advocates, NGOs, advocacy organizations',
            },
            {
              value: 'B',
              label: 'Member of Parliament / parliamentary staff / policy-maker',
              sub: 'MPs, parliamentary staff, government officials, policy advisors',
            },
            {
              value: 'C',
              label: 'Institutional partner / donor / foundation / technical partner',
              sub: 'UN agencies, bilateral and multilateral donors, foundations, implementation partners',
            },
            {
              value: 'D',
              label: 'Other (please describe briefly)',
              sub: 'Media, researchers, or others with a relevant perspective',
            },
          ],
        },
        {
          id: 'q0d_nearest',
          type: 'radio',
          label: 'Which track is closest to your perspective?',
          required: true,
          options: [
            opt('A', 'Community / civil society'),
            opt('B', 'Parliament / policy-maker'),
            opt('C', 'Institutional partner / donor'),
          ],
          showWhen: (a) => a.q0_type === 'D',
        },
      ],
    },
    {
      id: 'profile',
      tag: 'Your profile',
      title: 'Country and primary role',
      hint: 'This helps us map responses geographically and by sector. Unlike the perspective you chose in step 1 (which tailors the questions), this is your specific professional role.',
      fields: profileFields,
    },
    {
      id: 'urgency',
      tag: 'Urgency',
      title: 'How urgent is the need for a coordinated regional mechanism to support lung health and continuity of care in your context?',
      fields: [
        { id: 'q3_urgency', type: 'radio', label: '', required: true, options: urgencyOptions },
      ],
    },
    {
      id: 'risks',
      tag: 'Risk landscape',
      title: 'What are the three greatest risks to the continuity of lung health services in your context at present?',
      hint: 'Select up to three risks that are most relevant to your context right now.',
      fields: [
        { id: 'q4_risks', type: 'checkbox', label: '', required: true, maxSelect: 3, options: riskOptions },
        {
          id: 'q4_risks_other',
          type: 'text',
          label: 'Other risk (please specify)',
          showWhen: (a) => arr(a.q4_risks).includes('other'),
        },
      ],
    },
    {
      id: 'priorities',
      tag: 'Priorities',
      title: 'Please rank the three core Hub functions in order of priority for your context (1 = highest)',
      hint: 'Click each pillar in order of priority. Click an already-ranked item to remove its rank.',
      fields: [
        { id: 'q5_pillars', type: 'rank', label: '', required: true, rankCount: 3, options: pillarOptions },
      ],
    },
    {
      id: 'migration',
      tag: 'Migration & continuity',
      title: 'To what extent do population displacement and migration disrupt access to and continuity of lung health care in your context?',
      fields: [
        {
          id: 'q6_migration',
          type: 'radio',
          label: '',
          required: true,
          options: [
            opt('major', 'Major issue', 'Significant numbers of displaced people are losing or interrupting treatment'),
            opt('emerging', 'Emerging issue', 'We are seeing early signs; it is not yet a crisis'),
            opt('limited', 'Moderate issue', 'Displacement exists but is managed reasonably well'),
            opt('not', 'Not a significant issue in our context'),
            opt('unknown', "I don't have enough data/visibility to answer"),
          ],
        },
      ],
    },
    {
      id: 'contribution',
      tag: 'Your contribution',
      title: 'Are you in a position to contribute any of the following to this initiative?',
      hint: 'Select all that apply. This is not a commitment — it helps us understand what is available.',
      fields: [
        {
          id: 'q7_contribute',
          type: 'checkbox',
          label: '',
          options: [
            opt('data', 'Aggregated or de-identified health outcome data'),
            opt('legislation', 'Legislative documents, amendments, or draft laws'),
            opt('briefs', 'Existing policy briefs or research reports'),
            opt('networks', 'Contact networks (MPs, health officials, community leaders)'),
            opt('expertise', 'Institutional expertise for technical advisory input'),
            opt('funding', 'Financial support or co-funding'),
            opt('pilot', 'Pilot country or site access'),
            opt('none', 'None of the above at this stage'),
            opt('more-info', 'I need more information before committing'),
          ],
        },
      ],
    },
  ];

  return steps;
}

function contactStep(): FormStep {
  return {
    id: 'contact',
    tag: 'Follow-up',
    title: 'Would you be willing to be contacted for a follow-up conversation of up to 30 minutes?',
    hint: 'Your contact details will be used only for follow-up related to this initiative, with your explicit permission.',
    fields: [
      {
        id: 'q8_consent',
        type: 'radio',
        label: '',
        required: true,
        options: [
          opt('yes', 'Yes — please contact me'),
          opt('maybe', 'Maybe — I would like to know more first'),
          opt('no', 'No — I prefer to remain anonymous'),
        ],
      },
      {
        id: 'contact_group',
        type: 'group',
        label: 'Please share your name and preferred contact method',
        optional: true,
        showWhen: (a) => ['yes', 'maybe'].includes(str(a.q8_consent)),
        fields: [
          { id: 'q8a_name', type: 'text', label: 'Name', placeholder: 'Your name' },
          { id: 'q8a_email', type: 'text', label: 'Email address', placeholder: 'email@example.com' },
          { id: 'q8a_org', type: 'text', label: 'Organization', placeholder: 'Organization name' },
          { id: 'q8a_lang', type: 'text', label: 'Preferred language for follow-up', placeholder: 'e.g. English, Russian' },
        ],
      },
    ],
  };
}

function branchASteps(): FormStep[] {
  return [
    {
      id: 'a-access',
      tag: 'Community · Access',
      title: 'Where does access to lung health care most commonly break down in your experience or community?',
      showWhen: (_, b) => b === 'A',
      fields: [
        {
          id: 'qa1_access',
          type: 'checkbox',
          label: '',
          required: true,
          options: [
            opt('internal', 'When people move between cities or regions within a country'),
            opt('crossborder', 'When people cross international borders'),
            opt('funding', 'When funding changes and clinics reduce services'),
            opt('medicine', 'When medicine supply is interrupted'),
            opt('docs', 'When documentation (ID, residence permit) is missing or expired'),
            opt('language', 'When language or cultural barriers prevent engagement'),
            opt('workers', 'When healthcare workers are unavailable or displaced'),
            opt('protocols', 'When treatment protocols differ between locations'),
            opt('records', "When health records don't transfer between facilities"),
            opt('other', 'Other (please specify)'),
          ],
        },
      ],
    },
    {
      id: 'a-sensing',
      tag: 'Community · Early warning',
      title: 'Community signals and feedback channels',
      showWhen: (_, b) => b === 'A',
      fields: [
        {
          id: 'qa2_early',
          type: 'radio',
          label: 'In your experience, does your community identify problems with medicine access, treatment interruption, or health service breakdown before official systems do?',
          required: true,
          options: [
            opt('yes', 'Yes — Communities are the first to recognize emerging issues'),
            opt('sometimes', 'Sometimes — it depends on the issue'),
            opt('no', 'No — official systems usually detect problems first'),
            opt('unknown', "We don't have a reliable way to know either way"),
          ],
        },
        {
          id: 'qa3_feedback',
          type: 'radio',
          label: 'Does feedback from patients and communities currently reach lawmakers or health ministry decision-makers in any reliable way?',
          required: true,
          options: [
            opt('yes', 'Yes — there are formal and functioning channels'),
            opt('partial', 'Partially — some channels exist but they are slow or inconsistent'),
            opt('rarely', 'Rarely — feedback reaches decision-makers informally at best'),
            opt('no', 'No — there is no effective channel we are aware of'),
            opt('unknown', "I don't know"),
          ],
        },
      ],
    },
    {
      id: 'a-migration',
      tag: 'Community · Displaced populations',
      title: 'Migrant, refugee, and displaced community access to care',
      showWhen: (_, b) => b === 'A',
      fields: [
        {
          id: 'qa4_migrant',
          type: 'radio',
          label: 'Are people from migrant or displaced communities in your area losing access to TB or lung health treatment as a result of their movement?',
          required: true,
          options: [
            opt('yes-reg', 'Yes — this is happening on a regular basis'),
            opt('yes-cases', 'There are specific cases we are aware of'),
            opt('possibly', 'Possibly — we suspect it but have no confirmed data'),
            opt('no', 'Not that we have observed'),
            opt('na', 'This is not applicable in our context'),
          ],
        },
        {
          id: 'qa5_meds',
          type: 'radio',
          label: 'Are you aware if any affected community experienced interruptions in access to TB or lung health medicines in the past 12 months?',
          required: true,
          options: [
            opt('significant', 'Yes — significant interruptions'),
            opt('minor', 'Yes — minor or temporary interruptions'),
            opt('no', 'No — supply has been consistent'),
            opt('unknown', "I don't have reliable information on this"),
          ],
        },
      ],
    },
    {
      id: 'a-features',
      tag: 'Community · Features',
      title: 'If this Hub were built, which functions would be most useful for communities/organisations like yours?',
      hint: 'Rank in order of usefulness (1 = most useful).',
      showWhen: (_, b) => b === 'A',
      fields: [
        {
          id: 'qa6_features',
          type: 'rank',
          label: '',
          required: true,
          rankCount: 6,
          options: [
            opt('report', 'A channel to report access problems directly to decision-makers'),
            opt('alerts', 'Alerts when medicine supply or service availability changes'),
            opt('rights', 'Information about legal rights and access entitlements'),
            opt('laws', 'Visibility into which laws and policies affect your community'),
            opt('consult', 'A way to be consulted on legislation before it is finalized'),
            opt('options', 'Real-time information about treatment continuity options'),
          ],
        },
        {
          id: 'qa7_support',
          type: 'checkbox',
          label: 'What support would be most useful for civil society organizations to engage effectively?',
          optional: true,
          options: [
            opt('training', 'Training on how to use digital health advocacy tools'),
            opt('legal', 'Legal literacy on TB and lung health policy'),
            opt('documenting', 'Support for documenting and reporting treatment access issues'),
            opt('parliament', 'Guidance on how to engage with parliamentary processes'),
            opt('language', 'Translation and language support'),
            opt('tech', 'Technical support for using the platform'),
            opt('none', 'None — we have sufficient capacity'),
          ],
        },
      ],
    },
    {
      id: 'a-upload',
      tag: 'Community · Documents',
      title: 'Optional document upload',
      hint: "If you have any reports, documented cases, or community assessments (excluding any personally identifiable patient information) that are relevant to this research or could support the rationale for the Hub's future work, please upload them here. PDF, DOCX, XLSX. Max 10MB.",
      showWhen: (_, b) => b === 'A',
      fields: [
        {
          id: 'qa8_upload',
          type: 'file',
          label: 'Upload documents (optional)',
          optional: true,
          accept: '.pdf,.docx,.xlsx',
          maxSizeMB: 10,
        },
      ],
    },
  ];
}

function branchBSteps(): FormStep[] {
  return [
    {
      id: 'b-blockers',
      tag: 'Parliamentary · Bottlenecks',
      title: 'Which of the following currently block or delay health legislation in your parliament or ministry?',
      showWhen: (_, b) => b === 'B',
      fields: [
        {
          id: 'qb1_blockers',
          type: 'checkbox',
          label: '',
          required: true,
          options: [
            opt('evidence', 'Insufficient technical evidence or comparative data'),
            opt('comparative', 'Lack of comparative examples from other EECA countries'),
            opt('budget', 'No budget analysis or fiscal notes attached to proposals'),
            opt('coordination', 'Slow inter-ministerial coordination'),
            opt('political', 'Political disagreement within coalition or majority'),
            opt('capacity', 'Limited legislative drafting capacity'),
            opt('community', 'Lack of community or patient-group input'),
            opt('legal', 'Unclear legal compatibility with regional frameworks'),
            opt('committee', 'No dedicated health committee capacity'),
            opt('other', 'Other (please specify)'),
          ],
        },
      ],
    },
    {
      id: 'b-tools',
      tag: 'Parliamentary · Legislative tools',
      title: 'Comparative law database and AI-assisted policy tools',
      showWhen: (_, b) => b === 'B',
      fields: [
        {
          id: 'qb2_compLaw',
          type: 'radio',
          label: 'Would access to a searchable database of health legislation from across EECA countries be useful for your work?',
          required: true,
          options: [
            opt('very', 'Very useful — I would use it regularly'),
            opt('somewhat', 'Somewhat useful — I would use it for specific situations'),
            opt('uncertain', "Uncertain — it depends on how it's designed"),
            opt('unlikely', 'Unlikely to be useful in my context'),
            opt('colleagues', 'I would not use it personally but colleagues might'),
          ],
        },
        {
          id: 'qb2a_scope',
          type: 'checkbox',
          label: 'Scope of legislation you would need access to',
          showWhen: (a) => !['unlikely'].includes(str(a.qb2_compLaw)),
          options: [
            opt('general', 'General health legislation'),
            opt('lung', 'Lung health-specific legislation'),
            opt('communicable', 'Communicable diseases beyond lung health'),
            opt('ncd', 'Non-communicable diseases (NCDs)'),
            opt('prevention', 'Public health and prevention policies'),
            opt('pharma', 'Pharmaceutical regulation and access to medicines'),
            opt('workforce', 'Health workforce and service delivery'),
            opt('other', 'Other (please specify)'),
          ],
        },
        {
          id: 'qb3_ai',
          type: 'radio',
          label: 'Would you or your team use an AI-assisted tool that analyzes proposed health amendments and compares them to regional standards?',
          required: true,
          options: [
            opt('yes', 'Yes — this would be genuinely useful'),
            opt('possibly', 'Possibly — with the right governance and transparency conditions'),
            opt('uncertain', "Uncertain — I'd need to see it in practice"),
            opt('unlikely', 'Unlikely — I prefer human analysis'),
            opt('no', 'No'),
          ],
        },
        {
          id: 'qb3a_trust',
          type: 'checkbox',
          label: 'What conditions would be required for you to trust and use AI-generated policy analysis?',
          optional: true,
          showWhen: (a) => ['yes', 'possibly'].includes(str(a.qb3_ai)),
          options: [
            opt('transparency', 'Transparency about data sources used'),
            opt('human', 'Human review before any output is relied upon'),
            opt('confidence', 'Clear indication of confidence level or uncertainty'),
            opt('endorse', 'Institutional endorsement (WHO, regional body, etc.)'),
            opt('sovereign', 'Data held on sovereign or national infrastructure'),
            opt('training', 'User training and onboarding'),
            opt('audit', 'A clear audit trail for all outputs'),
            opt('other', 'Other (please specify)'),
          ],
        },
      ],
    },
    {
      id: 'b-portal',
      tag: 'Parliamentary · Portal',
      title: 'Secure MP portal and legislative timing',
      showWhen: (_, b) => b === 'B',
      fields: [
        {
          id: 'qb4_portal',
          type: 'radio',
          label: 'Would you use a secure, invitation-only digital portal designed specifically for parliamentarians?',
          required: true,
          options: [
            opt('yes', 'Yes — I would use it actively'),
            opt('possibly', 'Possibly — if the security and governance conditions were right'),
            opt('uncertain', "I'm uncertain — I'd need more information"),
            opt('no', "No — I wouldn't use it"),
          ],
        },
        {
          id: 'qb5_windows',
          type: 'checkbox',
          label: 'Are there upcoming legislative windows, budget cycles, or political deadlines in the next 12 months?',
          required: true,
          options: [
            opt('budget', 'Budget allocation or supplementary budget process'),
            opt('healthlaw', 'Health law revision or new national health strategy'),
            opt('tbprogram', 'TB or infectious disease program renewal'),
            opt('election', 'Parliamentary election cycle creating urgency'),
            opt('eu', 'EU accession or international treaty compliance process'),
            opt('gf', 'Global Fund transition planning'),
            opt('none', 'No clear window in the near term'),
            opt('unsure', "I'm not sure"),
          ],
        },
      ],
    },
    {
      id: 'b-intelligence',
      tag: 'Parliamentary · Migration intelligence',
      title: 'Health Security & Migration Intelligence',
      showWhen: (_, b) => b === 'B',
      fields: [
        {
          id: 'qb6_intel',
          type: 'radio',
          label: 'How useful would access to a regional early warning system — one that helps identify risks of disruptions in the availability and supply of TB and lung health medicines, as well as other threats to continuity of treatment — be for your work?',
          required: true,
          options: [
            opt('very', 'Very useful — it would directly support timely decision-making'),
            opt('somewhat', 'Somewhat useful — helpful in specific crisis situations'),
            opt('uncertain', 'Uncertain — depends on how the system is designed and delivered'),
            opt('limited', 'Not very useful — limited relevance to my role or context'),
            opt('none', 'Not useful at all'),
          ],
        },
      ],
    },
    {
      id: 'b-design',
      tag: 'Parliamentary · Design priorities',
      title: 'What would make this platform genuinely useful to you?',
      showWhen: (_, b) => b === 'B',
      fields: [
        {
          id: 'qb7_open',
          type: 'textarea',
          label: 'What single thing would make this platform genuinely useful to you — something you would actually open and rely on? (max 100 words)',
          required: true,
          maxWords: 100,
          placeholder: 'Share your honest perspective…',
        },
        {
          id: 'qb8_upload',
          type: 'file',
          label: 'Upload draft legislation, policy briefs, or committee reports (optional). PDF, DOCX. Max 10MB.',
          optional: true,
          accept: '.pdf,.docx',
          maxSizeMB: 10,
        },
      ],
    },
  ];
}

function branchCSteps(): FormStep[] {
  return [
    {
      id: 'c-profile',
      tag: 'Partner · Organization',
      title: 'Organization type',
      showWhen: (_, b) => b === 'C',
      fields: [
        {
          id: 'qc1_org',
          type: 'select',
          label: 'Which best describes your organization?',
          required: true,
          options: [
            opt('un', 'UN agency or affiliated body (WHO, IOM, UNAIDS, etc.)'),
            opt('multilateral', 'Multilateral or bilateral organization'),
            opt('intl-foundation', 'International philanthropic foundation'),
            opt('national-foundation', 'National foundation or state development fund'),
            opt('regional', 'Regional health organization'),
            opt('academic', 'Academic or research institution with implementation role'),
            opt('implementer', 'Implementation partner / technical assistance provider'),
            opt('other', 'Other (please specify)'),
          ],
        },
      ],
    },
    {
      id: 'c-data',
      tag: 'Partner · Funding transition',
      title: 'Funding transition risks',
      showWhen: (_, b) => b === 'C',
      fields: [
        {
          id: 'qc4_funding',
          type: 'radio',
          label: 'How serious are funding gaps for TB and lung health programs in your countries, especially as donor support decreases or ends?',
          required: true,
          options: [
            opt('very', 'Very serious — urgent action is needed'),
            opt('serious', 'Serious — action will be needed soon'),
            opt('moderate', 'Moderate — should be monitored'),
            opt('low', 'Low — not a priority issue'),
            opt('na', 'Not relevant in my context'),
            opt('unknown', "I don't know"),
          ],
        },
      ],
    },
    {
      id: 'c-evidence',
      tag: 'Partner · Evidence & systems',
      title: 'Evidence requirements and existing platforms',
      showWhen: (_, b) => b === 'C',
      fields: [
        {
          id: 'qc5_evidence',
          type: 'checkbox',
          label: 'What key evidence or criteria would your organization look for when assessing a platform like the EECA Hub?',
          required: true,
          options: [
            opt('poc', 'Proof-of-concept pilot in at least one country'),
            opt('govlet', 'Letters of intent or endorsement from national governments'),
            opt('review', 'Independent technical review or validation'),
            opt('parliament', 'Demonstrated parliamentary engagement or uptake'),
            opt('governance', 'Clear governance, privacy, and data security standards'),
            opt('codesign', 'Evidence of community co-design and civil society engagement'),
            opt('vfm', 'Cost-effectiveness or value-for-money analysis'),
            opt('alignment', 'Alignment with existing regional or global frameworks'),
            opt('now', 'We would support based on current information'),
            opt('other', 'Other (please specify)'),
          ],
        },
        {
          id: 'qc6_systems',
          type: 'radio',
          label: 'Does your organization already use dashboards, analytical platforms, or legislative tracking tools relevant to this region?',
          required: true,
          options: [
            opt('yes-open', 'Yes — and we would be open to integration or interoperability'),
            opt('yes-closed', 'Yes — but they are proprietary or restricted'),
            opt('basic', 'We use basic tools but nothing purpose-built for this region'),
            opt('no', 'No — we rely on manual reporting'),
          ],
        },
        {
          id: 'qc6a_desc',
          type: 'textarea',
          label: 'Briefly describe existing digital tools and whether integration would be useful',
          optional: true,
          showWhen: (a) => ['yes-open', 'yes-closed'].includes(str(a.qc6_systems)),
        },
      ],
    },
    {
      id: 'c-pilot',
      tag: 'Partner · Pilot & Development',
      title: 'Support for pilot implementation and early product development',
      showWhen: (_, b) => b === 'C',
      fields: [
        {
          id: 'qc7_pilot',
          type: 'radio',
          label: 'Would your organization be willing to support or co-facilitate a pilot of the Hub in one or more EECA countries?',
          required: true,
          options: [
            opt('yes', 'Yes — we are actively looking for initiatives to support'),
            opt('possibly', 'Possibly — subject to governance and feasibility review'),
            opt('maybe', 'Maybe — we would need to see a detailed proposal'),
            opt('unlikely', 'Unlikely at this stage'),
            opt('no', 'No'),
          ],
        },
        {
          id: 'qc7a_countries',
          type: 'checkbox',
          label: 'Which countries would you prioritize for a pilot?',
          optional: true,
          showWhen: (a) => ['yes', 'possibly'].includes(str(a.qc7_pilot)),
          options: COUNTRIES.map((c) => opt(c, c)),
        },
        {
          id: 'qc8_fundable',
          type: 'radio',
          label: 'From a funding perspective, which Hub component would be easiest to support in the next 12–18 months?',
          required: true,
          options: [
            opt('leg', 'Legislative platform / MP Sovereignty Portal'),
            opt('dip', 'AI-driven bilateral diplomacy and country matching system'),
            opt('sec', 'Health security and continuity-of-care crisis intelligence layer'),
            opt('full', 'The full integrated platform'),
            opt('none', 'None of the above'),
            opt('uncertain', 'Uncertain'),
          ],
        },
      ],
    },
    {
      id: 'c-governance',
      tag: 'Partner · Governance',
      title: 'Governance, privacy and trust requirements',
      showWhen: (_, b) => b === 'C',
      fields: [
        {
          id: 'qc9_governance',
          type: 'checkbox',
          label: 'What rules, safeguards, or trust standards would the Hub need to meet before your organization could engage or support it?',
          required: true,
          options: [
            opt('iso', 'ISO 27001 or equivalent information security standard'),
            opt('gdpr', 'GDPR or equivalent data protection compliance'),
            opt('who', 'WHO digital health framework alignment'),
            opt('noindiv', 'No individual or identifiable patient data collection'),
            opt('board', 'Independent governance board or oversight body'),
            opt('audit', 'Annual third-party audit'),
            opt('sovereign', 'Sovereign data hosting in-country or in-region'),
            opt('opensource', 'Open-source or auditable codebase'),
            opt('other', 'Other — please specify'),
          ],
        },
      ],
    },
  ];
}

function closingSteps(): FormStep[] {
  const mvpField: FormField = {
    id: 'q12_mvp',
    type: 'rank',
    label: 'If the Hub were launching with one core feature in the next 6 months, rank by priority (1 = highest)',
    required: true,
    rankCount: 6,
    options: mvpFeatureOptions,
  };

  const steps: FormStep[] = [
    {
      id: 'intelligence',
      tag: 'Closing · Health security',
      title: 'Continuity-of-care intelligence and crisis readiness',
      fields: [
        {
          id: 'q9_intel',
          type: 'radio',
          label: 'How useful would a regional early warning system be — one that helps identify risks of patients losing access to treatment and alerts decision-makers early?',
          required: true,
          options: [
            opt('very', 'Very useful — this is a critical gap'),
            opt('useful', 'Useful — this would complement existing systems'),
            opt('uncertain', 'Uncertain — it depends on how the data is collected and governed'),
            opt('limited', 'Of limited use in my context'),
            opt('no', 'No'),
          ],
        },
        {
          id: 'q10_crisis',
          type: 'radio',
          label: 'How prepared is the health system in your country or region to maintain TB and lung health services during a major crisis?',
          required: true,
          options: [
            opt('well', 'Well prepared — systems and protocols are in place'),
            opt('partial', 'Partially prepared — some systems exist but gaps remain'),
            opt('poor', 'Poorly prepared — we would struggle in a major crisis'),
            opt('not', 'Not prepared — there are no meaningful contingency mechanisms'),
            opt('unknown', "I don't know"),
          ],
        },
      ],
    },
    {
      id: 'coordination',
      tag: 'Completion · Regional Collaboration & Pilot Priorities',
      title: 'Regional Collaboration and Hub Pilot Priorities',
      fields: [
        {
          id: 'q11_crossborder',
          type: 'radio',
          label: 'Is there currently any functional mechanism for cross-border coordination on TB or lung health continuity between your country and neighbors?',
          required: true,
          options: [
            opt('yes', 'Yes — formal agreements are in place and functioning'),
            opt('partial', 'Partial — informal coordination exists in some cases'),
            opt('limited', 'Very limited — coordination is ad hoc at best'),
            opt('no', 'No — no meaningful cross-border mechanism exists'),
            opt('unknown', "I don't know"),
          ],
        },
        mvpField,
      ],
    },
    contactStep(),
    {
      id: 'open',
      tag: 'Closing · Open response',
      title: 'Is there anything critical we have not asked?',
      hint: 'Optional — max 100 words. Often the most valuable input.',
      fields: [
        {
          id: 'q13_open',
          type: 'textarea',
          label: '',
          optional: true,
          maxWords: 100,
          placeholder: 'Share any additional context, concerns, or priorities…',
        },
      ],
    },
  ];

  return steps;
}

export function getAllSteps(_variant: FormVariant = 'full'): FormStep[] {
  return [
    ...sharedSteps(),
    ...branchASteps(),
    ...branchBSteps(),
    ...branchCSteps(),
    ...closingSteps(),
  ];
}

export function buildStepSequence(answers: FormAnswers): FormStep[] {
  const branch = resolveBranch(answers);
  const all = getAllSteps();

  const sharedIds = new Set(sharedSteps().map((s) => s.id));
  const branchPrefix = ['a-', 'b-', 'c-'];

  return all.filter((step) => {
    if (sharedIds.has(step.id)) return true;
    if (step.showWhen) return step.showWhen(answers, branch);
    if (branchPrefix.some((p) => step.id.startsWith(p))) return false;
    return true;
  });
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function rankArr(v: unknown): string[] {
  return arr(v);
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function visibleFields(step: FormStep, answers: FormAnswers): FormField[] {
  const out: FormField[] = [];
  for (const field of step.fields) {
    if (field.showWhen && !field.showWhen(answers)) continue;
    if (field.type === 'group' && field.fields) {
      out.push({ ...field, fields: field.fields.filter((f) => !f.showWhen || f.showWhen(answers)) });
    } else {
      out.push(field);
    }
  }
  return out;
}

export function validateStep(step: FormStep, answers: FormAnswers): string | null {
  const fields = visibleFields(step, answers);

  for (const field of fields) {
    if (field.type === 'group' && field.fields) {
      continue;
    }

    const val = answers[field.id];

    if (field.required) {
      if (field.type === 'checkbox') {
        if (!arr(val).length) return `Please answer: ${field.label || step.title}`;
      } else if (field.type === 'rank') {
        const ranked = rankArr(val);
        if (ranked.length < (field.rankCount ?? 3)) return `Please complete ranking for: ${step.title}`;
      } else if (field.type === 'file') {
        // optional file fields skip
      } else if (!str(val).trim()) {
        return `Please answer: ${field.label || step.title}`;
      }
    }

    if (field.type === 'textarea' && field.maxWords && str(val)) {
      if (wordCount(str(val)) > field.maxWords) {
        return `Please limit your response to ${field.maxWords} words.`;
      }
    }

    if (field.type === 'checkbox' && field.maxSelect && arr(val).length > field.maxSelect) {
      return `Please select at most ${field.maxSelect} options.`;
    }
  }

  if (step.id === 'entry' && !answers.q0_type) {
    return 'Please select your respondent type to continue.';
  }

  return null;
}

export const STEP_LABELS: Record<string, string> = {
  entry: 'Your perspective',
  profile: 'Country & role',
  urgency: 'Urgency',
  risks: 'Key risks',
  priorities: 'Pillar priorities',
  migration: 'Migration & continuity',
  contribution: 'Your contribution',
  contact: 'Follow-up',
  'a-access': 'Access breakdown',
  'a-sensing': 'Early warning',
  'a-migration': 'Displaced populations',
  'a-features': 'Community features',
  'a-upload': 'Documents',
  'b-blockers': 'Legislative bottlenecks',
  'b-tools': 'Digital tools',
  'b-portal': 'MP portal',
  'b-intelligence': 'Migration intelligence',
  'b-design': 'Design priorities',
  'c-profile': 'Org profile',
  'c-data': 'Funding transition',
  'c-evidence': 'Evidence & systems',
  'c-pilot': 'Pilot & funding',
  'c-governance': 'Governance standards',
  intelligence: 'Health security',
  coordination: 'Cross-border & MVP',
  open: 'Open response',
};

export function labelForOption(fieldId: string, value: string, variant: FormVariant): string {
  const all = getAllSteps(variant);
  for (const step of all) {
    for (const field of step.fields) {
      if (field.id === fieldId && field.options) {
        const match = field.options.find((o) => o.value === value);
        if (match) return match.label;
      }
      if (field.fields) {
        for (const sub of field.fields) {
          if (sub.id === fieldId && sub.options) {
            const match = sub.options.find((o) => o.value === value);
            if (match) return match.label;
          }
        }
      }
    }
  }
  return value;
}
