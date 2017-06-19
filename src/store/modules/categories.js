import config from 'Config'
import axios from 'axios'
import { SET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/store/mutations'
import { find, findIndex, filter } from 'lodash'

export const actions = {
  getAllCategories ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/categories`).then(response => {
        if (response.status === 200) {
          commit(SET_CATEGORIES, response.data)
          resolve(true)
        }
        reject(`There was an error`)
      }, error => {
        reject(error)
      })
    })
  },
  addCategory ({ commit }, categoryData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/category`, categoryData).then(response => {
        if (response.status === 201) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  editCategory ({ commit }, categoryData) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/category/${categoryData.id}`, categoryData).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  deleteCategory ({ commit }, categoryId) {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.apiHost}/api/category/${categoryId}`).then(response => {
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
  [SET_CATEGORIES] (state, categories) {
    state.categories = categories
  },
  [ADD_CATEGORY] (state, category) {
    state.categories.push(category)
  },
  [UPDATE_CATEGORY] (state, category) {
    const elmIndex = findIndex(state.categories, x => x.id === category.id)

    state.categories.splice(elmIndex, 1, category)
  },
  [DELETE_CATEGORY] (state, categoryId) {
    state.categories = filter(state.categories, o => o.id !== categoryId)
  }
}

export const getters = {
  categories: state => state.categories,
  category: (state, getters) => (categoryId) => {
    return find(state.categories, category => category.id === categoryId)
  },
  displayCategories: state => filter(state.categories, cat => cat.display_in_list)
}

export default {
  state: {
    categories: []
  },
  actions,
  mutations,
  getters
}
