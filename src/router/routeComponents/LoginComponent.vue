<template>
  <div class="columns">
    <div class="column is-4 is-offset-4 flex-center">
      <img class="logo" src="/static/img/logo.svg">
      <form @submit.prevent="submitLogin">
      <b-field label="Email Address">
          <b-input v-model='email'></b-input>
      </b-field>
      <b-field label="Password">
          <b-input type="password" v-model='password'></b-input>
      </b-field>
        <button v-if='!loading' type="submit" class="button is-success is-block">
          Log In
        </button>
        <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
  }
  .logo {
    width: 50%;
    margin: 0 auto 2em;
  }
</style>

<script>
  import { CLEAR_NEXT_ROUTE } from '@/store/mutations'
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import swal from 'sweetalert2'
  import auth from 'Auth'

  export default {
    name: 'LoginComponent',
    components: {
      ClipLoader
    },
    data () {
      return {
        email: '',
        password: '',
        loading: false
      }
    },
    methods: {
      submitLogin () {
        this.loading = true
        const authResponse = auth.attemptLogin(this.email, this.password)
        authResponse.then(() => {
          this.loading = false
          if (auth.isLoggedIn()) {
            if (this.$store.getters.nextRoute !== null) {
              const nextRoute = this.$store.getters.nextRoute
              this.$store.commit(CLEAR_NEXT_ROUTE)
              this.$router.push(nextRoute)
            } else {
              this.$router.push('/')
            }
          } else {
            swal({
              'title': 'Login Failed',
              'text': 'Your login failed. Are you sure your email address and password are correct?',
              'type': 'error'
            })
            this.password = ''
          }
        }, () => {
          this.loading = false
          swal({
            'title': 'Login Failed',
            'text': 'Your login failed. Are you sure your email address and password are correct?',
            'type': 'error'
          })
          this.password = ''
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      if (auth.isLoggedIn()) {
        next('/')
      } else {
        next()
      }
    }
  }
</script>
