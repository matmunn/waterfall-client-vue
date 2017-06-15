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
      <a href="#" @click.prevent='deleteCategory'>
        <i class="fa fa-trash-o"></i>
      </a>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
  .centered {
    text-align: center;
  }
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
      deleteCategory () {
        return helpers.swal({
          title: 'Delete Category',
          html: `Are you sure you want to <strong>permanently delete this category, its users and its tasks</strong>?`,
          type: 'error',
          showCancelButton: true
        }).then(() => {
          this.dispatchDelete()
        }, helpers.swal.noop)
      },
      dispatchDelete () {
        this.$store.dispatch('deleteCategory', this.category.id)
      }
    }
  }
</script>
