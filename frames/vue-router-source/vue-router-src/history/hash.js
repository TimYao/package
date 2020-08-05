import History from './base';

// 处理默认根目录#
const ensureSlash = () => {
  if (window.location.href.lastIndexOf('#/') > -1) {
    return;
  }
  window.location.hash = '/';
}

class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;

    ensureSlash();
  }
  getCurrentLocation() {
    return window.location.hash.slice(1);
  }
  setupListener() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(this.getCurrentLocation());
    })
  }
  push(location, onComplete) {
    this.transitionTo(location, (route) => {
      pushHash(location);
      onComplete && onComplete(route);
    });
  }
}

// 简单实现
function pushHash(location) {
  const getPath = () => {
    if (typeof location === 'string') {
      return location;
    } else if (typeof location === 'object') {
      return location.path || '/';
    }
  }
  window.location.hash = getPath();
}

export default HashHistory;