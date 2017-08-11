import config from 'Config'
import axios from 'axios'
import moment from 'moment'
import { SET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, SET_TASK_COMPLETE_STATUS } from '@/store/mutations'
import { sortBy, findIndex, filter, find } from 'lodash'

export const mutations = {
  [SET_TASKS] (state, tasks) {
    state.tasks = tasks
  },
  [ADD_TASK] (state, task) {
    state.tasks.push(task)
  },
  [UPDATE_TASK] (state, task) {
    const elmIndex = findIndex(state.tasks, x => x.id === task.id)

    state.tasks.splice(elmIndex, 1, task)
  },
  [DELETE_TASK] (state, taskId) {
    state.tasks = filter(state.tasks, task => task.id !== taskId)
  },
  [SET_TASK_COMPLETE_STATUS] (state, {taskId, status}) {
    let task = find(state.tasks, task => task.id === taskId)
    if (task !== undefined) {
      task.completed = status
    }
  }
}

export const getters = {
  tasks: state => state.tasks,
  task: (state, getters) => (taskId) => {
    return find(state.tasks, task => task.id === taskId)
  },
  sortedTasks: state => {
    return sortBy(state.tasks, ['completed', 'start_date'])
  },
  userTasks: (state, getters) => (userId, startDate, endDate) => {
    return filter(getters.sortedTasksWithDate(startDate, endDate), task => task.user_id === userId)
  },
  sortedTasksWithDate: (state, getters) => (startDate, endDate) => {
    return filter(getters.sortedTasks, task => {
      const startTimeMatch = (moment(task.start_date) >= moment(startDate))
      const endTimeMatch = (moment(task.end_date) <= moment(endDate).hour(18).minute(0))
      return startTimeMatch && endTimeMatch
    })
  }
}

export const actions = {
  getAllTasks ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/tasks`).then(response => {
        if (response.status === 200) {
          commit(SET_TASKS, response.data)
          resolve(response.data.length)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  getTasksBetweenDates ({ commit }, dateRange = {start: moment().day(1).format('YYYY-MM-DD'), end: moment().day(5).format('YYYY-MM-DD')}) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/tasks/${dateRange.start}/${dateRange.end}`).then(response => {
        if (response.status === 200) {
          commit(SET_TASKS, response.data)
          resolve(response.data.length)
        }
        reject('There was an error')
      }, () => {
        reject('There was an error')
      })
    })
  },
  markTaskComplete ({ commit }, taskId) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/task/${taskId}/complete`).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(response)
      }, err => {
        reject(err.response.data)
      })
    })
  },
  markTaskIncomplete ({ commit }, taskId) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/task/${taskId}/incomplete`).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject('There was an error')
      }, () => {
        reject('There was an error')
      })
    })
  },
  addTask ({ commit }, taskData) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.apiHost}/api/task`, taskData).then(response => {
        if (response.status === 201) {
          resolve(true)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  editTask ({ commit }, taskData) {
    return new Promise((resolve, reject) => {
      axios.patch(`${config.apiHost}/api/task/${taskData.id}`, taskData).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject(response)
      }, err => {
        reject(err.response.data)
      })
    })
  },
  deleteTask ({ commit }, taskId) {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.apiHost}/api/task/${taskId}`).then(response => {
        if (response.status === 200) {
          resolve(true)
        }
        reject('There was an error')
      }, () => {
        reject('There was an error')
      })
    })
  }
}

export default {
  state: {
    tasks: []
  },
  actions,
  mutations,
  getters
}
