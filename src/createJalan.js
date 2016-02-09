import { fork } from 'redux-saga';

import { compileRoutes, NOT_FOUND } from './compileRoutes';
import { enhanceHistory } from './enhanceHistory';
import { isCompiled, isEnhanced } from './utils';
import { createReader } from './createReader';
import { createWriter } from './createWriter';

export function createJalan(history, routes, notFoundAction = NOT_FOUND) {
  const enhancedHistory = isEnhanced(history) ? history : enhanceHistory(history);
  const compiledRoutes = isCompiled(routes) ? routes : compileRoutes(routes, notFoundAction);

  return function* jalan() {
    yield fork(createWriter(enhancedHistory, compiledRoutes));
    yield fork(createReader(enhancedHistory, compiledRoutes));
  };
}
