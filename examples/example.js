const Constants = require('../src/Constants');
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

(async () => {
  const ads = await wbapi.getSearchAds('менструальная чаша');
  console.log(ads.adverts);

  const catalog = await wbapi.search('менструальные чаши', 1);
  console.log(catalog)
})();
