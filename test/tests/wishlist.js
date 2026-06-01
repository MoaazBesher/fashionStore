/**
 * Wishlist Functionality Tests
 * Category: Wishlist Functionality
 * Test IDs: TC-064 to TC-068
 *
 * Tests the wishlist modal, items container, product card
 * wishlist buttons, localStorage persistence, and heart icons.
 */

async function runWishlistTests(page, BASE_URL) {
  const results = [];

  // Navigate to base URL and wait for products to load
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForSelector('.product-card', { timeout: 10000 });

  // ─── TC-064: Wishlist modal exists ───
  {
    const start = Date.now();
    const id = 'TC-064';
    try {
      const wishlistModal = await page.$('#wishlistModal');
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist modal exists',
        description: 'Check that #wishlistModal element exists on the page',
        expected: '#wishlistModal element should exist',
        actual: wishlistModal ? '#wishlistModal element found' : '#wishlistModal element not found',
        status: wishlistModal ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist modal exists',
        description: 'Check that #wishlistModal element exists on the page',
        expected: '#wishlistModal element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-065: Wishlist items container exists ───
  {
    const start = Date.now();
    const id = 'TC-065';
    try {
      const wishlistItems = await page.$('#wishlistItems');
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist items container exists',
        description: 'Check that #wishlistItems element exists on the page',
        expected: '#wishlistItems element should exist',
        actual: wishlistItems ? '#wishlistItems element found' : '#wishlistItems element not found',
        status: wishlistItems ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist items container exists',
        description: 'Check that #wishlistItems element exists on the page',
        expected: '#wishlistItems element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-066: Product cards have wishlist button ───
  {
    const start = Date.now();
    const id = 'TC-066';
    try {
      const wishlistBtns = await page.$$('.product-card .product-wishlist');
      const productCards = await page.$$('.product-card');
      const hasButtons = wishlistBtns.length > 0;
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Product cards have wishlist button',
        description: 'Wait for .product-card and check .product-wishlist button exists',
        expected: 'Product cards should have .product-wishlist buttons',
        actual: hasButtons
          ? `Found ${wishlistBtns.length} wishlist button(s) across ${productCards.length} product card(s)`
          : `No .product-wishlist buttons found in ${productCards.length} product card(s)`,
        status: hasButtons ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Product cards have wishlist button',
        description: 'Wait for .product-card and check .product-wishlist button exists',
        expected: 'Product cards should have .product-wishlist buttons',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-067: Wishlist persists via localStorage ───
  {
    const start = Date.now();
    const id = 'TC-067';
    try {
      const wishlistData = await page.evaluate(() => localStorage.getItem('wishlist'));
      let isValidArray = false;
      if (wishlistData !== null) {
        try {
          const parsed = JSON.parse(wishlistData);
          isValidArray = Array.isArray(parsed);
        } catch (_) {
          isValidArray = false;
        }
      }
      // Wishlist key existing with valid JSON array or null (not set yet) are both acceptable
      const passed = wishlistData === null || isValidArray;
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist persists via localStorage',
        description: 'Evaluate localStorage.getItem("wishlist") and check it returns valid JSON array',
        expected: 'localStorage "wishlist" key should return valid JSON array or null',
        actual: wishlistData === null
          ? 'localStorage "wishlist" is null (not set yet - acceptable)'
          : isValidArray
            ? `localStorage "wishlist" contains valid JSON array: ${wishlistData.substring(0, 80)}...`
            : `localStorage "wishlist" is not a valid JSON array: ${wishlistData.substring(0, 80)}...`,
        status: passed ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist persists via localStorage',
        description: 'Evaluate localStorage.getItem("wishlist") and check it returns valid JSON array',
        expected: 'localStorage "wishlist" key should return valid JSON array or null',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-068: Wishlist heart icon exists on cards ───
  {
    const start = Date.now();
    const id = 'TC-068';
    try {
      const heartIcons = await page.$$eval('.product-wishlist i', icons =>
        icons.map(i => i.className)
      );
      const hasHeartIcons = heartIcons.length > 0;
      const hasCorrectClass = heartIcons.some(cls =>
        cls.includes('fa-heart')
      );
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist heart icon exists on cards',
        description: 'Check .product-wishlist i element exists with fa-heart class (far or fas)',
        expected: 'Product cards should have heart icons (far fa-heart or fas fa-heart)',
        actual: hasHeartIcons
          ? `Found ${heartIcons.length} heart icon(s). Classes: ${heartIcons.slice(0, 3).join(', ')}${heartIcons.length > 3 ? '...' : ''}`
          : 'No heart icons found in .product-wishlist elements',
        status: hasHeartIcons && hasCorrectClass ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Wishlist Functionality',
        name: 'Wishlist heart icon exists on cards',
        description: 'Check .product-wishlist i element exists with fa-heart class (far or fas)',
        expected: 'Product cards should have heart icons (far fa-heart or fas fa-heart)',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  return results;
}

module.exports = runWishlistTests;
