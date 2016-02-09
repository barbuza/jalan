import test from 'tape';

import { compileRoutes } from '../src/index';

test('compileRoutes', t => {
  const routes = compileRoutes({
    '/': 'HOME',
    '/foo': 'FOO',
    '/bar/{spam}': 'BAR',
  });

  t.deepEqual(routes.match('/'), { type: 'HOME', params: {} });
  t.deepEqual(routes.match('/foo'), { type: 'FOO', params: {} });
  t.deepEqual(routes.match('/bar/eggs'), { type: 'BAR', params: { spam: 'eggs' } });
  t.equal(routes.reverse({ type: 'BAR', params: { spam: 'eggs' } }), '/bar/eggs');

  t.end();
});
