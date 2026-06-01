module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Page Loading & SEO', name, description, expected, actual, status, duration });
  };

  // TC-001: Homepage loads
  let start = Date.now();
  try {
    const response = await page.goto(BASE_URL);
    const status = response.status();
    recordResult('TC-001', 'Homepage loads (HTTP 200)', 'Navigate to BASE_URL and check response status', '200 OK', `HTTP ${status}`, status === 200 || status === 304 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-001', 'Homepage loads (HTTP 200)', 'Navigate to BASE_URL and check response status', '200 OK', e.message, 'FAIL', Date.now() - start);
  }

  // TC-002: Product page loads
  start = Date.now();
  try {
    const response = await page.goto(BASE_URL + 'product.html?id=test');
    const status = response.status();
    recordResult('TC-002', 'Product page loads', 'Navigate to product page', '200 OK', `HTTP ${status}`, status === 200 || status === 304 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-002', 'Product page loads', 'Navigate to product page', '200 OK', e.message, 'FAIL', Date.now() - start);
  }

  // TC-003: Admin page loads
  start = Date.now();
  try {
    const response = await page.goto(BASE_URL + 'admin/');
    const status = response.status();
    recordResult('TC-003', 'Admin page loads', 'Navigate to admin page', '200 OK', `HTTP ${status}`, status === 200 || status === 304 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-003', 'Admin page loads', 'Navigate to admin page', '200 OK', e.message, 'FAIL', Date.now() - start);
  }

  // TC-004: Profile page loads
  start = Date.now();
  try {
    const response = await page.goto(BASE_URL + 'profile/');
    const status = response.status();
    recordResult('TC-004', 'Profile page loads', 'Navigate to profile page', '200 OK', `HTTP ${status}`, status === 200 || status === 304 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-004', 'Profile page loads', 'Navigate to profile page', '200 OK', e.message, 'FAIL', Date.now() - start);
  }

  // Back to home for SEO checks
  await page.goto(BASE_URL);

  // TC-005: Page title is correct
  start = Date.now();
  try {
    const title = await page.title();
    const hasTitle = title.includes('Fashion Store');
    recordResult('TC-005', 'Page title is correct', 'Check document.title contains Fashion Store', 'Contains Fashion Store', `Title: ${title}`, hasTitle ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-005', 'Page title is correct', 'Check document.title contains Fashion Store', 'Contains Fashion Store', e.message, 'FAIL', Date.now() - start);
  }

  // TC-006: Meta description exists
  start = Date.now();
  try {
    const metaDesc = await page.$eval('meta[name="description"]', el => el.content);
    recordResult('TC-006', 'Meta description exists', 'Check meta[name=description] has content', 'Has content', metaDesc ? 'Found' : 'Not found', metaDesc ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-006', 'Meta description exists', 'Check meta[name=description] has content', 'Has content', e.message, 'FAIL', Date.now() - start);
  }

  // TC-007: Meta viewport exists
  start = Date.now();
  try {
    const metaViewport = await page.$eval('meta[name="viewport"]', el => el.content);
    recordResult('TC-007', 'Meta viewport exists', 'Check meta[name=viewport] exists', 'Exists', metaViewport ? 'Found' : 'Not found', metaViewport ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-007', 'Meta viewport exists', 'Check meta[name=viewport] exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-008: Open Graph tags exist
  start = Date.now();
  try {
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
    recordResult('TC-008', 'Open Graph tags exist', 'Check meta[property=og:title] exists', 'Exists', ogTitle ? 'Found' : 'Not found', ogTitle ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-008', 'Open Graph tags exist', 'Check meta[property=og:title] exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
