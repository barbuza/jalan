import { fork, take, call, put, cps } from 'redux-saga';

export const JALAN = Symbol();

function createHistoryCps(history) {
  let callback = null;
  let location = null;

  const unlisten = history.listen(loc => {
    if (callback) {
      const callbackCopy = callback;
      callback = null;
      location = null;
      callbackCopy(null, loc);
    } else {
      location = loc;
    }
  });

  function historyCps(cb) {
    if (location) {
      const locationCopy = location;
      location = null;
      cb(null, locationCopy);
    } else if (!callback) {
      callback = cb;
    } else {
      throw new Error('invalid state');
    }
  }

  return { historyCps, unlisten };
}

export function createReadHistory(history, routes) {
  return function* readHistory() {
    const { unlisten, historyCps } = createHistoryCps(history);
    try {
      while (true) {
        const { pathname, state } = yield cps(historyCps);
        if (state && state[JALAN]) {
          continue;
        }
        if (routes[pathname]) {
          yield put({ type: routes[pathname] });
        } else {
          throw new Error('unknown route');
        }
      }
    } finally {
      unlisten();
    }
  };
}

export function createUpdateHistory(history, routes) {
  const routingActions = [];
  const urls = {};

  for (const pattern in routes) {
    if (routes.hasOwnProperty(pattern)) {
      routingActions.push(routes[pattern]);
      urls[routes[pattern]] = pattern;
    }
  }

  return function* updateHistory() {
    while (true) {
      const action = yield take(routingActions);
      if (history.getLocation().pathname !== urls[action.type]) {
        yield call([history, history.push], {
          pathname: urls[action.type],
          state: {
            [JALAN]: true,
          },
        });
      }
    }
  };
}

export function createJalan(history, routes) {
  return function* jalan() {
    yield fork(createUpdateHistory(history, routes));
    yield fork(createReadHistory(history, routes));
  };
}
