<template>
<form @submit.prevent="saveClient">
  <div class="form-group">
    <label for="name">Client Name</label>
    <input id="name" type="text" v-model="clientName" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="account_manager">Account Manager</label>
    <select id="account_manager" v-model="clientAccountManager" class="form-control" required>
      <option disabled value="">Choose an account manager</option>
      <option v-for="u in users" :value="u.id">{{ u.name }}</option>
    </select>
  </div>
  <div class="form-group">
    <input v-if='!loading' type="submit" value="Save Client" class="btn btn-large btn-success">
    <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
  </div>
</form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import helpers from 'Helpers'

export default {
  name: 'ClientForm',
  props: ['client', 'editing'],
  components: {
    ClipLoader
  },
  methods: {
    saveClient () {
      this.loading = true

      const clientData = {
        name: this.clientName,
        accountManager: this.clientAccountManager
      }

      let action = this.addClient
      if (this.editing) {
        clientData.id = this.editingClient.id
        action = this.editClient
      }

      return action(clientData).then(() => {
        this.loading = false

        this.$router.push('/admin/clients')
      }, () => {
        this.loading = false

        helpers.toastr.error(`An error occurred while processing your request`, 'Error')
      })
    },
    ...mapActions(['getAllUsers', 'addClient', 'editClient'])
  },
  data () {
    return {
      editingClient: helpers.getClient(this.client),
      clientName: '',
      clientAccountManager: '',
      loading: false
    }
  },
  computed: mapGetters(['users']),
  created () {
    this.getAllUsers()

    if (this.editing) {
      this.clientName = this.editingClient.name
      this.clientAccountManager = this.editingClient.account_manager_id
    }
  }
}
</script>
