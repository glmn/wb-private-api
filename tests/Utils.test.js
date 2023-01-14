/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const Utils = require('../src/Utils');

describe('Проверка утилит Card', () => {
  test('Проверка генерации URL на фотографии карточек .imageURL()', () => {
    const testurl = 'https://images.wbstatic.net/big/new/123450000/123456789-4.jpg?r=';
    const url = Utils.Card.imageURL(123456789, 'BIG', 4);
    expect(url).toContain(testurl);
  });
  test('Проверка метода getBasketNumber() генерации Basket номера по Артикулу товара', () => {
    const skus = [
      14381552, 14411552, 28910126, 71840112, 72232256, 101032256, 106332256,
      111632256, 117032256, 131499998,
    ];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const [index, sku] of skus.entries()) {
      const basket = Utils.Card.getBasketNumber(sku);
      expect(basket).toBe(expected[index]);
    }
  });
});
