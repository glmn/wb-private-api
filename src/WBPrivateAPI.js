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

    const parseQueryParams = (async function () {
      const res = await this.axios.get(Constants.URLS.SEARCH.EXACTMATCH, { params: { query: keyword } });
      return [res.data.shardKey, ...res.data.query.split('=')];
    }).bind(this);

    const parseTotalProducts = (async function () {
      const res = await this.axios.get(Constants.URLS.SEARCH.TOTALPRODUCTS, { params: {
        appType: Constants.APPTYPES.DESKTOP,
        couponsGeo: '2,7,3,6,19,21,8',
        curr: 'rub',
        query: keyword,
        dest: Constants.DESTINATIONS.UFO,
        locale: 'ru',
        resultset: 'filters',
        stores: Constants.STORES.UFO
      }});
      return res.data.filters.data.total;
    }).bind(this);

    const parseCatalog = (async function (page = 1) {
      let foundProducts;
      return new Promise(async (resolve) => {
        const options = {
          params: {
            [_preset]: _val,
            appType: Constants.APPTYPES.DESKTOP,
            locale: 'ru',
            page: page,
            dest: Constants.DESTINATIONS.UFO,
            sort: 'popular',
            limit: Constants.PRODUCTS_PER_PAGE,
            stores: Constants.STORES.UFO
          },
        };

        try {
          const res = await this.axios.get(Constants.URLS.SEARCH.CATALOG.format(shardKey), options);
          foundProducts = res.data.data.products;
        } catch (err) {
          await parseCatalog(page);
        }

        resolve(foundProducts);
      });
    }).bind(this);

    const totalProducts = await parseTotalProducts()
    if(totalProducts == 0) return [];

    const [shardKey, _preset, _val] = await parseQueryParams();

    let totalPages = Math.round((totalProducts/100) + 0.5)
    if(totalPages > Constants.PAGES_PER_CATALOG)
      totalPages = Constants.PAGES_PER_CATALOG;

    const threads = Array(totalPages).fill(1).map((x, y) => x + y);
    const parsedPages = await Promise.all(threads.map(parseCatalog));
    parsedPages.every((val) => products.push(...val.map((v) => new WBProduct(v))));

    const catalog = new WBCatalog({
      shardKey: shardKey,
      preset: _preset,
      preset_value: _val,
      pages: totalPages,
      products: products
    });

    return catalog;
  }

  searchAds = async function (keyword) {
    const options = { params: { keyword } };
    const res = await this.axios.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  };
}

module.exports = WBPrivateAPI;
