import test from 'tape';

import { compileRoutes } from '../src/index';

test('compileRoutes', t => {
  const routes = compileRoutes({
    '/': 'HOME',
    '/foo': 'FOO',
    '/bar/{spam}': 'BAR',
    '/search{?q}': 'SEARCH',
  });

  t.deepEqual(routes.match('/'), { type: 'HOME', params: {} });
  t.equal(routes.reverse({ type: 'HOME' }), '/');

  t.deepEqual(routes.match('/foo'), { type: 'FOO', params: {} });
  t.equal(routes.reverse({ type: 'FOO' }), '/foo');

  t.deepEqual(routes.match('/bar/eggs'), { type: 'BAR', params: { spam: 'eggs' } });
  t.equal(routes.reverse({ type: 'BAR', params: { spam: 'eggs' } }), '/bar/eggs');

  t.deepEqual(routes.match('/search?q=test'), { type: 'SEARCH', params: { q: 'test' } });
  t.equal(routes.reverse({ type: 'SEARCH', params: { q: 'test' } }), '/search?q=test');

  t.end();
});
