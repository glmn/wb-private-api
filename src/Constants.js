module.exports = {
  URLS: {
    MAIN_MENU: 'https://www.wildberries.ru/webapi/menu/main-menu-ru-ru.json',
    PRODUCT: {
      CONTENT: 'https://wbx-content-v2.wbstatic.net/ru/{}.json',
      IMAGE: 'http://img1.wbstatic.net/small/new/{}0000/{}.jpg{?}r={}',
      STOCKS: 'https://wbxcatalog-ru.wildberries.ru/nm-2-card/catalog{}',
      DETAILS: 'https://card.wb.ru/cards/detail{}',
      EXTRADATA: 'https://www.wildberries.ru/webapi/product/{}',
    },
    SEARCH: {
      EXACTMATCH: 'https://wbxsearch.wildberries.ru/exactmatch/v2/female',
      CATALOG: 'https://wbxcatalog-ru.wildberries.ru/{}/catalog', // shardKey, queryParams, query
      ADS: 'https://catalog-ads.wildberries.ru/api/v5/search',
    },
    RECOMMENDATIONS: {
      SIMILAR_BY_NM: 'https://www.wildberries.ru/webapi/recommendations/similar-by-nm/{?}',
    },
  },
  APPTYPES: {
    DESKTOP: 1,
    ANDROID: 64,
    IOS: 74,
  },
  WAREHOUSES: {
    507: 'Подольск',
    686: 'Новосибирск',
    1193: 'Хабаровск',
    1699: 'Краснодар',
    1733: 'Екатеринбург',
    2737: 'Санкт-Петербург',
    3158: 'Коледино',
    116433: 'Домодедово',
    117393: 'СЦ Минск',
    117501: 'Подольск 2',
    117986: 'Казань',
    120762: 'Электросталь',
    121709: 'Электросталь КБТ',
    124731: 'Крёкшино КБТ',
    130744: 'Склад Краснодар',
    159402: 'Санкт-Петербург 2',
    161812: 'Склад Санкт-Петербург КБТ',
  },
  DESTINATIONS: {
    UFO: [-1059500, -108082, -269701, 12358048],
  },
};
