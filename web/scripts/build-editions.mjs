// Generates the review editions of the concept note from the live bodies.
//
//   public/concept-note-body.html             the live English note (hand-edited)
//   public/concept-note-body-ru.html          the live Russian note (hand-edited)
//   public/concept-note-body-revision.html    EN, this round's changes marked red
//   public/concept-note-body-ru-revision.html RU, this round's changes marked red
//
// The revision editions are what goes to the team for comment: everything the
// September 2026 source-accuracy pass changed is in red, everything black is
// unchanged. Deletions cannot be highlighted, so the legend names them.
//
// Both are generated from the live bodies rather than maintained by hand, so
// they cannot drift. Every replacement asserts on its match, so an edit to a
// live body that breaks an anchor fails loudly instead of silently dropping a
// marker.
//
// The earlier `full` and `diff` editions are retired. `full` carried proposed
// additions that the team has now accepted — they live in the note itself.
// `diff` compared against Alesia's source doc, which this round has moved well
// beyond; the revision edition is the comparison the team needs now.
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

/** Applies [find, replace] pairs, requiring an exact number of matches. */
function apply(html, pairs, label) {
  for (const [find, replace, expected = 1] of pairs) {
    const n = html.split(find).length - 1;
    if (n !== expected) {
      console.error(`build-editions (${label}): expected ${expected} match(es), found ${n}, for:\n  ${find.slice(0, 100)}`);
      process.exit(1);
    }
    html = html.split(find).join(replace);
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

const red = (s) => `<span class="cn-diff">${s}</span>`;
const note = (s) => `<span class="cn-diff"> [${s}]</span>`;

// ---------------------------------------------------------------------------
// English revision edition
// ---------------------------------------------------------------------------

const EN_LEGEND = `
          <div class="cn-legend">
            <p><strong>Revision for review — September 2026.</strong> Everything marked in <span class="cn-legend-key">red</span> changed in this round. Black text is unchanged. Please comment directly on the red passages.</p>
            <p>This round did three things: it acted on the team's nine comments, it corrected every figure that could not be supported by a published source, and it added a references section — the note previously cited nothing at all.</p>
            <p>It also acts on the team's later request to reframe the Global TB Caucus relationship: every "in collaboration with the Global TB Caucus" now reads "with support from the Global TB Caucus", the section 2.1 heading changed accordingly, and on the website all links to globaltbcaucus.org were removed and "Multi-year MoU with the Global TB Caucus" became "Working with parliamentary leaders across the EECA region".</p>
            <p><strong>Removed, and so not visible below.</strong> The claim of "approximately 300,000 vulnerable patients … a conservative estimate based on the annual incidence of TB alone in the target countries" is gone: WHO/ECDC record about 225,000 estimated TB cases in the <em>entire</em> WHO European Region in 2023, so the figure was roughly three times too high. The figures "85% of the TB burden" and "99% of MDR-TB" are gone: they describe the WHO European Region rather than EECA, and the 99% appears nowhere in the current WHO/ECDC report — it survives only in a 2007–2015 plan. Two references were dropped because nothing in the note cited them (Impakter, on US philanthropy; Gavi 6.0, on vaccines — whose link was also dead). Two claims were softened because no source exists for them: the statistic about an "average MP" facing a deluge of legislation, and, on the website, "22 of 26 high-burden countries that raised domestic TB budgets had an active caucus".</p>
          </div>
`;

const EN_MARKS = [
  // Executive summary
  ['<h4>EXECUTIVE SUMMARY</h4>',
   `<h4>EXECUTIVE SUMMARY</h4>${note('the tagline "A Catalytic Two-Year Programme" was removed')}`],
  ['built as a phased programme over two years, opening with a $100,000, six-month Foundation Phase in one EECA country that delivers a fully working solution',
   red('built as a phased programme over two years, opening with a $100,000, six-month Foundation Phase in one EECA country that delivers a fully working solution') +
   note('was "structured … over 2 years: a USD 100,000, 6-month Foundation Phase". "Built" per comment; "$" replaces "USD" throughout; this is now the only statement of duration in the executive summary')],
  ['to a total programme value of $1.2 million.', red('to a total programme value of $1.2 million.')],
  ['Its regional network for Eastern Europe and Central Asia has been active since 2016.<sup>3</sup>',
   red('Its regional network for Eastern Europe and Central Asia has been active since 2016.<sup>3</sup>') +
   note('was "active in the EECA region since 2014". The Global TB Caucus was founded globally in 2014; its Eurasian Parliamentary Group on TB was established in June 2016'), 1],
  ['<p>Functioning as a <strong>Health Security Coordination Center</strong>, the Hub is designed to protect continuity of care where the regional burden is heaviest. The nine partner countries include three of the six highest-burden countries in the WHO European Region: Ukraine (42,000 estimated cases in 2023), Uzbekistan (20,000) and Kazakhstan (14,000).<sup>1</sup></p>',
   `<p class="cn-diff">Functioning as a <strong>Health Security Coordination Center</strong>, the Hub is designed to protect continuity of care where the regional burden is heaviest. The nine partner countries include three of the six highest-burden countries in the WHO European Region: Ukraine (42,000 estimated cases in 2023), Uzbekistan (20,000) and Kazakhstan (14,000).<sup>1</sup> <em>(Replaces the 300,000 claim. These are published per-country figures, quoted rather than summed.)</em></p>`],

  // 1.1
  ['The WHO European Region recorded an estimated 225,000 new and relapse tuberculosis cases in 2023, about 84% of them in the 18 countries WHO designates as high-priority – a group that includes all nine EECA countries this programme works with. Incidence across those 18 averages 46 per 100,000, five times the EU/EEA average. The Region also carries the world\'s heaviest drug-resistant burden: an estimated 65,000 rifampicin-resistant and multidrug-resistant (RR/MDR-TB) cases, and nine of the 30 countries with the highest MDR-TB burden worldwide.<sup>1</sup>',
   red('The WHO European Region recorded an estimated 225,000 new and relapse tuberculosis cases in 2023, about 84% of them in the 18 countries WHO designates as high-priority – a group that includes all nine EECA countries this programme works with. Incidence across those 18 averages 46 per 100,000, five times the EU/EEA average. The Region also carries the world\'s heaviest drug-resistant burden: an estimated 65,000 rifampicin-resistant and multidrug-resistant (RR/MDR-TB) cases, and nine of the 30 countries with the highest MDR-TB burden worldwide.<sup>1</sup>') +
   note('every figure here is quoted from the WHO/ECDC report and now carries a reference')],
  ['<div class="cn-stats-row">', '<div class="cn-stats-row cn-diff">'],

  // 1.2 and 1.4
  ['from early 2025 onward.<sup>2</sup>', `from early 2025 onward.${red('<sup>2</sup>')}${note('now sourced')}`],
  ['It also stems from the legislative workload carried by parliamentarians: where health policy competes with a heavy flow of other legislation, the capacity for swift, informed decision-making on complex health questions is constrained.',
   red('It also stems from the legislative workload carried by parliamentarians: where health policy competes with a heavy flow of other legislation, the capacity for swift, informed decision-making on complex health questions is constrained.') +
   note('softened — the previous wording implied a statistic about "an average MP" that no source supports')],

  // 2, 2.1, 2.3
  ['within a $1.2 million budget.', red('within a $1.2 million budget.') + note('"over 2 years" removed as a duplicate statement of duration')],
  ['Its regional network for Eastern Europe and Central Asia has been active since 2016, cultivating',
   red('Its regional network for Eastern Europe and Central Asia has been active since 2016,') + ' cultivating'],
  ['<strong>2.3. The $1.2 Million Programme: The EECA Lung Health Hub</strong>',
   `<strong>2.3. The $1.2 Million Programme: The EECA Lung Health Hub</strong>${note('"(2-Year Program)" removed')}`],
  ['<p class="cn-component-label">Key deliverables</p>',
   `<p class="cn-component-label">Key deliverables${note('"(within 24 months)" removed here and on the other two components')}</p>`, 3],
  ['(aligned with the WHO global strategy on digital health<sup>4</sup>)',
   red('(aligned with the WHO global strategy on digital health<sup>4</sup>)')],
  ['<li>Demonstrated decision value in the lead partner country, with a clear roadmap for regional scale</li>',
   `<li>${red('Demonstrated decision value in the lead partner country')}${note('was "across 2–3 pilot countries", which contradicted the one-country Phase 1 stated everywhere else')}, with a clear roadmap for regional scale</li>`],

  // sections 4 and 5, accepted from the review edition
  ['<h4 class="cn-page-break">4. MECHANICS OF PROJECT IMPLEMENTATION</h4>',
   `<h4 class="cn-page-break cn-diff">4. MECHANICS OF PROJECT IMPLEMENTATION</h4>\n          <p class="cn-suggestion">Sections 4 and 5 were proposed in the previous review edition and carried no comments, so they are treated as accepted and are now part of the note. The month ranges appear only in the timeline graphic; the four phase headings below no longer repeat them.</p>`],
  ['<h4 class="cn-page-break">5. BUDGET STRUCTURE</h4>',
   `<h4 class="cn-page-break cn-diff">5. BUDGET STRUCTURE</h4>${note('shortened per comment: detail on request, then how the money splits')}`],

  // conclusion
  ['<p>The EECA Lung Health Hub closes a critical gap: turning political decisions into real delivery of care – fast – entered through a Foundation Phase in one EECA country that delivers a working solution before any further funding is asked.</p>',
   '<p class="cn-diff">The EECA Lung Health Hub closes a critical gap: turning political decisions into real delivery of care – fast – entered through a Foundation Phase in one EECA country that delivers a working solution before any further funding is asked. <em>(Accepted from the review edition; "24-month" dropped, since the duration is stated just below.)</em></p>'],
  ['<p>Within six months (Phase 1), the investment delivers:', `<p>${red('Within six months')} (Phase 1), the investment delivers:`],
  ['<p>Within two years, the investment delivers:</p>', `<p>${red('Within two years')}, the investment delivers:</p>${note('was "Within 24 months"')}`],
  ['<li>Protected continuity of care across the nine partner countries, beginning with the highest-burden settings</li>',
   `<li>${red('Protected continuity of care across the nine partner countries, beginning with the highest-burden settings')}${note('was "for 300,000+ vulnerable patients"')}</li>`],

  // Global TB Caucus reframed from collaborator to supporter (team request)
  ['the Hub is developed with support from the <strong>Global TB Caucus</strong>',
   red('the Hub is developed with support from the <strong>Global TB Caucus</strong>') +
   note('was "in collaboration with". The Hub is not a joint venture with the Caucus; it receives their support')],
  ['<strong>2.1. Support from the Global TB Caucus Network</strong>',
   `<strong class="cn-diff">2.1. Support from the Global TB Caucus Network</strong>${note('heading was "Collaboration with the Global TB Caucus Network"')}`],
  ['the Hub works with support from the Global TB Caucus.',
   red('the Hub works with support from the Global TB Caucus.')],
  ['with support from the Global TB Caucus network.', red('with support from the Global TB Caucus network.')],
  ['with support from the Global TB Caucus and its regional network.',
   red('with support from the Global TB Caucus and its regional network.')],
  ['<p>Working with support from the Global TB Caucus network and by linking',
   `<p>${red('Working with support from the Global TB Caucus network')} and by linking`],

  // references
  ['<h4 class="cn-references">REFERENCES</h4>',
   `<h4 class="cn-references cn-diff">REFERENCES</h4>\n          <p class="cn-suggestion">New. The note previously had no references section at all, and no inline citations. Each claim that rests on a source now carries a superscript number pointing here. All four links were checked and resolve.</p>`],
];

write('concept-note-body-revision.html',
  apply(insertAfterCoverMeta(read('concept-note-body.html'), EN_LEGEND), EN_MARKS, 'en-revision'));

// ---------------------------------------------------------------------------
// Russian revision edition
// ---------------------------------------------------------------------------

const RU_LEGEND = `
          <div class="cn-legend">
            <p><strong>Редакция для обсуждения — сентябрь 2026.</strong> Всё, что выделено <span class="cn-legend-key">красным</span>, изменено в этом раунде. Чёрный текст не менялся. Комментарии удобнее оставлять прямо к красным фрагментам.</p>
            <p>В этом раунде сделано три вещи: учтены девять комментариев команды, исправлены все цифры, которые не подтверждались опубликованным источником, и добавлен раздел источников — раньше записка не ссылалась ни на что.</p>
            <p>Учтена и более поздняя просьба команды переформулировать отношения с Глобальным парламентским кокусом по туберкулёзу: везде, где было «в сотрудничестве с», теперь «при поддержке», заголовок раздела 2.1 изменён соответственно, а на сайте убраны все ссылки на globaltbcaucus.org и формулировка «Многолетний MoU с Кокусом» заменена на «Работа с парламентскими лидерами в регионе ВЕЦА».</p>
            <p><strong>Удалено и поэтому ниже не видно.</strong> Утверждение о «примерно 300 000 уязвимых пациентов … консервативная оценка на основе годовой заболеваемости туберкулёзом» убрано: по данным ВОЗ/ECDC во <em>всём</em> Европейском регионе ВОЗ в 2023 году расчётно 225 000 случаев ТБ, то есть цифра была завышена примерно втрое. Показатели «85 % бремени ТБ» и «99 % МЛУ-ТБ» убраны: они относятся к Европейскому региону ВОЗ, а не к ВЕЦА, и 99 % отсутствует в текущем отчёте ВОЗ/ECDC — этот показатель встречается только в плане 2007–2015 годов. Два источника исключены, поскольку в тексте на них не было ссылок (Impakter — о частной филантропии в США; Gavi 6.0 — о вакцинах, к тому же ссылка не работала). Две формулировки смягчены из-за отсутствия источника: утверждение о «среднем депутате» и статистика «22 из 26 стран» на сайте.</p>
          </div>
`;

const RU_MARKS = [
  ['<h4>КРАТКОЕ РЕЗЮМЕ</h4>', `<h4>КРАТКОЕ РЕЗЮМЕ</h4>${note('подзаголовок «Каталитическая двухлетняя программа» удалён')}`],
  ['построенной как поэтапная программа на два года, которая начинается с шестимесячной Фазы основания стоимостью $100 000 в одной из стран ВЕЦА',
   red('построенной как поэтапная программа на два года, которая начинается с шестимесячной Фазы основания стоимостью $100 000 в одной из стран ВЕЦА') +
   note('«построенной» вместо «структурированной»; «$» вместо «долларов США»; это единственное упоминание сроков в кратком резюме')],
  ['Её региональная сеть для Восточной Европы и Центральной Азии работает с 2016 года.<sup>3</sup>',
   red('Её региональная сеть для Восточной Европы и Центральной Азии работает с 2016 года.<sup>3</sup>') +
   note('было «с 2014 года». Глобальный кокус основан в 2014 году, его Евразийская парламентская группа по ТБ — в июне 2016 года')],
  ['<p>Выполняя функцию <strong>Центра координации безопасности здравоохранения</strong>, Хаб призван защищать непрерывность медицинской помощи там, где региональное бремя наиболее велико. В число девяти стран-партнёров входят три из шести стран с наибольшим бременем в Европейском регионе ВОЗ: Украина (42 000 расчётных случаев в 2023 году), Узбекистан (20 000) и Казахстан (14 000).<sup>1</sup></p>',
   '<p class="cn-diff">Выполняя функцию <strong>Центра координации безопасности здравоохранения</strong>, Хаб призван защищать непрерывность медицинской помощи там, где региональное бремя наиболее велико. В число девяти стран-партнёров входят три из шести стран с наибольшим бременем в Европейском регионе ВОЗ: Украина (42 000 расчётных случаев в 2023 году), Узбекистан (20 000) и Казахстан (14 000).<sup>1</sup> <em>(Заменяет утверждение о 300 000. Это опубликованные страновые показатели, приведённые дословно, а не сумма.)</em></p>'],
  ['В Европейском регионе ВОЗ в 2023 году зарегистрировано расчётно 225 000 новых случаев туберкулёза и рецидивов',
   red('В Европейском регионе ВОЗ в 2023 году зарегистрировано расчётно 225 000 новых случаев туберкулёза и рецидивов')],
  ['находятся в Регионе.<sup>1</sup>', red('находятся в Регионе.<sup>1</sup>') + note('каждая цифра взята из отчёта ВОЗ/ECDC и теперь снабжена ссылкой')],
  ['<div class="cn-stats-row">', '<div class="cn-stats-row cn-diff">'],
  ['начиная с начала 2025 года.<sup>2</sup>', `начиная с начала 2025 года.${red('<sup>2</sup>')}${note('теперь со ссылкой')}`],
  ['Она также связана с законодательной нагрузкой на парламентариев: когда политика здравоохранения конкурирует с плотным потоком других законодательных актов, способность к быстрому и обоснованному принятию решений по сложным вопросам здравоохранения оказывается ограниченной.',
   red('Она также связана с законодательной нагрузкой на парламентариев: когда политика здравоохранения конкурирует с плотным потоком других законодательных актов, способность к быстрому и обоснованному принятию решений по сложным вопросам здравоохранения оказывается ограниченной.') +
   note('смягчено — прежняя формулировка подразумевала статистику о «среднем депутате», которая ничем не подтверждена')],
  ['в рамках бюджета $1,2 млн.', red('в рамках бюджета $1,2 млн.') + note('«на 2 года» убрано как повтор')],
  ['<strong>2.3. Программа стоимостью $1,2 млн: Хаб по здоровью лёгких в регионе ВЕЦА</strong>',
   `<strong>2.3. Программа стоимостью $1,2 млн: Хаб по здоровью лёгких в регионе ВЕЦА</strong>${note('«(2-летняя программа)» удалено')}`],
  ['<p class="cn-component-label">Ключевые результаты</p>', `<p class="cn-component-label">Ключевые результаты${note('«(в течение 24 месяцев)» убрано здесь и у двух других компонентов')}</p>`, 3],
  ['<li>продемонстрированная ценность решений в ведущей стране-партнёре с чёткой дорожной картой регионального масштабирования.</li>',
   `<li>${red('продемонстрированная ценность решений в ведущей стране-партнёре')}${note('было «в 2–3 пилотных странах», что противоречило Фазе 1 в одной стране')} с чёткой дорожной картой регионального масштабирования.</li>`],
  ['<h4 class="cn-page-break">4. МЕХАНИКА РЕАЛИЗАЦИИ ПРОЕКТА</h4>',
   `<h4 class="cn-page-break cn-diff">4. МЕХАНИКА РЕАЛИЗАЦИИ ПРОЕКТА</h4>\n          <p class="cn-suggestion">Разделы 4 и 5 предлагались в предыдущей редакции и не получили комментариев, поэтому считаются принятыми и включены в записку. Месяцы указаны только на схеме; в четырёх заголовках фаз они больше не повторяются.</p>`],
  ['<h4 class="cn-page-break">5. СТРУКТУРА БЮДЖЕТА</h4>',
   `<h4 class="cn-page-break cn-diff">5. СТРУКТУРА БЮДЖЕТА</h4>${note('сокращено по комментарию: детализация по запросу, затем распределение средств')}`],
  ['<p>Хаб закрывает критический разрыв: превращает политические решения в реальную помощь пациентам — быстро — начиная с Фазы основания в одной стране ВЕЦА, которая даёт работающее решение до того, как будет запрошено дальнейшее финансирование.</p>',
   '<p class="cn-diff">Хаб закрывает критический разрыв: превращает политические решения в реальную помощь пациентам — быстро — начиная с Фазы основания в одной стране ВЕЦА, которая даёт работающее решение до того, как будет запрошено дальнейшее финансирование. <em>(Принято из редакции для обсуждения; «24 месяца» убрано, срок указан ниже.)</em></p>'],
  ['<p>В течение первых шести месяцев (Фаза 1)', `<p>${red('В течение первых шести месяцев')} (Фаза 1)`],
  ['<p>В течение двух лет инвестиция обеспечивает:</p>', `<p>${red('В течение двух лет')} инвестиция обеспечивает:</p>${note('было «В течение 24 месяцев»')}`],
  ['<li>защищённую непрерывность помощи в девяти странах-партнёрах, начиная с территорий с наибольшим бременем.</li>',
   `<li>${red('защищённую непрерывность помощи в девяти странах-партнёрах, начиная с территорий с наибольшим бременем')}${note('было «для 300 000+ уязвимых пациентов»')}.</li>`],
  ['Хаб развивается при поддержке <strong>Глобального парламентского кокуса по туберкулёзу</strong>',
   red('Хаб развивается при поддержке <strong>Глобального парламентского кокуса по туберкулёзу</strong>') +
   note('было «в сотрудничестве с». Хаб — не совместный проект с Кокусом; Кокус оказывает поддержку')],
  ['<strong>2.1. Поддержка со стороны сети Глобального парламентского кокуса по туберкулёзу</strong>',
   `<strong class="cn-diff">2.1. Поддержка со стороны сети Глобального парламентского кокуса по туберкулёзу</strong>${note('заголовок был «Сотрудничество с сетью Глобального парламентского кокуса по туберкулёзу»')}`],
  ['Хаб работает при поддержке Глобального парламентского кокуса по туберкулёзу.',
   red('Хаб работает при поддержке Глобального парламентского кокуса по туберкулёзу.')],
  ['опираясь при этом на поддержку сети Глобального парламентского кокуса по туберкулёзу.',
   red('опираясь при этом на поддержку сети Глобального парламентского кокуса по туберкулёзу.')],
  ['опираясь при этом на поддержку Глобального парламентского кокуса по туберкулёзу',
   red('опираясь при этом на поддержку Глобального парламентского кокуса по туберкулёзу')],
  ['<p>Работая при поддержке сети Глобального парламентского кокуса по туберкулёзу и связывая',
   `<p>${red('Работая при поддержке сети Глобального парламентского кокуса по туберкулёзу')} и связывая`],

  ['<h4 class="cn-references">ИСТОЧНИКИ</h4>',
   `<h4 class="cn-references cn-diff">ИСТОЧНИКИ</h4>\n          <p class="cn-suggestion">Новый раздел. Раньше в записке не было ни списка источников, ни сносок. Каждое утверждение, опирающееся на источник, теперь снабжено надстрочным номером. Все четыре ссылки проверены и открываются.</p>`],
];

write('concept-note-body-ru-revision.html',
  apply(insertAfterCoverMeta(read('concept-note-body-ru.html'), RU_LEGEND), RU_MARKS, 'ru-revision'));
