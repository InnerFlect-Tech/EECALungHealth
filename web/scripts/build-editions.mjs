// Generates the two derived editions of the concept note from the live body.
//
//   public/concept-note-body.html        the clean, ready-to-use note (hand-edited)
//   public/concept-note-body-full.html   + proposed additions, marked red
//   public/concept-note-body-diff.html   the same clean note, with everything
//                                        that differs from the source doc marked red
//
// Both derived files are generated rather than maintained by hand, so they can
// never silently drift from the live note. Every replacement below asserts on
// its match, so an edit to the live body that breaks an anchor fails loudly
// instead of quietly dropping a marker.
//
// Usage: node scripts/build-editions.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFileSync(join(root, 'public', name), 'utf8');
const write = (name, body) => {
  writeFileSync(join(root, 'public', name), body);
  console.log(`Wrote public/${name}`);
};

const live = read('concept-note-body.html');

/** Applies [find, replace] pairs, requiring exactly one match for each. */
function apply(html, pairs, label) {
  for (const [find, replace] of pairs) {
    const n = html.split(find).length - 1;
    if (n !== 1) {
      console.error(`build-editions (${label}): expected 1 match, found ${n}, for:\n  ${find.slice(0, 90)}`);
      process.exit(1);
    }
    html = html.replace(find, replace);
  }
  return html;
}

function insertAfterCoverMeta(html, block) {
  const end = html.indexOf('</p>', html.indexOf('class="cn-doc-meta"')) + '</p>'.length;
  if (end < 4) {
    console.error('build-editions: could not find the cover meta line');
    process.exit(1);
  }
  return html.slice(0, end) + '\n' + block + html.slice(end);
}

// ---------------------------------------------------------------------------
// Edition 2 — proposed additions, marked red
// ---------------------------------------------------------------------------

const REVIEW_LEGEND = `
          <div class="cn-legend">
            <p><strong>Review edition.</strong> This is the current concept note plus a set of <span class="cn-legend-key">proposed additions</span>, each marked in red. Everything in black is exactly the document as it stands today.</p>
            <p>Each red block opens with a short note saying what it is and why it is suggested. Nothing here has been added to the live document — this edition exists so the team can decide, section by section, what should go in.</p>
          </div>
`;

