<!-- <template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <p>
          Are you sure you want to delete this task?
        </p>
        <p class='text-center'>
          <button class="btn btn-danger" @click.prevent='deleteTask'>
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
    name: 'TaskDeleteRoute',
    methods: {
      cancel () {
        this.$router.push('/admin/tasks')
      },
      deleteTask () {
        this.$store.dispatch('deleteTask', this.$route.params.id).then(() => {
          this.$router.push('/admin/tasks')
        })
      }
    }
  }
</script>
 -->
