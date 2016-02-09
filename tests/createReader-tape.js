import test from 'tape';
import { put } from 'redux-saga';
import { createMemoryHistory } from 'history';

import { compileRoutes, enhanceHistory, createReader } from '../src/index';

const routes = {
  '/': 'HOME',
  '/foo': 'FOO',
  '/bar': 'BAR',
};

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
