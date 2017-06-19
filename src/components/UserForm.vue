<template>
<form @submit.prevent='saveUser'>
  <div class="form-group">
    <label for="name">Name</label>
    <input id="name" type="text" v-model='name' class="form-control" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" type="email" v-model='email' class="form-control" required>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input id="password" type="password" v-model='password' class="form-control">
  </div>
  <div class="form-group">
    <label for="category">Category</label>
    <select v-model='category' class="form-control" required>
      <option disabled value="">Choose a category</option>
      <option v-for='category in categories' :value='category.id'>{{ category.description }}</option>
    </select>
  </div>
  <div class="form-group">
    <input v-if='!loading' type="submit" value="Save User" class="btn btn-large btn-success">
    <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
  </div>
</form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import helpers from 'Helpers'

export default {
  name: 'UserForm',
  props: ['user', 'editing'],
  components: {
    ClipLoader
  },
  data () {
    return {
      editingUser: helpers.getUser(this.user),
      name: '',
      email: '',
      password: '',
      category: '',
      loading: false
    }
  },
  methods: {
    saveUser () {
      this.loading = true

      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        category: this.category
      }

      let action = this.addUser
      if (this.editing) {
        action = this.editUser
        userData.id = this.editingUser.id
      }

      return action(userData).then(() => {
        this.loading = false

        this.$router.push('/admin/users')
      }, () => {
        this.loading = false
        helpers.toastr.error(`An error occurred while processing your request`, `Error`)
      })
    },
    ...mapActions(['getAllCategories', 'addUser', 'editUser'])
  },
  computed: mapGetters(['categories']),
  created () {
    this.getAllCategories()

    if (this.editing) {
      this.name = this.editingUser.name
      this.email = this.editingUser.email
      this.category = this.editingUser.category_id
    }
  },
  mounted () {
    if (!this.editing) {
      document.getElementById('password').setAttribute('required', true)
    }
  }
}
</script>
