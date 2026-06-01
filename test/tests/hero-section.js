module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Hero Section', name, description, expected, actual, status, duration });
  };

  await page.goto(BASE_URL);

  // TC-017: Hero section renders
  let start = Date.now();
  try {
    const exists = await page.$('.hero') !== null;
    recordResult('TC-017', 'Hero section renders', 'Check .hero section exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-017', 'Hero section renders', 'Check .hero section exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-018: Hero title displays correct text
  start = Date.now();
  try {
    const titleText = await page.$eval('.hero-title', el => el.textContent);
    const hasText = titleText.includes('Discover Your');
    recordResult('TC-018', 'Hero title displays correct text', 'Check .hero-title contains Discover Your', 'Contains text', hasText ? 'Contains' : 'Missing', hasText ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-018', 'Hero title displays correct text', 'Check .hero-title contains Discover Your', 'Contains text', e.message, 'FAIL', Date.now() - start);
  }

  // TC-019: Hero badge shows year
  start = Date.now();
  try {
    const yearText = await page.$eval('#currentYear', el => el.textContent);
    const currentYear = new Date().getFullYear().toString();
    const hasYear = yearText.includes(currentYear);
    recordResult('TC-019', 'Hero badge shows year', 'Check .hero-badge and #currentYear has current year', 'Current year', hasYear ? 'Match' : 'Mismatch', hasYear ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-019', 'Hero badge shows year', 'Check .hero-badge and #currentYear has current year', 'Current year', e.message, 'FAIL', Date.now() - start);
  }

  // TC-020: Shop Collection CTA exists
  start = Date.now();
  try {
    const ctaExists = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.textContent.includes('Shop Collection'));
    });
    recordResult('TC-020', 'Shop Collection CTA exists', 'Check anchor with text Shop Collection exists', 'Exists', ctaExists ? 'Exists' : 'Not found', ctaExists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-020', 'Shop Collection CTA exists', 'Check anchor with text Shop Collection exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-021: Contact Us CTA exists
  start = Date.now();
  try {
    const ctaExists = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.textContent.includes('Contact Us'));
    });
    recordResult('TC-021', 'Contact Us CTA exists', 'Check anchor with text Contact Us exists', 'Exists', ctaExists ? 'Exists' : 'Not found', ctaExists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-021', 'Contact Us CTA exists', 'Check anchor with text Contact Us exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-022: Hero stats section exists
  start = Date.now();
  try {
    const itemsCount = await page.$$eval('.hero-stats .stat-item', els => els.length);
    recordResult('TC-022', 'Hero stats section exists', 'Check .hero-stats has .stat-item elements', '> 0 items', `${itemsCount} items`, itemsCount > 0 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-022', 'Hero stats section exists', 'Check .hero-stats has .stat-item elements', '> 0 items', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
