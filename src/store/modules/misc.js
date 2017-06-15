import { SET_NOTIFICATION_PERMISSION } from '@/store/mutations'

export const mutations = {
  [SET_NOTIFICATION_PERMISSION] (state, permission) {
    state.notificationPermission = permission
  }
}

export const getters = {
  notificationPermission: state => state.notificationPermission
}

export default {
  state: {
    notificationPermission: false
  },
  mutations,
  getters
}
