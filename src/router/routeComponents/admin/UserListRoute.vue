<template>
<div>
  <table>
    <tr>
      <th>
        Name
      </th>
      <th>
        Email Address
      </th>
      <th>
        Category
      </th>
      <th></th>
    </tr>
    <AdminUser v-for="user in users" :user="user" :key="user.id" />
  </table>
</div>
</template>

<style scoped>
table {
  margin: 0 auto;
}
</style>

<script>
import AdminUser from '@/components/AdminUser'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserListRoute',
  components: {
    AdminUser
  },
  computed: mapGetters(['users']),
  methods: mapActions(['getAllUsers', 'getAllCategories']),
  created () {
    this.getAllCategories()
    this.getAllUsers()
  }
}
</script>
