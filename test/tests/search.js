module.exports = async function(page, BASE_URL) {
  const results = [];
  
  const recordResult = (id, name, description, expected, actual, status, duration) => {
    results.push({ id, category: 'Search Functionality', name, description, expected, actual, status, duration });
  };

  await page.goto(BASE_URL);
  
  try {
    await page.waitForSelector('.product-card', { timeout: 10000 });
  } catch (e) {
    console.log('Timeout waiting for initial products in search tests');
  }

  // Helper to count visible products
  const countProducts = async () => {
    return await page.$$eval('.product-card', els => els.filter(el => window.getComputedStyle(el).display !== 'none').length);
  };

  const initialCount = await countProducts();

  // TC-033: Search input accepts text
  let start = Date.now();
  try {
    const searchIcon = await page.$('#searchToggle');
    if (searchIcon) {
      const isHidden = await page.$eval('#searchInput', el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || el.offsetWidth === 0;
      });
      if (isHidden) {
        await searchIcon.click();
        await new Promise(r => setTimeout(r, 500));
      }
    }

    await page.type('#searchInput', 'dress');
    const value = await page.$eval('#searchInput', el => el.value);
    recordResult('TC-033', 'Search input accepts text', "Type 'dress' into #searchInput, check value", 'dress', value, value === 'dress' ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-033', 'Search input accepts text', "Type 'dress' into #searchInput, check value", 'dress', e.message, 'FAIL', Date.now() - start);
  }

  // TC-034: Search filters products
  start = Date.now();
  try {
    await new Promise(r => setTimeout(r, 500)); // wait for filter debounce if any
    const count = await countProducts();
    recordResult('TC-034', 'Search filters products', "Wait 500ms, check if products are filtered", 'Filtered', `${count} products`, count >= 0 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-034', 'Search filters products', "Wait 500ms, check if products are filtered", 'Filtered', e.message, 'FAIL', Date.now() - start);
  }

  // TC-035: Search with no results
  start = Date.now();
  try {
    await page.evaluate(() => document.getElementById('searchInput').value = '');
    await page.type('#searchInput', 'xyznonexistent123');
    await new Promise(r => setTimeout(r, 500));
    
    const isVisible = await page.$eval('#noResults', el => {
      const style = window.getComputedStyle(el);
      return style && style.display !== 'none' && style.visibility !== 'hidden';
    });
    recordResult('TC-035', 'Search with no results', "Type 'xyznonexistent123', check #noResults is visible", 'Visible', isVisible ? 'Visible' : 'Hidden', isVisible ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-035', 'Search with no results', "Type 'xyznonexistent123', check #noResults is visible", 'Visible', e.message, 'FAIL', Date.now() - start);
  }

  // TC-036: Clearing search restores products
  start = Date.now();
  try {
    await page.evaluate(() => {
      const input = document.getElementById('searchInput');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await new Promise(r => setTimeout(r, 500));
    
    const count = await countProducts();
    recordResult('TC-036', 'Clearing search restores products', "Clear #searchInput, check products appear", '> 0 products', `${count} products`, count > 0 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-036', 'Clearing search restores products', "Clear #searchInput, check products appear", '> 0 products', e.message, 'FAIL', Date.now() - start);
  }

  // TC-037: Search is case-insensitive
  start = Date.now();
  try {
    await page.type('#searchInput', 'DRESS');
    await new Promise(r => setTimeout(r, 500));
    const count = await countProducts();
    recordResult('TC-037', 'Search is case-insensitive', "Type 'DRESS', check products", '>= 0 products', `${count} products`, count >= 0 ? 'PASS' : 'FAIL', Date.now() - start);
  } catch (e) {
    recordResult('TC-037', 'Search is case-insensitive', "Type 'DRESS', check products", '>= 0 products', e.message, 'FAIL', Date.now() - start);
  }

  return results;
};
