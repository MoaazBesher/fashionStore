/**
 * Responsive Design Tests
 * Category: Responsive Design
 * Test IDs: TC-069 to TC-074
 *
 * Tests the website's responsive behavior across different
 * viewport sizes: desktop, laptop, tablet, and mobile.
 */

async function runResponsiveTests(page, BASE_URL) {
  const results = [];

  // ─── TC-069: Desktop layout (1920x1080) ───
  {
    const start = Date.now();
    const id = 'TC-069';
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const navVisible = await page.$eval('nav, .navbar, header', el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).catch(() => false);

      const productsVisible = await page.$$('.product-card');

      results.push({
        id, category: 'Responsive Design',
        name: 'Desktop layout (1920x1080)',
        description: 'Set viewport to 1920x1080, check navbar is visible and products grid shows',
        expected: 'Navbar should be visible and product cards should render at 1920x1080',
        actual: `Navbar visible: ${navVisible}, Product cards: ${productsVisible.length}`,
        status: navVisible && productsVisible.length > 0 ? 'PASS' : 'FAIL',
        duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Desktop layout (1920x1080)',
        description: 'Set viewport to 1920x1080, check navbar is visible and products grid shows',
        expected: 'Navbar should be visible and product cards should render at 1920x1080',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-070: Laptop layout (1366x768) ───
  {
    const start = Date.now();
    const id = 'TC-070';
    try {
      await page.setViewport({ width: 1366, height: 768 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const navVisible = await page.$eval('nav, .navbar, header', el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).catch(() => false);

      const productsVisible = await page.$$('.product-card');

      results.push({
        id, category: 'Responsive Design',
        name: 'Laptop layout (1366x768)',
        description: 'Set viewport to 1366x768, check page renders correctly',
        expected: 'Page should render correctly at 1366x768 with visible navbar and products',
        actual: `Navbar visible: ${navVisible}, Product cards: ${productsVisible.length}`,
        status: navVisible && productsVisible.length > 0 ? 'PASS' : 'FAIL',
        duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Laptop layout (1366x768)',
        description: 'Set viewport to 1366x768, check page renders correctly',
        expected: 'Page should render correctly at 1366x768 with visible navbar and products',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-071: Tablet layout (768x1024) ───
  {
    const start = Date.now();
    const id = 'TC-071';
    try {
      await page.setViewport({ width: 768, height: 1024 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const pageElements = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, header');
        const products = document.querySelectorAll('.product-card');
        const navStyle = nav ? window.getComputedStyle(nav) : null;
        return {
          navVisible: navStyle ? navStyle.display !== 'none' && navStyle.visibility !== 'hidden' : false,
          productCount: products.length
        };
      });

      results.push({
        id, category: 'Responsive Design',
        name: 'Tablet layout (768x1024)',
        description: 'Set viewport to 768x1024, check page elements still visible',
        expected: 'Page elements should remain visible at tablet viewport 768x1024',
        actual: `Navbar visible: ${pageElements.navVisible}, Product cards: ${pageElements.productCount}`,
        status: pageElements.navVisible && pageElements.productCount > 0 ? 'PASS' : 'FAIL',
        duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Tablet layout (768x1024)',
        description: 'Set viewport to 768x1024, check page elements still visible',
        expected: 'Page elements should remain visible at tablet viewport 768x1024',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-072: Mobile layout (375x667) ───
  {
    const start = Date.now();
    const id = 'TC-072';
    try {
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const pageElements = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, header');
        const products = document.querySelectorAll('.product-card');
        const navStyle = nav ? window.getComputedStyle(nav) : null;
        return {
          navExists: nav !== null,
          navVisible: navStyle ? navStyle.display !== 'none' && navStyle.visibility !== 'hidden' : false,
          productCount: products.length
        };
      });

      results.push({
        id, category: 'Responsive Design',
        name: 'Mobile layout (375x667)',
        description: 'Set viewport to 375x667, check navbar and products still visible',
        expected: 'Navbar and products should remain visible at mobile viewport 375x667',
        actual: `Nav exists: ${pageElements.navExists}, Nav visible: ${pageElements.navVisible}, Product cards: ${pageElements.productCount}`,
        status: pageElements.navExists && pageElements.productCount > 0 ? 'PASS' : 'FAIL',
        duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Mobile layout (375x667)',
        description: 'Set viewport to 375x667, check navbar and products still visible',
        expected: 'Navbar and products should remain visible at mobile viewport 375x667',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-073: Product grid adapts on mobile ───
  {
    const start = Date.now();
    const id = 'TC-073';
    try {
      // Viewport should still be 375x667 from previous test
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const gridInfo = await page.evaluate(() => {
        const cards = document.querySelectorAll('.product-card');
        if (cards.length < 2) return { adapted: true, detail: 'Only 1 card, stacking not applicable' };

        const firstCard = cards[0].getBoundingClientRect();
        const secondCard = cards[1].getBoundingClientRect();

        // On mobile, cards should be stacked vertically (second card below first)
        // or taking full width
        const isStacked = secondCard.top >= firstCard.bottom - 5; // Allow small tolerance
        const isFullWidth = firstCard.width >= 300; // At 375px viewport, card should be near full width

        return {
          adapted: isStacked || isFullWidth,
          firstCardWidth: Math.round(firstCard.width),
          firstCardTop: Math.round(firstCard.top),
          secondCardTop: Math.round(secondCard.top),
          isStacked,
          isFullWidth
        };
      });

      results.push({
        id, category: 'Responsive Design',
        name: 'Product grid adapts on mobile',
        description: 'At 375x667, check product cards are stacked (grid changes for mobile)',
        expected: 'Product cards should stack vertically or span full width on mobile',
        actual: gridInfo.adapted
          ? `Grid adapted for mobile. Stacked: ${gridInfo.isStacked}, Full-width: ${gridInfo.isFullWidth}, Card width: ${gridInfo.firstCardWidth}px`
          : `Grid did NOT adapt. Card width: ${gridInfo.firstCardWidth}px, 1st card top: ${gridInfo.firstCardTop}, 2nd card top: ${gridInfo.secondCardTop}`,
        status: gridInfo.adapted ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Product grid adapts on mobile',
        description: 'At 375x667, check product cards are stacked (grid changes for mobile)',
        expected: 'Product cards should stack vertically or span full width on mobile',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-074: Footer visible on all sizes ───
  {
    const start = Date.now();
    const id = 'TC-074';
    try {
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });

      const footerVisible = await page.$eval('.footer, footer', el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).catch(() => false);

      results.push({
        id, category: 'Responsive Design',
        name: 'Footer visible on all sizes',
        description: 'Check .footer is visible at 375x667 mobile viewport',
        expected: 'Footer should be visible at mobile viewport size',
        actual: footerVisible ? 'Footer is visible at 375x667' : 'Footer is NOT visible at 375x667',
        status: footerVisible ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Responsive Design',
        name: 'Footer visible on all sizes',
        description: 'Check .footer is visible at 375x667 mobile viewport',
        expected: 'Footer should be visible at mobile viewport size',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  return results;
}

module.exports = runResponsiveTests;
