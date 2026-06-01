/**
 * ============================================================
 *  Fashion Store — Automated Test Runner
 * ============================================================
 *  Executes all test suites against a Live Server instance,
 *  then generates:
 *    • test-results.xlsx  (organized Excel workbook)
 *    • test.html          (premium interactive dashboard)
 * ============================================================
 */

const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// ── Config ──────────────────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:5500/';
const OUTPUT_DIR = __dirname;

// ── Test Modules ────────────────────────────────────────────
const testModules = [
  { name: 'Page Loading & SEO', file: './tests/page-loading.js' },
  { name: 'Navigation & UI', file: './tests/navigation-ui.js' },
  { name: 'Hero Section', file: './tests/hero-section.js' },
  { name: 'Product Display & Filtering', file: './tests/product-display.js' },
  { name: 'Search Functionality', file: './tests/search.js' },
  { name: 'Product Detail Page', file: './tests/product-detail.js' },
  { name: 'Cart Functionality', file: './tests/cart.js' },
  { name: 'Checkout Flow', file: './tests/checkout.js' },
  { name: 'Wishlist Functionality', file: './tests/wishlist.js' },
  { name: 'Responsive Design', file: './tests/responsive.js' },
  { name: 'Accessibility & Performance', file: './tests/accessibility.js' },
];

// ── Helpers ─────────────────────────────────────────────────
const color = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
};

function statusIcon(s) {
  if (s === 'PASS') return `${color.green}✔ PASS${color.reset}`;
  if (s === 'FAIL') return `${color.red}✘ FAIL${color.reset}`;
  return `${color.yellow}⊘ SKIP${color.reset}`;
}

