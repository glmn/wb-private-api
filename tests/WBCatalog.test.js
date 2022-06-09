/* eslint-disable no-undef */
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

describe('Проверка класса WBCatalog', () => {
  test('Проверка метода .page() по ключевому запросу "Платье"', async () => {
    const catalog = await wbapi.search('Платье', 2);
    expect(catalog.page(2).length).toBe(100);
  }, 30 * 1000);

  test('Проверка метода .getPosition() по ключевому запросу "Менструальные чаши"', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 3);
    const position = catalog.getPosition(60059650);
    expect(position).toBeGreaterThan(0);
  });

  test('Проверка метода .getPosition() на ответ при ложном поиске', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 3);
    const position = catalog.getPosition(0);
    expect(position).toBe(-1);
  });
});
