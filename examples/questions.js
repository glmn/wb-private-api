const WBProduct = require('../src/WBProduct');

(async () => {
  const product = await WBProduct.create(15693390);
  await product.getQuestions();
  console.log(product);
  console.log(product.questions[0], product.totalQuestions);
})();
