<template>
<form @submit.prevent="saveClient">
  <div class="field">
    <label class="label" for="name">Client Name</label>
    <input id="name" type="text" v-model="clientName" class="input" required>
  </div>
  <div class="field">
    <label class="label" for="account_manager">Account Manager</label>
    <select id="account_manager" v-model="clientAccountManager" class="select" required>
      <option disabled value="">Choose an account manager</option>
      <option v-for="u in users" :value="u.id">{{ u.name }}</option>
    </select>
  </div>
  <div class="field">
    <button type="submit" class="button is-primary is-pulled-right" :class="{ 'is-loading': loading }">
      Save Client
    </button>
  </div>
</form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import helpers from 'Helpers'

export default {
  name: 'ClientForm',
  props: ['client', 'editing'],
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
