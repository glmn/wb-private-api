<p align="center"><h3>🍒 wb-private-api</h3></p>

![GitHub package.json version](https://img.shields.io/github/package-json/v/glmn/wb-private-api) ![GitHub last commit](https://img.shields.io/github/last-commit/glmn/wb-private-api) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/glmn/wb-private-api) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/glmn/wb-private-api/Node.js%20CI)

![npm](https://nodei.co/npm/wb-private-api.png)

NodeJS модуль. Работает через приватное API Wildberries

Установка: `npm i wb-private-api`

После установки рекомендую протестировать работоспособность

![image](https://github.com/glmn/wb-private-api/assets/1326151/e1d04808-1ba3-40cf-96bf-c6c5868ad4b8)

Если все результаты положительные, значит библиотека полностью работоспособна и сервера WB отвечают верно. В случае, если каки-либо тесты отрицательные, прошу создать обращение https://github.com/glmn/wb-private-api/issues

## Пример работы

### Вывод данных о первом товаре из поисковой выдачи по ключевому слову

```js
import { WBPrivateAPI, Constants } from "wb-private-api";

const keyword = "HotWheels";

/*
 * Select destination and init WBPrivateAPI with it
 * You can find more destionations in Constants.DESTINATIONS
 */
const destination = Constants.DESTINATIONS.MOSCOW;
const wbapi = new WBPrivateAPI({ destination });

const initiate = async () => {
  /*
   * Search and Grab first 2 pages
   * with specified keyword
   */
  const catalog = await wbapi.search(keyword, 2);
  const product = catalog.products[0];

  /*
   * Returning all Stocks with Warehouses Ids
   * Then you can compare these Ids
   * using Constants.WAREHOUSES
   */
  const stocks = await product.getStocks();

  /* No comments here :P */
  const feedbacks = await product.getFeedbacks();
  const questions = await product.getQuestions();
};

initiate();
```

### Вывод рекламодателей из поисковой выдачи по ключевому слову

```js
import { WBPrivateAPI, Constants } from "wb-private-api";

const keyword = "Менструальные чаши";

/*
 * Select destination and init WBPrivateAPI with it
 * You can find more destionations in Constants.DESTINATIONS
 */
const destination = Constants.DESTINATIONS.MOSCOW;
const wbapi = new WBPrivateAPI({ destination });

const initiate = async () => {
  /*
   * Search ads in search results
   * with specified keyword
   */
  const { pages, prioritySubjects, adverts } = await wbapi.getSearchAds(
    keyword
  );

  // Ads positions on each page
  console.log(pages);

  // Subjects ordered by priority
  console.log(prioritySubjects);

  // Adverts including CPM
  console.log(adverts);
};

initiate();
```

## `WBPrivateAPI` методы

`.search(keyword, pageCount, retries = 0, filters = [])` - Поиск всех товаров по Ключевому слову `keyword`. `pageCount` отвечает за кол-во необходимых страниц для прохода. Если `pageCount = 0`, то будет взяты все страницы или `100`, если их больше. `retries` отвечает за количество попыток выполнить запрос, если в ответ был получен статус 5хх или 429. `filters` это массив с объектами вида `[{type: 'fbrand' value: 11399 }]`, необходим для фильтрации поисковой выдачи по брендам, поставщикам, цене и т.д. Метод возвращает объект `WBCatalog`

`.getSearchAds(keyword)` - Поиск рекламодателей (в разделе Поиск) по Ключевому слову

`.getCarouselAds(keyword)` - Поиск рекламодателей внутри карточке в каруселе "Рекламный блок"

`.keyHint(query)` - Возвращает список подсказок из поиска WB по фразе `query`

`.searchSimilarByNm(productId)` - Возвращает список похожих товаров (как в разделе "Похожие товары" внутри карточки на WB)

`.getPromos()` - Возвращает массив текущих промо-акций на WB

`.getListOfProducts(productIds)` - Возвращает массив найденных артикулов на WB с деталями (Не оборачивается в WBProduct)

## `WBCatalog` методы

`.page(number)` - Возвращает массив товаров с заданной страницы (массив состоит из объектов `WBProduct`)

`.getPosition(productId)` - Возвращает номер позиции по заданному SKU. Если такого SKU в выдаче нет, то вернёт `-1`

## `WBProduct` методы

`.create(id)` - Статичный метод. Использовать в виде `WBProduct.create(id)`. Где `id` = `Артикул товара`. Метод асинхронный, поэтому перед вызовом используйте `await`. Вернет объект `WBProduct`

`.totalStocks` - Вернёт сумму остатков товара со всех складов (!) предварительно вызвать `.getStocks()`)

`.getStocks()` - Присвоет (и вернет) свойству `stocks` массив с данными об остатках на складе

`.getPromo()` - Присвоет (и вернет) свойству `promo` объект с данными об участии в промо-акции

`.getFeedbacks()` - Присвоет (и вернет) свойству `feedbacks` массив со всеми отзывами `WBFeedback` о товаре

`.getQuestions()` - Присвоет (и вернет) свойству `questions` массив со всеми вопросами `WBQuestion` о товаре

## `WBFeedback` методы

`.getPhotos(size='min')` - Вернет ссылки на все фотографии в текущем отзыве. `size` по умолчанию = `min`. Заменить на `full` если необходим большой размер

[![Verified on Openbase](https://badges.openbase.com/js/verified/wb-private-api.svg?token=yS0bpJQgFYOsdNzGVKyXsudiHKfqZve3FHuweIWRjnM=)](https://openbase.com/js/wb-private-api?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)