const PROPOSED_SECTIONS = `
          <div class="cn-diff-block">
          <p class="cn-suggestion">Suggested addition. The note explains what the Hub is and why it is worth funding, but never says when anything actually lands — the only timing anywhere in the document is the single "within 6 months (Phase 1)" line in the conclusion. This section makes the phasing explicit, which is what a funder needs in order to understand what a first tranche buys and what the next one depends on. It is in no version of the concept note doc, and the phase timings in particular need the team's sign-off before this goes to anyone outside.</p>
          <h4 class="cn-page-break">4. MECHANICS OF PROJECT IMPLEMENTATION (PHASED, 2-YEAR PROGRAMME)</h4>
          <div class="cn-section">
          <p>The programme is implemented in phases. Each phase is independently fundable, delivers a working result on its own, and the foundation unit is designed to replicate country-by-country – a donor never funds a promise, only a repeat of something already proven.</p>

          <div class="cn-timeline">
            <div class="cn-timeline-phase">
              <span class="cn-timeline-when">Months 1–6</span>
              <strong>Phase 1 · Foundation</strong>
              <span>One EECA country</span>
            </div>
            <div class="cn-timeline-phase">
              <span class="cn-timeline-when">Months 7–12</span>
              <strong>Phase 1R · Replication</strong>
              <span>Country by country</span>
            </div>
            <div class="cn-timeline-phase">
              <span class="cn-timeline-when">Months 13–18</span>
              <strong>Phase 2 · Regional Platform</strong>
              <span>Multi-country build-out</span>
            </div>
            <div class="cn-timeline-phase">
              <span class="cn-timeline-when">Months 19–24</span>
              <strong>Phase 3 · Scale &amp; Integration</strong>
              <span>Nine-country coverage</span>
            </div>
          </div>
          </div>

          <p><strong>Phase 1 – Foundation: One EECA Country (Months 1–6)</strong><br>
          Objective: a working solution, live, after 6 months, in one country. The lead partner country is selected from the nine active national TB caucuses on criteria including caucus readiness, political momentum, and donor fit. Delivered at Month 6: lean governance established; a Legislative Ask Map (the exact regulatory changes needed in the lead country, validated with MPs and communities); the Hub App core on sovereign infrastructure (roles/authentication, country profile, stakeholder directory, caucus workspace); a screening-intelligence dashboard with a national-reporting interoperability pilot; and a caucus legislative workplan running in the App – the proof unit.</p>

          <p><strong>Phase 1R – Country Replication (Months 7–12)</strong><br>
          The identical playbook stamped into additional caucus countries, each producing its own Legislative Ask Map, dashboard and caucus workplan within 6 months. Replications run in parallel.</p>

          <p><strong>Phase 2 – Regional Platform Build-Out (Months 13–18)</strong><br>
          Full Sovereignty App: Secure MP Portal, Comparative-Law Intelligence (multi-country EECA database), AI-assisted drafting &amp; amendment analysis with mandatory human review; EN/RU multilingual rollout; hardened security posture (ISO 27001-grade, sovereign hosting); first Regional Parliamentary Summit on the platform; Decision Briefs and budget/policy intelligence production.</p>

          <p><strong>Phase 3 – Scale &amp; Integration (Months 19–24)</strong><br>
          Onboard the remaining caucus countries (full nine-country coverage); full Bridge (country-matching analytics, evidence-based missions, accountability frameworks); full Shield (signal-based early warning, continuity-of-care mapping, supply &amp; last-mile visibility dashboard; private-sector integration); comprehensive evaluation, sustainability &amp; domestic-financing strategy, long-term institutionalization.</p>

          <p>The components in §2.3 (Engine · Bridge · Shield) are the <em>what</em>; the phases are the <em>when and how much</em>: the Engine's core ships in Phase 1 and completes in Phase 2; the Shield's intelligence layer seeds in Phase 1 and completes in Phase 3; the Bridge operates from Phase 2 and completes in Phase 3.</p>
          </div>

          <div class="cn-diff-block">
          <p class="cn-suggestion">Suggested addition. The document already names the headline total and offers the line-item detail on request; this section adds the reasoning in between – how the money is staged phase by phase, and what Phase 1 actually covers – which is what a funder needs in order to judge the first tranche. The chart shows proportions only, no figures. One item to settle before this is used: the doc's total was calculated with a Phase 1 of USD 70,000, and the team has since raised that ask to USD 100,000, so the precise total needs re-deriving.</p>
          <h4 class="cn-page-break">5. BUDGET STRUCTURE (PHASED · 24 MONTHS)</h4>
          <p>The programme is funded phase by phase. Phase 1 is a self-contained Foundation stage in one EECA country that delivers a fully working solution after 6 months; every later phase scales a proven unit. Phase 1R replicates the identical playbook country by country. Phase 2 builds out the regional platform. Phase 3 delivers nine-country coverage, full Bridge and Shield, and long-term institutionalization.</p>
          <p>Phase 1 carries only three lines – core team, development of the solution, and a small buffer. Communications, legal/administrative work and coordination are performed by the core team within their engagement. Staff, training, multi-country rollout and maintenance for later phases are contained within the Phase 2 and Phase 3 allocations.</p>
          </div>
<!--budget-chart-->
          <div class="cn-diff-block">
          <p><strong>Full phased budget, Phase 1 line-item detail, and terms are available on request.</strong> Please <a href="/contact">contact us</a> or start a <a href="/consultation">consultation</a> to receive the detailed budget package.</p>
          </div>

`;

