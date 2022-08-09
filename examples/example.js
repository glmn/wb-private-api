const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

(async () => {

  const KEYWORD = 'менструальные чаши';
  const ads = await wbapi.getSearchAds(KEYWORD);

  console.log(ads)
})();
