import config from 'Config'
import { SET_NOTES, ADD_NOTE, UPDATE_NOTE, DELETE_NOTE } from '@/store/mutations'
import { findIndex, filter } from 'lodash'
import axios from 'axios'

export const actions = {
  getAllNotes ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/notes`).then(response => {
        if (response.status === 200) {
          commit(SET_NOTES, response.data)
          resolve(response.data.length)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  addNote ({ commit }, noteData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/notes`, noteData).then(response => {
        if (response.status === 201) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  editNote ({ commit }, noteData) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/notes/${noteData.id}`, noteData).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(`There was an error`)
      }, () => {
        reject(`There was an error`)
      })
    })
  },
  deleteNote ({ commit }, noteId) {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.apiHost}/api/notes/${noteId}`).then(response => {
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
  [SET_NOTES] (state, notes) {
    state.notes = notes
  },
  [ADD_NOTE] (state, note) {
    state.notes.unshift(note)
  },
  [UPDATE_NOTE] (state, note) {
    const elmIndex = findIndex(state.notes, x => x.id === note.id)

    state.notes.splice(elmIndex, 1, note)
  },
  [DELETE_NOTE] (state, noteId) {
    state.notes = filter(state.notes, note => note.id !== noteId)
  }
}

export const getters = {
  notes: state => state.notes,
  taskNotes: (state, getters) => (taskId) => {
    return filter(state.notes, note => note.task_id === taskId)
  }
}

export default {
  state: {
    notes: []
  },
  actions,
  mutations,
  getters
}
