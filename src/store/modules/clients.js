import axios from 'axios'
import { SET_CLIENTS, ADD_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '@/store/mutations'
import { findIndex, filter, find } from 'lodash'

export const actions = {
  getAllClients ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/clients').then(response => {
        if (response.status === 200) {
          commit(SET_CLIENTS, response.data)
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  addClient ({ commit }, clientData) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/client`, clientData).then(response => {
        if (response.status === 201) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  editClient ({ commit }, clientData) {
    return new Promise((resolve, reject) => {
      axios.patch(`/api/client/${clientData.id}`, clientData).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  deleteClient ({ commit }, clientId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/client/${clientId}`).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an errro`)
      })
    })
  }
}

export const mutations = {
  [SET_CLIENTS] (state, clients) {
    state.clients = clients
  },
  [ADD_CLIENT] (state, client) {
    state.clients.push(client)
  },
  [UPDATE_CLIENT] (state, client) {
    const elmIndex = findIndex(state.clients, x => x.id === client.id)

    state.clients.splice(elmIndex, 1, client)
  },
  [DELETE_CLIENT] (state, clientId) {
    state.clients = filter(state.clients, client => client.id !== clientId)
  }
}

export const getters = {
  clients: state => state.clients,
  client: (state) => (clientId) => {
    return find(state.clients, client => client.id === clientId)
  }
}

export default {
  state: {
    clients: []
  },
  actions,
  mutations,
  getters
}
