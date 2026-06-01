module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Product Display & Filtering', name, description, expected, actual, status, duration });
  };

  await page.goto(BASE_URL);

  // TC-023: Products grid container exists
  let start = Date.now();
  try {
    const exists = await page.$('#products') !== null;
    recordResult('TC-023', 'Products grid container exists', 'Check #products exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-023', 'Products grid container exists', 'Check #products exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-024: Products load from Firebase
  start = Date.now();
  try {
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const count = await page.$$eval('.product-card', els => els.length);
    recordResult('TC-024', 'Products load from Firebase', 'Wait for .product-card elements, check count > 0', '> 0 cards', `${count} cards`, count > 0 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-024', 'Products load from Firebase', 'Wait for .product-card elements, check count > 0', '> 0 cards', e.message, 'FAIL', Date.now() - start);
  }

  // TC-025: Product cards have name
  start = Date.now();
  try {
    const hasName = await page.$eval('.product-card .product-name', el => el.textContent.trim().length > 0);
    recordResult('TC-025', 'Product cards have name', 'Check .product-name exists in first card', 'Has name', hasName ? 'Yes' : 'No', hasName ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-025', 'Product cards have name', 'Check .product-name exists in first card', 'Has name', e.message, 'FAIL', Date.now() - start);
  }

  // TC-026: Product cards have price
  start = Date.now();
  try {
    const hasPrice = await page.$eval('.product-card .price-current, .product-card .product-price', el => el.textContent.trim().length > 0);
    recordResult('TC-026', 'Product cards have price', 'Check .price-current exists in first card', 'Has price', hasPrice ? 'Yes' : 'No', hasPrice ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-026', 'Product cards have price', 'Check .price-current exists in first card', 'Has price', e.message, 'FAIL', Date.now() - start);
  }

  // TC-027: Product cards have image
  start = Date.now();
  try {
    const hasImage = await page.$('.product-card .product-image img') !== null;
    recordResult('TC-027', 'Product cards have image', 'Check .product-image img exists in first card', 'Has image', hasImage ? 'Yes' : 'No', hasImage ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-027', 'Product cards have image', 'Check .product-image img exists in first card', 'Has image', e.message, 'FAIL', Date.now() - start);
  }

  // TC-028: Product cards have rating
  start = Date.now();
  try {
    const hasRating = await page.$('.product-card .product-rating') !== null;
    recordResult('TC-028', 'Product cards have rating', 'Check .product-rating exists in first card', 'Has rating', hasRating ? 'Yes' : 'No', hasRating ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-028', 'Product cards have rating', 'Check .product-rating exists in first card', 'Has rating', e.message, 'FAIL', Date.now() - start);
  }

  // TC-029: 'All Products' filter is active by default
  start = Date.now();
  try {
    const activeFilter = await page.$eval('.filter-btn.active', el => el.getAttribute('data-category'));
    recordResult('TC-029', "'All Products' filter is active by default", "Check .filter-btn.active has data-category='all'", 'all', activeFilter, activeFilter === 'all' ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-029', "'All Products' filter is active by default", "Check .filter-btn.active has data-category='all'", 'all', e.message, 'FAIL', Date.now() - start);
  }

  // TC-030: Dresses filter button exists
  start = Date.now();
  try {
    const exists = await page.$('.filter-btn[data-category="dress"]') !== null;
    recordResult('TC-030', 'Dresses filter button exists', 'Check .filter-btn[data-category=dress] exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-030', 'Dresses filter button exists', 'Check .filter-btn[data-category=dress] exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-031: Bags filter button exists
  start = Date.now();
  try {
    const exists = await page.$('.filter-btn[data-category="bag"]') !== null;
    recordResult('TC-031', 'Bags filter button exists', 'Check .filter-btn[data-category=bag] exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-031', 'Bags filter button exists', 'Check .filter-btn[data-category=bag] exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  // TC-032: Accessories filter button exists
  start = Date.now();
  try {
    const exists = await page.$('.filter-btn[data-category="accessory"]') !== null;
    recordResult('TC-032', 'Accessories filter button exists', 'Check .filter-btn[data-category=accessory] exists', 'Exists', exists ? 'Exists' : 'Not found', exists ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-032', 'Accessories filter button exists', 'Check .filter-btn[data-category=accessory] exists', 'Exists', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
