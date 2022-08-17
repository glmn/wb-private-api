module.exports = {
  PRODUCTS_PER_PAGE: 100,
  PAGES_PER_CATALOG: 100,
  FEEDBACKS_PER_PAGE: 30,
  QUESTIONS_PER_PAGE: 30,
  URLS: {
    MAIN_MENU: 'https://www.wildberries.ru/webapi/menu/main-menu-ru-ru.json',
    PRODUCT: {
      STOCKS: 'https://wbxcatalog-ru.wildberries.ru/nm-2-card/catalog',
      CONTENT: 'https://wbx-content-v2.wbstatic.net/ru/{}.json',
      EXTRADATA: 'https://www.wildberries.ru/webapi/product/{}/data',
      DETAILS: 'https://card.wb.ru/cards/detail{}',
      FEEDBACKS: 'https://public-feedbacks.wildberries.ru/api/v1/feedbacks/site',
      QUESTIONS: 'https://questions.wildberries.ru/api/v1/questions',
      DELIVERYDATA: 'https://card.wb.ru/cards/list',
    },
    SEARCH: {
      SIMILAR_BY_NM: 'https://www.wildberries.ru/webapi/recommendations/similar-by-nm/{}',
      TOTALPRODUCTS: 'https://search.wb.ru/exactmatch/ru/female/v3/search',
      EXACTMATCH: 'https://search.wb.ru/exactmatch/ru/female/v4/search',
      CATALOG: 'https://wbxcatalog-ru.wildberries.ru/{}/catalog',
      ADS: 'https://catalog-ads.wildberries.ru/api/v5/search',
      CAROUSEL_ADS: 'https://carousel-ads.wildberries.ru/api/v4/carousel',
      HINT: 'https://search.wb.ru/suggests/api/v2/hint',
    },
    IMAGES: {
      TINY: 'http://img1.wbstatic.net/small/new/{0}0000/{1}.jpg?r={2}', // 180x240
      SMALL: 'https://images.wbstatic.net/c246x328/new/{0}0000/{1}-{3}.jpg?r={2}', // 246x328
      MEDIUM: 'https://images.wbstatic.net/c516x688/new/{0}0000/{1}-{3}.jpg?r={2}', // 516x688
      BIG: 'https://images.wbstatic.net/big/new/{0}0000/{1}-{3}.jpg?r={2}', // 900x1200
      FEEDBACK_BASE: 'https://feedbackphotos.wbstatic.net/',
    },
  },
  APPTYPES: {
    DESKTOP: 1,
    ANDROID: 32,
    IOS: 64,
  },
  WAREHOUSES: [
    { id: 507, title: 'Коледино' },
    { id: 686, title: 'Новосибирск' },
    { id: 1193, title: 'Хабаровск' },
    { id: 1733, title: 'Екатеринбург' },
    { id: 2737, title: 'Санкт-Петербург Уткина Заводь' },
    { id: 6144, title: 'СЦ Волгоград' },
    { id: 6154, title: 'СЦ Ярославль' },
    { id: 6156, title: 'СЦ Рязань' },
    { id: 6159, title: 'СЦ Красногорск' },
    { id: 158328, title: 'СЦ Южные Ворота' },
    { id: 159402, title: 'Санкт-Петербург Шушары '},
    { id: 204939, title: 'Склад Казахстан' },
    { id: 130744, title: 'Склад Краснодар' },
    { id: 206968, title: 'Чехов (Новоселки)' },
    { id: 120762, title: 'Электросталь' },
    { id: 121709, title: 'Электросталь КБТ' },
    { id: 206348, title: 'Алексин' },
    { id: 206236, title: 'Белые Столбы' },
    { id: 117986, title: 'Казань' },
    { id: 124731, title: 'Крёкшино КБТ' },
    { id: 117501, title: 'Подольск' },
    { id: 169872, title: 'СЦ Астрахань' },
    { id: 172430, title: 'СЦ Барнаул' },
    { id: 205228, title: 'СЦ Белая Дача' },
    { id: 172940, title: 'СЦ Брянск' },
    { id: 144649, title: 'СЦ Владимир' },
    { id: 203632, title: 'СЦ Иваново' },
    { id: 158140, title: 'СЦ Ижевск' },
    { id: 131643, title: 'СЦ Иркутск' },
    { id: 117442, title: 'СЦ Калуга' },
    { id: 205205, title: 'СЦ Киров' },
    { id: 154371, title: 'СЦ Комсомольская' },
    { id: 140302, title: 'СЦ Курск' },
    { id: 156814, title: 'СЦ Курьяновская' },
    { id: 160030, title: 'СЦ Липецк' },
    { id: 117289, title: 'СЦ Лобня' },
    { id: 115650, title: 'СЦ Мытищи' },
    { id: 204952, title: 'СЦ Набережные Челны' },
    { id: 118535, title: 'СЦ Нижний Новгород' },
    { id: 147019, title: 'СЦ Пермь' },
    { id: 124716, title: 'СЦ Подрезково' },
    { id: 158929, title: 'СЦ Саратов' },
    { id: 169537, title: 'СЦ Серов' },
    { id: 144154, title: 'СЦ Симферополь' },
    { id: 117497, title: 'СЦ Смоленск' },
    { id: 117866, title: 'СЦ Тамбов' },
    { id: 117456, title: 'СЦ Тверь' },
    { id: 117819, title: 'СЦ Тюмень' },
    { id: 149445, title: 'СЦ Уфа' },
    { id: 203799, title: 'СЦ Чебоксары' },
    { id: 132508, title: 'СЦ Челябинск' },
  ],
  DESTINATIONS: {
    UFO: [-1059500, -108082, -269701, 12358048],
    MSK: [-1029256, -102269, -2162196, -1257786],
  },
  STORES: {
    // Краснодарский Край
    UFO: [
      117673, 122258, 122259, 130744, 117501, 507, 3158, 124731,
      121709, 120762, 204939, 117986, 159402, 2737, 686, 1733,
    ],
    // Москва и московская область
    MSK: [
      117673, 122258, 122259, 125238, 125239, 125240, 507, 3158, 117501, 120602,
      120762, 6158, 121709, 124731, 130744, 159402, 2737, 117986, 1733, 686, 132043,
    ],
  },
  LOCALES: {
    RU: 'ru',
  },
  CURRENCIES: {
    RUB: 'rub',
  },
  SEX: {
    FEMALE: 'female',
    MALE: 'male',
  },
  USERAGENT: 'Mozilla/5.0 (compatible; wb-private-api; +https://github.com/glmn/wb-private-api)',
};

