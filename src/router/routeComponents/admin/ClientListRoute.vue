<template>
<div>
  <table>
    <tr>
      <th>
        Client Name
      </th>
      <th>
        Account Manager
      </th>
      <th></th>
    </tr>
    <AdminClient v-for="client in clients" :client="client" :key="client.id" />
  </table>
</div>
</template>

<style scoped>
table {
  margin: 0 auto;
}
th {
  padding: 5px 10px;
}
</style>

<script>
import AdminClient from '@/components/AdminClient'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClientListRoute',
  components: { AdminClient },
  computed: mapGetters(['clients']),
  methods: mapActions(['getAllClients', 'getAllUsers']),
  created () {
    this.getAllClients()
    this.getAllUsers()
  }
}
</script>
