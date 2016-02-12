export function metaMiddleware(meta) {
  return () => next => action => {
    if (action.type && meta[action.type]) {
      return next({ ...action, meta: meta[action.type] });
    }
    return next(action);
  };
}
