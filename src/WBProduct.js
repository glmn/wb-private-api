const Constants = require('./Constants');
const SessionBuilder = require('./SessionBuilder');
const WBFeedback = require('./WBFeedback');
const WBQuestion = require('./WBQuestion');

/* An array of properties that are required for the product. */
const requiredProps = ['id', 'name', 'root', 'pics', 'sizes', 'colors', 'rating'];

class WBProduct {
  stocks = [];
  promo = {};
  feedbacks = [];
  _rawResponse = {};

  constructor(product) {
    this.session = SessionBuilder.create();
    if (typeof product !== 'number') {
      this.imt_id = product.root;
      this.totalFeedbacks = product.feedbacks;
      requiredProps.forEach((prop) => {
        this[prop] = product[prop];
      });
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
    } else {
      this.id = product;
    }
  }

  static async create(productId) {
    const instance = new WBProduct(productId);
    await instance.getProductData();
    return new WBProduct(instance._rawResponse);
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
  async getPromo() {
    if ('id' in this._rawResponse === false) {
      await this.getProductData(this);
    }

    if ('panelPromoId' in this.promo) {
      return this.promo;
    }

    if ('panelPromoId' in this._rawResponse) {
      this.promo = {
        active: true,
        panelPromoId: this._rawResponse.panelPromoId,
        promoTextCard: this._rawResponse.promoTextCard,
        promoTextCat: this._rawResponse.promoTextCat,
      };
      return this.promo;
    }

    this.promo = {
      active: false,
    };

    return this.promo;
  }

  /**
   * It gets all feedbacks.
   * @param [page=0] - page number
   * @returns An array of WBFeedback objects
   */
  async getFeedbacks(page = 0) {
    let newFeedbacks = [];
    if (page === 0) {
      const totalPages = Math.round(
        this.totalFeedbacks / Constants.FEEDBACKS_PER_PAGE + 0.5,
      );
      const threads = Array(totalPages).fill(1).map((x, y) => x + y);
      const parsedPages = await Promise.all(
        threads.map((thr) => this.getFeedbacks(thr)),
      );
      parsedPages.every((val) => newFeedbacks.push(...val));
    } else {
      const skip = (page - 1) * Constants.FEEDBACKS_PER_PAGE;
      const body = {
        imtId: this.imt_id,
        skip,
        take: Constants.FEEDBACKS_PER_PAGE,
        order: 'dateDesc',
      };

      const url = Constants.URLS.PRODUCT.FEEDBACKS;
      const res = await this.session.post(url, body);
      newFeedbacks = res.data.feedbacks.map((fb) => new WBFeedback(fb));
    }
    this.feedbacks = newFeedbacks;
    return newFeedbacks;
  }

  /**
   * It returns the total number of questions for a given imt_id
   * @returns The total number of questions for the product.
   */
  async getQuestionsCount() {
    const options = {
      params: {
        imtId: this.imt_id,
        onlyCount: true,
      },
    };
    const url = Constants.URLS.PRODUCT.QUESTIONS;
    const res = await this.session.get(url, options);
    this.totalQuestions = res.data.count;
    return this.totalQuestions;
  }

  /**
   * It gets all questions
   * @param [page=0] - The page number of the questions to get.
   * @returns An array of WBQuestion objects
   */
  async getQuestions(page = 0) {
    let newQuestions = [];
    let totalQuestions = 0;
    if (page === 0) {
      if ('totalQuestions' in this) {
        totalQuestions = this.totalQuestions;
      } else {
        totalQuestions = await this.getQuestionsCount();
      }
      const totalPages = Math.round(
        totalQuestions / Constants.QUESTIONS_PER_PAGE + 0.5,
      );
      const threads = Array(totalPages).fill(1).map((x, y) => x + y);
      const parsedPages = await Promise.all(
        threads.map((thr) => this.getQuestions(thr)),
      );
      parsedPages.every((val) => newQuestions.push(...val));
    } else {
      const skip = (page - 1) * Constants.FEEDBACKS_PER_PAGE;
      const options = {
        params: {
          imtId: this.imt_id,
          skip,
          take: Constants.QUESTIONS_PER_PAGE,
        },
      };

      const url = Constants.URLS.PRODUCT.QUESTIONS;
      const res = await this.session.get(url, options);
      newQuestions = res.data.questions.map((fb) => new WBQuestion(fb));
    }
    this.questions = newQuestions;
    return newQuestions;
  }
}

module.exports = WBProduct;
