export default function enhanceHistory(history) {
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

    push({ pathname, state }) {
      history.push({ pathname, state });
    },
  };
}
