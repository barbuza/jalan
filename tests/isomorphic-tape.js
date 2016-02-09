import test from 'tape';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { ActionTypes } from 'redux/lib/createStore';
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

function logger(state = [], action) {
  return [...state, action.type];
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

function createServerStore(pathname, cb) {
  const history = createMemoryHistory();
  history.push({ pathname });

  const middleware = sagaMiddleware(createJalan(history, routes), fetcherSaga);
  const finalCreateStore = applyMiddleware(middleware)(createStore);
  const reducer = combineReducers({ router, fetcher, logger });
  const store = finalCreateStore(reducer);

  let once = false;

  store.subscribe(() => {
    const state = store.getState();
    if (state.fetcher.loaded && !once) {
      once = true;
      cb(state);
    }
  });
}

test('isomorphic', t => {
  t.plan(2);

  createServerStore('/about', state => {
    t.deepEqual(state, {
      router: { page: 'about' },
      fetcher: { loaded: true, data: { text: 'about' } },
      logger: [
        ActionTypes.INIT,
        ABOUT,
        ABOUT_LOADED,
      ],
    });
  });

  createServerStore('/', state => {
    t.deepEqual(state, {
      router: { page: 'index' },
      fetcher: { loaded: true, data: { text: 'index' } },
      logger: [
        ActionTypes.INIT,
        INDEX,
        INDEX_LOADED,
      ],
    });
  });
});
