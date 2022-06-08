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
  },
};

console.log(Utils.Card.imageURL(60059650, 'SMALL', 4));

module.exports = Utils;
