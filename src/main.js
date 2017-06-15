// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/styles/app.scss'

import Vue from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import auth from 'Auth'

axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = `Bearer ${auth.getToken()}`

  return config
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store
}).$mount('#app')
