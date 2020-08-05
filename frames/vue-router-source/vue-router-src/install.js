import View from './components/View';
import Link from './components/Link';

let Vue;
const install = (_Vue) => {
    if (install._Vue) {return}
    install._Vue = _Vue;
    Vue = _Vue;

    Vue.mixin({
      beforeCreate() {
        const options = this.$options;
        if (options.router) {
          this._routerRoot = this;
          this._router = options.router;
          this._router.init(this);

          Vue.util.defineReactive(this._routerRoot, '_route', this._router.history.current);
        } else {
          this._routerRoot = this.$parent._routerRoot || this;
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$router', {
      get() {
        return this._routerRoot._router;
      }
    })
    Object.defineProperty(Vue.prototype, '$route', {
      get() {
        return this._routerRoot && this._routerRoot._route;
      }
    })

    Vue.component('router-view', View)
    Vue.component('router-link', Link);
}
export default install;