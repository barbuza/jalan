import test from 'tape';
import sagaMiddleware, { take, put, call } from 'redux-saga';

import { ActionTypes } from 'redux/lib/createStore';
import { createStore, applyMiddleware } from 'redux';
import { createMemoryHistory } from 'history';

import enhanceHistory from '../src/enhanceHistory';
import { createReadHistory, createUpdateHistory, createJalan, JALAN } from '../src/sagas';

const routes = {
  '/': 'HOME',
  '/foo': 'FOO',
  '/bar': 'BAR',
};

test('updateHistory', t => {
  const history = enhanceHistory(createMemoryHistory());
  const saga = createUpdateHistory(history, routes)();
  const navigateActions = ['HOME', 'FOO', 'BAR'];

  t.deepEqual(
    saga.next().value,
    take(navigateActions)
  );

  t.deepEqual(
    saga.next({ type: 'HOME' }).value,
    take(navigateActions),
    'ignore current location'
  );

  t.deepEqual(
    saga.next({ type: 'FOO' }).value,
    call([history, history.push], { pathname: '/foo', state: { [JALAN]: true } })
  );

  t.deepEqual(
    saga.next().value,
    take(navigateActions)
  );

  t.end();
});

test('readHistory', t => {
  const history = enhanceHistory(createMemoryHistory());
  const readHistory = createReadHistory(history, routes);

  const saga = readHistory();

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/' }).value,
    put({ type: 'HOME' })
  );

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/foo' }).value,
    put({ type: 'FOO' })
  );

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/bar' }).value,
    put({ type: 'BAR' })
  );

  t.end();
});

test('integration', t => {
  const actual = [];

  const expected = [
    { type: ActionTypes.INIT },
    { type: 'HOME' },
    { type: 'FOO' },
    { type: 'BAR' },
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
    store.dispatch({ type: 'BAR' });
  }, 150);
});
