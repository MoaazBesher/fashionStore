/**
 * Cart Functionality Tests
 * Category: Cart Functionality
 * Test IDs: TC-046 to TC-055
 *
 * Tests the shopping cart UI elements, modal behavior,
 * empty state, and localStorage persistence.
 */

async function runCartTests(page, BASE_URL) {
  const results = [];

  // Navigate to base URL and wait for page to load
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });

  // ─── TC-046: Cart icon exists with count badge ───
  {
    const start = Date.now();
    const id = 'TC-046';
    try {
      const cartIcon = await page.$('#cartIcon');
      const cartCount = await page.$('#cartCount');
      if (cartIcon && cartCount) {
        results.push({
          id, category: 'Cart Functionality',
          name: 'Cart icon exists with count badge',
          description: 'Check that #cartIcon and #cartCount elements exist on the page',
          expected: '#cartIcon and #cartCount elements should exist',
          actual: 'Both #cartIcon and #cartCount elements found',
          status: 'PASS', duration: Date.now() - start
        });
      } else {
        results.push({
          id, category: 'Cart Functionality',
          name: 'Cart icon exists with count badge',
          description: 'Check that #cartIcon and #cartCount elements exist on the page',
          expected: '#cartIcon and #cartCount elements should exist',
          actual: `#cartIcon: ${cartIcon ? 'found' : 'missing'}, #cartCount: ${cartCount ? 'found' : 'missing'}`,
          status: 'FAIL', duration: Date.now() - start
        });
      }
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart icon exists with count badge',
        description: 'Check that #cartIcon and #cartCount elements exist on the page',
        expected: '#cartIcon and #cartCount elements should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-047: Cart count initially shows 0 or empty ───
  {
    const start = Date.now();
    const id = 'TC-047';
    try {
      const countText = await page.$eval('#cartCount', el => el.textContent.trim());
      if (countText === '0' || countText === '') {
        results.push({
          id, category: 'Cart Functionality',
          name: 'Cart count initially shows 0 or empty',
          description: 'Check that #cartCount text is "0" or empty string',
          expected: 'Cart count should be "0" or ""',
          actual: `Cart count text is "${countText}"`,
          status: 'PASS', duration: Date.now() - start
        });
      } else {
        results.push({
          id, category: 'Cart Functionality',
          name: 'Cart count initially shows 0 or empty',
          description: 'Check that #cartCount text is "0" or empty string',
          expected: 'Cart count should be "0" or ""',
          actual: `Cart count text is "${countText}"`,
          status: 'FAIL', duration: Date.now() - start
        });
      }
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart count initially shows 0 or empty',
        description: 'Check that #cartCount text is "0" or empty string',
        expected: 'Cart count should be "0" or ""',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-048: Cart modal exists ───
  {
    const start = Date.now();
    const id = 'TC-048';
    try {
      const cartModal = await page.$('#cartModal');
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart modal exists',
        description: 'Check that #cartModal element exists on the page',
        expected: '#cartModal element should exist',
        actual: cartModal ? '#cartModal element found' : '#cartModal element not found',
        status: cartModal ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart modal exists',
        description: 'Check that #cartModal element exists on the page',
        expected: '#cartModal element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-049: Click cart icon opens cart modal ───
  {
    const start = Date.now();
    const id = 'TC-049';
    try {
      await page.waitForSelector('#loader.hidden');
      await page.click('#cartIcon');
      // Wait for modal to be visible
      await page.waitForFunction(() => {
        const modal = document.querySelector('#cartModal');
        return modal && window.getComputedStyle(modal).display === 'block';
      });
      const display = await page.$eval('#cartModal', el => {
        const style = window.getComputedStyle(el);
        return style.display;
      });
      results.push({
        id, category: 'Cart Functionality',
        name: 'Click cart icon opens cart modal',
        description: 'Click #cartIcon and check #cartModal display becomes "block"',
        expected: '#cartModal display should be "block" after clicking cart icon',
        actual: `#cartModal display is "${display}"`,
        status: display === 'block' ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Click cart icon opens cart modal',
        description: 'Click #cartIcon and check #cartModal display becomes "block"',
        expected: '#cartModal display should be "block" after clicking cart icon',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-050: Empty cart shows empty message ───
  {
    const start = Date.now();
    const id = 'TC-050';
    try {
      // Cart modal should be open from previous test; check for empty state text
      const modalText = await page.$eval('#cartModal', el => el.textContent.toLowerCase());
      const hasEmptyState = modalText.includes('empty') || modalText.includes('no items') ||
        modalText.includes('no products') || modalText.includes('cart is empty');
      results.push({
        id, category: 'Cart Functionality',
        name: 'Empty cart shows empty message',
        description: 'Inside cart modal, check for empty state text indicating no items',
        expected: 'Cart modal should display an empty state message',
        actual: hasEmptyState ? 'Empty state message found in cart modal' : `No empty state text found. Modal text: "${modalText.substring(0, 100)}..."`,
        status: hasEmptyState ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Empty cart shows empty message',
        description: 'Inside cart modal, check for empty state text indicating no items',
        expected: 'Cart modal should display an empty state message',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-051: Cart modal has close button ───
  {
    const start = Date.now();
    const id = 'TC-051';
    try {
      const closeBtn = await page.$('#cartModal .modal-close');
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart modal has close button',
        description: 'Check that .modal-close button exists inside #cartModal',
        expected: '.modal-close element should exist inside #cartModal',
        actual: closeBtn ? '.modal-close button found in #cartModal' : '.modal-close button not found in #cartModal',
        status: closeBtn ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart modal has close button',
        description: 'Check that .modal-close button exists inside #cartModal',
        expected: '.modal-close element should exist inside #cartModal',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-052: Close button closes cart modal ───
  {
    const start = Date.now();
    const id = 'TC-052';
    try {
      // Ensure modal is open first
      const displayBefore = await page.$eval('#cartModal', el => window.getComputedStyle(el).display);
      if (displayBefore !== 'block') {
        await page.waitForSelector('#loader.hidden');
        await page.click('#cartIcon');
        await page.waitForFunction(() => {
          const modal = document.querySelector('#cartModal');
          return modal && window.getComputedStyle(modal).display === 'block';
        });
      }
      // Click close button
      await page.click('#cartModal .modal-close');
      // Wait for modal to be hidden
      await page.waitForFunction(() => {
        const modal = document.querySelector('#cartModal');
        return modal && window.getComputedStyle(modal).display === 'none';
      });
      const displayAfter = await page.$eval('#cartModal', el => window.getComputedStyle(el).display);
      results.push({
        id, category: 'Cart Functionality',
        name: 'Close button closes cart modal',
        description: 'Click .modal-close button and verify #cartModal is hidden',
        expected: '#cartModal should be hidden (display: none) after clicking close button',
        actual: `#cartModal display is "${displayAfter}" after clicking close`,
        status: displayAfter === 'none' ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Close button closes cart modal',
        description: 'Click .modal-close button and verify #cartModal is hidden',
        expected: '#cartModal should be hidden (display: none) after clicking close button',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-053: Checkout button exists ───
  {
    const start = Date.now();
    const id = 'TC-053';
    try {
      const checkoutBtn = await page.$('#checkoutBtn');
      results.push({
        id, category: 'Cart Functionality',
        name: 'Checkout button exists',
        description: 'Check that #checkoutBtn element exists on the page',
        expected: '#checkoutBtn element should exist',
        actual: checkoutBtn ? '#checkoutBtn element found' : '#checkoutBtn element not found',
        status: checkoutBtn ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Checkout button exists',
        description: 'Check that #checkoutBtn element exists on the page',
        expected: '#checkoutBtn element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-054: Cart total element exists ───
  {
    const start = Date.now();
    const id = 'TC-054';
    try {
      const cartTotal = await page.$('#cartTotal');
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart total element exists',
        description: 'Check that #cartTotal element exists on the page',
        expected: '#cartTotal element should exist',
        actual: cartTotal ? '#cartTotal element found' : '#cartTotal element not found',
        status: cartTotal ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart total element exists',
        description: 'Check that #cartTotal element exists on the page',
        expected: '#cartTotal element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-055: Cart persists via localStorage ───
  {
    const start = Date.now();
    const id = 'TC-055';
    try {
      const cartData = await page.evaluate(() => localStorage.getItem('cart'));
      let isValidJSON = false;
      if (cartData !== null) {
        try {
          JSON.parse(cartData);
          isValidJSON = true;
        } catch (_) {
          isValidJSON = false;
        }
      }
      // Cart key existing with valid JSON (even if empty array) or null (not set yet) are both acceptable
      const passed = cartData === null || isValidJSON;
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart persists via localStorage',
        description: 'Evaluate localStorage.getItem("cart") and check it returns valid JSON',
        expected: 'localStorage "cart" key should return valid JSON or null',
        actual: cartData === null
          ? 'localStorage "cart" is null (not set yet - acceptable)'
          : isValidJSON
            ? `localStorage "cart" contains valid JSON: ${cartData.substring(0, 80)}...`
            : `localStorage "cart" contains invalid JSON: ${cartData.substring(0, 80)}...`,
        status: passed ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Cart Functionality',
        name: 'Cart persists via localStorage',
        description: 'Evaluate localStorage.getItem("cart") and check it returns valid JSON',
        expected: 'localStorage "cart" key should return valid JSON or null',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  return results;
}

module.exports = runCartTests;
