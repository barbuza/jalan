import test from 'tape';

import { compileRoutes, NOT_FOUND } from '../src/index';

test('compileRoutes', t => {
  const routes = compileRoutes([
    { '/': 'HOME' },
    { '/foo': 'FOO' },
    { '/bar/{spam}': 'BAR' },
    { '/foo/bar': 'FOOBAR' },
    { '/{key}/{value}': 'PAIR' },
    { '/search{?q}': 'SEARCH' },
  ]);

  t.deepEqual(routes.match('/'), { type: 'HOME', params: {} });
  t.equal(routes.reverse({ type: 'HOME' }), '/');

  t.deepEqual(routes.match('/foo'), { type: 'FOO', params: {} });
  t.equal(routes.reverse({ type: 'FOO' }), '/foo');

  t.deepEqual(routes.match('/bar/eggs'), { type: 'BAR', params: { spam: 'eggs' } });
  t.equal(routes.reverse({ type: 'BAR', params: { spam: 'eggs' } }), '/bar/eggs');

  t.deepEqual(routes.match('/foo/bar'), { type: 'FOOBAR', params: {} });
  t.equal(routes.reverse({ type: 'FOOBAR' }), '/foo/bar');

  t.deepEqual(routes.match('/foo/spam'), { type: 'PAIR', params: { key: 'foo', value: 'spam' } });
  t.equal(routes.reverse({ type: 'PAIR', params: { key: 'foo', value: 'spam' } }), '/foo/spam');

  t.deepEqual(routes.match('/search?q=test'), { type: 'SEARCH', params: { q: 'test' } });
  t.equal(routes.reverse({ type: 'SEARCH', params: { q: 'test' } }), '/search?q=test');

  t.deepEqual(routes.match('/not-found'), { type: NOT_FOUND });
  t.notOk(routes.reverse({ type: 'UNKNOWN' }));

  t.end();
});
