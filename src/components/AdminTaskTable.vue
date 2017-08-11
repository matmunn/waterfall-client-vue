<template>
<div>
  <div class="text-center space">
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
  props: ['tasks'],
  computed: {
    taskList () {
      return sortBy(filter(this.sortedTasksWithDate(this.startDate, this.endDate), task => task.created_by === Auth.getUser().id), ['completed', 'user_id', 'start_time'])
    },
    ...mapGetters(['sortedTasksWithDate', 'users'])
  },
  data () {
    return {
      startDate: moment().day(1).hour(8).minute(0).format('YYYY-MM-DD'),
      endDate: moment().day(5).hour(18).minute(0).format('YYYY-MM-DD'),
      datepickerInputClass: 'input is-static',
      datepickerWrapperClass: 'inline',
      selectedUser: ''
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
    this.getAllUsers()
    this.getAllTasks()
    this.getAllClients()
  }
}
</script>
