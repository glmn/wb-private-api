const format = require('string-format');
const Axios = require('axios').default;
const https = require('https');
const http = require('http');
const qs = require('qs');
const Constants = require('./Constants');
const WBProduct = require('./WBProduct');
const WBCatalog = require('./WBCatalog');

format.extend(String.prototype, {});

class WBPrivateAPI {
  /* Creating a new instance of the class WBPrivateAPI. */
  constructor(config) {
    this.config = config;
    this.axios = Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    });
  }

  /**
   * It searches for products on the website.
   * @param {string} keyword - The keyword to search for
   * @param {number} pageCount - Number of pages to retrieve
   * @returns {WBCatalog} WBCatalog objects with WBProducts inside it
   */
  async search(keyword, pageCount = 0) {
    const products = [];

    const totalProducts = await this.searchTotalProducts(keyword);
    if (totalProducts === 0) return [];

    const [shardKey, preset, presetValue] = await this._getQueryParams(keyword);
    const catalogConfig = { shardKey, preset, presetValue };

    let totalPages = Math.round((totalProducts / 100) + 0.5);
    if (totalPages > Constants.PAGES_PER_CATALOG) { totalPages = Constants.PAGES_PER_CATALOG; }

    if (pageCount > 0) {
      if (pageCount < totalPages) {
        totalPages = pageCount;
      }
    }

    const threads = Array(totalPages).fill(1).map((x, y) => x + y);
    const parsedPages = await Promise.all(
      threads.map((thr) => this.getCatalogPage(catalogConfig, thr)),
    );

    parsedPages.every((val) => products.push(...val.map((v) => new WBProduct(v))));

    Object.assign(catalogConfig, { pages: totalPages, products });

    return new WBCatalog(catalogConfig);
  }

  /**
   * It takes a keyword and returns an array of three elements,
   * shardKey, preset and preset value
   * @param {string} keyword - The keyword you want to search for.
   * @returns {array} - An array of shardKey, preset and preset value
   */
  async _getQueryParams(keyword) {
    const res = await this.axios.get(Constants.URLS.SEARCH.EXACTMATCH, {
      params: { query: keyword },
    });
    return [res.data.shardKey, ...res.data.query.split('=')];
  }

  /**
   * It returns the total number of products for a given keyword
   * @param {string} keyword - the search query
   * @returns Total number of products
   */
  async searchTotalProducts(keyword) {
    const res = await this.axios.get(Constants.URLS.SEARCH.TOTALPRODUCTS, {
      params: {
        appType: Constants.APPTYPES.DESKTOP,
        query: keyword,
        couponsGeo: [2, 7, 3, 6, 19, 21, 8],
        curr: Constants.CURRENCIES.RUB,
        dest: Constants.DESTINATIONS.UFO,
        locale: Constants.LOCALES.RU,
        resultset: 'filters',
        stores: Constants.STORES.UFO,
      },
    });
    return res.data.filters.data.total;
  }

  /**
   * It gets all products from specified page
   * @param {object} catalogConfig - { shradKey, preset, presetValue }
   * @param {number} page - page number
   * @returns {array} - An array of products
   */
  async getCatalogPage(catalogConfig, page = 1) {
    return new Promise(async (resolve) => {
      let foundProducts;
      const options = {
        params: {
          [catalogConfig.preset]: catalogConfig.presetValue,
          appType: Constants.APPTYPES.DESKTOP,
          locale: Constants.LOCALES.RU,
          page,
          dest: Constants.DESTINATIONS.UFO,
          sort: 'popular',
          limit: Constants.PRODUCTS_PER_PAGE,
          stores: Constants.STORES.UFO,
        },
      };
      try {
        const url = Constants.URLS.SEARCH.CATALOG.format(catalogConfig.shardKey);
        const res = await this.axios.get(url, options);
        foundProducts = res.data.data.products;
      } catch (err) {
        await this.getCatalogPage(catalogConfig, page);
      }
      resolve(foundProducts);
    });
  }

  /**
   * Search for adverts and their ads form specified keyword
   * @param {string} keyword - the search query
   * @returns {object} - An object with adverts and their ads
   */
  async searchAds(keyword) {
    const options = { params: { keyword } };
    const res = await this.axios.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  }

  /**
   * It makes a request to the server and gets the product data
   * @param {WBProduct} product - the product object that we're getting data for
   */
  async getProductData(product) {
    const options = {
      params: {
        appType: Constants.APPTYPES.DESKTOP,
        dest: Constants.DESTINATIONS.UFO,
        stores: Constants.STORES.UFO,
        locale: Constants.LOCALES.RU,
        nm: product.id,
      },
    };

    const res = await this.axios.get(Constants.URLS.PRODUCT.STOCKS, options);
    const rawData = res.data.data.products[0];
    product._rawResponse = rawData;
  }

  /**
   * If the product has stocks, return the stocks. If the product has sizes,
   * return the stocks of the first size. If the product doesn't have sizes, get
   * the product data and return the stocks
   * @param {WBProduct} product - The product object that you want to get the stocks of.
   * @returns {object} - The stocks of the product.
   */
  async getStocks(product) {
    if (product.stocks.length !== 0) {
      return product.stocks;
    }

    if ('sizes' in product._rawResponse) {
      product.stocks = product._rawResponse.sizes[0].stocks;
      return product.stocks;
    }

    await this.getProductData(product);
    return this.getStocks(product);
  }

  /**
   * It returns the promo object for a product, but if it doesn't exist, it calls
   * the getProductData function to get the product data, and then calls itself
   * again to get the promo object
   * @param {WBProduct} product - The product object
   * @returns {object} - the product.promo object.
   */
  async getPromo(product) {
    if ('id' in product._rawResponse === false) {
      await this.getProductData(product);
    }

    if ('panelPromoId' in product.promo) {
      return product.promo;
    }

    if ('panelPromoId' in product._rawResponse) {
      product.promo = {
        active: true,
        panelPromoId: product._rawResponse.panelPromoId,
        promoTextCard: product._rawResponse.promoTextCard,
        promoTextCat: product._rawResponse.promoTextCat,
      };
      return product.promo;
    }

    product.promo = {
      active: false,
    };

    return product.promo;
  }
}

module.exports = WBPrivateAPI;
