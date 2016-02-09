# jalan

functional routing for redux

[usage example](tests/browser.js)

## usage
```js
import { createStore, applyMiddleware } from 'redux';
import sagaMiddleware from 'redux-saga';
import { createHistory } from 'history';
import { createJalan } from 'jalan';

import { INDEX, NEWS, NEWS_ITEM } from '...';
import reducer from '...';

const routes = {
  '/':          INDEX,
  '/news':      NEWS,
  '/news/{id}': NEWS_ITEM
};

const history = createHistory();

const finalCreateStore = applyMiddleware(sagaMiddleware(
  createJalan(history, routes)
))(createStore);

const store = finalCreateStore(reducer);
```
