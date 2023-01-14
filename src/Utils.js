/* eslint-disable no-nested-ternary */
const format = require('string-format');
const Constants = require('./Constants');

format.extend(String.prototype, {});

const Utils = {
  Card: {
    imageURL(productId, imageType = 'SMALL', order = 1) {
      const archive = parseInt(productId / 10000, 10);
      const random = Date.now();
      const URL = Constants.URLS.IMAGES[imageType];
      return URL.format(archive, productId, random, order);
    },
    getBasketNumber(sku) {
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
      return basket(parseInt(sku / 1e5, 10));
    },
  },
};

module.exports = Utils;
