/* eslint-disable no-undef */
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

test('Поиск рекламодателей по ключевому слову "Платье"', async () => {
  const ads = await wbapi.searchAds('Платье');
  expect(ads.adverts.length).toBeGreaterThan(0);
});

test('Проверка отображения CPM у рекламодателей', async () => {
  const ads = await wbapi.searchAds('Платье');
  expect(ads.adverts[0].cpm).toBeGreaterThan(0);
});

test('Поиск количества товаров по ключевому слову "Платье"', async () => {
  const totalProducts = await wbapi.searchTotalProducts('Платье');
  expect(totalProducts).toBeGreaterThan(0);
});

test('Проверка получения shardKey и пресета по ключевому слову "Платье"', async () => {
  const [shardKey, preset, presetValue] = await wbapi._getQueryParams('Платье');
  expect(shardKey).toBe('dresses');
  expect(preset).toBe('subject');
  expect(presetValue).toBe('69;70;2613;2905;4000;4855;4857');
});

test('Проверка получения shardKey и пресета по ключевому слову "Платье"', async () => {
  const [shardKey, preset, presetValue] = await wbapi._getQueryParams('Платье');
  const catalogPage = await wbapi.getCatalogPage({ shardKey, preset, presetValue }, 3);
  expect(catalogPage.length).toBe(100);
});

test('Сбор 100 страниц товаров по ключевому слову "Платье"', async () => {
  const catalog = await wbapi.search('Платье');
  expect(catalog.products.length).toBeGreaterThan(9990);
}, 30 * 1000);
