/* eslint-disable no-undef */
const Utils = require('../src/Utils');

describe('Проверка утилит Card', () => {
  test('Проверка генерации URL на фотографии карточек .imageURL()', () => {
    const random = Date.now();
    const testurl = 'https://images.wbstatic.net/big/new/123450000/123456789-4.jpg?r=';
    const url = Utils.Card.imageURL(123456789, 'BIG', 4);
    expect(url).toBe(testurl + random);
  });
});
