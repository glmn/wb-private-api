const Constants = require('./Constants');

class WBCatalog {
  /* Creating a new instance of the class WBCatalog. */
  constructor(data) {
    this.shardKey = data.shardKey;
    this.preset = data.preset;
    this.preset_value = data.preset_value;
    this.pages = data.pages;
    this.products = data.products;
    this.totalProducts = data.products.length;
  }

  /**
   * It takes a page number and returns an array of products that should be
   * displayed on that page.
   * @param {number} number - the page number
   * @returns {array} - An array of WBProduct's.
   */
  page(number) {
    const startIndex = (number - 1) * 100;
    let endIndex = startIndex + Constants.PRODUCTS_PER_PAGE - 1;
    if (startIndex > this.totalProducts) return [];
    if (endIndex >= this.totalProducts) endIndex = this.totalProducts - 1;

    const outputProducts = [];
    for (let idx = startIndex; idx <= endIndex; idx += 1) {
      outputProducts.push(this.products[idx]);
    }
    return outputProducts;
  }

  getPosition(productId) {
    const position = this.products.findIndex((item) => item.id === productId) || -1;
    return position;
  }
}

module.exports = WBCatalog;
