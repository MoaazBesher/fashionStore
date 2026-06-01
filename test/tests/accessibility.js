/**
 * Accessibility & Performance Tests
 * Category: Accessibility & Performance
 * Test IDs: TC-075 to TC-080
 *
 * Tests skip-to-content link, ARIA labels, keyboard navigation,
 * image alt attributes, toast container, and loader element.
 */

async function runAccessibilityTests(page, BASE_URL) {
  const results = [];

  // Navigate to base URL and wait for products to load
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForSelector('.product-card', { timeout: 10000 });

  // ─── TC-075: Skip-to-content link exists ───
  {
    const start = Date.now();
    const id = 'TC-075';
    try {
      const skipLink = await page.$('a.skip-link');
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Skip-to-content link exists',
        description: 'Check that a.skip-link element exists on the page',
        expected: 'a.skip-link element should exist for accessibility',
        actual: skipLink ? 'a.skip-link element found' : 'a.skip-link element not found',
        status: skipLink ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Skip-to-content link exists',
        description: 'Check that a.skip-link element exists on the page',
        expected: 'a.skip-link element should exist for accessibility',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-076: ARIA labels on nav ───
  {
    const start = Date.now();
    const id = 'TC-076';
    try {
      const navWithAria = await page.$('nav[aria-label]');
      let ariaLabel = null;
      if (navWithAria) {
        ariaLabel = await page.$eval('nav[aria-label]', el => el.getAttribute('aria-label'));
      }
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'ARIA labels on nav',
        description: 'Check that nav element has aria-label attribute',
        expected: 'nav[aria-label] should exist for screen reader accessibility',
        actual: navWithAria
          ? `nav[aria-label] found with label: "${ariaLabel}"`
          : 'No nav element with aria-label attribute found',
        status: navWithAria ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'ARIA labels on nav',
        description: 'Check that nav element has aria-label attribute',
        expected: 'nav[aria-label] should exist for screen reader accessibility',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-077: Keyboard escape closes modals ───
  {
    const start = Date.now();
    const id = 'TC-077';
    try {
      // Open cart modal first
      const cartIcon = await page.$('#cartIcon');
      if (cartIcon) {
        await page.waitForSelector('#loader.hidden');
        await page.click('#cartIcon');
        await page.waitForFunction(() => {
          const modal = document.querySelector('#cartModal');
          return modal && window.getComputedStyle(modal).display === 'block';
        });

        // Verify modal is open
        const displayBefore = await page.$eval('#cartModal', el =>
          window.getComputedStyle(el).display
        ).catch(() => 'none');

        // Press Escape key
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => {
          const modal = document.querySelector('#cartModal');
          return modal && window.getComputedStyle(modal).display === 'none';
        });

        // Check if modal is closed
        const displayAfter = await page.$eval('#cartModal', el =>
          window.getComputedStyle(el).display
        ).catch(() => 'none');

        const modalClosed = displayAfter === 'none';
        results.push({
          id, category: 'Accessibility & Performance',
          name: 'Keyboard escape closes modals',
          description: 'Open cart modal, press Escape, check modals are closed',
          expected: 'Pressing Escape key should close the cart modal',
          actual: modalClosed
            ? `Modal closed successfully. Before: "${displayBefore}", After: "${displayAfter}"`
            : `Modal did NOT close. Before: "${displayBefore}", After: "${displayAfter}"`,
          status: modalClosed ? 'PASS' : 'FAIL', duration: Date.now() - start
        });
      } else {
        results.push({
          id, category: 'Accessibility & Performance',
          name: 'Keyboard escape closes modals',
          description: 'Open cart modal, press Escape, check modals are closed',
          expected: 'Pressing Escape key should close the cart modal',
          actual: 'Cannot test: #cartIcon not found to open modal',
          status: 'FAIL', duration: Date.now() - start
        });
      }
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Keyboard escape closes modals',
        description: 'Open cart modal, press Escape, check modals are closed',
        expected: 'Pressing Escape key should close the cart modal',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-078: Images have alt attributes ───
  {
    const start = Date.now();
    const id = 'TC-078';
    try {
      const imgInfo = await page.$$eval('.product-card img', imgs => {
        const total = imgs.length;
        const withAlt = imgs.filter(img => img.hasAttribute('alt') && img.alt.trim() !== '').length;
        const withoutAlt = total - withAlt;
        const missingAltSrcs = imgs
          .filter(img => !img.hasAttribute('alt') || img.alt.trim() === '')
          .map(img => img.src)
          .slice(0, 3); // Show up to 3 examples
        return { total, withAlt, withoutAlt, missingAltSrcs };
      });

      const allHaveAlt = imgInfo.total > 0 && imgInfo.withoutAlt === 0;
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Images have alt attributes',
        description: 'Check all img elements in .product-card have alt attribute',
        expected: 'All product card images should have non-empty alt attributes',
        actual: imgInfo.total === 0
          ? 'No images found in .product-card elements'
          : allHaveAlt
            ? `All ${imgInfo.total} images have alt attributes`
            : `${imgInfo.withoutAlt}/${imgInfo.total} images missing alt. Examples: ${imgInfo.missingAltSrcs.join(', ')}`,
        status: allHaveAlt ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Images have alt attributes',
        description: 'Check all img elements in .product-card have alt attribute',
        expected: 'All product card images should have non-empty alt attributes',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-079: Toast container exists ───
  {
    const start = Date.now();
    const id = 'TC-079';
    try {
      const toastContainer = await page.$('#toastContainer');
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Toast container exists',
        description: 'Check that #toastContainer element exists on the page',
        expected: '#toastContainer element should exist for notification display',
        actual: toastContainer ? '#toastContainer element found' : '#toastContainer element not found',
        status: toastContainer ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Toast container exists',
        description: 'Check that #toastContainer element exists on the page',
        expected: '#toastContainer element should exist for notification display',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-080: Loader element exists ───
  {
    const start = Date.now();
    const id = 'TC-080';
    try {
      const loader = await page.$('#loader');
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Loader element exists',
        description: 'Check that #loader element exists on the page',
        expected: '#loader element should exist for loading state display',
        actual: loader ? '#loader element found' : '#loader element not found',
        status: loader ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Accessibility & Performance',
        name: 'Loader element exists',
        description: 'Check that #loader element exists on the page',
        expected: '#loader element should exist for loading state display',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  return results;
}

module.exports = runAccessibilityTests;
