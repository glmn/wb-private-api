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
  constructor(config) {
    this.config = config;
    this.axios = Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    });
  }

  async search(keyword, pageCount = 0) {
    const products = [];

    const totalProducts = await this.searchTotalProducts(keyword)
    if(totalProducts == 0) return [];

    const [shardKey, preset, preset_value] = await this._getQueryParams(keyword);
    const catalogConfig = {
      shardKey: shardKey,
      preset: preset,
      preset_value: preset_value
    };

    let totalPages = Math.round((totalProducts/100) + 0.5)
    if(totalPages > Constants.PAGES_PER_CATALOG)
      totalPages = Constants.PAGES_PER_CATALOG;

    const threads = Array(totalPages).fill(1).map((x, y) => x + y);
    const parsedPages = await Promise.all(threads.map(thr => this.getCatalog(catalogConfig, thr)));

    parsedPages.every((val) => products.push(...val.map((v) => new WBProduct(v))));

    Object.assign(catalogConfig, {
      pages: totalPages,
      products: products
    });

    return new WBCatalog(catalogConfig);
  }

  async _getQueryParams(keyword) {
    const res = await this.axios.get(Constants.URLS.SEARCH.EXACTMATCH, { params: { query: keyword } });
    return [res.data.shardKey, ...res.data.query.split('=')];
  }

  async searchTotalProducts(keyword) {
    const res = await this.axios.get(Constants.URLS.SEARCH.TOTALPRODUCTS, { params: {
      appType: Constants.APPTYPES.DESKTOP,
      query: keyword,
      couponsGeo: [2,7,3,6,19,21,8],
      curr: Constants.CURRENCIES.RUB,
      dest: Constants.DESTINATIONS.UFO,
      locale: Constants.LOCALES.RU,
      resultset: 'filters',
      stores: Constants.STORES.UFO
    }});
    return res.data.filters.data.total;
  }

  async getCatalog(catalogConfig, page = 1) {
    return new Promise(async (resolve) => {
      let foundProducts;
      const options = {
        params: {
          [catalogConfig.preset]: catalogConfig.preset_value,
          appType: Constants.APPTYPES.DESKTOP,
          locale: Constants.LOCALES.RU,
          page: page,
          dest: Constants.DESTINATIONS.UFO,
          sort: 'popular',
          limit: Constants.PRODUCTS_PER_PAGE,
          stores: Constants.STORES.UFO
        }
      };

      try {
        const res = await this.axios.get(Constants.URLS.SEARCH.CATALOG.format(catalogConfig.shardKey), options);
        foundProducts = res.data.data.products;
      } catch (err) {
        await this.getCatalog(catalogConfig, page);
      }

      resolve(foundProducts);
    });
  }

  searchAds = async function (keyword) {
    const options = { params: { keyword } };
    const res = await this.axios.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  };

}

module.exports = WBPrivateAPI;
