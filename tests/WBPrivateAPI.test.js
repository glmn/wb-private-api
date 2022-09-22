/* eslint-disable no-undef */
const Constants = require('../src/Constants');
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI({
  destination: Constants.DESTINATIONS.MOSCOW
});

describe('Проверка поиска рекламодателей', () => {
  test('Проверка рекламы по Поиску .getSearchAds()', async () => {
    const ads = await wbapi.getSearchAds('Платье');
    expect(ads.adverts.length).toBeGreaterThan(0);
    expect(ads.prioritySubjects.length).toBeGreaterThan(0);
    expect(ads.adverts[0].cpm).toBeGreaterThan(0);
    expect(ads.pages.length).toBeGreaterThan(0);
  });

  test('Проверка карусели внутри карточки .getCarouselAds()', async () => {
    const ads = await wbapi.getCarouselAds(60059650);
    expect(ads.length).toBeGreaterThan(0);
    expect(ads[0].cpm).toBeGreaterThan(0);
  });
});

describe('Проверка поиска товаров WBPrivateAPI.search()', () => {
  test('Поиск количества товаров по ключевому слову "Платье"', async () => {
    const totalProducts = await wbapi.searchTotalProducts('Платье');
    expect(totalProducts).toBeGreaterThan(0);
  });

  test('Проверка получения Query Params по ключевому слову "Платье"', async () => {
    const queryParams = await wbapi.getQueryParams('Платье');
    const [shardKey, query] = queryParams;
    expect(Array.isArray(queryParams)).toBeTruthy();
    expect(shardKey).toBe('dresses');
    expect(query).toBe('subject=69;70;2613;2905;4000;4855;4857');
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

  test('Проверка метода .keyHint(query) на вывод предположений по фразу "Платье"', async () => {
    const hints = await wbapi.keyHint('Платье');
    expect(hints[0].type).toBe('suggest');
  });

  test('Проверка метода .searchSimilarByNm(productId) на возврат идентификаторов похожиш товаров', async () => {
    const similar = await wbapi.searchSimilarByNm(60059650);
    expect(similar.value.nmIds.length).toBeGreaterThan(0);
  });
});
