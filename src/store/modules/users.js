import config from 'Config'
import axios from 'axios'
import { SET_USERS, ADD_USER, UPDATE_USER, DELETE_USER } from '@/store/mutations'
import { findIndex, find, filter } from 'lodash'

export const actions = {
  getAllUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/users`).then(response => {
        if (response.status === 200) {
          commit(SET_USERS, response.data)
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  addUser ({ commit }, userData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/user`, userData).then(response => {
        if (response.status === 201) {
          resolve(true)
        }
        reject('There was an error')
      }, () => {
        reject('There was an error')
      })
    })
  },
  editUser ({ commit }, userData) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/user/${userData.id}`, userData).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject('There was an error')
      }, () => {
        reject('There was an error')
      })
    })
  },
  deleteUser ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.apiHost}/api/user/${userId}`).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  }
}

export const mutations = {
  [SET_USERS] (state, users) {
    state.users = users
  },
  [ADD_USER] (state, user) {
    state.users.push(user)
  },
  [UPDATE_USER] (state, user) {
    const elmIndex = findIndex(state.users, x => x.id === user.id)

    state.users.splice(elmIndex, 1, user)
  },
  [DELETE_USER] (state, userId) {
    state.users = filter(state.users, user => user.id !== userId)
  }
}

export const getters = {
  users: state => state.users,
  categoryUsers: (state, getters) => (category) => {
    return filter(state.users, user => user.category_id === category)
  },
  user: (state, getters) => (userId) => {
    return find(state.users, user => user.id === userId)
  }
}

export default {
  state: {
    users: []
  },
  actions,
  mutations,
  getters
}
