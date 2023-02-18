/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Constants = require('../src/Constants');
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI({
  destination: Constants.DESTINATIONS.MOSCOW,
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

  test('Поиск количества товаров (редких) по ключевому слову "тату майнкрафт"', async () => {
    const totalProducts = await wbapi.searchTotalProducts('тату майнкрафт');
    expect(totalProducts).toBeGreaterThan(0);
  });

  test('Проверка получения Query Params по ключевому слову "Платье"', async () => {
    const metadata = await wbapi.getQueryMetadata('Платье');
    const { catalog_type, catalog_value } = metadata;
    expect(typeof metadata === 'object').toBeTruthy();
    expect(catalog_type).toBe('subject');
    expect(catalog_value).toBe('subject=69;70;2613;2905;4000;4855;4857');
  });

  test('Проверка метода getQueryMetadata на запросых разных страниц', async () => {
    const pageOne = await wbapi.getQueryMetadata('Платье', 3, true, 1);
    const pageTwo = await wbapi.getQueryMetadata('Платье', 3, true, 2);
    expect(pageOne.products[0].id !== pageTwo.products[0].id).toBeTruthy();
  });

  test('Сбор 3 страниц товаров по ключевому слову "Платье"', async () => {
    const catalog = await wbapi.search('Платье', 3);
    expect(catalog.products.length).toBe(300);
  });

  test('Проверка аргумента pageCount на понижение кол-ва страниц, если их меньше чем запрошено', async () => {
    const pageCount = 100;
    const catalog = await wbapi.search('nokia 3310', pageCount);
    expect(pageCount).toBeGreaterThan(catalog.pages);
  });

  test('Проверка метода .keyHint(query) на вывод предположений по фразу "Платье"', async () => {
    const hints = await wbapi.keyHint('Платье');
    expect(hints[0].type).toBe('suggest');
  });

  test('Проверка метода .searchSimilarByNm(productId) на возврат идентификаторов похожиш товаров', async () => {
    const similarIds = await wbapi.searchSimilarByNm(60059650);
    expect(similarIds.length).toBeGreaterThan(0);
  });

  test('Проверка метода .getPromos() на возврат текущих промо-акций', async () => {
    const promos = await wbapi.getPromos();
    expect(promos.length).toBeGreaterThan(0);
  });

  test('Проверка метода .getListOfProducts() на возврат найденных товаров', async () => {
    const products = Array(10)
      .fill(60059650)
      .map((v, idx) => v + idx);
    const list = await wbapi.getListOfProducts(products);
    expect(list.length).toBeGreaterThan(0);
  });
});
