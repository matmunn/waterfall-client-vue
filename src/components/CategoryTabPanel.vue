<template>
<div>
  <div v-if="users.length">
    <b-tabs v-model='activeTab' :animated='false'>
      <b-tab-item v-for='user in users' :key='user.id' :label='user.name'>
        <!-- <CategoryTabPanel :key='category.id' :category='category' :id='categorySafeName(category.description)'></CategoryTabPanel> -->
        <!-- <UserTabPanel :key="user.id" :user="user" :id="'user' + user.id" :background="category.hex_color"></UserTabPanel> -->
        <UserTaskTable :key="user.id" :user="user" :tasks='userTasks(user.id, startDate, endDate)' :background="category.hex_color"></UserTaskTable>
      </b-tab-item>
    </b-tabs>
  </div>
  <div class="no-tasks" v-else>
    <h3>
      This category doesn't have any users.
    </h3>
  </div>
</div>
</template>

<style scoped lang="scss">
.no-tasks {
  h3 {
    text-align: center;
  }
}
</style>

<script>
import moment from 'moment'
import Auth from 'Auth'
import UserTabPanel from './UserTabPanel'
import UserTaskTable from './UserTaskTable'
import { mapGetters } from 'vuex'

export default {
  name: 'CategoryTabPanel',
  props: ['category'],
  components: {
    UserTabPanel,
    UserTaskTable
  },
  data () {
    return {
      activeTab: 0,
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD')
    }
  },
  computed: {
    users () {
      return this.categoryUsers(this.category.id)
    },
    isActiveUserCategory () {
      if (Auth.isLoggedIn()) {
        if (Auth.getUser().category_id === this.category.id) {
          return 'active'
        }
      }
      return ''
    },
    ...mapGetters(['categoryUsers', 'userTasks'])
  }
  // methods: {
  //   isActiveUser (userId) {
  //     if (Auth.isLoggedIn()) {
  //       if (Auth.getUser().id === userId) {
  //         return 'active'
  //       }
  //     }
  //     return ''
  //   }
  // }
}
</script>
