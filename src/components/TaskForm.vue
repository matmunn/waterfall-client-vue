<template>
<form @submit.prevent="saveTask" @keydown.enter.prevent=''>
  <div class="field">
    <label class="label" for="user">Job is for</label>
    <select id="user" class="input" v-model="user" required>
      <option disabled value="">Choose a user</option>
      <option v-for="user in users" :value="user.id">{{ user.name }}</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="client">Project</label>
    <v-select label='name' :value.sync='client' :options='clients' :on-change='changeVal'></v-select>
  </div>
  <div class="field">
    <label class="label" for="description">Task Description</label>
    <input id='description' type="text" v-model="description" class="input" required>
  </div>
  <div class="field">
    <div class="field col-md-6">
      <label class="label" for="dateRange">Task Timings</label>
      <DateRangePicker :id='`dateRange`' v-model='timings' :startTime='this.timings.start' :endTime='this.timings.end'></DateRangePicker>
    </div>
  </div>
  <div class="field">
    <p class="control">
      <label class="checkbox">
        <input type="checkbox" v-model='absence'>
        &nbsp;Task is an absence?
      </label>
    </p>
  </div>
  <div class="field" v-if='editing'>
    <p class="control">
      <label class="checkbox">
        <input type="checkbox" v-model='completed'>
        &nbsp;Task is completed?
      </label>
    </p>
  </div>
  <div class="field">
    <p class="control">
      <label class="checkbox">
        <input type="checkbox" v-model='recurring'>
        &nbsp;Task is recurring?
      </label>
    </p>
  </div>
  <div v-if='recurring'>
    <div class="field">
      <label class="label">Task recurs every:</label>
      <div class="row">
        <div class="col-md-6">
          <input v-model='recurrencePeriod' type="number" class="input col-md-6" min="1" max="50">
        </div>
        <div class="col-md-6">
          <select v-model='recurrenceType' class="input">
            <option value='Days'>Days</option>
            <option value='Weeks'>Weeks</option>
            <option value='Months'>Months</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="field">
    <button type="submit" class="button is-primary is-pulled-right" :class="{ 'is-loading': loading }">
      Save Task
    </button>
  </div>
</form>
</template>

<style lang="scss">
.v-select .dropdown-toggle {
  @extend .input !optional;
  border-radius: 0;
}
</style>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader'
import moment from 'moment'
import vSelect from 'vue-select'
import DateRangePicker from '@/components/DateRangePicker'
import { mapActions, mapGetters } from 'vuex'
import Auth from 'Auth'
import helpers from 'Helpers'

export default {
  name: 'TaskForm',
  props: ['task', 'editing'],
  components: {
    ClipLoader,
    DateRangePicker,
    vSelect
  },
  methods: {
    saveTask () {
      this.loading = true

      const taskData = {
        user: this.user,
        client: this.client ? this.client.id : null,
        description: this.description,
        startTime: this.timings.start,
        endTime: this.timings.end,
        completed: this.completed,
        recurring: this.recurring,
        recurrencePeriod: this.recurrencePeriod,
        recurrenceType: this.recurrenceType,
        absence: this.absence
      }

      let action = this.addTask
      if (this.editing) {
        taskData.id = this.editingTask.id
        action = this.editTask
      }

      return action(taskData).then(response => {
        this.loading = false

        this.$router.push('/admin/tasks')
      }, err => {
        this.loading = false
        if (err === 'time-error') {
          helpers.toastr.error(`The end time must be after the start time`, 'Error')
        } else {
          helpers.toastr.error(`An error occurred while processing your request`, 'Error')
        }
      })
    },
    changeVal (value) {
      this.client = value
    },
    ...mapActions(['getAllUsers', 'getAllClients', 'getAllTasks', 'addTask', 'editTask'])
  },
  data () {
    const curTime = moment().minute(0)
    const time0900 = moment().hour(9).minute(0)
    const startTime = curTime < time0900 ? time0900 : curTime

    return {
      editingTask: helpers.getTask(this.task),
      user: Auth.getUser().id,
      client: null,
      description: '',
      completed: false,
      recurring: false,
      recurrencePeriod: 0,
      recurrenceType: 'Weeks',
      loading: false,
      absence: false,
      timings: {
        start: startTime.format('YYYY-MM-DD HH:mm'),
        end: startTime.clone().add(2, 'hours').format('YYYY-MM-DD HH:mm')
      }
    }
  },
  computed: mapGetters(['users', 'clients']),
  created () {
    this.getAllClients()
    this.getAllUsers()
    this.getAllTasks()

    if (this.editing) {
      this.user = this.editingTask.user_id
      this.client = helpers.getClient(this.editingTask.client_id)
      this.description = this.editingTask.description
      this.timings = {
        start: moment(this.editingTask.start_date).format('YYYY-MM-DD HH:mm'),
        end: moment(this.editingTask.end_date).format('YYYY-MM-DD HH:mm')
      }
      this.completed = this.editingTask.completed
      this.recurring = this.editingTask.is_recurring
      this.recurrencePeriod = this.editingTask.recurrence_period
      this.recurrenceType = this.editingTask.recurrence_type
      this.absence = this.editingTask.is_absence
    }
  }
}
</script>