const CONCLUSION_LEAD = `          <p class="cn-diff">The EECA Lung Health Hub is a focused 24-month investment to close a critical gap: turning political decisions into real delivery of care – fast – entered through a 6-month Foundation Phase in one EECA country that delivers a working solution before any further funding is asked. <em>(Suggested opening line, to tie the conclusion back to the phased sections above. Only makes sense if those are kept.)</em></p>
`;

const REFERENCES = `
          <div class="cn-diff-block">
          <h4 class="cn-references">REFERENCES</h4>
          <p class="cn-suggestion">Suggested addition. The note makes hard factual claims – 85% of the regional TB burden, 99% of MDR-TB, roughly 300,000 patients, donor withdrawal from 2025 – and currently cites nothing for any of them. All six entries below were checked against the live sources. Two corrections were made in the process: the Impakter piece published on 27 November 2025, not the 26th, and the WHO digital health strategy now runs to 2027, extended by World Health Assembly resolution WHA78(22) in May 2025. One open item: the WHO Global Tuberculosis Report 2025 was published on 12 November 2025, so the 2024 edition cited here is one cycle behind – worth re-checking the 18 / 85% / 99% figures against the newer edition before switching the citation.</p>
          <ol>
            <li>Human Rights Watch. Donor Nation Cuts to Global Health Financing Affect Millions. January 22, 2026. <a href="https://www.hrw.org/news/2026/01/22/donor-nation-cuts-to-global-health-financing-affect-millions" target="_blank" rel="noopener">hrw.org</a></li>
            <li>Impakter. Individual American Donors Are Shifting to Domestic Needs: Implications for Philanthropy. November 27, 2025. <a href="https://impakter.com/individual-american-donors-are-shifting-to-domestic-needs-implications-for-philanthropy/" target="_blank" rel="noopener">impakter.com</a></li>
            <li>World Health Organization. Global Tuberculosis Report 2024. October 29, 2024. <a href="https://www.who.int/teams/global-programme-on-tuberculosis-and-lung-health/tb-reports/global-tuberculosis-report-2024" target="_blank" rel="noopener">who.int</a></li>
            <li>Global TB Caucus. <a href="https://www.globaltbcaucus.org/" target="_blank" rel="noopener">globaltbcaucus.org</a></li>
            <li>World Health Organization. Global strategy on digital health 2020–2027. <a href="https://www.who.int/publications/i/item/9789240116870" target="_blank" rel="noopener">who.int</a></li>
            <li>Gavi, the Vaccine Alliance. Gavi's Strategy for 2026–2030 (Gavi 6.0). <a href="https://www.gavi.org/our-alliance/strategy/gavi-6-0" target="_blank" rel="noopener">gavi.org</a></li>
          </ol>
          </div>
`;

let review = insertAfterCoverMeta(live, REVIEW_LEGEND);
review = apply(review, [
  ['          <h4 class="cn-page-break">4. CONCLUSION:', PROPOSED_SECTIONS + '          <h4 class="cn-page-break">4. CONCLUSION:'],
  ['<h4 class="cn-page-break">4. CONCLUSION:', '<h4 class="cn-page-break"><span class="cn-diff">6.</span> CONCLUSION:'],
], 'review');
const headingEnd = review.indexOf('</h4>', review.indexOf('CONCLUSION:')) + '</h4>\n'.length;
review = review.slice(0, headingEnd) + CONCLUSION_LEAD + review.slice(headingEnd);
write('concept-note-body-full.html', review.trimEnd() + '\n' + REFERENCES);

// ---------------------------------------------------------------------------
// Edition 3 — same clean note, with every departure from the source doc marked
// ---------------------------------------------------------------------------

