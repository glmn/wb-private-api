![Untitled-1](https://user-images.githubusercontent.com/1326151/172098759-d7b2a089-4899-4b3e-9ce5-2804575e7b49.jpg)


<p align="center"><h3>wb-private-api</h3></p>

![GitHub package.json version](https://img.shields.io/github/package-json/v/glmn/wb-private-api) ![GitHub last commit](https://img.shields.io/github/last-commit/glmn/wb-private-api) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/glmn/wb-private-api) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/glmn/wb-private-api/Node.js%20CI)

![npm](https://nodei.co/npm/wb-private-api.png)

NodeJS модуль. Работает через приватное API Wildberries
```bash
npm i wb-private-api
```

## Пример работы
```js
const WBPrivateAPI = require('WBPrivateAPI');
const wbapi = new WBPrivateAPI();

(async () => {
  const KEYWORD = 'менструальные чаши';
  const catalog = await wbapi.search(KEYWORD);
  const ads = await wbapi.searchAds(KEYWORD);

  console.log(`
  Ключевое слово: ${KEYWORD}
  Найдено товаров: ${catalog.totalProducts}
  Всего страниц: ${catalog.pages}

  Всего рекламодателей: ${ads.adverts.length}
  Самый высокий CPM: ${ads.adverts[0].cpm} Рублей
  `);

  let product = catalog.page(2)[45]
  console.log(product)
})();
```

## `WBPrivateAPI` методы
`.search(keyword)` - Поиск всех товаров по Ключевому слову  (Возвращает объект `WBCatalog`)

`.searchAds(keyword)` - Поиск рекламодателей (в разделе Поиск) по Ключевому слову


## `WBCatalog` методы
`.page(number)` - Возвращает массив товаров с заданной страницы (массив состоит из объектов `WBProduct`)

`.getPosition(productId)` - Возвращает номер позиции по заданному SKU. Если такого SKU в выдаче нет, то вернёт `-1`
