<template>
<div class="waterfall-home">
  <section class="hero is-primary is-bold">
    <div class="hero-head">
      <header class="nav">
        <div class="container">
          <div class="nav-left">
            <router-link to='/overview' class="nav-item">Weekly Overview</router-link>
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
        <div class="logo" v-html='logoSvg'></div>
      </div>
    </div>
    <div class="hero-foot">
      <div class="container">
        <div class="date-inputs">
          <div class="field has-addons has-addons-centered">
            <p class="control">
              <DatePicker v-model='startDate' :config="{ dateFormat: 'Y-m-d' }"></DatePicker>
            </p>
            <p class="control">
              <span class="button is-static">
                to
              </span>
            </p>
            <p class="control">
              <DatePicker v-model='endDate' :config="{ dateFormat: 'Y-m-d' }"></DatePicker>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Tabs>
    <Tab v-for='category in displayCategories' :key='category.id' :name='category.description'>
      <CategoryTabPanel :key='category.id' :category='category' :id='categorySafeName(category.description)'></CategoryTabPanel>
    </Tab>
  </Tabs>
</div>
</template>

<style scoped lang="scss">
.date-inputs {
  text-align: center;
  margin-bottom: 20px;
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
// import DatePicker from 'vuejs-datepicker'
import DatePicker from 'vue-bulma-datepicker'
import { toastr, getTask, getUser } from 'Helpers'
import { mapActions, mapGetters } from 'vuex'
import { CategoryTabPanel, Tabs, Tab } from 'Components'
// import { findIndex } from 'lodash'

import logo from '../../../static/img/logo.svg'

export default {
  name: 'HomeRoute',
  components: {
    CategoryTabPanel,
    DatePicker,
    Tabs,
    Tab
  },
  data () {
    return {
      taskInterval: undefined,
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD'),
      datePeriod: {},
      datepickerInputClass: 'input is-static',
      datepickerWrapperClass: 'inline',
      taskCount: 999,
      noteCount: 999,
      activeTab: 0,
      logoSvg: logo
    }
  },
  watch: {
    startDate (val) {
      this.startDate = moment(val).day(1).format('YYYY-MM-DD')
      this.endDate = moment(val).day(5).format('YYYY-MM-DD')
      this.updateDates()
    },
    endDate (val) {
      this.startDate = moment(val).day(1).format('YYYY-MM-DD')
      this.endDate = moment(val).day(5).format('YYYY-MM-DD')
      // this.updateDates()
    }
  },
  computed: mapGetters(['displayCategories']),
  methods: {
    categorySafeName (catName) {
      return catName.toLowerCase().replace(' ', '_')
    },
    updateDates () {
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
    },
    ...mapActions(['getAllCategories', 'getAllUsers', 'getAllTasks', 'getAllClients', 'getAllNotes', 'getTasksBetweenDates'])
  },
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
        .stopListening('.NoteAdded')
        .stopListening('.TaskAdded')
        .listen('.TaskCompleted', data => {
          const message = `A task you are the account manager for (${getUser(data.task.user_id).name} - ${data.task.description}) has been completed.`
          toastr.success(message, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', { body: message })
            setTimeout(n.close.bind(n), 5000)
          }
        })
        .listen('.TaskIncomplete', data => {
          const message = `A task you are the account manager for (${getUser(data.task.user_id).name} - ${data.task.description}) has been marked incomplete.`
          toastr.warning(message, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', { body: message })
            setTimeout(n.close.bind(n), 5000)
          }
        })
        .listen('.NoteAdded', data => {
          const message = `A new note was added to your task '${getTask(data.note.entry_id).description}'`
          toastr.info(message, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', { body: message })
            setTimeout(n.close.bind(n), 5000)
          }
        })
        .listen('.TaskAdded', data => {
          const message = `A new task was added (${data.task.description})<br>
            Starting ${moment(data.task.start_date).format('YYYY-MM-DD HH:mm')}
          `
          toastr.info(message, 'Notice')
          if (this.$store.getters.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', { body: message.replace('<br>', '\n') })
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
