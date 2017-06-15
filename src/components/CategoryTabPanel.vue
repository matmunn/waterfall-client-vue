<template>
  <div class="tab-pane" :class='isActiveUserCategory' role="tabpanel">
    <div v-if="users.length">
      <ul class="nav nav-tabs" role="tablist">
        <li v-for="user in users" :class='isActiveUser(user.id)' :key="user.id" role="presentation">
          <a :href="'#user' + user.id" role="tab" data-toggle="tab">{{ user.name }}</a>
        </li>
      </ul>
      <div class="tab-content">
        <UserTabPanel v-for="user in users" :key="user.id" :user="user" :id="'user' + user.id" :background="category.hex_color" />
      </div>
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
import Auth from 'Auth'
import UserTabPanel from './UserTabPanel'

export default {
  name: 'CategoryTabPanel',
  props: ['category'],
  components: {
    UserTabPanel
  },
  computed: {
    users () {
      return this.$store.getters.categoryUsers(this.category.id)
    },
    isActiveUserCategory () {
      if (Auth.isLoggedIn()) {
        if (Auth.getUser().category_id === this.category.id) {
          return 'active'
        }
      }
      return ''
    }
  },
  methods: {
    isActiveUser (userId) {
      if (Auth.isLoggedIn()) {
        if (Auth.getUser().id === userId) {
          return 'active'
        }
      }
      return ''
    }
  }
}
</script>
