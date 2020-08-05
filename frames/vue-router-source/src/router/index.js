import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueRouter from '../../vue-router-src'
import Home from '../views/Home.vue'
import About from '../views/About.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        name: 'a',
        component: {
          render: h=>h('p', 'about a')
        }
      },
      {
        path: 'b',
        name: 'b',
        component: {
          render: h=>h('p', 'about b')
        }
      }
    ]
  },
  {
    path: '*',
    component: {
      render: h => h('<h2>not found</h2>')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: '/',
  routes
})

export default router
