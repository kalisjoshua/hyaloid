function debounce(fn, delay) {
  let pending;

  function postponed(...args) {
    if (pending) {
      clearTimeout(pending);
    }

    pending = setTimeout(fn.bind(this, ...args), delay || 60);
  }

  return postponed;
}

export default debounce;
