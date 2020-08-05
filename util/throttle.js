let throttle = function (fn, wait, options = {leading: false, trailing: true}) {
  let previous = 0;
  let context;
  let arg;
  let timeout;
  let lastCall = () => {
    if (options.leading === false) {
      previous = 0
    } else {
      previous = Date.now();
    }
    fn.apply(context, arg);
    previous = Date.now();
  }
  let throttled = () => {
    let now = Date.now();
    if (!previous && options.leading === false) { previous = now; }
    let remaining = wait - (now-previous); // 1000 1200
    context = this;
    arg = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      fn.apply(context, arg);
      previous = now;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(lastCall, remaining)
    }
  }
  return throttled;
}
window.throttle = throttle;


let debounce = (fn, wait, options = {immediate: true}) => {
  let timeout;
  let context;
  let arg;

  let debounced = () => {
    context = this;
    arg = arguments;
    clearTimeout(timeout);
    if (options.immediate) {
      let called = !timeout;
      if (called) {
        called = false;
        fn.apply(context, arg);
      }
    }
    timeout = setTimeout(() => {
      fn.apply(context, arg);
      timeout = null;
    }, wait)
  }
  return debounced;
}
window.debounce = debounce;