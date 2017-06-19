<template>
<div>
  <table v-if="tasks.length" align="center">
    <tr class="every-cell-br2px">
      <th rowspan="2" colspan="4">
        Job Title
      </th>
      <th colspan="7">
        Monday<br />
        {{ moment(startDate).format("DD/MM/YY") }}
      </th>
      <th colspan="7">
        Tuesday<br />
        {{ moment(startDate).add(1, 'day').format("DD/MM/YY") }}
      </th>
      <th colspan="7">
        Wednesday<br />
        {{ moment(startDate).add(2, 'days').format("DD/MM/YY") }}
      </th>
      <th colspan="7">
        Thursday<br />
        {{ moment(startDate).add(3, 'days').format("DD/MM/YY") }}
      </th>
      <th colspan="7">
        Friday<br />
        {{ moment(startDate).add(4, 'days').format("DD/MM/YY") }}
      </th>
    </tr>
    <tr class="rotated-text">
      <!-- Monday -->
      <th>0900</th>
      <th>1000</th>
      <th>1100</th>
      <th>1200</th>
      <th>1400</th>
      <th>1500</th>
      <th>1600</th>
      <!-- Tuesday -->
      <th>0900</th>
      <th>1000</th>
      <th>1100</th>
      <th>1200</th>
      <th>1400</th>
      <th>1500</th>
      <th>1600</th>
      <!-- Wednesday -->
      <th>0900</th>
      <th>1000</th>
      <th>1100</th>
      <th>1200</th>
      <th>1400</th>
      <th>1500</th>
      <th>1600</th>
      <!-- Thursday -->
      <th>0900</th>
      <th>1000</th>
      <th>1100</th>
      <th>1200</th>
      <th>1400</th>
      <th>1500</th>
      <th>1600</th>
      <!-- Friday -->
      <th>0900</th>
      <th>1000</th>
      <th>1100</th>
      <th>1200</th>
      <th>1400</th>
      <th>1500</th>
      <th>1600</th>
    </tr>
    <Task v-for="task in tasks" :key="task.id" :task="task" :background="background" />
    <tr>
      <td></td>
      <td colspan="42">
        {{ totalWeeklyHours }} scheduled hours for the week, {{ absenceHours }} hours of absences. {{ completedHours }} hours completed, {{ totalWeeklyHours - completedHours }} remaining.
      </td>
    </tr>
  </table>
  <div class="no-tasks" v-else>
    <h3 v-if='!loading && !tasks.length'>
      This user doesn't have any tasks for this week.
    </h3>
    <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`' class='cliploader'></ClipLoader>
  </div>
</div>
</template>

<style scoped lang="scss">
.cliploader {
  margin-top: 40px;
}
table {
  font-size: 0.8vw;
  margin-top: 2vh;
}
th {
  text-align: center;
  border-bottom-width: 2px;
}
.rotated-text {
  th {
    transform: rotate(-90deg);
    height: 3vw;
    font-weight: normal;
  }
}
tr:not(.rotated-text) th:first-of-type {
  padding: 0 20px;
}
tr:not(.every-cell-br2px) th:nth-of-type(7n), .every-cell-br2px th {
  border-right-width: 2px;
}
.no-tasks {
  h3 {
    text-align: center;
  }
}

@media (min-width: 2000px) {
  table {
    font-size: 17px;
  }
  .rotated-text th {
    height: 70px;
  }
}
tr:last-of-type {
  td {
    padding: 3px 10px;
  }
}
</style>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader'
import moment from 'moment'
import Task from './Task'
import { reduce } from 'lodash'

export default {
  name: 'UserTaskTable',
  props: ['tasks', 'background'],
  components: {
    Task,
    ClipLoader
  },
  data () {
    return {
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD'),
      loading: false
    }
  },
  methods: {
    moment,
    startedLoading () {
      this.loading = true
    },
    finishedLoading () {
      this.loading = false
    },
    updateDates (newDates) {
      this.startDate = moment(newDates.start).day(1).format('YYYY-MM-DD')
      this.endDate = moment(newDates.end).day(5).format('YYYY-MM-DD')
    }
  },
  computed: {
    totalWeeklyHours () {
      return reduce(this.tasks, (accumulator, item) => {
        return accumulator + item.blocks.length
      }, 0)
    },
    completedHours () {
      return reduce(this.tasks, (accumulator, item) => {
        return accumulator + (item.completed ? item.blocks.length : 0)
      }, 0)
    },
    absenceHours () {
      return reduce(this.tasks, (accumulator, item) => {
        return accumulator + (item.is_absence ? item.blocks.length : 0)
      }, 0)
    }
  },
  created () {
    this.$bus.$on('date-changed-event', this.updateDates)
    this.$bus.$on('started-loading-tasks', this.startedLoading)
    this.$bus.$on('finished-loading-tasks', this.finishedLoading)
  }
}
</script>
