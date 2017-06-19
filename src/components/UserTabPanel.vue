<!-- <template>
  <div>
    <UserTaskTable :tasks='tasks' :background='background'></UserTaskTable>
  </div>
</template>

<script>
import moment from 'moment'
import Auth from 'Auth'
import UserTaskTable from './UserTaskTable'
import { mapGetters } from 'vuex'

export default {
  name: 'UserTabPanel',
  props: ['user', 'background'],
  components: {
    UserTaskTable
  },
  data () {
    return {
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD')
    }
  },
  computed: {
    tasks () {
      return this.userTasks(this.user.id, this.startDate, this.endDate)
    },
    isActiveUser () {
      if (Auth.isLoggedIn) {
        if (this.user.id === Auth.getUser().id) {
          return 'active'
        }
      }
      return ''
    },
    ...mapGetters(['userTasks'])
  },
  methods: {
    updateDates (newDates) {
      this.startDate = moment(newDates.start).day(1).format('YYYY-MM-DD')
      this.endDate = moment(newDates.end).day(5).format('YYYY-MM-DD')
    }
  },
  created () {
    this.$bus.$on('date-changed-event', this.updateDates)
  }
}
</script>
 -->