const DIFF_LEGEND = `
          <div class="cn-legend">
            <p><strong>Comparison edition.</strong> Same document as the clean version — nothing added, nothing removed. Everything marked in <span class="cn-legend-key">red</span> is where it departs from the source concept note doc (<em>170826_EECA_LH_Sovereignty_Hub__12_m</em>), with the doc's own wording given in brackets. Black text is the doc's wording.</p>
            <p><strong>New since the last review:</strong> every description of the relationship with the Global TB Caucus has been reworded from "built on / benefits from / draws directly from" to collaboration. This is a deliberate departure from the doc, requested by Alesia so that external readers do not read the Hub as a GTBC-owned initiative. The affected passages are marked below.</p>
            <p>Not marked individually: the doc's typos and broken sentences are silently repaired throughout — "a strategic and locally-led <em>d</em> response", an executive-summary paragraph ending in a comma, the verbless sentence in 1.3, the broken construction in 1.4, and "from early 2025 onward<em>..</em>This".</p>
          </div>
`;

const note = (text) => `<span class="cn-diff"> [${text}]</span>`;

let diff = insertAfterCoverMeta(live, DIFF_LEGEND);
diff = apply(diff, [
  // Cover
  ['<p class="subtitle">From Decision to Delivery',
   `<p class="cn-diff">[The cover framing — "Detailed Investment Proposal", the lead sentence, the date and contact line — is not in the doc, whose title is "Concept Note / Regional Lung Health Hub in EECA Countries".]</p>\n          <p class="subtitle">From Decision to Delivery`],

  // In Brief — in neither language version of the doc
  ['<div class="cn-section">\n          <h4>IN BRIEF:',
   '<p class="cn-diff">[The In Brief section below is in no version of the doc.]</p>\n          <div class="cn-section cn-diff-block">\n          <h4>IN BRIEF:'],

  // Executive summary
  ['<h4>EXECUTIVE SUMMARY: A CATALYTIC TWO-YEAR PROGRAMME</h4>',
   `<h4>EXECUTIVE SUMMARY:<span class="cn-diff"> A CATALYTIC TWO-YEAR PROGRAMME</span></h4>${note('the doc has no tagline here')}`],
  ['a USD 100,000, 6-month Foundation Phase in one EECA country',
   `<span class="cn-diff">a USD 100,000, 6-month Foundation Phase in one EECA country</span>${note('doc: "a USD 70,000, 6-month Foundation Phase in Kazakhstan" — the $70,000 was superseded when the team raised the Phase 1 ask')}`],
  ['to a total programme value of USD 1.2 million. Full phased budget and terms are available on request.',
   `<span class="cn-diff">to a total programme value of USD 1.2 million. Full phased budget and terms are available on request.</span>${note('doc: "to a total programme value of USD 1,210,000, with further details provided in subsequent sections" — no section of the doc provides them')}`],
  ['to end tuberculosis, active in the EECA region since 2014.',
   `to end tuberculosis, active in the EECA region since <span class="cn-diff">2014</span>${note('doc: 2014-2016')}.`],

  // Section 2
  ['within a $1.2 million budget over 2 years.',
   `within a <span class="cn-diff">$1.2 million</span>${note('doc: $1,200,000')} budget over 2 years.`],
  ['engaged in the EECA region since 2014, cultivating',
   `engaged in the EECA region since <span class="cn-diff">2014</span>${note('doc: 2014-2016')}, cultivating`],
  ['allocation of the $1.2 million budget directly',
   `allocation of the <span class="cn-diff">$1.2 million</span>${note('doc: $1,210,000')} budget directly`],
  ['Governance rests on four operating bodies, coordinated by a <strong>Regional Steering Committee</strong> of Parliamentary Council, Civil Society Council, and regional technical-expert representatives, which sets strategic direction and ensures alignment with regional priorities:',
   `<span class="cn-diff">Governance rests on four operating bodies, coordinated by a <strong>Regional Steering Committee</strong> of Parliamentary Council, Civil Society Council, and regional technical-expert representatives, which sets strategic direction and ensures alignment with regional priorities:</span>${note('rewritten. Doc: "Regional Steering Committee: Composed of representatives from the Parliamentary Council, Civil Society Council, and key technical experts from the region. This committee will provide strategic direction, oversight, and ensure alignment with regional priorities." In the doc this sits above a bulleted list of the four bodies; presenting it as one more bullet is what made it read as a fifth branch. The four bodies below are set as cards; their wording is the doc\'s')}`],

  // Section 2.3
  ['<h5>Component 1: The Engine (AI-Powered Legislative Platform)</h5>',
   `<h5>Component 1: The Engine (AI-Powered Legislative Platform)</h5>\n            <p class="cn-suggestion">The doc reads "The Engine —  App (AI-Powered Legislative Platform)" — a word is missing after the dash. The doc also sets all three components in a four-column table; at page width that produced rows a full page tall, so the same content is set as blocks.</p>`],
  ['<p>Together these present the Hub as a single, integrated system',
   `<p><span class="cn-diff">Together these</span>${note('doc: "The table above"')} present the Hub as a single, integrated system`],

  // Global TB Caucus relationship — reworded to collaboration (Alesia's request)
  ['Crucially, the Hub is developed in collaboration with the <strong>Global TB Caucus</strong>,',
   `<span class="cn-diff">Crucially, the Hub is developed in collaboration with the <strong>Global TB Caucus</strong></span>${note('doc: "the Hub is building on a solid and proven foundation – it builds upon the established, high-impact infrastructure and deep relationships of the Global TB Caucus"')},`],
  ['offers exceptional regional reach for rapid, sustainable impact.',
   `<span class="cn-diff">offers exceptional regional reach</span>${note('doc: "provides an unparalleled foundation"')} for rapid, sustainable impact.`],
  ['<strong>2.1. Collaboration with the Global TB Caucus Network</strong>',
   `<strong>2.1. <span class="cn-diff">Collaboration with</span> the Global TB Caucus Network</strong>${note('doc: "2.1. Building on Established Foundations: The Global TB Caucus Network"')}`],
  ['the Hub works in collaboration with the Global TB Caucus.',
   `the Hub <span class="cn-diff">works in collaboration with</span>${note('doc: "benefits from the pre-existing, robust infrastructure of"')} the Global TB Caucus.`],
  ['The Hub collaborates with nine active national TB caucuses in Armenia,',
   `<span class="cn-diff">The Hub collaborates with</span>${note('doc: "The Hub will directly integrate and amplify the work of"')} nine active national TB caucuses in Armenia,`],
  ['while collaborating closely with the Global TB Caucus network.',
   `<span class="cn-diff">while collaborating closely with</span>${note('doc: "while remaining strategically connected to the broader"')} the Global TB Caucus network.`],
  ['Formed with representatives from the nine national TB caucuses (Armenia,',
   `<span class="cn-diff">Formed with representatives from</span>${note('doc: "Drawing directly from the nine active national Global TB Caucuses"')} the nine national TB caucuses (Armenia,`],
  ['while collaborating with the Global TB Caucus and its regional network.',
   `<span class="cn-diff">while collaborating with the Global TB Caucus and its regional network</span>${note('doc: "while benefiting from the global expertise and network of the Global TB Caucus"')}.`],
  ['<p>Working in collaboration with the Global TB Caucus network and by linking budget data,',
   `<p><span class="cn-diff">Working in collaboration with</span>${note('doc: "Building on"')} the Global TB Caucus network and by linking budget data,`],

  // Section 3
  ['<p>This $1.2 million programme establishes',
   `<p>This <span class="cn-diff">$1.2 million</span>${note('doc: $1,210,000')} programme establishes`],

  // Conclusion
  ['a national screening-intelligence dashboard connected to national reporting',
   `a <span class="cn-diff">national</span>${note('doc: "Kazakhstan"; the Russian doc adds "as pilot country; another country may be selected if needed"')} screening-intelligence dashboard connected to national reporting`],
], 'diff');

