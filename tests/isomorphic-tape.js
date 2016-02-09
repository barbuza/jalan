import test from 'tape';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import sagaMiddleware, { take, put, call } from 'redux-saga';
import { createJalan } from '../src/index';

const INDEX = 'INDEX';
const ABOUT = 'ABOUT';
const INDEX_LOADED = 'INDEX_LOADED';
const ABOUT_LOADED = 'ABOUT_LOADED';

function fetchIndexData() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ text: 'index' }), 50);
  });
}

function fetchAboutData() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ text: 'about' }), 50);
  });
}

function router(state = { page: null }, action) {
  switch (action.type) {
    case INDEX:
      return { ...state, page: 'index' };
    case ABOUT:
      return { ...state, page: 'about' };
    default:
      return state;
  }
}

function fetcher(state = { loaded: false, data: null }, action) {
  switch (action.type) {
    case INDEX:
      return { ...state, loaded: false, data: null };
    case INDEX_LOADED:
      return { ...state, loaded: true, data: action.data };
    case ABOUT:
      return { ...state, loaded: false, data: null };
    case ABOUT_LOADED:
      return { ...state, loaded: true, data: action.data };
    default:
      return state;
  }
}

function* fetcherSaga() {
  while (true) {
    const action = yield take([INDEX, ABOUT]);
    if (action.type === INDEX) {
      const data = yield call(fetchIndexData);
      yield put({ type: INDEX_LOADED, data });
    } else if (action.type === ABOUT) {
      const data = yield call(fetchAboutData);
      yield put({ type: ABOUT_LOADED, data });
    }
  }
}

const routes = {
  '/': INDEX,
  '/about': ABOUT,
};

test('isomorphic', t => {
  const history = createMemoryHistory();
  history.push({ pathname: '/about' });

  const middleware = sagaMiddleware(createJalan(history, routes), fetcherSaga);
  const finalCreateStore = applyMiddleware(middleware)(createStore);
  const reducer = combineReducers({ router, fetcher });
  const store = finalCreateStore(reducer);

  store.subscribe(() => {
    const state = store.getState();
    if (state.fetcher.loaded) {
      t.deepEqual(state, {
        router: { page: 'about' },
        fetcher: { loaded: true, data: { text: 'about' } },
      });
      t.end();
    }
  });
});
