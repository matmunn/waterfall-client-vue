import store from '@/store'
import toastrModule from 'toastr'
import swalModule from 'sweetalert2'

toastrModule.options.closeButton = false
toastrModule.options.timeOut = 2500
toastrModule.options.extendedTimeOut = 5000

export const toastr = toastrModule

export const swal = swalModule

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
