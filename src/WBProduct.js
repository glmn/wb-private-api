class WBProduct {
  stocks = [];

  /* Creating a new instance of the class WBProduct. */
  constructor(product) {
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

  get totalStocks() {
    return this.stocks.reduce((sum, x) => sum + x.qty, 0);
  }
}

module.exports = WBProduct;
