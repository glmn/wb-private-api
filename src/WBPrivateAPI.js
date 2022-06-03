const format = require('string-format');
const Axios = require('axios').default;
const https = require('https');
const http = require('http');
const qs = require('qs');
const Constants = require('./Constants');
const WBProduct = require('./WBProduct');

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

  async search(keyword, pageCount) {
    const products = [];

    const parseQueryParams = (async function (url) {
      const res = await this.axios.get(url, { params: { query: keyword } });
      return [res.data.shardKey, ...res.data.query.split('=')];
    }).bind(this);

    // const parseTotalProducts = (async function () {

    // });

    const parseCatalog = (async function (page = 1) {
      let foundProducts;
      return new Promise(async (resolve) => {
        const options = {
          params: {
            [_preset]: _val,
            locale: 'ru',
            page,
            dest: Constants.DESTINATIONS.UFO,
            sort: 'popular',
            limit: 100,
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

    const [shardKey, _preset, _val] = await parseQueryParams(Constants.URLS.SEARCH.EXACTMATCH);
    const threads = Array(pageCount).fill(1).map((x, y) => x + y);
    const parsedPages = await Promise.all(threads.map(parseCatalog));
    parsedPages.every((val) => products.push(...val.map((v) => new WBProduct(v))));

    return products;
  }

  searchAds = async function (keyword) {
    const options = { params: { keyword } };
    const res = await this.axios.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  };
}

module.exports = WBPrivateAPI;
