import { fork } from 'redux-saga';

import { compileRoutes } from './compileRoutes';
import { enhanceHistory } from './enhanceHistory';
import { isCompiled, isEnhanced } from './utils';
import { createReader } from './createReader';
import { createWriter } from './createWriter';

export function createJalan(history, routes) {
  const enhancedHistory = isEnhanced(history) ? history : enhanceHistory(history);
  const compiledRoutes = isCompiled(routes) ? routes : compileRoutes(routes);

  return function* jalan() {
    yield fork(createWriter(enhancedHistory, compiledRoutes));
    yield fork(createReader(enhancedHistory, compiledRoutes));
  };
}
