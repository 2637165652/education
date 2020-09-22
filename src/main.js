// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import filters from './filters'
import store from './store/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.use(filters)

Vue.config.productionTip = false

// 全局前置守卫 权限控制
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (localStorage.getItem('user')) {
      next()
    } else {
      next({name: 'Login'})
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
