import invariant from 'invariant';
import { take, call } from 'redux-saga';

import { JALAN, isCompiled, isEnhanced } from './utils';

export function createWriter(history, routes) {
  invariant(isEnhanced(history), 'enhanced history required');
  invariant(isCompiled(routes), 'compiled routes required');

  return function* writer() {
    while (true) {
      const action = yield take(routes.actions);
      const url = routes.reverse(action);

      if (history.getLocation().pathname !== url) {
        const [pathname, maybeSearch] = url.split('?');
        let search = '';
        if (maybeSearch && maybeSearch.length) {
          search = `?${maybeSearch}`;
        }
        yield call([history, history.push], {
          pathname,
          search,
          state: {
            [JALAN]: true,
          },
        });
      }
    }
  };
}
