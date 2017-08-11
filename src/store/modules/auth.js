import config from 'Config'
import axios from 'axios'
import moment from 'moment'
import { LOGIN, LOGOUT } from '@/store/mutations'

export const actions = {
  attemptLogin ({ commit }, userData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/login`, userData).then(response => {
        if (response.status === 200) {
          commit(LOGIN, response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('loggedIn', true)
          localStorage.setItem('loginExpires', moment().add(24, 'hours').toISOString())
          resolve(response.data)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  attemptRegister ({ commit }, userData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/register`, userData).then(response => {
        if (response.status === 201) {
          commit(LOGIN, response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('loggedIn', true)
          localStorage.setItem('loginExpires', moment().add(24, 'hours').toISOString())
          resolve(response.data)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('loginExpires')
      commit(LOGOUT)
      resolve()
    })
  }
}

export const mutations = {
  [LOGIN] (state, user) {
    state.loginStatus = true
    state.user = user
  },
  [LOGOUT] (state) {
    state.loginStatus = false
    state.user = {}
  }
}

export const getters = {
  loginStatus: state => state.loginStatus,
  authUser: state => state.user
}

export default {
  state: {
    loginStatus: !!localStorage.getItem('loggedIn'),
    user: JSON.parse(localStorage.getItem('user')) || {}
  },
  actions,
  mutations,
  getters
}
