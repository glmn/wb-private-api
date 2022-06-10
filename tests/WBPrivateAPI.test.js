/* eslint-disable no-undef */
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

describe('Проверка поиска рекламодателей WBPrivateAPI.searchAds()', () => {
  test('Присутствие не пустого свойства adverts', async () => {
    const ads = await wbapi.searchAds('Платье');
    expect(ads.adverts.length).toBeGreaterThan(0);
    expect(ads.prioritySubjects.length).toBeGreaterThan(0);
    expect(ads.adverts[0].cpm).toBeGreaterThan(0);
    expect(ads.pages.length).toBeGreaterThan(0);
  });
});

describe('Проверка поиска товаров WBPrivateAPI.search()', () => {
  test('Поиск количества товаров по ключевому слову "Платье"', async () => {
    const totalProducts = await wbapi.searchTotalProducts('Платье');
    expect(totalProducts).toBeGreaterThan(0);
  });

  test('Проверка получения Query Params по ключевому слову "Платье"', async () => {
    const queryParams = await wbapi._getQueryParams('Платье');
    const [shardKey, preset, presetValue] = queryParams;
    expect(Array.isArray(queryParams)).toBeTruthy();
    expect(shardKey).toBe('dresses');
    expect(preset).toBe('subject');
    expect(presetValue).toBe('69;70;2613;2905;4000;4855;4857');
  });

  test('Сбор 3 страниц товаров по ключевому слову "Платье"', async () => {
    const catalog = await wbapi.search('Платье', 3);
    expect(catalog.products.length).toBe(300);
  });

  test('Проверка аргумента pageCount на понижение кол-ва страниц, если их меньше чем запрошено', async () => {
    const pageCount = 100;
    const catalog = await wbapi.search('Менструальные чаши', pageCount);
    expect(pageCount).toBeGreaterThan(catalog.pages);
  });

  test('Проверка метода .keyHint(query) на понижение кол-ва страниц, если их меньше чем запрошено', async () => {
    const hints = await wbapi.keyHint('Платье');
    expect(hints[0].type).toBe('suggest');
  });
});
