const WBPrivateAPI = require('../src/WBPrivateAPI');

(async () => {
  const wbapi = new WBPrivateAPI();
  const ads = await wbapi.getCarouselAds(60059650);
  console.log(ads[0].cpm);
})();
