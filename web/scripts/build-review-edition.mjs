// Generates public/concept-note-body-full.html from public/concept-note-body.html.
//
// The review edition is the live concept note plus a set of proposed additions,
// each marked in red with a short note saying what it is and why it is being
// suggested. Generating it from the live body rather than maintaining a second
// copy means the two can never silently drift apart — re-run this after any
// edit to the live note.
//
// Usage: node scripts/build-review-edition.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public', 'concept-note-body.html');
const out = join(root, 'public', 'concept-note-body-full.html');

let html = readFileSync(src, 'utf8');

const LEGEND = `
          <div class="cn-legend">
            <p><strong>Review edition.</strong> This is the current concept note plus a set of <span class="cn-legend-key">proposed additions</span>, each marked in red. Everything in black is exactly the document as it stands today.</p>
            <p>Each red block opens with a short note saying what it is and why it is suggested. Nothing here has been added to the live document — this edition exists so the team can decide, section by section, what should go in.</p>
          </div>
`;

const MECHANICS = `
          <div class="cn-diff-block">
          <p class="cn-suggestion">Suggested addition. The note explains what the Hub is and why it is worth funding, but never says when anything actually lands — the only timing anywhere in the document is the single "within 6 months (Phase 1)" line in the conclusion. This section makes the phasing explicit, which is what a funder needs in order to understand what a first tranche buys and what the next one depends on. It is in no version of the concept note doc, and the phase timings in particular need the team's sign-off before this goes to anyone outside.</p>
          <h4>4. MECHANICS OF PROJECT IMPLEMENTATION (PHASED, 2-YEAR PROGRAMME)</h4>
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
          <p class="cn-suggestion">Suggested addition. The document already names the headline total and offers the line-item detail on request; this section adds the reasoning in between – how the money is staged phase by phase, and what Phase 1 actually covers – which is what a funder needs in order to judge the first tranche. The chart shows proportions only, no figures. One item to settle before this is used: the doc's total was calculated with a Phase 1 of USD 70,000, and the team has since raised that ask to USD 100,000 on the website, so the precise total needs re-deriving.</p>
          <h4>5. BUDGET STRUCTURE (PHASED · 24 MONTHS)</h4>
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

function must(condition, message) {
  if (!condition) {
    console.error(`build-review-edition: ${message}`);
    process.exit(1);
  }
}

// Legend goes directly under the cover meta line.
const metaEnd = html.indexOf('</p>', html.indexOf('class="cn-doc-meta"')) + '</p>'.length;
must(metaEnd > 4, 'could not find the cover meta line');
html = html.slice(0, metaEnd) + '\n' + LEGEND + html.slice(metaEnd);

// The proposed sections sit between the investment thesis and the conclusion.
const conclusionHeading = '          <h4>4. CONCLUSION:';
must(html.includes(conclusionHeading), 'could not find the conclusion heading');
html = html.replace(conclusionHeading, MECHANICS + conclusionHeading);

// Renumber the conclusion, since two sections now precede it, and give it the
// suggested opening line.
html = html.replace(
  '<h4>4. CONCLUSION:',
  '<h4><span class="cn-diff">6.</span> CONCLUSION:',
);
const afterConclusionHeading = html.indexOf('</h4>', html.indexOf('CONCLUSION:')) + '</h4>\n'.length;
html = html.slice(0, afterConclusionHeading) + CONCLUSION_LEAD + html.slice(afterConclusionHeading);

// References close the document.
html = html.trimEnd() + '\n' + REFERENCES;

writeFileSync(out, html);
console.log(`Wrote ${out}`);
