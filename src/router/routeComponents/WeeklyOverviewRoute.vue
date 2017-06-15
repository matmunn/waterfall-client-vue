<template>
  <div>
    <div>
      <router-link to='/'>
        <img src="/img/savi-logo.svg" class="logo">
      </router-link>
    </div>
    <div class='date-pickers'>
      <DatePicker :value='startDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
      to
      <DatePicker :value='endDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
    </div>
    <div class="category" v-for='category in displayCategories'>
      <div class="category-header">
        <h1>
          {{ category.description }}
        </h1>
      </div>
      <div class="user" v-for='user in categoryUsers(category.id)'>
        <div class="user-header">
          <h2>
            {{ user.name }}
          </h2>
        </div>
        <UserTaskTable :tasks='userTasks(user.id)' :background='category.hex_color'></UserTaskTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 10%;
  max-width: 300px;
  margin: 1vh auto 2vh;
  display: block;
}
.date-pickers {
  text-align: center;
}
.category {
  border: 1px solid black;
  margin-top: 50px;
}
.user {
  margin-top: 30px;
}
.category-header, .user-header {
  text-align: center;
}
</style>
<style>
.vdp-datepicker__calendar {
  left: -100px;
}
.inline {
  display: inline-block;
}
</style>

<script>
import moment from 'moment'
import DatePicker from 'vuejs-datepicker'
import { toastr } from 'Helpers'
import { mapActions, mapGetters } from 'vuex'
import UserTaskTable from '@/components/UserTaskTable'

export default {
  name: 'WeeklyOverviewRoute',
  components: {
    UserTaskTable,
    DatePicker
  },
  data () {
    return {
      taskInterval: undefined,
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD'),
      datePeriod: {},
      datepickerInputClass: 'form-control',
      datepickerWrapperClass: 'inline',
      taskCount: 999,
      noteCount: 999
    }
  },
  computed: mapGetters(['displayCategories']),
  methods: Object.assign({},
    mapActions(['getAllCategories', 'getAllUsers', 'getAllTasks', 'getAllClients', 'getAllNotes', 'getTasksBetweenDates']),
    {
      categoryUsers (categoryId) {
        return this.$store.getters.categoryUsers(categoryId)
      },
      userTasks (userId) {
        return this.$store.getters.userTasks(userId, this.startDate, this.endDate)
      },
      chooseDate (date) {
        this.startDate = moment(date).day(1).format('YYYY-MM-DD')
        this.endDate = moment(date).day(5).format('YYYY-MM-DD')
        this.$bus.$emit('date-changed-event', {
          start: this.startDate,
          end: this.endDate
        })
        this.taskCount = 999
        this.fetchTasksWithDates()
      },
      fetchTasksWithDates () {
        this.loading = true
        this.$bus.$emit('started-loading-tasks')
        this.getTasksBetweenDates({start: moment(this.startDate).format('YYYY-MM-DD'), end: moment(this.endDate).format('YYYY-MM-DD')}).then(tasks => {
          this.loading = false
          this.$bus.$emit('finished-loading-tasks')
          if (tasks > this.taskCount) {
            toastr.info('New tasks have been added', 'Notice')
            if (this.$store.getters.notificationPermission !== 'denied') {
              const n = new Notification('Waterfall', {body: 'New tasks have been added'})
              setTimeout(n.close.bind(n), 5000)
            }
          }
          this.taskCount = tasks
        }, () => {
          toastr.error(`There was an error fetching tasks`, 'Error')
        })
      }
    }
  ),
  created () {
    this.getAllCategories()
    this.getAllUsers()
    this.getAllClients()
    this.getAllNotes()

    this.fetchTasksWithDates()
  }
}
</script>