// ── Main Runner ─────────────────────────────────────────────
(async () => {
  console.log(`\n${color.magenta}${color.bold}╔══════════════════════════════════════════════════╗${color.reset}`);
  console.log(`${color.magenta}${color.bold}║   🧪  Fashion Store — Automated Test Suite       ║${color.reset}`);
  console.log(`${color.magenta}${color.bold}╚══════════════════════════════════════════════════╝${color.reset}\n`);

  console.log(`${color.cyan}▸ Target:${color.reset} ${BASE_URL}`);
  console.log(`${color.cyan}▸ Modules:${color.reset} ${testModules.length}`);
  console.log(`${color.cyan}▸ Started:${color.reset} ${new Date().toLocaleString()}\n`);

  // Launch browser
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
      defaultViewport: { width: 1920, height: 1080 },
    });
  } catch (err) {
    console.error(`${color.red}Failed to launch browser:${color.reset}`, err.message);
    process.exit(1);
  }

  const allResults = [];
  const moduleStats = [];
  const startTime = Date.now();

  for (const mod of testModules) {
    console.log(`${color.bold}━━━ ${mod.name} ━━━${color.reset}`);
    const page = await browser.newPage();

    // Suppress console noise from the page
    page.on('console', () => {});
    page.on('pageerror', () => {});

    let results = [];
    try {
      const testFn = require(mod.file);
      results = await testFn(page, BASE_URL);
    } catch (err) {
      console.log(`  ${color.red}Module error: ${err.message}${color.reset}`);
      results = [{
        id: 'ERR', category: mod.name, name: 'Module Load Error',
        description: 'Failed to load/run test module',
        expected: 'Module runs', actual: err.message,
        status: 'FAIL', duration: 0,
      }];
    }

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const skipped = results.filter(r => r.status === 'SKIP').length;

    results.forEach(r => {
      const dur = r.duration ? `${color.dim}(${r.duration}ms)${color.reset}` : '';
      console.log(`  ${statusIcon(r.status)} ${r.id} ${r.name} ${dur}`);
    });

    const passRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : '0.0';
    console.log(`  ${color.dim}─── ${passed}/${results.length} passed (${passRate}%)${color.reset}\n`);

    moduleStats.push({ name: mod.name, total: results.length, passed, failed, skipped, passRate: parseFloat(passRate) });
    allResults.push(...results);

    await page.close();
  }

  await browser.close();

  const totalDuration = Date.now() - startTime;
  const totalPassed = allResults.filter(r => r.status === 'PASS').length;
  const totalFailed = allResults.filter(r => r.status === 'FAIL').length;
  const totalSkipped = allResults.filter(r => r.status === 'SKIP').length;
  const overallRate = allResults.length > 0 ? ((totalPassed / allResults.length) * 100).toFixed(1) : '0.0';

  console.log(`${color.magenta}${color.bold}══════════════════════════════════════════════════${color.reset}`);
  console.log(`${color.bold}  Total: ${allResults.length} | ` +
    `${color.green}Passed: ${totalPassed}${color.reset} | ` +
    `${color.red}Failed: ${totalFailed}${color.reset} | ` +
    `${color.yellow}Skipped: ${totalSkipped}${color.reset} | ` +
    `Rate: ${overallRate}%`);
  console.log(`  Duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`${color.magenta}${color.bold}══════════════════════════════════════════════════${color.reset}\n`);

  // ── Generate Excel ──────────────────────────────────────
  await generateExcel(allResults, moduleStats, { totalPassed, totalFailed, totalSkipped, overallRate, totalDuration });

  // ── Generate HTML ───────────────────────────────────────
  generateHTML(allResults, moduleStats, { totalPassed, totalFailed, totalSkipped, overallRate, totalDuration });

  console.log(`\n${color.green}${color.bold}✔ Reports generated:${color.reset}`);
  console.log(`  📊 ${path.join(OUTPUT_DIR, 'test-results.xlsx')}`);
  console.log(`  🌐 ${path.join(OUTPUT_DIR, 'test.html')}\n`);
})();

// ═══════════════════════════════════════════════════════════
//  EXCEL GENERATION
// ═══════════════════════════════════════════════════════════
async function generateExcel(results, moduleStats, summary) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Fashion Store Test Suite';
  wb.created = new Date();

  // ── Sheet 1: Summary ───────────────────────────────────
  const ws1 = wb.addWorksheet('Summary', {
    properties: { tabColor: { argb: 'FFE91E63' } },
  });

  // Title
  ws1.mergeCells('A1:F1');
  const titleCell = ws1.getCell('A1');
  titleCell.value = '🧪 Fashion Store — Test Execution Summary';
  titleCell.font = { size: 18, bold: true, color: { argb: 'FFE91E63' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws1.getRow(1).height = 40;

  // Date
  ws1.mergeCells('A2:F2');
  const dateCell = ws1.getCell('A2');
  dateCell.value = `Generated: ${new Date().toLocaleString()} | Duration: ${(summary.totalDuration / 1000).toFixed(2)}s`;
  dateCell.font = { size: 10, color: { argb: 'FF666666' } };
  dateCell.alignment = { horizontal: 'center' };

  // Stats row
  ws1.getRow(4).values = ['', 'Total Tests', 'Passed ✔', 'Failed ✘', 'Skipped ⊘', 'Pass Rate'];
  ws1.getRow(5).values = ['', results.length, summary.totalPassed, summary.totalFailed, summary.totalSkipped, `${summary.overallRate}%`];

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE91E63' } };
  const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };

  for (let c = 2; c <= 6; c++) {
    const cell = ws1.getRow(4).getCell(c);
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center' };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFE91E63' } } };
  }

  for (let c = 2; c <= 6; c++) {
    const cell = ws1.getRow(5).getCell(c);
    cell.font = { bold: true, size: 14 };
    cell.alignment = { horizontal: 'center' };
  }

  ws1.getRow(5).getCell(3).font = { bold: true, size: 14, color: { argb: 'FF4CAF50' } };
  ws1.getRow(5).getCell(4).font = { bold: true, size: 14, color: { argb: 'FFF44336' } };
  ws1.getRow(5).getCell(5).font = { bold: true, size: 14, color: { argb: 'FFFF9800' } };

  // Module breakdown
  ws1.getRow(7).values = ['', 'Module', 'Total', 'Passed', 'Failed', 'Pass Rate'];
  for (let c = 2; c <= 6; c++) {
    const cell = ws1.getRow(7).getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF212121' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center' };
  }

  moduleStats.forEach((m, i) => {
    const row = ws1.getRow(8 + i);
    row.values = ['', m.name, m.total, m.passed, m.failed, `${m.passRate}%`];
    for (let c = 2; c <= 6; c++) {
      row.getCell(c).alignment = { horizontal: 'center' };
    }
    row.getCell(2).alignment = { horizontal: 'left' };
    if (m.passRate === 100) {
      row.getCell(6).font = { color: { argb: 'FF4CAF50' }, bold: true };
    } else if (m.passRate < 50) {
      row.getCell(6).font = { color: { argb: 'FFF44336' }, bold: true };
    }
  });

  ws1.columns = [
    { width: 3 }, { width: 35 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 14 },
  ];

  // ── Sheet 2: All Test Cases ────────────────────────────
  const ws2 = wb.addWorksheet('All Test Cases', {
    properties: { tabColor: { argb: 'FF4CAF50' } },
  });

  const headers2 = ['Test ID', 'Category', 'Test Name', 'Description', 'Expected Result', 'Actual Result', 'Status', 'Duration (ms)'];
  ws2.getRow(1).values = headers2;
  ws2.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FFE91E63' } } };
  });
  ws2.getRow(1).height = 30;

  results.forEach((r, i) => {
    const row = ws2.getRow(i + 2);
    row.values = [r.id, r.category, r.name, r.description, r.expected, r.actual, r.status, r.duration];

    const statusCell = row.getCell(7);
    if (r.status === 'PASS') {
      statusCell.font = { bold: true, color: { argb: 'FF4CAF50' } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
    } else if (r.status === 'FAIL') {
      statusCell.font = { bold: true, color: { argb: 'FFF44336' } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4EC' } };
    } else {
      statusCell.font = { bold: true, color: { argb: 'FFFF9800' } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3E0' } };
    }
    statusCell.alignment = { horizontal: 'center' };

    row.getCell(8).alignment = { horizontal: 'center' };

    // Alternate row colors
    if (i % 2 === 0) {
      for (let c = 1; c <= 8; c++) {
        if (c !== 7) {
          row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
        }
      }
    }
  });

  // Auto-filter
  ws2.autoFilter = { from: 'A1', to: `H${results.length + 1}` };

  ws2.columns = [
    { width: 10 }, { width: 28 }, { width: 35 }, { width: 45 },
    { width: 35 }, { width: 45 }, { width: 10 }, { width: 14 },
  ];

  // ── Sheet 3: By Category ──────────────────────────────
  const ws3 = wb.addWorksheet('By Category', {
    properties: { tabColor: { argb: 'FF2196F3' } },
  });

  const headers3 = ['Category', 'Total Tests', 'Passed', 'Failed', 'Skipped', 'Pass Rate', 'Avg Duration (ms)'];
  ws3.getRow(1).values = headers3;
  ws3.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2196F3' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  moduleStats.forEach((m, i) => {
    const catResults = results.filter(r => r.category === m.name);
    const avgDur = catResults.length > 0
      ? (catResults.reduce((sum, r) => sum + (r.duration || 0), 0) / catResults.length).toFixed(1)
      : '0';

    const row = ws3.getRow(i + 2);
    row.values = [m.name, m.total, m.passed, m.failed, m.skipped, `${m.passRate}%`, avgDur];
    for (let c = 1; c <= 7; c++) {
      row.getCell(c).alignment = { horizontal: 'center' };
    }
    row.getCell(1).alignment = { horizontal: 'left' };
  });

  ws3.columns = [
    { width: 32 }, { width: 14 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 18 },
  ];

  const xlsxPath = path.join(OUTPUT_DIR, 'test-results.xlsx');
  await wb.xlsx.writeFile(xlsxPath);
}

// ═══════════════════════════════════════════════════════════
//  HTML REPORT GENERATION
// ═══════════════════════════════════════════════════════════
function generateHTML(results, moduleStats, summary) {
  const timestamp = new Date().toLocaleString();
  const durationSec = (summary.totalDuration / 1000).toFixed(2);

  // Calculate avg duration per module for charts
  const moduleDurations = moduleStats.map(m => {
    const catResults = results.filter(r => r.category === m.name);
    const avg = catResults.length > 0
      ? (catResults.reduce((sum, r) => sum + (r.duration || 0), 0) / catResults.length).toFixed(1)
      : 0;
    return { name: m.name, avgDuration: parseFloat(avg) };
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Fashion Store — Test Execution Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-primary: #0a0e1a;
      --bg-secondary: #111827;
      --bg-card: #1a1f35;
      --bg-card-hover: #1f2642;
      --border: rgba(255,255,255,0.06);
      --border-glow: rgba(139,92,246,0.3);
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-primary: #8b5cf6;
      --accent-secondary: #a78bfa;
      --accent-tertiary: #c4b5fd;
      --green: #10b981;
      --green-glow: rgba(16,185,129,0.2);
      --red: #ef4444;
      --red-glow: rgba(239,68,68,0.2);
      --yellow: #f59e0b;
      --yellow-glow: rgba(245,158,11,0.2);
      --blue: #3b82f6;
      --pink: #ec4899;
      --cyan: #06b6d4;
      --shadow-lg: 0 20px 60px rgba(0,0,0,0.5);
      --shadow-glow: 0 0 40px rgba(139,92,246,0.15);
      --radius: 16px;
      --radius-sm: 10px;
      --radius-xs: 6px;
    }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── Animated Background ─────────────────────────── */
    .bg-grid {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(236,72,153,0.06) 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, rgba(6,182,212,0.05) 0%, transparent 40%);
    }
    .bg-grid::before {
      content: '';
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    /* ── Wrapper ─────────────────────────────────────── */
    .app { position: relative; z-index: 1; }

    /* ── Header ──────────────────────────────────────── */
    .header {
      padding: 30px 40px;
      border-bottom: 1px solid var(--border);
      background: rgba(17,24,39,0.8);
      backdrop-filter: blur(20px);
      position: sticky; top: 0; z-index: 100;
    }
    .header-inner {
      max-width: 1440px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;
    }
    .header-brand {
      display: flex; align-items: center; gap: 14px;
    }
    .header-icon {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, var(--accent-primary), var(--pink));
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; color: #fff;
      box-shadow: 0 0 30px rgba(139,92,246,0.4);
    }
    .header-title {
      font-size: 1.35rem; font-weight: 800;
      background: linear-gradient(135deg, var(--accent-tertiary), var(--pink));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .header-sub {
      font-size: 0.8rem; color: var(--text-muted); font-weight: 500;
    }
    .header-meta {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    }
    .header-badge {
      padding: 6px 16px; border-radius: 50px;
      font-size: 0.78rem; font-weight: 600;
      display: flex; align-items: center; gap: 6px;
    }
    .badge-pass { background: var(--green-glow); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
    .badge-fail { background: var(--red-glow); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
    .badge-time { background: rgba(59,130,246,0.1); color: var(--blue); border: 1px solid rgba(59,130,246,0.3); }

    /* ── Tab Navigation ──────────────────────────────── */
    .tabs-nav {
      max-width: 1440px; margin: 0 auto;
      padding: 20px 40px 0;
      display: flex; gap: 4px;
      border-bottom: 1px solid var(--border);
    }
    .tab-btn {
      padding: 12px 24px;
      background: transparent; border: none; color: var(--text-muted);
      font-family: inherit; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;
    }
    .tab-btn:hover { color: var(--text-secondary); }
    .tab-btn.active {
      color: var(--accent-primary);
      border-bottom-color: var(--accent-primary);
    }
    .tab-btn i { font-size: 0.85rem; }
    .tab-panel { display: none; animation: fadeUp 0.4s ease; }
    .tab-panel.active { display: block; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .content { max-width: 1440px; margin: 0 auto; padding: 30px 40px 60px; }

    /* ── Cards ────────────────────────────────────────── */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      transition: all 0.3s ease;
    }
    .card:hover { border-color: var(--border-glow); box-shadow: var(--shadow-glow); }
    .card-title {
      font-size: 0.85rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px;
      color: var(--text-muted); margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
    }
    .card-title i { color: var(--accent-primary); }

    /* ── Overview Stats ───────────────────────────────── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px; margin-bottom: 30px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px 28px;
      position: relative; overflow: hidden;
      transition: all 0.3s ease;
    }
    .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-glow); border-color: var(--border-glow); }
    .stat-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      border-radius: 3px 3px 0 0;
    }
    .stat-card.total::before { background: linear-gradient(90deg, var(--accent-primary), var(--pink)); }
    .stat-card.passed::before { background: var(--green); }
    .stat-card.failed::before { background: var(--red); }
    .stat-card.skipped::before { background: var(--yellow); }
    .stat-card.rate::before { background: linear-gradient(90deg, var(--cyan), var(--blue)); }

    .stat-label { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }
    .stat-value { font-size: 2.5rem; font-weight: 900; line-height: 1; }
    .stat-value.total-val { color: var(--accent-secondary); }
    .stat-value.pass-val { color: var(--green); }
    .stat-value.fail-val { color: var(--red); }
    .stat-value.skip-val { color: var(--yellow); }
    .stat-value.rate-val {
      background: linear-gradient(135deg, var(--cyan), var(--blue));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .stat-icon { position: absolute; top: 20px; right: 20px; font-size: 1.8rem; opacity: 0.1; }

    /* ── Charts Grid ──────────────────────────────────── */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }

    /* ── Donut Chart ──────────────────────────────────── */
    .donut-wrap { display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap; }
    .donut-svg { width: 180px; height: 180px; }
    .donut-center { font-size: 1.6rem; font-weight: 900; fill: var(--text-primary); }
    .donut-center-sub { font-size: 0.6rem; fill: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .donut-legend { display: flex; flex-direction: column; gap: 10px; }
    .legend-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-secondary); }
    .legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .legend-val { font-weight: 700; color: var(--text-primary); margin-left: auto; min-width: 25px; text-align: right; }

    /* ── Bar Chart ────────────────────────────────────── */
    .bar-chart { display: flex; flex-direction: column; gap: 14px; }
    .bar-row { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 140px; font-size: 0.78rem; color: var(--text-secondary); text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .bar-track { flex: 1; height: 28px; background: rgba(255,255,255,0.04); border-radius: 6px; overflow: hidden; position: relative; }
    .bar-fill { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.4,0,0.2,1); position: relative; min-width: 2px; }
    .bar-fill-inner { position: absolute; inset: 0; border-radius: 6px; opacity: 0.9; }
    .bar-value { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 0.72rem; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.4); }
    .bar-outside-value { width: 45px; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); }

    /* ── Modules Grid ─────────────────────────────────── */
    .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .module-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      transition: all 0.3s ease;
      position: relative; overflow: hidden;
    }
    .module-card:hover { border-color: var(--border-glow); transform: translateY(-3px); box-shadow: var(--shadow-glow); }
    .module-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
    .module-name { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); max-width: 200px; }
    .module-badge { padding: 4px 12px; border-radius: 50px; font-size: 0.72rem; font-weight: 700; }
    .module-badge.perfect { background: var(--green-glow); color: var(--green); }
    .module-badge.good { background: rgba(59,130,246,0.15); color: var(--blue); }
    .module-badge.warn { background: var(--yellow-glow); color: var(--yellow); }
    .module-badge.bad { background: var(--red-glow); color: var(--red); }

    .module-stats { display: flex; gap: 16px; margin-bottom: 16px; }
    .module-stat { display: flex; flex-direction: column; }
    .module-stat-val { font-size: 1.4rem; font-weight: 800; }
    .module-stat-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

    .module-bar-wrap { width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
    .module-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

    /* ── Results Table ────────────────────────────────── */
    .table-controls { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-box {
      flex: 1; min-width: 200px;
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 10px 16px 10px 40px;
      color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
      transition: all 0.3s ease; position: relative;
    }
    .search-box:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem; }
    .filter-select {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 10px 16px; color: var(--text-primary); font-family: inherit; font-size: 0.85rem;
      cursor: pointer;
    }
    .filter-select:focus { outline: none; border-color: var(--accent-primary); }
    .filter-select option { background: var(--bg-secondary); }

    .results-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .results-table th {
      padding: 14px 16px; text-align: left;
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px;
      color: var(--text-muted);
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 2;
    }
    .results-table td {
      padding: 12px 16px; font-size: 0.85rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
      transition: background 0.2s;
    }
    .results-table tr:hover td { background: rgba(139,92,246,0.04); }
    .results-table .id-cell { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--accent-secondary); font-size: 0.8rem; }
    .results-table .module-cell { font-weight: 500; color: var(--text-primary); }

    .status-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 14px; border-radius: 50px;
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px;
    }
    .status-pill.pass { background: var(--green-glow); color: var(--green); }
    .status-pill.fail { background: var(--red-glow); color: var(--red); }
    .status-pill.skip { background: var(--yellow-glow); color: var(--yellow); }

    .duration-cell {
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
      color: var(--text-muted);
    }
    .duration-cell.fast { color: var(--green); }
    .duration-cell.medium { color: var(--yellow); }
    .duration-cell.slow { color: var(--red); }

    .table-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 0; color: var(--text-muted); font-size: 0.85rem;
    }

    /* ── Response Time Chart ──────────────────────────── */
    .response-bars { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding: 20px 0; }
    .resp-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
    .resp-bar {
      width: 100%; max-width: 60px; border-radius: 6px 6px 0 0;
      transition: height 1s cubic-bezier(0.4,0,0.2,1);
      position: relative; min-height: 4px;
    }
    .resp-bar:hover { filter: brightness(1.2); }
    .resp-bar-label { font-size: 0.65rem; color: var(--text-muted); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; writing-mode: vertical-lr; transform: rotate(180deg); }
    .resp-bar-val { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); }

    /* ── Responsive ───────────────────────────────────── */
    @media (max-width: 1024px) {
      .charts-grid { grid-template-columns: 1fr; }
      .header { padding: 20px; }
      .content { padding: 20px; }
      .tabs-nav { padding: 15px 20px 0; overflow-x: auto; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .modules-grid { grid-template-columns: 1fr; }
      .donut-wrap { flex-direction: column; }
      .bar-label { width: 80px; font-size: 0.7rem; }
      .tab-btn { padding: 10px 14px; font-size: 0.8rem; }
      .tab-btn span { display: none; }
      .table-controls { flex-direction: column; }
      .results-table { font-size: 0.75rem; }
      .results-table th, .results-table td { padding: 8px; }
    }

    /* ── Animations ───────────────────────────────────── */
    .animate-in { opacity: 0; transform: translateY(20px); animation: animIn 0.6s ease forwards; }
    @keyframes animIn { to { opacity: 1; transform: translateY(0); } }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .delay-5 { animation-delay: 0.5s; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-primary); }
    ::-webkit-scrollbar-thumb { background: var(--bg-card-hover); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

    /* Expandable row */
    .expandable-row { cursor: pointer; }
    .detail-row { display: none; }
    .detail-row.open { display: table-row; }
    .detail-cell {
      padding: 16px 20px !important;
      background: rgba(139,92,246,0.03) !important;
    }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .detail-block label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
    .detail-block p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; word-break: break-word; }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="header-brand">
          <div class="header-icon"><i class="fas fa-flask"></i></div>
          <div>
            <div class="header-title">Fashion Store — Test Report</div>
            <div class="header-sub">Automated E2E Test Execution Dashboard</div>
          </div>
        </div>
        <div class="header-meta">
          <span class="header-badge badge-pass"><i class="fas fa-check-circle"></i> ${summary.totalPassed} Passed</span>
          <span class="header-badge badge-fail"><i class="fas fa-times-circle"></i> ${summary.totalFailed} Failed</span>
          <span class="header-badge badge-time"><i class="fas fa-clock"></i> ${durationSec}s</span>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <nav class="tabs-nav">
      <button class="tab-btn active" data-tab="overview"><i class="fas fa-chart-pie"></i> <span>Overview</span></button>
      <button class="tab-btn" data-tab="modules"><i class="fas fa-cubes"></i> <span>Modules</span></button>
      <button class="tab-btn" data-tab="results"><i class="fas fa-table"></i> <span>Test Results</span></button>
      <button class="tab-btn" data-tab="analytics"><i class="fas fa-chart-bar"></i> <span>Charts & Analytics</span></button>
    </nav>

    <div class="content">

      <!-- ═══ OVERVIEW TAB ═══ -->
      <div class="tab-panel active" id="tab-overview">
        <!-- Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card total animate-in delay-1">
            <div class="stat-label">Total Tests</div>
            <div class="stat-value total-val">${results.length}</div>
            <i class="fas fa-vial stat-icon"></i>
          </div>
          <div class="stat-card passed animate-in delay-2">
            <div class="stat-label">Passed</div>
            <div class="stat-value pass-val">${summary.totalPassed}</div>
            <i class="fas fa-check-circle stat-icon"></i>
          </div>
          <div class="stat-card failed animate-in delay-3">
            <div class="stat-label">Failed</div>
            <div class="stat-value fail-val">${summary.totalFailed}</div>
            <i class="fas fa-times-circle stat-icon"></i>
          </div>
          <div class="stat-card skipped animate-in delay-4">
            <div class="stat-label">Skipped</div>
            <div class="stat-value skip-val">${summary.totalSkipped}</div>
            <i class="fas fa-forward stat-icon"></i>
          </div>
          <div class="stat-card rate animate-in delay-5">
            <div class="stat-label">Pass Rate</div>
            <div class="stat-value rate-val">${summary.overallRate}%</div>
            <i class="fas fa-percentage stat-icon"></i>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-grid">
          <!-- Donut Chart -->
          <div class="card animate-in delay-2">
            <div class="card-title"><i class="fas fa-chart-pie"></i> Test Distribution</div>
            <div class="donut-wrap">
              ${generateDonutSVG(summary.totalPassed, summary.totalFailed, summary.totalSkipped, results.length)}
              <div class="donut-legend">
                <div class="legend-item"><span class="legend-dot" style="background:var(--green)"></span> Passed <span class="legend-val">${summary.totalPassed}</span></div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--red)"></span> Failed <span class="legend-val">${summary.totalFailed}</span></div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--yellow)"></span> Skipped <span class="legend-val">${summary.totalSkipped}</span></div>
              </div>
            </div>
          </div>

          <!-- Module Distribution Bar Chart -->
          <div class="card animate-in delay-3">
            <div class="card-title"><i class="fas fa-cubes"></i> Module Distribution</div>
            <div class="bar-chart">
              ${moduleStats.map(m => {
                const pct = m.total > 0 ? (m.passed / m.total * 100) : 0;
                const barColor = pct === 100 ? 'var(--green)' : pct >= 70 ? 'var(--blue)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
                return `<div class="bar-row">
                  <div class="bar-label" title="${m.name}">${m.name.length > 18 ? m.name.substring(0,18)+'…' : m.name}</div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width:${pct}%">
                      <div class="bar-fill-inner" style="background:${barColor}"></div>
                      ${pct > 20 ? `<span class="bar-value">${m.passed}/${m.total}</span>` : ''}
                    </div>
                  </div>
                  <div class="bar-outside-value">${pct.toFixed(0)}%</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Execution Info -->
        <div class="card animate-in delay-4">
          <div class="card-title"><i class="fas fa-info-circle"></i> Execution Info</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px;">
            <div><span style="color:var(--text-muted);font-size:0.8rem">Target URL</span><br/><span style="font-weight:600;font-family:'JetBrains Mono',monospace;font-size:0.85rem">${BASE_URL}</span></div>
            <div><span style="color:var(--text-muted);font-size:0.8rem">Timestamp</span><br/><span style="font-weight:600;font-size:0.85rem">${timestamp}</span></div>
            <div><span style="color:var(--text-muted);font-size:0.8rem">Duration</span><br/><span style="font-weight:600;font-size:0.85rem">${durationSec}s</span></div>
            <div><span style="color:var(--text-muted);font-size:0.8rem">Modules Tested</span><br/><span style="font-weight:600;font-size:0.85rem">${moduleStats.length}</span></div>
          </div>
        </div>
      </div>

      <!-- ═══ MODULES TAB ═══ -->
      <div class="tab-panel" id="tab-modules">
        <div class="modules-grid">
          ${moduleStats.map((m, i) => {
            const pct = m.passRate;
            const badgeClass = pct === 100 ? 'perfect' : pct >= 80 ? 'good' : pct >= 50 ? 'warn' : 'bad';
            const barColor = pct === 100 ? 'var(--green)' : pct >= 80 ? 'var(--blue)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
            return `<div class="module-card animate-in" style="animation-delay:${i * 0.08}s">
              <div class="module-header">
                <div class="module-name">${m.name}</div>
                <span class="module-badge ${badgeClass}">${pct}%</span>
              </div>
              <div class="module-stats">
                <div class="module-stat"><span class="module-stat-val" style="color:var(--text-primary)">${m.total}</span><span class="module-stat-label">Total</span></div>
                <div class="module-stat"><span class="module-stat-val" style="color:var(--green)">${m.passed}</span><span class="module-stat-label">Passed</span></div>
                <div class="module-stat"><span class="module-stat-val" style="color:var(--red)">${m.failed}</span><span class="module-stat-label">Failed</span></div>
                <div class="module-stat"><span class="module-stat-val" style="color:var(--yellow)">${m.skipped}</span><span class="module-stat-label">Skipped</span></div>
              </div>
              <div class="module-bar-wrap"><div class="module-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- ═══ TEST RESULTS TAB ═══ -->
      <div class="tab-panel" id="tab-results">
        <div class="card">
          <div class="table-controls">
            <div class="search-wrap">
              <i class="fas fa-search"></i>
              <input type="text" class="search-box" id="searchInput" placeholder="Search test cases..."/>
            </div>
            <select class="filter-select" id="statusFilter">
              <option value="all">All Status</option>
              <option value="PASS">Passed</option>
              <option value="FAIL">Failed</option>
              <option value="SKIP">Skipped</option>
            </select>
            <select class="filter-select" id="moduleFilter">
              <option value="all">All Modules</option>
              ${moduleStats.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
            </select>
          </div>
          <div style="overflow-x:auto">
            <table class="results-table" id="resultsTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Module</th>
                  <th>Test Case</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${results.map((r, i) => {
                  const pillClass = r.status === 'PASS' ? 'pass' : r.status === 'FAIL' ? 'fail' : 'skip';
                  const durClass = r.duration < 500 ? 'fast' : r.duration < 2000 ? 'medium' : 'slow';
                  return `<tr class="expandable-row" data-idx="${i}" data-status="${r.status}" data-module="${r.category}">
                    <td class="id-cell">${r.id}</td>
                    <td class="module-cell">${r.category}</td>
                    <td>${r.name}</td>
                    <td><span class="status-pill ${pillClass}"><i class="fas fa-${r.status === 'PASS' ? 'check' : r.status === 'FAIL' ? 'times' : 'forward'}"></i> ${r.status}</span></td>
                    <td class="duration-cell ${durClass}">${r.duration}ms</td>
                    <td style="color:var(--text-muted);font-size:0.8rem"><i class="fas fa-chevron-down"></i></td>
                  </tr>
                  <tr class="detail-row" data-detail="${i}">
                    <td colspan="6" class="detail-cell">
                      <div class="detail-grid">
                        <div class="detail-block"><label>Description</label><p>${escapeHtml(r.description)}</p></div>
                        <div class="detail-block"><label>Expected Result</label><p>${escapeHtml(r.expected)}</p></div>
                        <div class="detail-block"><label>Actual Result</label><p>${escapeHtml(r.actual)}</p></div>
                        <div class="detail-block"><label>Duration</label><p>${r.duration}ms</p></div>
                      </div>
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="table-footer">
            <span id="tableCount">Showing ${results.length} of ${results.length} test cases</span>
          </div>
        </div>
      </div>

      <!-- ═══ CHARTS & ANALYTICS TAB ═══ -->
      <div class="tab-panel" id="tab-analytics">
        <div class="charts-grid">
          <!-- Pass Rate by Module -->
          <div class="card animate-in delay-1">
            <div class="card-title"><i class="fas fa-chart-bar"></i> Pass Rate by Module</div>
            <div class="bar-chart">
              ${moduleStats.map(m => {
                const pct = m.passRate;
                const barColor = pct === 100 ? 'var(--green)' : pct >= 70 ? 'var(--blue)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
                return `<div class="bar-row">
                  <div class="bar-label" title="${m.name}">${m.name.length > 18 ? m.name.substring(0,18)+'…' : m.name}</div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width:${pct}%">
                      <div class="bar-fill-inner" style="background:${barColor}"></div>
                      ${pct > 15 ? `<span class="bar-value">${pct}%</span>` : ''}
                    </div>
                  </div>
                  <div class="bar-outside-value">${pct}%</div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="card animate-in delay-2">
            <div class="card-title"><i class="fas fa-layer-group"></i> Tests per Module</div>
            <div class="bar-chart">
              ${moduleStats.map(m => {
                const maxTests = Math.max(...moduleStats.map(x => x.total));
                const pct = maxTests > 0 ? (m.total / maxTests * 100) : 0;
                return `<div class="bar-row">
                  <div class="bar-label" title="${m.name}">${m.name.length > 18 ? m.name.substring(0,18)+'…' : m.name}</div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width:${pct}%">
                      <div class="bar-fill-inner" style="background:linear-gradient(90deg,var(--accent-primary),var(--pink))"></div>
                      ${pct > 15 ? `<span class="bar-value">${m.total}</span>` : ''}
                    </div>
                  </div>
                  <div class="bar-outside-value">${m.total}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Response Time -->
        <div class="card animate-in delay-3" style="margin-top:20px">
          <div class="card-title"><i class="fas fa-stopwatch"></i> Average Response Time by Module</div>
          <div class="response-bars">
            ${(() => {
              const maxDur = Math.max(...moduleDurations.map(d => d.avgDuration), 1);
              const colors = ['#8b5cf6','#ec4899','#06b6d4','#10b981','#f59e0b','#ef4444','#3b82f6','#a78bfa','#f97316','#14b8a6','#6366f1'];
              return moduleDurations.map((d, i) => {
                const h = Math.max((d.avgDuration / maxDur) * 100, 3);
                return `<div class="resp-bar-col">
                  <div class="resp-bar-val">${d.avgDuration}ms</div>
                  <div class="resp-bar" style="height:${h}%;background:${colors[i % colors.length]}"></div>
                  <div class="resp-bar-label">${d.name.split(' ').slice(0,2).join(' ')}</div>
                </div>`;
              }).join('');
            })()}
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="charts-grid" style="margin-top:20px">
          <div class="card animate-in delay-4">
            <div class="card-title"><i class="fas fa-trophy"></i> Top Performing Modules</div>
            ${moduleStats.filter(m => m.passRate === 100).length > 0
              ? moduleStats.filter(m => m.passRate === 100).map(m =>
                `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
                  <i class="fas fa-check-circle" style="color:var(--green)"></i>
                  <span style="font-weight:600;font-size:0.9rem">${m.name}</span>
                  <span style="margin-left:auto;font-size:0.8rem;color:var(--green);font-weight:700">${m.total}/${m.total}</span>
                </div>`).join('')
              : '<p style="color:var(--text-muted);font-size:0.9rem;padding:20px 0">No module achieved 100% pass rate</p>'
            }
          </div>
          <div class="card animate-in delay-5">
            <div class="card-title"><i class="fas fa-bug"></i> Modules Needing Attention</div>
            ${moduleStats.filter(m => m.passRate < 100).length > 0
              ? moduleStats.filter(m => m.passRate < 100).sort((a,b) => a.passRate - b.passRate).map(m =>
                `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
                  <i class="fas fa-exclamation-triangle" style="color:${m.passRate >= 70 ? 'var(--yellow)' : 'var(--red)'}"></i>
                  <span style="font-weight:600;font-size:0.9rem">${m.name}</span>
                  <span style="margin-left:auto;font-size:0.8rem;color:${m.passRate >= 70 ? 'var(--yellow)' : 'var(--red)'};font-weight:700">${m.passRate}%</span>
                </div>`).join('')
              : '<p style="color:var(--text-muted);font-size:0.9rem;padding:20px 0">All modules passed! 🎉</p>'
            }
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /app -->

  <script>
    // ── Tab Switching ───────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });

    // ── Expandable Rows ─────────────────────────────────
    document.querySelectorAll('.expandable-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = row.dataset.idx;
        const detail = document.querySelector('.detail-row[data-detail="' + idx + '"]');
        detail.classList.toggle('open');
        const icon = row.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (icon) icon.classList.toggle('fa-chevron-down'), icon.classList.toggle('fa-chevron-up');
      });
    });

    // ── Search & Filter ─────────────────────────────────
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const moduleFilter = document.getElementById('moduleFilter');

    function applyFilters() {
      const q = searchInput.value.toLowerCase();
      const statusVal = statusFilter.value;
      const moduleVal = moduleFilter.value;
      let visible = 0;

      document.querySelectorAll('.expandable-row').forEach(row => {
        const text = row.textContent.toLowerCase();
        const status = row.dataset.status;
        const mod = row.dataset.module;
        const matchSearch = !q || text.includes(q);
        const matchStatus = statusVal === 'all' || status === statusVal;
        const matchModule = moduleVal === 'all' || mod === moduleVal;
        const show = matchSearch && matchStatus && matchModule;
        row.style.display = show ? '' : 'none';
        const idx = row.dataset.idx;
        const detail = document.querySelector('.detail-row[data-detail="' + idx + '"]');
        if (!show && detail) { detail.classList.remove('open'); detail.style.display = 'none'; }
        else if (detail) { detail.style.display = ''; }
        if (show) visible++;
      });
      document.getElementById('tableCount').textContent = 'Showing ' + visible + ' of ${results.length} test cases';
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    moduleFilter.addEventListener('change', applyFilters);
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'test.html'), html, 'utf-8');
}

// ── SVG Donut Generator ─────────────────────────────────
function generateDonutSVG(passed, failed, skipped, total) {
  const r = 70, cx = 90, cy = 90, stroke = 18;
  const circumference = 2 * Math.PI * r;

  const pPassed = total > 0 ? passed / total : 0;
  const pFailed = total > 0 ? failed / total : 0;
  const pSkipped = total > 0 ? skipped / total : 0;

  const dPassed = circumference * pPassed;
  const dFailed = circumference * pFailed;
  const dSkipped = circumference * pSkipped;

  const offsetPassed = 0;
  const offsetFailed = circumference - dPassed;
  const offsetSkipped = circumference - dPassed - dFailed;

  const rate = total > 0 ? ((passed / total) * 100).toFixed(0) : 0;

  return `<svg class="donut-svg" viewBox="0 0 180 180">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${stroke}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#10b981" stroke-width="${stroke}"
      stroke-dasharray="${dPassed} ${circumference - dPassed}"
      stroke-dashoffset="${offsetPassed}" transform="rotate(-90 ${cx} ${cy})"
      stroke-linecap="round" style="transition:stroke-dasharray 1s ease"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ef4444" stroke-width="${stroke}"
      stroke-dasharray="${dFailed} ${circumference - dFailed}"
      stroke-dashoffset="-${dPassed}" transform="rotate(-90 ${cx} ${cy})"
      stroke-linecap="round" style="transition:stroke-dasharray 1s ease"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f59e0b" stroke-width="${stroke}"
      stroke-dasharray="${dSkipped} ${circumference - dSkipped}"
      stroke-dashoffset="-${dPassed + dFailed}" transform="rotate(-90 ${cx} ${cy})"
      stroke-linecap="round" style="transition:stroke-dasharray 1s ease"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center">${rate}%</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" class="donut-center-sub">pass rate</text>
  </svg>`;
}

// ── HTML Escape ─────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
