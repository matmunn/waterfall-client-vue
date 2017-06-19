<template>
<tr>
  <td>
    {{ this.category.description }}
  </td>
  <td>
    {{ this.category.hex_color }}
  </td>
  <td>
    <div class="sample" :style="fillSample"></div>
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
td {
  padding: 10px;
  position: relative;
}
.sample {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<script>
import helpers from 'Helpers'
import { mapActions } from 'vuex'

export default {
  name: 'AdminCategory',
  props: ['category'],
  computed: {
    fillSample () {
      return `background-color: #${this.category.hex_color}`
    },
    deleteLink () {
      return `/admin/categories/${this.category.id}/delete`
    },
    editLink () {
      return `/admin/categories/${this.category.id}/edit`
    }
  },
  methods: {
    confirmDelete () {
      return helpers.swal({
        title: 'Delete Category',
        html: `Are you sure you want to <strong>permanently delete this category, its users and its tasks</strong>?`,
        type: 'error',
        showCancelButton: true
      }).then(() => {
        this.deleteCategory(this.category.id)
      }, helpers.swal.noop)
    },
    ...mapActions(['deleteCategory'])
  }
}
</script>
