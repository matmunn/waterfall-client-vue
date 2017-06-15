import store from '@/store'
import toastr from 'toastr'
import swal from 'sweetalert2'

toastr.options.closeButton = false
toastr.options.timeOut = 2500
toastr.options.extendedTimeOut = 5000

export const getCategory = categoryId => {
  return store.getters.category(categoryId) || {}
}

export const getUser = userId => {
  return store.getters.user(userId) || {}
}

export const getClient = clientId => {
  return store.getters.client(clientId) || {}
}

export const getNotes = taskId => {
  return store.getters.taskNotes(taskId)
}

export const getTask = taskId => {
  return store.getters.task(taskId) || {}
}

export default {
  getUser,
  getClient,
  getNotes,
  getCategory,
  getTask,
  toastr,
  swal
}
