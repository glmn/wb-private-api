/* eslint-disable no-nested-ternary */
const format = require("string-format");
const Constants = require("./Constants");
const moment = require("moment")

format.extend(String.prototype, {});

const BASKETS = [
  [0, 143],
  [144, 287],
  [288, 431],
  [432, 719],
  [720, 1007],
  [1008, 1061],
  [1062, 1115],
  [1116, 1169],
  [1170, 1313],
  [1314, 1601],
  [1602, 1655],
  [1656, 1919],
  [1920, 2045],
  [2046, 2189]
];

const imageURL = (productId, imageType = "SMALL", order = 1) => {
  const vol = parseInt(productId / 100000, 10);
  const part = parseInt(productId / 1000, 10);
  const basket = getBasketNumber(productId);
  const basketWithZero = basket < 10 ? `0${basket}` : basket;
  const random = Date.now();
  const URL = Constants.URLS.IMAGES[imageType];

  return `${URL.format(
    basketWithZero,
    vol,
    part,
    productId,
    order
  )}?r=${random}`;
};

const getBasketNumber = (productId) => {
  const vol = parseInt(productId / 100000, 10);
  const basket = BASKETS.reduce((accumulator, current, index) => {
    if (vol >= current[0] && vol <= current[1]) {
      return index + 1;
    }
    return accumulator;
  }, 1);
  return basket;
};

const brandImageURL = (brandId) => Constants.URLS.BRAND.IMAGE.format(brandId);

const genNewUserID = function () {
  var t = Math.floor((new Date).getTime() / 1e3)
    , e = Math.floor(Math.random() * Math.pow(2, 30)).toString() + t.toString()
    , n = new Date;
  return e
};

const getQueryIdForSearch = function () {
  return `qid${genNewUserID()}${moment(new Date).format("yyyyMMDDHHmmss")}`
};

const Utils = {
  Card: {
    imageURL,
    getBasketNumber,
  },
  Brand: {
    imageURL: brandImageURL,
  },
  Search: {
    getQueryIdForSearch
  }
};

module.exports = Utils;
