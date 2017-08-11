<template>
<div>
  <div class="component-wrapper" v-if='!loading'>
    <div class="space">
      <div class="field has-addons has-addons-centered">
        <div class="control">
          <div class="select">
            <select class='select' v-model='selectedUser'>
              <option v-for='user in users' :value='user.id'>{{ user.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field has-addons has-addons-centered">
        <p class="control">
          <DatePicker :value='startDate' :input-class="datepickerInputClass" @selected='chooseDate2' :wrapper-class='datepickerWrapperClass'></DatePicker>
        </p>
        <p class="control">
          <span class="button is-static">
            to
          </span>
        </p>
        <p class="control">
          <DatePicker :value='endDate' :input-class="datepickerInputClass" @selected='chooseDate2' :wrapper-class='datepickerWrapperClass'></DatePicker>
        </p>
      </div>
    </div>
    <table>
      <tr>
        <th>
          User
        </th>
        <th>
          Client
        </th>
        <th>
          Task Description
        </th>
        <th>
          Start Time
        </th>
        <th>
          End Time
        </th>
        <th>
          Hours Allotted
        </th>
        <th>
          Task Completed
        </th>
        <th></th>
      </tr>
      <AdminTask v-for="task in taskList" :task="task" :key="task.id" />
    </table>
  </div>
  <div v-else>
    Loading tasks...
  </div>
</div>
</template>

<style scoped>
table {
  margin: 0 auto;
}
.space {
  margin: 20px auto;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import { sortBy, filter } from 'lodash'
import Auth from 'Auth'
import moment from 'moment'
import AdminTask from '@/components/AdminTask'
import DatePicker from 'vuejs-datepicker'

export default {
  name: 'TaskListRoute',
  components: {
    AdminTask,
    DatePicker
  },
  computed: {
    taskList () {
      return sortBy(filter(this.sortedTasksWithDate(this.startDate, this.endDate), task => task.user_id === this.selectedUser), ['completed', 'user_id', 'start_time'])
    },
    ...mapGetters(['sortedTasks', 'users', 'sortedTasksWithDate'])
  },
  data () {
    return {
      startDate: moment().day(1).hour(8).minute(0).toDate(),
      endDate: moment().day(5).hour(18).minute(0).toDate(),
      datepickerInputClass: 'input is-static',
      datepickerWrapperClass: 'inline',
      selectedUser: '',
      loading: false
    }
  },
  methods: {
    chooseDate2 (date) {
      this.startDate = moment(date).day(1).format('YYYY-MM-DD')
      this.endDate = moment(date).day(5).hour(18).format('YYYY-MM-DD')
      // console.log(moment(date).day(1).hour(18).toDate())
    },
    ...mapActions(['getAllTasks', 'getAllUsers', 'getAllClients'])
  },
  created () {
    this.loading = true
    return Promise.all([
      this.getAllUsers().then(() => {
        this.selectedUser = Auth.getUser().id
      }),
      this.getAllTasks(),
      this.getAllClients()
    ]).then(() => { this.loading = false })
  }
}
</script>
