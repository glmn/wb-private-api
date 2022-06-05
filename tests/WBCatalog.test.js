/* eslint-disable no-undef */
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();
const TIMEOUT = 30 * 1000;
jest.setTimeout(TIMEOUT);

test('Проверка получения 100 товаров со 2 страницы по ключевому запросу "Платье"', async () => {
  const catalog = await wbapi.search('Платье');
  expect(catalog.page(2).length).toBe(100);
});
