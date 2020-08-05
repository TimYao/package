class History {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, {path: '/'});
  }
  transitionTo(location, onComplete) {
    const current = this.router.match(location);

    console.log('原来的：', this.current);

    if (this.current.path === current.path && (this.current.matched.length === current.matched.length)) {
      return;
    }

    this.current = current;
    this.cb && this.cb(current);
    console.log('新的：', current);

    onComplete && onComplete(current);
  }
  listener(cb) {
    this.cb = cb;
  }
}
function createRoute(record, location) {
  let matched = [];
  if (record) {
    while(record) {
      matched.unshift(record);
      record = record.parent;
    }
  }
  return {
    ...location,
    matched
  }
}
export {
  createRoute
}
export default History;