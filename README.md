# wb-private-api v0.0.3
NodeJS Модуль работает через приватное API Wildberries

<a href="https://asciinema.org/a/O0mxkkU7PyfOpYRpJ5TD4EGwo" target="_blank"><img src="https://asciinema.org/a/O0mxkkU7PyfOpYRpJ5TD4EGwo.svg" /></a>

## Установка
Необходим NodeJS v14 или выше
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
