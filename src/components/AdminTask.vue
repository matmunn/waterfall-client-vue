<template>
<tr>
  <td>
    {{ getUser(this.task.user_id).name }}
  </td>
  <td>
    {{ getClient(this.task.client_id).name }}
  </td>
  <td>
    {{ this.task.description }}
  </td>
  <td>
    {{ formattedTime(this.task.start_date) }}
  </td>
  <td>
    {{ formattedTime(this.task.end_date) }}
  </td>
  <td class="centered">
    {{ this.task.blocks.length }}
  </td>
  <td class="centered">
    <i class="fa" :class="completedClass"></i>
  </td>
  <td>
    <router-link :to='editLink'>
      <i class="fa fa-edit"></i>
    </router-link>
    <a href="#" @click.prevent='deleteTask'>
      <i class="fa fa-trash-o"></i>
    </a>
  </td>
</tr>
</template>

<style lang="scss" scoped>
.fa-times {
  color: red;
}
.fa-check {
  color: yellowgreen;
}
.centered {
  text-align: center;
}
td {
  padding: 10px;
}
</style>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import helpers from 'Helpers'
const { getUser, getClient } = helpers

export default {
  name: 'AdminTask',
  props: ['task'],
  computed: {
    completedClass () {
      return this.task.completed ? 'fa-check' : 'fa-times'
    },
    editLink () {
      return `/admin/tasks/${this.task.id}/edit`
    },
    deleteLink () {
      return `/admin/tasks/${this.task.id}/delete`
    }
  },
  methods: {
    getUser,
    getClient,
    formattedTime (time) {
      return moment(time).format('YYYY-MM-DD HH:00')
    },
    confirmDelete () {
      return helpers.swal({
        title: `Delete Task`,
        html: `Are you sure you want to <strong>permanently delete this task</strong>?`,
        type: 'error',
        showCancelButton: true
      }).then(() => {
        this.deleteTask(this.task.id)
      }, helpers.swal.noop)
    },
    ...mapActions(['deleteTask'])
  }
}
</script>
