import test from 'tape';
import sagaMiddleware from 'redux-saga';
import { ActionTypes } from 'redux/lib/createStore';
import { createStore, applyMiddleware } from 'redux';
import { createMemoryHistory } from 'history';

import { enhanceHistory, createJalan } from '../src/index';

const routes = {
  '/': 'HOME',
  '/foo': 'FOO',
  '/bar': 'BAR',
};

test('integration', t => {
  const actual = [];

  const expected = [
    { type: ActionTypes.INIT },
    { type: 'HOME', params: {} },
    { type: 'FOO', params: {} },
    { type: 'BAR', params: {} },
  ];
  const history = enhanceHistory(createMemoryHistory());

  const finalCreateStore = applyMiddleware(sagaMiddleware(
    createJalan(history, routes)
  ))(createStore);

  const store = finalCreateStore((state, action) => {
    actual.push(action);
  });

  setTimeout(() => {
    t.deepEqual(actual, expected);
    t.equal(history.getLocation().pathname, '/bar');
    t.end();
  }, 250);

  setTimeout(() => {
    history.push({ pathname: '/foo' });
  }, 50);

  setTimeout(() => {
    store.dispatch({ type: 'BAR', params: {} });
  }, 150);
});
