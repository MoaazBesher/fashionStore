module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Product Detail Page', name, description, expected, actual, status, duration });
  };

  // Using a dummy ID or common structure
  const productUrl = BASE_URL + 'product.html?id=-OPjEww0MvbVqyHRwqiW';

  // TC-038: Page loads with product ID
  let start = Date.now();
  try {
    const response = await page.goto(productUrl);
    const status = response.status();
    recordResult('TC-038', 'Page loads with product ID', 'Navigate to product detail page', '200 OK', `HTTP ${status}`, status === 200 || status === 304 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-038', 'Page loads with product ID', 'Navigate to product detail page', '200 OK', e.message, 'FAIL', Date.now() - start);
  }

  // TC-039: Loading state appears initially
  start = Date.now();
  try {
    // It might be hidden immediately or after data load, but we check if it exists in DOM
    const exists = await page.$('#productLoading') !== null;
    recordResult('TC-039', 'Loading state appears initially', 'Check #productLoading exists on page', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-039', 'Loading state appears initially', 'Check #productLoading exists on page', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-040: Breadcrumb navigation exists
  start = Date.now();
  try {
    const exists = await page.$('.breadcrumb') !== null;
    recordResult('TC-040', 'Breadcrumb navigation exists', 'Check .breadcrumb exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-040', 'Breadcrumb navigation exists', 'Check .breadcrumb exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-041: Product title element exists
  start = Date.now();
  try {
    const exists = await page.$('#pdTitle') !== null;
    recordResult('TC-041', 'Product title element exists', 'Check #pdTitle exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-041', 'Product title element exists', 'Check #pdTitle exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-042: Product price element exists
  start = Date.now();
  try {
    const exists = await page.$('#pdPrice') !== null;
    recordResult('TC-042', 'Product price element exists', 'Check #pdPrice exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-042', 'Product price element exists', 'Check #pdPrice exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-043: Product category element exists
  start = Date.now();
  try {
    const exists = await page.$('#pdCategory') !== null;
    recordResult('TC-043', 'Product category element exists', 'Check #pdCategory exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-043', 'Product category element exists', 'Check #pdCategory exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-044: Quantity controls exist
  start = Date.now();
  try {
    const minus = await page.$('#pdQtyMinus') !== null;
    const plus = await page.$('#pdQtyPlus') !== null;
    const display = await page.$('#pdQtyDisplay') !== null;
    const allExist = minus && plus && display;
    recordResult('TC-044', 'Quantity controls exist', 'Check quantity buttons and display exist', 'Exist', allExist ? 'Exist' : 'Missing some', allExist ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-044', 'Quantity controls exist', 'Check quantity buttons and display exist', 'Exist', e.message, 'FAIL', Date.now() - start);
  }

  // TC-045: Add to cart button exists
  start = Date.now();
  try {
    const exists = await page.$('#pdAddToCart') !== null;
    recordResult('TC-045', 'Add to cart button exists', 'Check #pdAddToCart exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-045', 'Add to cart button exists', 'Check #pdAddToCart exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
