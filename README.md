![Untitled-1](https://user-images.githubusercontent.com/1326151/173079853-c0ddf68d-5cfc-44ac-bdf9-2d5c6016a90c.jpg)



<p align="center"><h3>wb-private-api</h3></p>

![GitHub package.json version](https://img.shields.io/github/package-json/v/glmn/wb-private-api) ![GitHub last commit](https://img.shields.io/github/last-commit/glmn/wb-private-api) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/glmn/wb-private-api) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/glmn/wb-private-api/Node.js%20CI)

![npm](https://nodei.co/npm/wb-private-api.png)

NodeJS модуль. Работает через приватное API Wildberries
```bash
npm i wb-private-api
```

После установки рекомендую протестировать работоспособность
```bash
npm test
```

![Screenshot_13](https://user-images.githubusercontent.com/1326151/173159882-beda437f-62f7-4e30-89d4-c2386ad5cd78.png)


Если все результаты положительные, значит библиотека полностью работоспособна и сервера WB отвечают верно. В случае, если каки-либо тесты отрицательные, прошу создать обращение https://github.com/glmn/wb-private-api/issues . Данный модуль развивается мною в одиночку (надеюсь, что пока что), буду обрабатывать обращения и вносить правки по возможности.

## Пример работы
```js
const WBPrivateAPI = require('WBPrivateAPI');

const wbapi = new WBPrivateAPI();

(async () => {
  const KEYWORD = 'менструальные чаши';
  const catalog = await wbapi.search(KEYWORD, 2);
  const ads = await wbapi.searchAds(KEYWORD);

  console.log(`
  Ключевое слово: ${KEYWORD}
  Найдено товаров: ${catalog.totalProducts}
  Всего страниц: ${catalog.pages}

  Всего рекламодателей: ${ads.adverts.length}
  Самый высокий CPM: ${ads.adverts[0].cpm} Рублей
  `);

  const product = catalog.page(1)[0];
  const stocks = await product.getStocks();
  const promo = await product.getPromo();
  console.log(stocks, product.totalStocks, promo);
})();

```

## `WBPrivateAPI` методы
`.search(keyword, pageCount)` - Поиск всех товаров по Ключевому слову `keyword`. `pageCount` отвечает за кол-во необходимых страниц для прохода. Если `pageCount = 0`, то будет взяты все страницы или `100`, если их больше. (Возвращает объект `WBCatalog`)

`.searchAds(keyword)` - Поиск рекламодателей (в разделе Поиск) по Ключевому слову

## `WBCatalog` методы
`.page(number)` - Возвращает массив товаров с заданной страницы (массив состоит из объектов `WBProduct`)

`.getPosition(productId)` - Возвращает номер позиции по заданному SKU. Если такого SKU в выдаче нет, то вернёт `-1`

## `WBCatalog` методы
`.totalStocks` - Вернёт сумму остатков товара со всех складов (!) предварительно вызвать `.getStocks()`)

`.getStocks()` - Присвоет (и вернет) свойству `stocks`  массив с данными об остатках на складе

`.getPromo()` - Присвоет (и вернет) свойству `promo` объект с данными об участии в промо-акции
