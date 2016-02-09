/* eslint no-console: 0 */

import 'babel-polyfill';
import { createStore, applyMiddleware } from 'redux';
import sagaMiddleware from 'redux-saga';
import { createHistory } from 'history';
import { createJalan } from '../src/index';

const INDEX = 'INDEX';
const NEWS = 'NEWS';
const NEWS_ITEM = 'NEWS_ITEM';

const loggerMiddleware = () => next => action => {
  console.info('dispatch', action);
  return next(action);
};

function reducer(state = { route: null }, action) {
  switch (action.type) {
    case INDEX:
      return { ...state, route: 'index', params: action.params };
    case NEWS:
      return { ...state, route: 'news', params: action.params };
    case NEWS_ITEM:
      return { ...state, route: 'news_item', params: action.params };
    default:
      return state;
  }
}

const routes = {
  '/': INDEX,
  '/news': NEWS,
  '/news/{id}': NEWS_ITEM,
};

const history = createHistory();

const finalCreateStore = applyMiddleware(
  loggerMiddleware,
  sagaMiddleware(createJalan(history, routes))
)(createStore);

const store = finalCreateStore(reducer);

store.subscribe(() => {
  document.getElementById('state').innerHTML = `state = ${JSON.stringify(store.getState())}`;
});

document.getElementById('index').onclick =
  () => store.dispatch({ type: INDEX });

document.getElementById('news').onclick =
  () => store.dispatch({ type: NEWS });

document.getElementById('news_item_1').onclick =
  () => store.dispatch({ type: NEWS_ITEM, params: { id: '1' } });

document.getElementById('news_item_2').onclick =
  () => store.dispatch({ type: NEWS_ITEM, params: { id: '2' } });
