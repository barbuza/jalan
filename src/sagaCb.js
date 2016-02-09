export function sagaCbStrict() {
  let nextCallback = null;
  const queue = [];

  function listener(data) {
    if (nextCallback) {
      const callbackCopy = nextCallback;
      nextCallback = null;
      callbackCopy(null, data);
    } else {
      queue.push(data);
    }
  }

  function callback(cb) {
    if (queue.length) {
      const data = queue.shift();
      cb(null, data);
    } else if (!nextCallback) {
      nextCallback = cb;
    } else {
      throw new Error('invalid state');
    }
  }

  return { callback, listener };
}

export function sagaCbLoose() {
  let nextCallback = null;
  let nextData = null;

  function listener(data) {
    if (nextCallback) {
      const callbackCopy = nextCallback;
      nextCallback = null;
      nextData = null;
      callbackCopy(null, data);
    } else {
      nextData = data;
    }
  }

  function callback(cb) {
    if (nextData) {
      const dataCopy = nextData;
      nextData = null;
      cb(null, dataCopy);
    } else if (!nextCallback) {
      nextCallback = cb;
    } else {
      throw new Error('invalid state');
    }
  }

  return { callback, listener };
}
