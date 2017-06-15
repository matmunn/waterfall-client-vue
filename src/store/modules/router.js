import { SET_NEXT_ROUTE, CLEAR_NEXT_ROUTE } from '@/store/mutations'

export const mutations = {
  [SET_NEXT_ROUTE] (state, route) {
    state.nextRoute = route
  },
  [CLEAR_NEXT_ROUTE] (state) {
    state.nextRoute = null
  }
}

export const getters = {
  nextRoute: state => state.nextRoute
}

export default {
  state: {
    nextRoute: null
  },
  mutations,
  getters
}