// The stat row and the missing loop graphic are presentation notes rather than
// wording changes, so they sit as short annotations where they apply.
diff = apply(diff, [
  ['<div class="cn-stats-row">',
   '<p class="cn-suggestion">The three figures below are the doc\'s own, lifted out of the paragraph above as a graphic.</p>\n          <div class="cn-stats-row">'],
], 'diff-notes');

write('concept-note-body-diff.html', diff);

// ---------------------------------------------------------------------------
// Russian editions — the clean one is hand-edited from the Russian doc; this
// derives the comparison edition from it, the same way as for English.
// ---------------------------------------------------------------------------

const RU_DIFF_LEGEND = `
          <div class="cn-legend">
            <p><strong>Сравнительная версия.</strong> Тот же документ, что и чистая версия, — ничего не добавлено и не удалено. Всё, что выделено <span class="cn-legend-key">красным</span>, отличается от исходной концептуальной записки (<em>RUS 170826_EECA_LH_Sovereignty_Hub__12_m</em>); формулировка исходного документа приведена в скобках. Чёрный текст — формулировки исходного документа.</p>
            <p>Отдельно не отмечено: опечатки и незавершённые предложения исходного документа исправлены по всему тексту — «безопасности <em>о</em> сфере здоровья лёгких» в подзаголовке, предложение без сказуемого в разделе 1.3, оборванная конструкция в 1.4, «здоровью <em>лешких</em>» в заголовке 2.3 и сноска-цифра после «18 приоритетных стран».</p>
          </div>
`;

