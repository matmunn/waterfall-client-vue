<template>
  <div>
    <div>
      <img src="/static/img/logo.svg" class="logo">
    </div>
    <div class="date-inputs">
      Welcome Mat
      <div class="field has-addons">
        <p class="control">
          <DatePicker :value='startDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
        </p>
        <p class="control">
          <span class="button is-static">
            to
          </span>
        </p>
        <p class="control">
          <DatePicker :value='endDate' :input-class="datepickerInputClass" @selected='chooseDate' :wrapper-class='datepickerWrapperClass'></DatePicker>
        </p>
      </div>
      <router-link to='/logout'>Logout</router-link>
    </div>
    <b-tabs v-model='activeTab' :animated='false'>
      <b-tab-item v-for='category in displayCategories' :key='category.id' :label='category.description'>
        <CategoryTabPanel :key='category.id' :category='category' :id='categorySafeName(category.description)'></CategoryTabPanel>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<style scoped>
.logo {
  width: 20%;
  max-width: 300px;
  margin: 1vh auto 2vh;
  display: block;
}
.date-inputs {
  text-align: center;
  margin-bottom: 2vh;
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
// import DatePicker from 'vue-bulma-datepicker'
import { toastr, getTask } from 'Helpers'
import { mapActions, mapGetters } from 'vuex'
import { CategoryTabPanel } from 'Components'
// import { findIndex } from 'lodash'

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
      noteCount: 999,
      activeTab: 0
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
            return 'is-active'
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
    this.getAllCategories().then(() => {
      // this.activeTab = findIndex(this.displayCategories, item => item.id === Auth.getUser().category_id)
    }).catch(() => {
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
      this.$echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${Auth.getToken()}`
      this.$echo.private(`App.User.${Auth.getUser().id}`)
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
