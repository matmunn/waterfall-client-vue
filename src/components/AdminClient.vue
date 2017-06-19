<template>
<tr>
  <td>
    {{ this.client.name }}
  </td>
  <td>
    {{ getUser(this.client.account_manager_id).name }}
  </td>
  <td>
    <router-link :to='editLink'>
      <i class="fa fa-edit"></i>
    </router-link>
    <a href="#" @click.prevent='confirmDelete'>
      <i class="fa fa-trash-o"></i>
    </a>
  </td>
</tr>
</template>

<style lang="scss" scoped>
.fa-times {
  color: red;
}
.fa-check {
  color: yellowgreen;
}
.centered {
  text-align: center;
}
td {
  padding: 10px;
}
</style>

<script>
import { mapActions } from 'vuex'
import helpers from 'Helpers'
const { getUser } = helpers

export default {
  name: 'AdminClient',
  props: ['client'],
  computed: {
    editLink () {
      return `/admin/clients/${this.client.id}/edit`
    },
    deleteLink () {
      return `/admin/clients/${this.client.id}/delete`
    }
  },
  methods: {
    getUser,
    confirmDelete () {
      return helpers.swal({
        title: 'Delete Client',
        html: `Are you sure you want to <strong>permanently delete this client and all its tasks</strong>?`,
        type: 'error',
        showCancelButton: true
      }).then(() => {
        this.deleteClient(this.client.id)
      }, helpers.swal.noop)
    },
    ...mapActions(['deleteClient'])
  }
}
</script>
