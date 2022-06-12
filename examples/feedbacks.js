const WBProduct = require('../src/WBProduct');

(async () => {
  const product = await WBProduct.create(15693390);
  await product.getFeedbacks();

  console.log(product.feedbacks[0], product.totalFeedbacks);
})();
