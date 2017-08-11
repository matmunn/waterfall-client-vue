// window.$ = window.jQuery = require('jquery')
// require('bootstrap-sass')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/styles/app.scss'

import Vue from 'vue'

import router from './router'
import store from './store'
import bus from './bus'
import axios from 'axios'
import auth from 'Auth'

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import config from 'Config'

window.Pusher = Pusher

import helpers from 'Helpers'

import {
  SET_NOTIFICATION_PERMISSION,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  ADD_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  ADD_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from '@/store/mutations'

axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = `Bearer ${auth.getToken()}`

  return config
})

Vue.config.productionTip = false

Vue.prototype.$bus = bus

Vue.prototype.$echo = new Echo({
  broadcaster: 'pusher',
  key: 'waterfall',
  authEndpoint: `${config.apiHost}/broadcasting/auth`,
  wsHost: config.pusherHost,
  wsPort: config.pusherPort,
  wssPort: config.pusherPort,
  enabledTransports: ['ws', 'flash']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  created () {
    if ('Notifcation' in window) {
      window.Notification.requestPermission(perm => {
        this.$store.commit(SET_NOTIFICATION_PERMISSION, perm)
      })
    }

    this.$echo.channel('waterfall')
      .listen('.UpdateAvailable', e => {
        helpers.swal({
          type: 'warning',
          title: 'Update Available',
          html: `A new version has been released.<br>
            You need to refresh to see the changes.<br>
            <strong>If you don't you might experience errors.</strong><br>
            Refresh now?`,
          showCancelButton: true,
          cancelButtonText: 'Not yet',
          confirmButtonText: 'Show me the goodness!'
        }).then(() => {
          window.location.reload()
        }, () => {
          window.ignoredReload = true
        })
      })
      .listen('.TaskAdded', data => {
        this.$store.commit(ADD_TASK, data.task)
      })
      .listen('.TaskDeleted', data => {
        this.$store.commit(DELETE_TASK, data.taskId)
      })
      .listen('.TaskEdited', data => {
        this.$store.commit(UPDATE_TASK, data.task)
      })
      .listen('.NoteAdded', data => {
        console.log('event triggerd')
        this.$store.commit(ADD_NOTE, data.note)
      })
      .listen('.NoteEdited', data => {
        this.$store.commit(UPDATE_NOTE, data.note)
      })
      .listen('.NoteDeleted', data => {
        this.$store.commit(DELETE_NOTE, data.noteId)
      })
      .listen('.UserAdded', data => {
        this.$store.commit(ADD_USER, data.user)
      })
      .listen('.UserEdited', data => {
        this.$store.commit(UPDATE_USER, data.user)
      })
      .listen('.UserDeleted', data => {
        this.$store.commit(DELETE_USER, data.userId)
      })
      .listen('.CategoryAdded', data => {
        this.$store.commit(ADD_CATEGORY, data.category)
      })
      .listen('.CategoryEdited', data => {
        this.$store.commit(UPDATE_CATEGORY, data.category)
      })
      .listen('.CategoryDeleted', data => {
        this.$store.commit(DELETE_CATEGORY, data.categoryId)
      })
      .listen('.ClientAdded', data => {
        this.$store.commit(ADD_CLIENT, data.client)
      })
      .listen('.ClientEdited', data => {
        this.$store.commit(UPDATE_CLIENT, data.client)
      })
      .listen('.ClientDeleted', data => {
        this.$store.commit(DELETE_CLIENT, data.clientId)
      })
  }
}).$mount('#app')
