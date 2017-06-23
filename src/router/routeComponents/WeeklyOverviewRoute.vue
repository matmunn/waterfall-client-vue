<template>
<div>
  <section class="hero is-primary is-bold">
    <div class="hero-head">
      <header class="nav">
        <div class="container">
          <div class="nav-left">
            <router-link to='/' class="nav-item">Home</router-link>
          </div>
          <div class="nav-right">
            <router-link to='/admin' class="nav-item">Admin</router-link>
            <router-link to='/logout' class="nav-item">Logout</router-link>
          </div>
        </div>
      </header>
    </div>
    <div class="hero-body">
      <div class="container">
        <router-link to="/">
          <div class="logo" v-html='logoSvg'></div>
        </router-link>
      </div>
    </div>
    <div class="hero-foot">
      <div class="container">
        <div class="date-inputs">
          <div class="field has-addons has-addons-centered">
            <p class="control">
              <!-- <DatePicker :value='startDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker> -->
              <DatePicker v-model='startDate' :config="{ dateFormat: 'Y-m-d' }"></DatePicker>
            </p>
            <p class="control">
              <span class="button is-static">
                to
              </span>
            </p>
            <p class="control">
              <!-- <DatePicker v-model='endDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker> -->
              <DatePicker v-model='endDate' :config="{ dateFormat: 'Y-m-d' }"></DatePicker>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section" v-for='category in displayCategories'>
    <div class="category-header">
      <h1 class="title">
        {{ category.description }}
      </h1>
    </div>
    <div class="user" v-for='user in categoryUsers(category.id)'>
      <div class="user-header">
        <h2 class="subtitle is-4">
          {{ user.name }}
        </h2>
      </div>
      <UserTaskTable :tasks='userTasks(user.id)' :background='category.hex_color'></UserTaskTable>
    </div>
  </section>
</div>
</template>

<style scoped>
.date-inputs {
  text-align: center;
  margin-bottom: 20px;
  /*margin-bottom: 2vh;*/
}
.category {
  /*border: 1px solid black;*/
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
// import DatePicker from 'vuejs-datepicker'
import DatePicker from 'vue-bulma-datepicker'
import { toastr } from 'Helpers'
import { mapActions, mapGetters } from 'vuex'
import UserTaskTable from '@/components/UserTaskTable'
import logo from '../../../static/img/logo.svg'

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
      noteCount: 999,
      logoSvg: logo
    }
  },
  computed: mapGetters(['displayCategories', 'categoryUsers', 'userTasks', 'nortificationPermission']),
  methods: {
    categoryUsers (categoryId) {
      return this.categoryUsers(categoryId)
    },
    userTasks (userId) {
      return this.userTasks(userId, this.startDate, this.endDate)
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
          if (this.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', {body: 'New tasks have been added'})
            setTimeout(n.close.bind(n), 5000)
          }
        }
        this.taskCount = tasks
      }, () => {
        toastr.error(`There was an error fetching tasks`, 'Error')
      })
    },
    ...mapActions(['getAllCategories', 'getAllUsers', 'getAllTasks', 'getAllClients', 'getAllNotes', 'getTasksBetweenDates'])
  },
  created () {
    this.getAllCategories()
    this.getAllUsers()
    this.getAllClients()
    this.getAllNotes()

    this.fetchTasksWithDates()
  }
}
</script>
