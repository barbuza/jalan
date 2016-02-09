import test from 'tape';
import { take, call } from 'redux-saga';
import { createMemoryHistory } from 'history';

import { compileRoutes, enhanceHistory, createWriter, JALAN } from '../src/index';

const routes = {
  '/': 'HOME',
  '/foo': 'FOO',
  '/bar': 'BAR',
};

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
    saga.next({ type: 'HOME' }).value,
    take(compiledRoutes.actions),
    'ignore current location'
  );

  t.deepEqual(
    saga.next({ type: 'FOO' }).value,
    call([history, history.push], { pathname: '/foo', state: { [JALAN]: true } })
  );

  t.deepEqual(
    saga.next().value,
    take(compiledRoutes.actions)
  );

  t.end();
});
