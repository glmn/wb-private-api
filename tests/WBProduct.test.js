/* eslint-disable no-undef */
const Constants = require('../src/Constants');
const WBPrivateAPI = require('../src/WBPrivateAPI');
const WBProduct = require('../src/WBProduct');

const wbapi = new WBPrivateAPI({
  destination: Constants.DESTINATIONS.MOSCOW,
});

describe('Проверка класса WBProduct', () => {
  test('Проверка метода .getStocks() на возврат данных об остатках товара на складах', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 1);
    const product = catalog.products[0];
    await product.getStocks();
    expect(product.totalStocks).toBeGreaterThan(0);
  });

  test('Проверка метода .getPromo() на возврат данных об участии в промо-акции', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 1);
    const product = catalog.products[0];
    await product.getPromo();
    expect(typeof product.promo.active === 'boolean').toBeTruthy();
  });

  test('Проверка метода .getFeedbacks() на возврат всех отзывов', async () => {
    const product = await WBProduct.create(76545116);
    await product.getFeedbacks();
    expect(typeof product.feedbacks === 'object').toBeTruthy();
    expect(product.feedbacks.length).toBeGreaterThan(0);
  }, 30 * 1000);

  test('Проверка метода .getQuestions() на возврат всех вопросов', async () => {
    const product = await WBProduct.create(60460901);
    await product.getQuestions();
    expect(typeof product.questions === 'object').toBeTruthy();
    expect(product.questions.length).toBe(product.totalQuestions);
  }, 30 * 1000);
});
