import moment from 'moment'
import store from '@/store'

export const isLoggedIn = () => {
  return store.getters.loginStatus
}

export const attemptLogin = (email, password) => {
  return store.dispatch('attemptLogin', { email, password })
}

export const logout = () => {
  return store.dispatch('logout')
}

export const getUser = () => {
  return store.getters.authUser
}

export const getToken = () => {
  return getUser().api_token || ''
}

export const expireInvalidLogins = () => {
  if (localStorage.getItem('loginExpires') !== null) {
    const expiry = moment(localStorage.getItem('loginExpires'))
    if (expiry < moment()) {
      store.dispatch('logout')
    }
  }
}

export default {
  isLoggedIn,
  attemptLogin,
  logout,
  getUser,
  getToken,
  expireInvalidLogins
}
