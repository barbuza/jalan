import test from 'tape';
import { take, call } from 'redux-saga';
import { createMemoryHistory } from 'history';

import { compileRoutes, enhanceHistory, createWriter, JALAN } from '../src/index';

const routes = [
  { '/': 'HOME' },
  { '/foo': 'FOO' },
  { '/bar': 'BAR' },
  { '/search{?q}': 'SEARCH' },
];

test('createWriter', t => {
  const history = enhanceHistory(createMemoryHistory());
  const compiledRoutes = compileRoutes(routes);
  const writer = createWriter(history, compiledRoutes);
  const saga = writer();

  t.deepEqual(
    saga.next().value,
    take(compiledRoutes.actions)
  );

  t.deepEqual(
    saga.next({ type: 'HOME', [JALAN]: true }).value,
    take(compiledRoutes.actions)
  );

  t.deepEqual(
    saga.next({ type: 'FOO' }).value,
    call([history, history.push], { pathname: '/foo', search: '', state: { [JALAN]: true } })
  );

  t.deepEqual(
    saga.next().value,
    take(compiledRoutes.actions)
  );

  t.deepEqual(
    saga.next({ type: 'SEARCH', params: { q: 'spam' } }).value,
    call([history, history.push], {
      pathname: '/search',
      search: '?q=spam',
      state: { [JALAN]: true },
    })
  );

  t.end();
});
