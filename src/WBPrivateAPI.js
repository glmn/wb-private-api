const format = require('string-format');
const Constants = require('./Constants');
const WBProduct = require('./WBProduct');
const WBCatalog = require('./WBCatalog');
const SessionBuilder = require('./SessionBuilder');

format.extend(String.prototype, {});

class WBPrivateAPI {
  /* Creating a new instance of the class WBPrivateAPI. */
  constructor() {
    this.session = SessionBuilder.create();
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
    const res = await this.session.get(Constants.URLS.SEARCH.EXACTMATCH, {
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
    const res = await this.session.get(Constants.URLS.SEARCH.TOTALPRODUCTS, {
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
        const res = await this.session.get(url, options);
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
    const res = await this.session.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  }

  /**
   * It takes a query string and returns a list of suggestions that match the query
   * @param {string} query - the search query
   * @returns {array} - An array of objects.
   */
  async keyHint(query) {
    const options = {
      params: {
        query,
        gender: Constants.SEX.FEMALE,
        locale: Constants.LOCALES.RU,
      },
    };
    const res = await this.session.get(Constants.URLS.SEARCH.HINT, options);
    return res.data;
  }

  /**
   * It takes a productId, makes a request to the server, and returns the similar Ids
   * @param productId - The product ID of the product you want to search for similar
   * @returns {object} with similar product Ids
   */
  async searchSimilarByNm(productId) {
    const options = { headers: { 'x-requested-with': 'XMLHttpRequest' } };
    const url = Constants.URLS.SEARCH.SIMILAR_BY_NM.format(productId);
    const res = await this.session.get(url, options);
    return res.data;
  }
}

module.exports = WBPrivateAPI;
