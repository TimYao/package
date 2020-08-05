import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

const vm = new Vue({
  router,
  render: h => {
    // console.log(h(App));
    return h(App)
  }
}).$mount('#app')
console.log(vm.$route);

