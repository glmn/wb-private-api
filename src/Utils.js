/* eslint-disable no-nested-ternary */
const format = require('string-format');
const Constants = require('./Constants');

format.extend(String.prototype, {});

const imageURL = (productId, imageType = 'SMALL', order = 1) => {
  const vol = parseInt(productId / 100000, 10);
  const part = parseInt(productId / 1000, 10);
  const random = Date.now();

  const basket = getBasketNumber(productId);
  const basketWithZero = basket < 10 ? `0${basket}` : basket;

  const URL = Constants.URLS.IMAGES[imageType];
  return `${URL.format(basketWithZero, vol, part, productId, order)}?r=${random}`;
};

const getBasketNumber = (productId) => {
  const basket = function (t) {
    if (t >= 0 && t <= 143) return 1;
    if (t >= 144 && t <= 287) return 2;
    if (t >= 288 && t <= 431) return 3;
    if (t >= 432 && t <= 719) return 4;
    if (t >= 720 && t <= 1007) return 5;
    if (t >= 1008 && t <= 1061) return 6;
    if (t >= 1062 && t <= 1115) return 7;
    if (t >= 1116 && t <= 1169) return 8;
    if (t >= 1170 && t <= 1313) return 9;
    if (t >= 1314 && t <= 1601) return 10;
    return 11;
  };
  return basket(parseInt(productId / 1e5, 10));
};

const brandImageURL = (brandId) => Constants.URLS.BRAND.IMAGE.format(brandId);

const Utils = {
  Card: {
    imageURL,
    getBasketNumber,
  },
  Brand: {
    imageURL: brandImageURL,
  },
};

module.exports = Utils;
