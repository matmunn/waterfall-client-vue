<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <p>
          Are you sure you want to delete this category?
        </p>
        <p>
          <strong>
            All users and tasks in this category will be permanently lost.
          </strong>
        </p>
        <p class='text-center'>
          <button class="btn btn-danger" @click.prevent='deleteCategory'>
            Delete
          </button>
          <button class="btn btn-success" @click.prevent='cancel'>
            Cancel
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoryDeleteRoute',
    methods: {
      cancel () {
        this.$router.push('/admin/categories')
      },
      deleteCategory () {
        this.$store.dispatch('deleteCategory', this.$route.params.id).then(() => {
          this.$router.push('/admin/categories')
        })
      }
    }
  }
</script>
