import test from 'tape';
import { createStore, applyMiddleware } from 'redux';
import { ActionTypes } from 'redux/lib/createStore';
import { metaMiddleware } from '../src/index';

test('metaMiddleware', t => {
  const middleware = metaMiddleware({
    FOO: { foo: true },
    SPAM: { spam: true },
  });

  const store = applyMiddleware(middleware)(createStore)(
    (state = [], action) => [...state, action]
  );

  store.dispatch({ type: 'FOO' });
  store.dispatch({ type: 'BAR' });
  store.dispatch({ type: 'SPAM' });

  t.deepEqual(store.getState(), [
    { type: ActionTypes.INIT },
    { type: 'FOO', meta: { foo: true } },
    { type: 'BAR' },
    { type: 'SPAM', meta: { spam: true } },
  ]);

  t.end();
});
