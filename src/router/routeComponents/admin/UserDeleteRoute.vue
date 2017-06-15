<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <p>
          Are you sure you want to delete this user?
        </p>
        <p>
          <strong>
            All tasks for this user will be permanently lost.
          </strong>
        </p>
        <p class='text-center'>
          <button class="btn btn-danger" @click.prevent='deleteUser'>
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
    name: 'UserDeleteRoute',
    methods: {
      cancel () {
        this.$router.push('/admin/users')
      },
      deleteUser () {
        this.$store.dispatch('deleteUser', this.$route.params.id).then(() => {
          this.$router.push('/admin/users')
        })
      }
    }
  }
</script>
