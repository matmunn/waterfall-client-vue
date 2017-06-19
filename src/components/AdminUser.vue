<template>
<tr>
  <td>
    {{ this.user.name }}
  </td>
  <td>
    {{ this.user.email }}
  </td>
  <td>
    {{ getCategory(this.user.category_id).description }}
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
import helpers from 'Helpers'
const { getCategory } = helpers
import { mapActions } from 'vuex'

export default {
  name: 'AdminUser',
  props: ['user'],
  computed: {
    editLink () {
      return `/admin/users/${this.user.id}/edit`
    },
    deleteLink () {
      return `/admin/users/${this.user.id}/delete`
    }
  },
  methods: {
    getCategory,
    confirmDelete () {
      return helpers.swal({
        title: 'Delete User',
        html: 'Are you sure you want to <strong>permanently delete this user and all its tasks</strong>?',
        type: 'error',
        showCancelButton: true
      }).then(() => {
        this.deleteUser(this.user.id)
      }, helpers.swal.noop)
    },
    ...mapActions(['deleteUser'])
  }
}
</script>
