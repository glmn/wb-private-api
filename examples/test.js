const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

(async () => {
  const KEYWORD = 'платье';
  const PAGES = 100;
  const catalog = await wbapi.search(KEYWORD, PAGES);
  const ads = await wbapi.searchAds(KEYWORD);
  console.log(ads.pages.length, catalog.length);
})();
