const Constants = require("./Constants");

class WBCatalog {
  constructor(data){
    this.shardKey = data.shardKey;
    this.preset = data.preset;
    this.preset_value = data.preset_value;
    this.pages = data.pages
    this.products = data.products;
    this.totalProducts = data.products.length
  }

  page = function(page){
    let startIndex = (page - 1) * 100;
    let endIndex = startIndex + Constants.PRODUCTS_PER_PAGE - 1
    if(startIndex > this.totalProducts) return [];
    if(endIndex >= this.totalProducts) endIndex = this.totalProducts-1

    let outputProducts = []
    for(let idx = startIndex; idx <= endIndex; idx++){
      outputProducts.push(this.products[idx])
    }
    return outputProducts
  }
}

module.exports = WBCatalog