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
   * @param keyword - The keyword to search for
   * @returns WBCatalog objects with WBProducts inside it
   */
  async search(keyword) {
    const products = [];

    const totalProducts = await this.searchTotalProducts(keyword);
    if (totalProducts === 0) return [];

    const [shardKey, preset, presetValue] = await this._getQueryParams(keyword);
    const catalogConfig = { shardKey, preset, presetValue };

    let totalPages = Math.round((totalProducts / 100) + 0.5);
    if (totalPages > Constants.PAGES_PER_CATALOG) { totalPages = Constants.PAGES_PER_CATALOG; }

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
   * @param keyword - The keyword you want to search for.
   * @returns An array of shardKey, preset and preset value
   */
  async _getQueryParams(keyword) {
    const res = await this.axios.get(Constants.URLS.SEARCH.EXACTMATCH, {
      params: { query: keyword },
    });
    return [res.data.shardKey, ...res.data.query.split('=')];
  }

  /**
   * It returns the total number of products for a given keyword
   * @param keyword - the search query
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
   * @param catalogConfig
   * @param [page=1] - page number
   * @returns An array of products
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
        // eslint-disable-next-line max-len
        const res = await this.axios.get(Constants.URLS.SEARCH.CATALOG.format(catalogConfig.shardKey), options);
        foundProducts = res.data.data.products;
      } catch (err) {
        await this.getCatalogPage(catalogConfig, page);
      }
      resolve(foundProducts);
    });
  }

  /**
   * Search for adverts and their ads form specified keyword
   * @param keyword - the search query
   * @returns An object with adverts and their ads
   */
  async searchAds(keyword) {
    const options = { params: { keyword } };
    const res = await this.axios.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  }
}

module.exports = WBPrivateAPI;
