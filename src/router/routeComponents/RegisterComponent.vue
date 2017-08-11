<template>
<div class="login-component">
  <div class="design-background brand-header">
    <div class="logo" v-html='logoSvg'></div>
  </div>
  <div class="grey-background">

  </div>
  <div class="login-container flex-center">
    <p class="is-primary has-bold-text title is-4 has-text-centered">
      Register
    </p>
    <form @submit.prevent="submitLogin">
      <div class="field">
        <label for="name" class="label">Name</label>
        <p class="control">
          <input type="text" id="name" class="input" :class='{ "is-danger": this.errors.name }' v-model='name' required>
        </p>
        <p class="help is-danger" v-if='this.errors.name'>{{ this.errors.name }}</p>
      </div>
      <div class="field">
        <label for="email" class="label">Email Address</label>
        <p class="control">
          <input type="email" id="email" class="input" :class='{ "is-danger": this.errors.email }' v-model='email' required>
        </p>
        <p class="help is-danger" v-if='this.errors.email'>{{ this.errors.email }}</p>
      </div>
      <div class="field">
        <label for="password" class="label">Password</label>
        <p class="control">
          <input type="password" class="input" :class='{ "is-danger": this.errors.password }' id="password" v-model='password' required>
        </p>
        <p class="help is-danger" v-if='this.errors.password'>{{ this.errors.password }}</p>
      </div>
      <button type="submit" class="button is-primary is-pulled-right" :class="{ 'is-loading': loading }">
        Sign Up
      </button>
    </form>
    <br>
    <p class="has-text-centered">
      <router-link to="/login">Already have an account? Login.</router-link>
    </p>
  </div>
</div>
</template>

<style scoped lang="scss">
@import "src/assets/styles/brand";

.design-background {
  height: 23%;
  background-color: $brand-color-primary;
  // background-image: linear-gradient(75deg, rgba(121,164,252, 0.4) 0%, rgba(30,87,153, 0.4) 38%, rgba(30,87,153, 0.4) 68%, rgba(41,137,216, 0.4) 100%), url('/static/img/login-background.svg');
}
.grey-background {
  height: 77%;
  background-color: $general-grey;
}
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-component {
  height: 100%;
}
.login-container {
  margin: 0 auto;
  width: 500px;
  position: absolute;
  top: 18%;
  min-height: 400px;
  left: calc(50% - 250px);
  background-color: #FFFFFF;
  padding: 40px;
}
.logo {
  width: 450px;
  margin: 0 auto 2em;
  position: relative;
  top: calc(50% - 57px);
}

@media (max-height: 700px) {
  .design-background {
    height: 50%;
  }
  .grey-background {
    height: 50%;
  }
  .logo {
    top: 30px;
  }
  .login-container {
    top: 117px;
    min-height: inherit;
    height: 300px;
  }
}
</style>

<script>
import { mapActions } from 'vuex'
import { CLEAR_NEXT_ROUTE } from '@/store/mutations'
import { swal } from 'Helpers'
import auth from 'Auth'
import { forEach } from 'lodash'
import logo from '../../../static/img/logo.svg'

export default {
  name: 'RegisterComponent',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      loading: false,
      logoSvg: logo,
      errors: {}
    }
  },
  methods: {
    submitLogin () {
      this.loading = true
      this.errors = {}
      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      return this.attemptRegister(data).then(() => {
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
            'title': 'Registration Failed',
            'text': 'Your registration failed. Are you sure your email address and password are correct?',
            'type': 'error'
          })
          this.password = ''
        }
      }, err => {
        this.loading = false

        if (err.response.status === 422) {
          let validationErrors = err.response.data
          forEach(validationErrors, (value, key) => {
            validationErrors[key] = value.join('<br />')
          })
          this.errors = validationErrors
        } else {
          swal({
            'title': 'Registration Failed',
            'text': 'An unkown error occurred while registering your account. Please try again.',
            'type': 'error'
          })
        }
        this.password = ''
      })
    },
    ...mapActions(['attemptRegister'])
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
