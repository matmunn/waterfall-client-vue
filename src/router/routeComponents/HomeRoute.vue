<template>
  <div>
    <div>
      <img src="/img/savi-logo.svg" class="logo">
    </div>
    <ul class="nav nav-tabs" role="tablist">
      <li v-for="category in displayCategories" :class='isUserCategory(category.id)' :key="category.id" role="presentation">
        <a :href="'#' + categorySafeName(category.description)" role="tab" data-toggle="tab">{{ category.description }}</a>
      </li>
      <li role="presentation" class="pull-right">
        <router-link to='/logout'>Logout</router-link>
      </li>
      <li role="presentation" class="pull-right">
        <router-link to='/admin'>Admin</router-link>
      </li>
      <li role="presentation" class="pull-right">
        <DatePicker :value='startDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
        to
        <DatePicker :value='endDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
      </li>
    </ul>
    <div class='tab-content'>
      <CategoryTabPanel v-for='category in displayCategories' :key='category.id' :category='category' :id='categorySafeName(category.description)' />
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
import Auth from 'Auth'
import moment from 'moment'
import DatePicker from 'vuejs-datepicker'
import { toastr, getTask } from 'Helpers'
import { mapActions, mapGetters } from 'vuex'
import { CategoryTabPanel } from 'Components'

export default {
  name: 'HomeRoute',
  components: {
    CategoryTabPanel,
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
      categorySafeName (catName) {
        return catName.toLowerCase().replace(' ', '_')
      },
      chooseDate (date) {
        this.startDate = moment(date).day(1).format('YYYY-MM-DD')
        this.endDate = moment(date).day(5).format('YYYY-MM-DD')
        this.$bus.$emit('date-changed-event', {
          start: this.startDate,
          end: this.endDate
        })
        this.fetchTasksWithDates()
      },
      isUserCategory (categoryId) {
        if (Auth.isLoggedIn()) {
          if (Auth.getUser().category_id === categoryId) {
            return 'active'
          }
        }
        return ''
      },
      fetchTasksWithDates () {
        this.loading = true
        this.$bus.$emit('started-loading-tasks')
        this.getTasksBetweenDates({start: moment(this.startDate).format('YYYY-MM-DD'), end: moment(this.endDate).format('YYYY-MM-DD')}).then(tasks => {
          this.loading = false
          this.$bus.$emit('finished-loading-tasks')
        }, () => {
          toastr.error(`There was an error fetching tasks`, 'Error')
        })
      }
    }
  ),
  created () {
    this.getAllCategories().catch(() => {
      toastr.error('There was an error fetching categories', 'Error')
    })
    this.getAllUsers().catch(() => {
      toastr.error('There was an error fetching users', 'Error')
    })
    this.getAllClients().catch(() => {
      toastr.error('There was an error fetching clients', 'Error')
    })

    this.getAllNotes().catch(() => {
      toastr.error('There was an error fetching notes', 'Error')
    })

    this.fetchTasksWithDates()

    if (Auth.isLoggedIn()) {
      window.Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${Auth.getToken()}`
      window.Echo.private(`App.User.${Auth.getUser().id}`)
        .listen('.NoteAdded', data => {
          toastr.info(`A new note was added to your task '${getTask(data.note.entry_id).description}'`, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', {body: `A new note was added to your task '${getTask(data.note.entry_id).description}'`})
            setTimeout(n.close.bind(n), 5000)
          }
        })
        .listen('.TaskAdded', data => {
          toastr.info(`A new task was added (${data.task.description})<br>
            Staring ${moment(data.task.start_date).format('YYYY-MM-DD HH:mm')}
          `, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', {body: `A new task was added (${data.task.description})\n
              Staring ${moment(data.task.start_date).format('YYYY-MM-DD HH:mm')}
            `})
            setTimeout(n.close.bind(n), 5000)
          }
        })
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.taskInterval)
    next()
  }
}
</script>
