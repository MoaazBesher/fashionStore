/**
 * Checkout Flow Tests
 * Category: Checkout Flow
 * Test IDs: TC-056 to TC-063
 *
 * Tests the checkout modal, form fields, governorate dropdown,
 * and payment method options.
 */

async function runCheckoutTests(page, BASE_URL) {
  const results = [];

  // Navigate to base URL and wait for page to load
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });

  // ─── TC-056: Checkout modal exists ───
  {
    const start = Date.now();
    const id = 'TC-056';
    try {
      const checkoutModal = await page.$('#checkoutModal');
      results.push({
        id, category: 'Checkout Flow',
        name: 'Checkout modal exists',
        description: 'Check that #checkoutModal element exists on the page',
        expected: '#checkoutModal element should exist',
        actual: checkoutModal ? '#checkoutModal element found' : '#checkoutModal element not found',
        status: checkoutModal ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Checkout modal exists',
        description: 'Check that #checkoutModal element exists on the page',
        expected: '#checkoutModal element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-057: Checkout form exists ───
  {
    const start = Date.now();
    const id = 'TC-057';
    try {
      const checkoutForm = await page.$('#checkoutForm');
      results.push({
        id, category: 'Checkout Flow',
        name: 'Checkout form exists',
        description: 'Check that #checkoutForm element exists on the page',
        expected: '#checkoutForm element should exist',
        actual: checkoutForm ? '#checkoutForm element found' : '#checkoutForm element not found',
        status: checkoutForm ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Checkout form exists',
        description: 'Check that #checkoutForm element exists on the page',
        expected: '#checkoutForm element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-058: Full name field exists ───
  {
    const start = Date.now();
    const id = 'TC-058';
    try {
      const fullName = await page.$('#fullName');
      const tagName = fullName ? await page.$eval('#fullName', el => el.tagName.toLowerCase()) : null;
      results.push({
        id, category: 'Checkout Flow',
        name: 'Full name field exists',
        description: 'Check that #fullName input element exists on the page',
        expected: '#fullName input element should exist',
        actual: fullName ? `#fullName element found (tag: ${tagName})` : '#fullName element not found',
        status: fullName ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Full name field exists',
        description: 'Check that #fullName input element exists on the page',
        expected: '#fullName input element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-059: Phone field exists with pattern ───
  {
    const start = Date.now();
    const id = 'TC-059';
    try {
      const phone = await page.$('#phone');
      let hasPattern = false;
      let patternValue = null;
      if (phone) {
        patternValue = await page.$eval('#phone', el => el.getAttribute('pattern'));
        hasPattern = patternValue !== null && patternValue !== '';
      }
      const passed = phone !== null && hasPattern;
      results.push({
        id, category: 'Checkout Flow',
        name: 'Phone field exists with pattern',
        description: 'Check that #phone input exists and has a pattern attribute for validation',
        expected: '#phone input should exist with a pattern attribute',
        actual: !phone
          ? '#phone element not found'
          : hasPattern
            ? `#phone found with pattern="${patternValue}"`
            : '#phone found but missing pattern attribute',
        status: passed ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Phone field exists with pattern',
        description: 'Check that #phone input exists and has a pattern attribute for validation',
        expected: '#phone input should exist with a pattern attribute',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-060: Email field exists ───
  {
    const start = Date.now();
    const id = 'TC-060';
    try {
      const email = await page.$('#email');
      results.push({
        id, category: 'Checkout Flow',
        name: 'Email field exists',
        description: 'Check that #email input element exists on the page',
        expected: '#email input element should exist',
        actual: email ? '#email element found' : '#email element not found',
        status: email ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Email field exists',
        description: 'Check that #email input element exists on the page',
        expected: '#email input element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-061: Governorate dropdown exists ───
  {
    const start = Date.now();
    const id = 'TC-061';
    try {
      const governorate = await page.$('#governorate');
      const tagName = governorate ? await page.$eval('#governorate', el => el.tagName.toLowerCase()) : null;
      const isSelect = tagName === 'select';
      results.push({
        id, category: 'Checkout Flow',
        name: 'Governorate dropdown exists',
        description: 'Check that #governorate select element exists on the page',
        expected: '#governorate select element should exist',
        actual: !governorate
          ? '#governorate element not found'
          : isSelect
            ? '#governorate select element found'
            : `#governorate found but is <${tagName}>, not <select>`,
        status: governorate && isSelect ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Governorate dropdown exists',
        description: 'Check that #governorate select element exists on the page',
        expected: '#governorate select element should exist',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-062: Governorate has Egyptian options ───
  {
    const start = Date.now();
    const id = 'TC-062';
    try {
      const options = await page.$$eval('#governorate option', opts =>
        opts.map(o => o.textContent.trim())
      );
      const requiredCities = ['Cairo', 'Giza', 'Alexandria'];
      const foundCities = requiredCities.filter(city =>
        options.some(opt => opt.toLowerCase().includes(city.toLowerCase()))
      );
      const allFound = foundCities.length === requiredCities.length;
      results.push({
        id, category: 'Checkout Flow',
        name: 'Governorate has Egyptian options',
        description: 'Check that #governorate dropdown includes Cairo, Giza, and Alexandria',
        expected: 'Governorate dropdown should contain Cairo, Giza, and Alexandria options',
        actual: allFound
          ? `All required cities found: ${foundCities.join(', ')}`
          : `Missing cities. Found: [${foundCities.join(', ')}], Expected: [${requiredCities.join(', ')}]. Available options: [${options.join(', ')}]`,
        status: allFound ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Governorate has Egyptian options',
        description: 'Check that #governorate dropdown includes Cairo, Giza, and Alexandria',
        expected: 'Governorate dropdown should contain Cairo, Giza, and Alexandria options',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  // ─── TC-063: Payment method shows Cash on Delivery ───
  {
    const start = Date.now();
    const id = 'TC-063';
    try {
      const paymentInfo = await page.$eval('#paymentMethod', el => {
        const selectedOption = el.options ? el.options[el.selectedIndex] : null;
        const allOptions = el.options
          ? Array.from(el.options).map(o => o.textContent.trim())
          : [];
        return {
          selectedText: selectedOption ? selectedOption.textContent.trim() : el.textContent.trim(),
          allOptions
        };
      });
      const hasCOD = paymentInfo.selectedText.toLowerCase().includes('cash on delivery') ||
        paymentInfo.allOptions.some(o => o.toLowerCase().includes('cash on delivery'));
      results.push({
        id, category: 'Checkout Flow',
        name: 'Payment method shows Cash on Delivery',
        description: 'Check that #paymentMethod has "Cash on Delivery" option selected',
        expected: '#paymentMethod should have "Cash on Delivery" as an option',
        actual: hasCOD
          ? `"Cash on Delivery" found. Selected: "${paymentInfo.selectedText}"`
          : `"Cash on Delivery" not found. Options: [${paymentInfo.allOptions.join(', ')}]`,
        status: hasCOD ? 'PASS' : 'FAIL', duration: Date.now() - start
      });
    } catch (err) {
      results.push({
        id, category: 'Checkout Flow',
        name: 'Payment method shows Cash on Delivery',
        description: 'Check that #paymentMethod has "Cash on Delivery" option selected',
        expected: '#paymentMethod should have "Cash on Delivery" as an option',
        actual: `Error: ${err.message}`,
        status: 'FAIL', duration: Date.now() - start
      });
    }
  }

  return results;
}

module.exports = runCheckoutTests;
