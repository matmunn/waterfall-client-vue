<template>
<form @submit.prevent="saveTask">
  <div class="form-group">
    <label for="user">Job is for</label>
    <select id="user" class="form-control" v-model="user" required>
      <option disabled value="">Choose a user</option>
      <option v-for="u in users" :value="u.id">{{ u.name }}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="client">Project</label>
    <v-select label='name' :value.sync='client' :options='clients' :on-change='changeVal'></v-select>
  </div>
  <div class="form-group">
    <label for="description">Task Description</label>
    <input id='description' type="text" v-model="description" class="form-control" required>
  </div>
  <div class="row">
    <div class="form-group col-md-6">
      <label for="dateRange">Task Timings</label>
      <DateRangePicker :id='`dateRange`' v-model='timings' :startTime='this.timings.start' :endTime='this.timings.end'></DateRangePicker>
    </div>
  </div>
  <div class="row">
    <div class="form-group col-md-6">
      <label>
        <input type="checkbox" v-model='absence'>
        &nbsp;Task is an absence?
      </label>
    </div>
    <div class="form-group col-md-6" v-if='editing'>
      <label>
        <input type="checkbox" v-model='completed'>
        &nbsp;Task Completed?
      </label>
    </div>
  </div>
  <div class="form-group">
    <label>
      <input type="checkbox" v-model='recurring'>
      &nbsp;Task is recurring?
    </label>
  </div>
  <div v-if='recurring'>
    <div class="form-group">
      <label>Task recurs every:</label>
      <div class="row">
        <div class="col-md-6">
          <input v-model='recurrencePeriod' type="number" class="form-control col-md-6" min="1" max="50">
        </div>
        <div class="col-md-6">
          <select v-model='recurrenceType' class="form-control">
            <option value='Days'>Days</option>
            <option value='Weeks'>Weeks</option>
            <option value='Months'>Months</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="form-group">
    <input v-if='!loading' type="submit" value="Save Task" class="btn btn-large btn-success">
    <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
  </div>
</form>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader'
import moment from 'moment'
import vSelect from 'vue-select'
import DateRangePicker from '@/components/DateRangePicker'
import { mapActions, mapGetters } from 'vuex'
import Auth from 'Auth'
import { toastr, getClient, getTask } from 'Helpers'

export default {
  name: 'TaskForm',
  props: ['task', 'editing'],
  components: {
    ClipLoader,
    DateRangePicker,
    vSelect
  },
  methods: Object.assign({},
    mapActions(['getAllUsers', 'getAllClients', 'getAllTasks']),
    {
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

        let action = 'addTask'
        if (this.editing) {
          taskData.id = this.editingTask.id
          action = 'editTask'
        }

        this.$store.dispatch(action, taskData).then(response => {
          this.loading = false
          if (response === true) {
            this.$router.push('/admin/tasks')
          }
        }, err => {
          this.loading = false
          if (err === 'time-error') {
            toastr.error(`The end time must be after the start time`, 'Error')
          } else {
            toastr.error(`An error occurred while processing your request`, 'Error')
          }
        })
      },
      changeVal (value) {
        this.client = value
      }
    }
  ),
  data () {
    const curTime = moment().minute(0)
    const time0900 = moment().hour(9).minute(0)
    const startTime = curTime < time0900 ? time0900 : curTime

    return {
      editingTask: getTask(this.task),
      user: Auth.getUser().id,
      client: null,
      description: '',
      completed: false,
      recurring: false,
      recurrencePeriod: 0,
      recurrenceType: 'Weeks',
      loading: false,
      timings: {
        start: startTime.format('YYYY-MM-DD HH:mm'),
        end: startTime.clone().add(2, 'hours').format('YYYY-MM-DD HH:mm')
      },
      absence: false
    }
  },
  computed: mapGetters(['users', 'clients']),
  created () {
    this.getAllClients()
    this.getAllUsers()
    this.getAllTasks()

    if (this.editing) {
      this.user = this.editingTask.user_id
      this.client = getClient(this.editingTask.client_id)
      this.description = this.editingTask.description
      this.timings = {
        start: moment(this.editingTask.start_date).format(),
        end: moment(this.editingTask.end_date).format()
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