const ruNote = (text) => `<span class="cn-diff"> [${text}]</span>`;

let ruLive;
try {
  ruLive = read('concept-note-body-ru.html');
} catch {
  console.log('Skipping RU editions — public/concept-note-body-ru.html not present.');
  process.exit(0);
}

let ruDiff = insertAfterCoverMeta(ruLive, RU_DIFF_LEGEND);
ruDiff = apply(ruDiff, [
  // Cover
  ['<p class="subtitle">От решения к результату',
   `<p class="cn-diff">[Оформление обложки — «Подробное инвестиционное предложение», вводная фраза, дата и контакт — отсутствует в исходном документе, озаглавленном «Концептуальная записка / Региональный хаб по здоровью лёгких в странах ВЕЦА».]</p>\n          <p class="subtitle">От решения к результату`],

  // In Brief — in neither language version of the doc
  ['<div class="cn-section">\n          <h4>КРАТКО:',
   '<p class="cn-diff">[Раздела «Кратко» ниже нет ни в одной версии исходного документа.]</p>\n          <div class="cn-section cn-diff-block">\n          <h4>КРАТКО:'],

  // Executive summary
  ['<h4>КРАТКОЕ РЕЗЮМЕ: КАТАЛИТИЧЕСКАЯ ДВУХЛЕТНЯЯ ПРОГРАММА</h4>',
   `<h4>КРАТКОЕ РЕЗЮМЕ:<span class="cn-diff"> КАТАЛИТИЧЕСКАЯ ДВУХЛЕТНЯЯ ПРОГРАММА</span></h4>${ruNote('в исходном документе подзаголовка нет')}`],
  ['Фаза основания стоимостью 100 000 долларов США продолжительностью 6 месяцев в одной из стран ВЕЦА',
   `<span class="cn-diff">Фаза основания стоимостью 100 000 долларов США продолжительностью 6 месяцев в одной из стран ВЕЦА</span>${ruNote('в документе: «Фаза основания стоимостью 70 000 долларов США … в Казахстане» — сумма 70 000 устарела после того, как команда повысила запрос по Фазе 1')}`],
  ['до общей стоимости программы 1,2 млн долларов США. Полный поэтапный бюджет и условия предоставляются по запросу.',
   `<span class="cn-diff">до общей стоимости программы 1,2 млн долларов США. Полный поэтапный бюджет и условия предоставляются по запросу.</span>${ruNote('в документе: «до общей стоимости программы 1 210 000 долларов США (подробности приведены в последующих разделах)» — таких разделов в документе нет')}`],
  ['которая с 2014 года работает в регионе ВЕЦА',
   `которая с <span class="cn-diff">2014 года</span>${ruNote('в документе: 2014–2016 годов')} работает в регионе ВЕЦА`],

  // Section 2
  ['в рамках бюджета 1,2 млн долларов США на 2 года',
   `в рамках бюджета <span class="cn-diff">1,2 млн долларов США</span>${ruNote('в документе: 1 210 000 долларов США')} на 2 года`],
  ['Эта сеть активно работает в регионе ВЕЦА с 2014 года',
   `Эта сеть активно работает в регионе ВЕЦА с <span class="cn-diff">2014 года</span>${ruNote('в документе: 2014–2016 годов')}`],
  ['позволяя эффективно направлять бюджет 1,2 млн долларов США непосредственно',
   `позволяя эффективно направлять бюджет <span class="cn-diff">1,2 млн долларов США</span>${ruNote('в документе: 1 210 000 долларов США')} непосредственно`],
  ['Управление опирается на четыре рабочих органа, координируемых <strong>Региональным руководящим комитетом</strong>, в состав которого входят представители Парламентского совета, Совета гражданского общества и ключевые технические эксперты региона и который обеспечивает стратегическое руководство, надзор и соответствие региональным приоритетам:',
   `<span class="cn-diff">Управление опирается на четыре рабочих органа, координируемых <strong>Региональным руководящим комитетом</strong>, в состав которого входят представители Парламентского совета, Совета гражданского общества и ключевые технические эксперты региона и который обеспечивает стратегическое руководство, надзор и соответствие региональным приоритетам:</span>${ruNote('переформулировано. В документе: «Региональный руководящий комитет: состоит из представителей Парламентского совета, Совета гражданского общества и ключевых технических экспертов региона. Комитет будет обеспечивать стратегическое руководство, надзор и соответствие региональным приоритетам.» В документе эта фраза стоит над маркированным списком четырёх органов; подача её как ещё одного пункта списка и создавала впечатление пятого органа. Формулировки четырёх органов ниже — из документа')}`],

  // 2.3
  ['<h5>Компонент 1: Двигатель — укрепление национального потенциала (ИИ-платформа для законодательной работы)</h5>',
   '<h5>Компонент 1: Двигатель — укрепление национального потенциала (ИИ-платформа для законодательной работы)</h5>\n            <p class="cn-suggestion">В документе все три компонента представлены таблицей из четырёх колонок; при ширине страницы строки занимали целую полосу, поэтому тот же текст оформлен блоками. Обратите внимание: русский документ называет Компонент 1 полнее, чем английский, где после тире пропущено слово.</p>'],
  ['<p>Вместе эти компоненты представляют Хаб как единую интегрированную систему',
   `<p><span class="cn-diff">Вместе эти компоненты представляют</span>${ruNote('в документе: «Приведённая выше таблица представляет»')} Хаб как единую интегрированную систему`],

  // Section 3
  ['<p>Эта программа стоимостью 1,2 млн долларов США создаёт',
   `<p>Эта программа стоимостью <span class="cn-diff">1,2 млн долларов США</span>${ruNote('в документе: 1 210 000 долларов США')} создаёт`],

  // Conclusion
  ['включая приложение Хаба, национальную панель данных по скринингу',
   `включая приложение Хаба, <span class="cn-diff">национальную</span>${ruNote('в документе: «панель данных по скринингу в Казахстане (в качестве пилотной страны; при необходимости может быть выбрана другая страна)»')} панель данных по скринингу`],
], 'ru-diff');

ruDiff = apply(ruDiff, [
  ['<div class="cn-stats-row">',
   '<p class="cn-suggestion">Три показателя ниже взяты из абзаца выше и вынесены в виде графики.</p>\n          <div class="cn-stats-row">'],
], 'ru-diff-notes');

write('concept-note-body-ru-diff.html', ruDiff);
