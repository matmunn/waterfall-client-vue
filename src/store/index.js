import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import tasks from './modules/tasks'
import categories from './modules/categories'
import users from './modules/users'
import clients from './modules/clients'
import notes from './modules/notes'
import auth from './modules/auth'
import router from './modules/router'
import misc from './modules/misc'

export default new Vuex.Store({
  modules: {
    tasks,
    categories,
    users,
    clients,
    notes,
    auth,
    router,
    misc
  }
})
