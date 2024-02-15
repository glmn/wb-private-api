/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const Utils = require("../src/Utils");

describe("Проверка утилит Card", () => {
  test("Проверка генерации URL на логотип бренда Brand.imageURL()", () => {
    const testurl = "https://images.wbstatic.net/brands/small/7658.jpg";
    const url = Utils.Brand.imageURL(7658);
    expect(url).toContain(testurl);
  });
  test("Проверка генерации URL на фотографии карточек Card.imageURL()", () => {
    const testurl =
      "https://basket-12.wbbasket.ru/vol1778/part177899/177899980/images/big/3.jpg";
    const url = Utils.Card.imageURL(177899980, "BIG", 3);
    expect(url).toContain(testurl);
  });
  test("Проверка метода getBasketNumber() генерации Basket номера по Артикулу товара", () => {
    const skus = [
      14381552, 14411552, 28910126, 71840112, 72232256, 101032256, 106332256,
      111632256, 117032256, 131499998, 165879870
    ];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
    for (const [index, sku] of skus.entries()) {
      const basket = Utils.Card.getBasketNumber(sku);
      expect(basket).toBe(expected[index]);
    }
  });
});
