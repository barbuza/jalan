import test from 'tape';
import { put } from 'redux-saga';
import { createMemoryHistory } from 'history';

import { compileRoutes, enhanceHistory, createReader } from '../src/index';

const routes = [
  { '/': 'HOME' },
  { '/foo': 'FOO' },
  { '/bar': 'BAR' },
];

test('createReader', t => {
  const history = enhanceHistory(createMemoryHistory());
  const reader = createReader(history, compileRoutes(routes));

  const saga = reader();

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/' }).value,
    put({ type: 'HOME', params: {} })
  );

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/foo' }).value,
    put({ type: 'FOO', params: {} })
  );

  t.ok(saga.next().value.CPS);

  t.deepEqual(
    saga.next({ pathname: '/bar' }).value,
    put({ type: 'BAR', params: {} })
  );

  t.end();
});

test('createReader unlisten', t => {
  const history = enhanceHistory(createMemoryHistory());

  let unlistenCalled = 0;

  const oldListen = history.listen;

  history.listen = listener => {
    const unlisten = oldListen(listener);
    return () => {
      unlistenCalled++;
      unlisten();
    };
  };

  const reader = createReader(history, compileRoutes(routes));

  const saga = reader();

  saga.next();

  try {
    saga.throw('');
  } catch (err) {
    // pass
  }

  t.equal(unlistenCalled, 1);

  t.end();
});
