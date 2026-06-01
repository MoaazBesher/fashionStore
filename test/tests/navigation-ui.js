module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Navigation & UI', name, description, expected, actual, status, duration });
  };

  await page.goto(BASE_URL);

  // TC-009: Navbar is visible
  let start = Date.now();
  try {
    const isVisible = await page.$eval('#navbar', el => {
      const style = window.getComputedStyle(el);
      return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    recordResult('TC-009', 'Navbar is visible', 'Check #navbar is visible', 'Visible', isVisible ? 'Visible' : 'Hidden', isVisible ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-009', 'Navbar is visible', 'Check #navbar is visible', 'Visible', e.message, 'FAIL', Date.now() - start);
  }

  // TC-010: Brand logo/text displayed
  start = Date.now();
  try {
    const brandText = await page.$eval('.navbar-brand', el => el.textContent);
    const hasText = brandText.includes('Fashion Store');
    recordResult('TC-010', 'Brand logo/text displayed', 'Check .navbar-brand contains Fashion Store', 'Contains text', hasText ? 'Contains' : 'Missing', hasText ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-010', 'Brand logo/text displayed', 'Check .navbar-brand contains Fashion Store', 'Contains text', e.message, 'FAIL', Date.now() - start);
  }

  // TC-011: Search input exists
  start = Date.now();
  try {
    const searchExists = await page.$('#searchInput') !== null;
    recordResult('TC-011', 'Search input exists', 'Check #searchInput exists', 'Exists', searchExists ? 'Exists' : 'Not found', searchExists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-011', 'Search input exists', 'Check #searchInput exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-012: Search toggle button exists
  start = Date.now();
  try {
    const toggleExists = await page.$('#searchToggle') !== null;
    recordResult('TC-012', 'Search toggle button exists', 'Check #searchToggle exists', 'Exists', toggleExists ? 'Exists' : 'Not found', toggleExists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-012', 'Search toggle button exists', 'Check #searchToggle exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-013: Sign-in button is visible
  start = Date.now();
  try {
    const isVisible = await page.$eval('#signInBtn', el => {
      const style = window.getComputedStyle(el);
      return style && style.display !== 'none' && style.visibility !== 'hidden';
    });
    recordResult('TC-013', 'Sign-in button is visible', 'Check #signInBtn exists and is visible', 'Visible', isVisible ? 'Visible' : 'Hidden', isVisible ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-013', 'Sign-in button is visible', 'Check #signInBtn exists and is visible', 'Visible', e.message, 'FAIL', Date.now() - start);
  }

  // TC-014: Cart icon is visible
  start = Date.now();
  try {
    const isVisible = await page.$eval('#cartIcon', el => {
      const style = window.getComputedStyle(el);
      return style && style.display !== 'none' && style.visibility !== 'hidden';
    });
    recordResult('TC-014', 'Cart icon is visible', 'Check #cartIcon exists and visible', 'Visible', isVisible ? 'Visible' : 'Hidden', isVisible ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-014', 'Cart icon is visible', 'Check #cartIcon exists and visible', 'Visible', e.message, 'FAIL', Date.now() - start);
  }

  // TC-015: Footer is visible with year
  start = Date.now();
  try {
    const yearText = await page.$eval('#footerYear', el => el.textContent);
    const currentYear = new Date().getFullYear().toString();
    const hasYear = yearText.includes(currentYear);
    recordResult('TC-015', 'Footer is visible with year', 'Check .footer exists, #footerYear has current year', 'Current year', hasYear ? 'Match' : 'Mismatch', hasYear ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-015', 'Footer is visible with year', 'Check .footer exists, #footerYear has current year', 'Current year', e.message, 'FAIL', Date.now() - start);
  }

  // TC-016: Trust bar items displayed
  start = Date.now();
  try {
    const itemsCount = await page.$$eval('.trust-item', els => els.length);
    recordResult('TC-016', 'Trust bar items displayed', 'Check .trust-bar has 4 .trust-item elements', '4 items', `${itemsCount} items`, itemsCount === 4 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-016', 'Trust bar items displayed', 'Check .trust-bar has 4 .trust-item elements', '4 items', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
