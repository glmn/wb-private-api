/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
const format = require("string-format");
const Constants = require("./Constants");
const WBProduct = require("./WBProduct");
const WBCatalog = require("./WBCatalog");
const SessionBuilder = require("./SessionBuilder");
const { getBasketNumber } = require("./Utils").Card;

format.extend(String.prototype, {});

class WBPrivateAPI {
  /* Creating a new instance of the class WBPrivateAPI. */
  constructor({ destination }) {
    this.session = SessionBuilder.create();
    this.destination = destination;
  }

  /**
   * It searches for products by keyword.
   * @param {string} keyword - The keyword to search for
   * @param {number} pageCount - Number of pages to retrieve
   * @returns {WBCatalog} WBCatalog objects with WBProducts inside it
   */
  async search(keyword, pageCount = 0) {
    const products = [];

    const totalProducts = await this.searchTotalProducts(keyword);
    if (totalProducts === 0) return [];

    const { catalog_type, catalog_value } = await this.getQueryMetadata(
      keyword,
      0,
      false
    );
    const catalogConfig = { keyword, catalog_type, catalog_value };

    let totalPages = Math.round(totalProducts / 100 + 0.5);
    if (totalPages > Constants.PAGES_PER_CATALOG) {
      totalPages = Constants.PAGES_PER_CATALOG;
    }

    if (pageCount > 0) {
      if (pageCount < totalPages) {
        totalPages = pageCount;
      }
    }
    const threads = Array(totalPages)
      .fill(1)
      .map((x, y) => x + y);
    const parsedPages = await Promise.all(
      threads.map((thr) => this.getCatalogPage(catalogConfig, thr))
    );

    parsedPages.map((val) => {
      if (Array.isArray(val)) {
        val.map((v) => products.push(new WBProduct(v)));
      }
    });

    Object.assign(catalogConfig, {
      pages: totalPages,
      products,
      totalProducts,
    });

    return new WBCatalog(catalogConfig);
  }

  /**
   * It takes a keyword and returns an array of three elements,
   * shardKey, preset and preset value
   * @param {string} keyword - The keyword you want to search for.
   * @returns {array} - An array of shardKey, preset and preset value
   */
  async getQueryMetadata(keyword, limit = 0, withProducts = false, page = 1) {
    let params = {
      query: keyword,
      locale: "ru",
      resultset: "catalog",
      limit,
    };

    if (withProducts) {
      params = {
        ...params,
        appType: Constants.APPTYPES.DESKTOP,
        dest: this.destination.ids,
        sort: "popular",
        regions: this.destination.regions,
        page,
      };
    }

    const res = await this.session.get(Constants.URLS.SEARCH.EXACTMATCH, {
      params,
    });
    if (
      res.data?.metadata?.hasOwnProperty("catalog_type") &&
      res.data?.metadata?.hasOwnProperty("catalog_value")
    ) {
      return { ...res.data.metadata, products: res.data.data?.products };
    }
    return { catalog_type: null, catalog_value: null, products: [] };
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
        curr: Constants.CURRENCIES.RUB,
        dest: this.destination.ids,
        regions: this.destination.regions,
        locale: Constants.LOCALES.RU,
        resultset: "filters",
      },
    });

    return res.data.data?.total || 0;
  }

  /**
   * It returns the data based on filters array
   * @param {string} keyword - the search query
   * @param {array} filters - array of filters elements like [`fbrand','fsupplier']
   * @returns Total number of products
   */
  async searchCustomFilters(keyword, filters) {
    const res = await this.session.get(Constants.URLS.SEARCH.EXACTMATCH, {
      params: {
        appType: Constants.APPTYPES.DESKTOP,
        query: keyword,
        curr: Constants.CURRENCIES.RUB,
        dest: this.destination.ids,
        regions: this.destination.regions,
        resultset: "filters",
        filters: filters.join(";"),
      },
    });
    return res.data?.data || {};
  }

  /**
   * It gets all products from specified page
   * @param {object} catalogConfig - { shradKey, query }
   * @param {number} page - page number
   * @returns {array} - An array of products
   */
  async getCatalogPage(catalogConfig, page = 1) {
    return new Promise(async (resolve) => {
      let foundProducts;
      const options = {
        params: {
          query: catalogConfig.keyword,
          appType: Constants.APPTYPES.DESKTOP,
          locale: Constants.LOCALES.RU,
          page,
          dest: this.destination.ids,
          sort: "popular",
          limit: Constants.PRODUCTS_PER_PAGE,
          regions: this.destination.regions,
          resultset: "catalog",
        },
      };
      try {
        const url = Constants.URLS.SEARCH.EXACTMATCH;
        const res = await this.session.get(url, options);
        foundProducts = res.data.data.products;
      } catch (err) {
        console.log(err);
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
  async getSearchAds(keyword) {
    const options = { params: { keyword } };
    const res = await this.session.get(Constants.URLS.SEARCH.ADS, options);
    return res.data;
  }

  /**
   * Search for carousel ads inside product card
   * @param {number} productId - product id
   * @returns {array} - An array with ads
   */
  async getCarouselAds(productId) {
    const options = {
      params: {
        nm: productId,
      },
    };
    const res = await this.session.get(
      Constants.URLS.SEARCH.CAROUSEL_ADS,
      options
    );
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
    const options = {
      params: { nm: productId },
    };
    const url = Constants.URLS.SEARCH.SIMILAR_BY_NM;
    const res = await this.session.get(url, options);
    return res.data;
  }

  /**
   * It takes an array of productIds and a destination, and returns an array of
   * products with delivery time data
   * @param config - { productIds, dest }
   * @returns {object} of products with delivety times
   */
  async getDeliveryDataByNms(productIds) {
    return new Promise(async (resolve) => {
      const options = {
        params: {
          appType: Constants.APPTYPES.DESKTOP,
          locale: Constants.LOCALES.RU,
          dest: this.destination.ids,
          nm: productIds.join(";"),
        },
      };
      try {
        const url = Constants.URLS.PRODUCT.DELIVERYDATA;
        const res = await this.session.get(url, options);
        const foundProducts = res.data.data.products;
        resolve(foundProducts);
      } catch (err) {
        await this.getDeliveryDataByNms(productIds);
      }
    });
  }

  /**
   * @returns Array of promos
   */
  async getPromos() {
    try {
      const result = await this.session.get(Constants.URLS.PROMOS);
      return result.data;
    } catch (e) {
      return console.log(e);
    }
  }

  /**
   * @returns Array of found products
   */
  async getListOfProducts(productIds) {
    const options = { params: { nm: productIds.join(";") } };
    const res = await this.session.get(Constants.URLS.SEARCH.LIST, options);
    return res.data.data.products || [];
  }

  /**
   * @returns Object with supplier info
   */
  async getSupplierInfo(sellerId) {
    const res = await this.session.get(
      Constants.URLS.SUPPLIER.INFO.format(sellerId),
    );
    return res.data || {};
  }
}

module.exports = WBPrivateAPI;
