// Funder target list — researched 2026-06-09. Internal outreach use only.
// Fit = realistic alignment with the EECA Lung Health Sovereignty Hub.

export type Fit = 'High' | 'Medium' | 'Low';
export type FunderCategory =
  | 'Foundations (KZ/AZ)'
  | 'Corporate & Innovation (KZ/AZ)'
  | 'Big Tech / AI-for-Good'
  | 'International Health & Development';

export type Funder = {
  name: string;
  country: string; // KZ, AZ, Global, EECA, etc.
  type: string;
  focus: string;
  fit: Fit;
  why: string;
  route: string; // program / contact URL
  flag?: string; // caveat
};

export type FunderGroup = { category: FunderCategory; blurb: string; funders: Funder[] };

export const FUNDER_GROUPS: FunderGroup[] = [
  {
    category: 'Foundations (KZ/AZ)',
    blurb: 'National & presidential/first-family foundations and state charity funds — legacy, prestige and health-sovereignty framing.',
    funders: [
      { name: 'Heydar Aliyev Foundation', country: 'AZ', type: 'First-family / presidential foundation', focus: 'Public health · science & education · ICT', fit: 'High', why: 'Azerbaijan’s flagship vehicle; explicitly funds public health AND ICT; convening power matches the parliamentary angle.', route: 'heydar-aliyev-foundation.org — formal partnership letter + concept note' },
      { name: 'Qazaqstan Halqyna', country: 'KZ', type: 'State-initiated national charity (2022)', focus: 'Healthcare · education · social infrastructure', fit: 'High', why: 'Direct health-system modernization mandate; ~$315M allocated; accepts large contributions.', route: 'qazaqstanhalqyna.kz — board of trustees', flag: 'Confirm current domain' },
      { name: 'Halyk Charitable Fund', country: 'KZ', type: 'Corporate foundation (Halyk Bank)', focus: 'Healthcare (esp. children’s) · education', fit: 'High', why: '120+ projects, ₸85bn; health is a stated priority; established grant machinery.', route: 'halykfund.com' },
      { name: 'Samruk-Kazyna Trust', country: 'KZ', type: 'Sovereign-wealth-fund charity arm', focus: 'Social & medical sector · human capital', fit: 'Medium', why: '₸44.6bn budget; funds “social and medical sector”; clean online application (15-day review).', route: 'sk-trust.kz — online project application' },
      { name: 'Science Development Foundation (under President of AZ)', country: 'AZ', type: 'Presidential science grant fund', focus: 'Research grants incl. ICT', fit: 'Medium', why: 'Could fund the evidence/research layer (Bridge) with an academic framing.', route: 'sdf.gov.az — grant competitions' },
      { name: 'NU Impact Foundation (Nazarbayev University)', country: 'KZ', type: 'University endowment / impact fund', focus: 'Healthcare · education · inclusion (SDGs)', fit: 'Medium', why: 'Lower-risk entry to the Nazarbayev cluster; research + human-in-the-loop validation partner.', route: 'fund.nu.edu.kz — partnerships' },
      { name: 'Nazarbayev Fund (cluster)', country: 'KZ', type: 'Former-president-linked foundations', focus: 'Education · science · social', fit: 'Low', why: 'Strong education/science record but politically sensitive post-2022; health/digital less direct.', route: 'nazarbayevfund.kz', flag: 'Site cert issue; OCCRP governance concerns — diligence + co-funder advised' },
      { name: 'Bolashak Corporate Foundation', country: 'KZ', type: 'Scholarship-linked corporate foundation', focus: 'Inclusion · talented youth · education', fit: 'Low', why: 'Education/scholarship focus; ~800 Bolashak alumni in the health sector (network value).', route: 'bolashak.gov.kz' },
    ],
  },
  {
    category: 'Corporate & Innovation (KZ/AZ)',
    blurb: 'Large local corporates with CSR/tech arms and government innovation funds — co-funding, in-kind infra, MedTech/GovTech grants.',
    funders: [
      { name: 'PASHA Holding (CSR)', country: 'AZ', type: 'Private conglomerate CSR', focus: 'Education · healthcare · community', fit: 'High', why: 'Largest private CSR budget in AZ; fintech/tech arms align with the digital build.', route: 'pasha-holding.az — CSR' },
      { name: 'IDDA — Innovation & Digital Development Agency', country: 'AZ', type: 'Govt innovation/digital agency', focus: 'Innovation · digital transformation · startups', fit: 'High', why: 'Best fit for sovereign-tech build; grants + concessional finance; runs AIM innovation centre.', route: 'idda.az/en/innovation' },
      { name: 'Astana Hub', country: 'KZ', type: 'Govt-backed tech park (grants + VC)', focus: 'IT startups incl. MedTech, GovTech', fit: 'High', why: 'Explicit MedTech grant track; Seed Money + accelerator; natural home for the Engine.', route: 'astanahub.com/en/l/gup-grant-programs' },
      { name: 'Azercell (CSR)', country: 'AZ', type: 'Telecom corporate CSR', focus: 'Digital literacy · mobile health clinics', fit: 'Medium', why: 'Both health AND digital CSR; telecom infra useful for the Shield/continuity layer.', route: 'azercell.com — social initiatives' },
      { name: 'Bakcell (CSR)', country: 'AZ', type: 'Telecom corporate CSR', focus: 'Health & wellbeing · connectivity', fit: 'Medium', why: 'National CSR Award (Good Health); funded ventilators/tests in COVID.', route: 'bakcell.com', flag: 'No standing grant portal — direct approach' },
      { name: 'Kaspi.kz (corporate giving)', country: 'KZ', type: 'Fintech philanthropy', focus: 'Relief · special-needs · social', fit: 'Medium', why: 'Huge digital reach; giving via Biz Birgemiz fund.', route: 'kaspi.kz/pay/charity', flag: 'Ad-hoc/relief — no standing grant program' },
      { name: 'Beeline Kazakhstan — Zhyly Zhurek', country: 'KZ', type: 'Telecom corporate foundation (VEON)', focus: 'Digital skills · rural education', fit: 'Medium', why: 'Digital-skills + AI capability (QazCode LLM) relevant to the Engine.', route: 'zhylyzhurek.kz' },
      { name: 'Kcell (CSR)', country: 'KZ', type: 'Telecom corporate CSR', focus: 'Digital entrepreneurship · education · health', fit: 'Medium', why: 'Digital + health themes; UN Global Compact member.', route: 'kcell.kz — sustainability' },
      { name: 'Freedom Shapagat (Freedom Holding)', country: 'KZ', type: 'Corporate foundation', focus: 'Education · AI research', fit: 'Medium', why: 'AI/tech appetite (funded an AI research center) is the hook.', route: 'ecosystem.ffin.kz', flag: 'No standalone grant portal; little health record' },
      { name: 'ERG — social investment', country: 'KZ', type: 'Mining conglomerate CSR', focus: 'Education · regional health response', fit: 'Low', why: 'Large budget but giving tied to regions-of-presence & memoranda, not open grants.', route: 'erg.kz/en/projects/charity' },
      { name: 'SOCAR — social/health investment', country: 'AZ', type: 'State oil company CSR', focus: 'Hospitals/diagnostics · education', fit: 'Low', why: 'Deep pockets + health infra, but CSR decentralized via subsidiaries.', route: 'socar.az — Social Development Dept', flag: 'No central foundation; OCCRP governance concerns' },
      { name: 'QazTech Ventures', country: 'KZ', type: 'State VC fund-of-funds (Baiterek)', focus: 'Venture financing · incubation', fit: 'Low', why: 'Equity/VC not grants; fit only if the Hub spins out a commercial entity.', route: 'baiterek.gov.kz — QazTech Ventures' },
      { name: '4SİM — Center for 4th Industrial Revolution', country: 'AZ', type: 'Govt center (Min. of Economy)', focus: 'Industry 4.0 · startup ecosystem', fit: 'Low', why: 'Convening/ecosystem partner more than a funder.', route: 'Via Ministry of Economy / MoU' },
      { name: 'Eurasian Development Bank — Digital Initiatives Fund', country: 'EECA', type: 'Development bank window', focus: 'Digital projects incl. health & data protection', fit: 'Low', why: 'KZ founding member; a digital-health/data window exists but health portfolio is thin.', route: 'eabr.org' },
    ],
  },
  {
    category: 'Big Tech / AI-for-Good',
    blurb: 'Cash grants, cloud/compute credits and technical partnership. Several US/EU-only — route via a fiscal sponsor or the Global TB Caucus.',
    funders: [
      { name: 'Google.org — Impact Challenge: AI for Government Innovation', country: 'Global', type: 'Corporate foundation grant', focus: 'AI to improve public services / government', fit: 'High', why: 'Health-policy + continuity-of-care is squarely “AI for government”; grants typically $500K–$3M.', route: 'google.org/impact-challenges/ai-government-innovation' },
      { name: 'Google.org — Accelerator: Generative AI', country: 'Global', type: 'Cash + accelerator + Cloud credits + engineers', focus: 'Social-impact GenAI (incl. health)', fit: 'High', why: 'Bundles cash + credits + serious engineering help; non-US eligible.', route: 'impactchallenge.withgoogle.com/genaiaccelerator' },
      { name: 'Patrick J. McGovern Foundation', country: 'Global', type: 'Private foundation (cash)', focus: 'Public-purpose AI · health equity · governance', fit: 'High', why: 'Their thesis (institutions building governed AI) maps almost exactly onto a sovereignty hub.', route: 'mcgovern.org/grants', flag: 'Relationship-driven; no open portal' },
      { name: 'AWS IMAGINE Grant', country: 'Global*', type: 'Cash + AWS credits + technical', focus: 'Health · research · humanitarian', fit: 'High', why: 'Real cash + credits + tech; you keep control of the AWS account (sovereignty-compatible).', route: 'aws.amazon.com/.../aws-imagine-grant-program', flag: 'Country-gated (US/UK/IE/CA/AU/NZ) — needs eligible-country partner' },
      { name: 'Anthropic — Claude for Nonprofits', country: 'Global', type: 'In-kind (up to 75% discount)', focus: 'Nonprofit AI productivity & delivery', fit: 'Medium', why: 'Directly cuts the core AI cost line; international equivalents accepted.', route: 'anthropic.com/news/claude-for-nonprofits' },
      { name: 'Microsoft — AI for Good Lab', country: 'Global', type: 'Azure credits + data-science collaboration', focus: 'Public health · human rights', fit: 'Medium', why: 'Strong thematic + credits/expertise fit; pursue as a direct partnership.', route: 'microsoft.com/research — AI for Good Lab', flag: 'Structured Open Call is WA-state only' },
      { name: 'Microsoft — AI for Health', country: 'Global', type: 'Azure credits + expertise', focus: 'Global health · access to care', fit: 'Medium', why: 'Perfect topical fit (underserved access).', route: 'microsoft.com/research/project/ai-for-health', flag: 'Original 5-yr window lapsed — verify still open' },
      { name: 'Microsoft for Nonprofits', country: 'Global', type: 'In-kind (Azure credits + licenses)', focus: 'Nonprofit IT enablement', fit: 'Medium', why: 'Reliable baseline credits/licenses, internationally available.', route: 'microsoft.com/nonprofits/eligibility' },
      { name: 'Meta — Llama Impact Grants', country: 'Global', type: 'Cash + mentorship', focus: 'Health · education · digital inclusion (on Llama)', fit: 'Medium', why: 'Health focus + global eligibility.', route: 'llama.com/llama-ai-innovation', flag: 'Must build on Llama; recent grants small (~$20K)' },
      { name: 'IBM — Sustainability Accelerator', country: 'Global', type: 'In-kind (watsonx + Cloud + 2-yr mentorship)', focus: 'Cohort themes (health if environment-linked)', fit: 'Medium', why: 'Global, gov/NGO-friendly; needs an environmental-health angle.', route: 'ibm.com/impact/initiatives/ibm-sustainability-accelerator' },
      { name: 'Anthropic — AI for Science', country: 'Global', type: 'Free API credits', focus: 'High-priority scientific research', fit: 'Medium', why: 'Relevant if framed with an epidemiology/research workstream.', route: 'support.claude.com — AI for Science' },
      { name: 'NVIDIA Inception', country: 'Global', type: 'In-kind (compute credits, training)', focus: 'Any AI startup', fit: 'Low', why: 'Generous compute, but startup-entity only — needs a spin-out.', route: 'nvidia.com/en-us/startups' },
      { name: 'OpenAI — People-First AI Fund', country: 'US', type: 'Cash grants', focus: 'AI literacy · health · community research', fit: 'Low', why: 'US-501(c)(3)-only and budget-capped — only via a US partner.', route: 'openai.com/index/people-first-ai-fund', flag: '2025 round closed; watch for international rounds' },
      { name: 'Google for Nonprofits / Ad Grants', country: 'Global', type: 'In-kind ($10K/mo search ads)', focus: 'Outreach / awareness', fit: 'Medium', why: 'Useful for the follow-up/outreach campaign, not the build.', route: 'google.com/nonprofits/eligibility', flag: 'Confirm KZ & AZ eligibility' },
      { name: 'Raspberry Pi Foundation', country: 'Global', type: 'Partner (not a funder)', focus: 'AI/computing education (Experience AI)', fit: 'Low', why: 'Engage as an AI-education/training content partner, not a money source.', route: 'fundraising@raspberrypi.org' },
    ],
  },
  {
    category: 'International Health & Development',
    blurb: 'The institutional backbone — multilaterals, development banks and global-health funders already active in EECA TB/health systems.',
    funders: [
      { name: 'The Global Fund (ATM)', country: 'Global', type: 'Multilateral financing partnership', focus: 'TB + resilient systems for health (incl. digital)', fit: 'High', why: 'Already funds an EECA multi-country TB grant covering KZ + AZ; Digital Health under RSSH; GC8 (2026–28).', route: 'theglobalfund.org — Multicountry RFP / Strategic Initiatives' },
      { name: 'Stop TB Partnership (CFCS)', country: 'Global', type: 'UN-hosted partnership / regrantor', focus: 'TB advocacy · communities · civil society', fit: 'High', why: 'Convenes the Global TB Caucus, a collaboration partner of the Hub; CFCS Round 13 = $19M. Warmest near-term route.', route: 'stoptb.org — funding communities (CFCS)' },
      { name: 'WHO Regional Office for Europe', country: 'EECA', type: 'UN agency (technical + legitimizer)', focus: 'Health systems · TB · digital health', fit: 'High', why: 'Leads TB-Free Central Asia Initiative (Astana 2025); endorsement de-risks every other pitch.', route: 'who.int/europe — TB in EECA' },
      { name: 'Asian Development Bank (ADB)', country: 'KZ', type: 'Development bank', focus: 'Health financing reform · digital health', fit: 'High', why: 'Central & West Asia Health Sector Approach 2025 mirrors the Hub; active in KZ.', route: 'adb.org — Health (KZ resident mission / TA)' },
      { name: 'World Bank', country: 'KZ', type: 'Development bank / multilateral', focus: 'Health system strengthening · financing · HIS', fit: 'High', why: 'Deep KZ health-financing track record (Social Health Insurance Project).', route: 'worldbank.org/en/country/kazakhstan' },
      { name: 'EU — Global Gateway / Team Europe', country: 'EECA', type: 'Regional bloc', focus: 'Digital connectivity · data protection · governance', fit: 'High', why: 'Central Asia digital flagship funds governance, cybersecurity & data protection — frame the Hub’s data governance here.', route: 'international-partnerships.ec.europa.eu — Global Gateway' },
      { name: 'UNDP', country: 'KZ', type: 'UN agency', focus: 'Digital governance · data governance · digital health', fit: 'Medium', why: 'Best multilateral match for the data-/digital-governance component; implementation partner.', route: 'undp.org/kazakhstan' },
      { name: 'Gates Foundation', country: 'Global', type: 'Foundation', focus: 'TB · diagnostics · data for health', fit: 'Medium', why: 'Strong on TB + TB data; needs a clear data/innovation angle (EECA not core geography).', route: 'gatesfoundation.org — Tuberculosis', flag: 'Mostly invited grants' },
      { name: 'EBRD', country: 'KZ', type: 'Development bank', focus: 'Health PPP · digitalisation · cybersecurity', fit: 'Medium', why: 'First Central Asian healthcare PPP (Kokshetau) incl. a digital hospital system.', route: 'ebrd.com — Kazakhstan', flag: 'Investment/PPP finance, not soft grants' },
      { name: 'Bloomberg Philanthropies', country: 'Global', type: 'Foundation', focus: 'Public-health data (Data for Health, CRVS)', fit: 'Medium', why: 'Aligns with the data-governance backbone; frame as data/CRVS.', route: 'bloomberg.org — strengthening health data', flag: 'EECA footprint unconfirmed; TB not a focus' },
      { name: 'Open Society Foundations', country: 'EECA', type: 'Foundation', focus: 'Rights-based public health · Eurasia program', fit: 'Medium', why: 'Values + Eurasia footprint align with the governance/rights framing.', route: 'opensocietyfoundations.org/grants', flag: 'Mostly by invitation post-restructure' },
      { name: 'Islamic Development Bank (IsDB)', country: 'KZ/AZ', type: 'Development bank', focus: 'Member-country infrastructure + some health', fit: 'Medium', why: 'KZ & AZ are priority members; co-finances health with ADB.', route: 'isdb.org', flag: 'KZ/AZ health financing not directly confirmed' },
      { name: 'Wellcome Trust', country: 'Global', type: 'Foundation (research)', focus: 'Infectious disease · digital modelling', fit: 'Low', why: 'Fits only a research/data-science sub-component, not the governance core.', route: 'wellcome.org/grant-funding' },
      { name: 'Unitaid', country: 'Global', type: 'Multilateral (WHO-hosted)', focus: 'TB diagnostics/medicines market-shaping', fit: 'Low', why: 'TB-relevant but product/market focus; EECA eligibility unconfirmed.', route: 'unitaid.org', flag: 'Likely-ineligible geography' },
      { name: 'UNICEF', country: 'KZ', type: 'UN agency', focus: 'Child/maternal health systems · digital public goods', fit: 'Low', why: 'Strong KZ digital-health presence but mandate is child/maternal, not adult TB.', route: 'unicef.org/kazakhstan' },
    ],
  },
];

export const FUNDER_COUNT = FUNDER_GROUPS.reduce((n, g) => n + g.funders.length, 0);
