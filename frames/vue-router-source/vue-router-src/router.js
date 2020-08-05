import Html5History from './history/html5';
import HashHistory from './history/hash';
import {createMatcher} from './create-matcher';


class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash';
    this.app = Object.create(null);

    // 对路由地址进行格式化
    // pathList = ['/', '/about'] pathMap = {'/', {name:'app', component:{}}}
    this.matcher = createMatcher(options.routes);

    // 测试手动添加路由
    // this.matcher.addRoutes([{
    //   path: '/xxx',
    //   component: {}
    // }]);

    switch(this.mode) {
      case 'hash':
        this.history = new HashHistory(this);
        break;
      case 'history':
        this.history = new Html5History(this);
        break;
      default:
        console.warn('mode is fail')
    }
  }
  init(app) {
    if (this.app !== app) {
      this.app = app;
    }

    const history = this.history;

    const setupListener = () => {
      history.setupListener();
    }
    // 切换地址
    history.transitionTo(history.getCurrentLocation(), setupListener);

    history.listener((route)=>{
      app._route = route;
    });
  }
  match(location) {
    return this.matcher.match(location);
  }
  push(location, onComplete) {
    this.history.push(location, onComplete);
  }
}

export default VueRouter;