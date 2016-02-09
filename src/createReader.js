import invariant from 'invariant';
import { put, cps } from 'redux-saga';

import { sagaCbStrict } from './sagaCb';
import { JALAN, isCompiled, isEnhanced } from './utils';

export function createReader(history, routes) {
  invariant(isEnhanced(history), 'enhanced history required');
  invariant(isCompiled(routes), 'compiled routes required');

  return function* reader() {
    const { callback, listener } = sagaCbStrict();
    const unlisten = history.listen(listener);
    try {
      while (true) {
        const { pathname, state } = yield cps(callback);
        if (state && state[JALAN]) {
          continue;
        }
        yield put(routes.match(pathname));
      }
    } finally {
      unlisten();
    }
  };
}
