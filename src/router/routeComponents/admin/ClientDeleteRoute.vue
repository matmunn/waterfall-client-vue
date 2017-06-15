<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <p>
          Are you sure you want to delete this client?
        </p>
        <p>
          <strong>
            All tasks for this client will be permanently lost.
          </strong>
        </p>
        <p class='text-center'>
          <button class="btn btn-danger" @click.prevent='deleteClient'>
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
    name: 'ClientDeleteRoute',
    methods: {
      cancel () {
        this.$router.push('/admin/clients')
      },
      deleteClient () {
        this.$store.dispatch('deleteClient', this.$route.params.id).then(() => {
          this.$router.push('/admin/clients')
        })
      }
    }
  }
</script>
