const Constants = require('./Constants');
const SessionBuilder = require('./SessionBuilder');

class WBProduct {
  stocks = [];
  promo = {};
  _rawResponse = {};

  /* Creating a new instance of the class WBProduct. */
  constructor(product) {
    this.session = SessionBuilder.create();
    this.id = product.id;
    this.name = product.name;
    this.root = product.root;
    this.pics = product.pics;
    this.sizes = product.sizes;
    this.colors = product.colors;
    this.rating = product.rating;
    this.feedbacks = product.feedbacks;
    this.subject = {
      id: product.subjectId,
      parentId: product.subjectParentId,
    };
    this.brand = {
      id: product.brandId,
      siteId: product.siteBrandId,
      name: product.brand,
    };
    this.price = {
      sale: product.sale / 100,
      retail: product.priceU,
      afterSale: product.salePriceU / 100,
    };
  }

  /**
   * The function returns the value of the afterSale property of the price
   * @returns The afterSale price.
   */
  get currentPrice() {
    return this.price.afterSale;
  }

  /**
   * It takes the array of stocks, and for each stock, it adds the quantity of
   * that stock to the sum
   * @returns The total number of stocks.
   */
  get totalStocks() {
    return this.stocks.reduce((sum, x) => sum + x.qty, 0);
  }

  /**
   * It makes a request to the server and gets the product data
   */
  async getProductData() {
    const options = {
      params: {
        appType: Constants.APPTYPES.DESKTOP,
        dest: Constants.DESTINATIONS.UFO,
        stores: Constants.STORES.UFO,
        locale: Constants.LOCALES.RU,
        nm: this.id,
      },
    };

    const res = await this.session.get(Constants.URLS.PRODUCT.STOCKS, options);
    const rawData = res.data.data.products[0];
    this._rawResponse = rawData;
  }

  /**
   * If the product has stocks, return the stocks. If the product has sizes,
   * return the stocks of the first size. If the product doesn't have sizes, get
   * the product data and return the stocks
   * @returns {object} - The stocks of the product.
   */
  async getStocks() {
    if (this.stocks.length !== 0) {
      return this.stocks;
    }

    if ('sizes' in this._rawResponse) {
      this.stocks = this._rawResponse.sizes[0].stocks;
      return this.stocks;
    }

    await this.getProductData();
    return this.getStocks();
  }

  /**
   * It returns the promo object for a product, but if it doesn't exist, it calls
   * the getProductData function to get the product data, and then calls itself
   * again to get the promo object
   * @returns {object} - the product.promo object.
   */
  async getPromo(product) {
    if ('id' in this._rawResponse === false) {
      await this.getProductData(this);
    }

    if ('panelPromoId' in this.promo) {
      return this.promo;
    }

    if ('panelPromoId' in this._rawResponse) {
      this.promo = {
        active: true,
        panelPromoId: product._rawResponse.panelPromoId,
        promoTextCard: product._rawResponse.promoTextCard,
        promoTextCat: product._rawResponse.promoTextCat,
      };
      return this.promo;
    }

    this.promo = {
      active: false,
    };

    return this.promo;
  }
}

module.exports = WBProduct;
