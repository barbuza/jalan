export function enhanceHistory(history) {
  let location = null;

  history.listen(loc => {
    location = loc;
  });

  return {
    getLocation() {
      return location;
    },

    listen(listener) {
      return history.listen(listener);
    },

    push({ pathname, search, state }) {
      history.push({ pathname, search, state });
    },
  };
}
