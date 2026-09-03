// Prints /concept-note to a PDF with a page-number footer, via puppeteer-core
// driving the system's own Chrome (no bundled Chromium download).
//
// Usage: node scripts/print-pdf.mjs <port> <outFile>

import puppeteer from 'puppeteer-core';

const [, , port, outFile] = process.argv;
if (!port || !outFile) {
  console.error('Usage: node scripts/print-pdf.mjs <port> <outFile>');
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  // A wide layout viewport keeps the multi-column grids (icon cards, governance
  // cards, timeline) from collapsing to their narrow-screen single-column layout —
  // print layout uses this viewport width, not the physical page size.
  await page.setViewport({ width: 1280, height: 1600 });
  await page.goto(`http://localhost:${port}/concept-note`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outFile,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%; font-size:8.5px; font-family:Helvetica,Arial,sans-serif; ' +
      'color:#8a9997; text-align:center;">' +
      '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '1.75cm', right: '1.75cm', bottom: '1.9cm', left: '1.75cm' },
  });
} finally {
  await browser.close();
}
