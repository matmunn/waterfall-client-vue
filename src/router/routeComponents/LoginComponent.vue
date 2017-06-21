<template>
<div class="login-component">
  <div class="design-background">
    <!-- <img class="logo" src="/static/img/logo.svg"> -->
    <div class="logo" v-html='logoSvg'></div>
  </div>
  <div class="grey-background">

  </div>
  <div class="login-container flex-center">
    <p class="is-primary is-bold title is-4 has-text-centered">
      Login
    </p>
    <form @submit.prevent="submitLogin">
      <div class="field">
        <label for="email" class="label">Email Address</label>
        <p class="control">
          <input type="email" id="email" class="input" v-model='email' required>
        </p>
      </div>
      <div class="field">
        <label for="password" class="label">Password</label>
        <p class="control">
          <input type="password" class="input" id="password" v-model='password' required>
        </p>
      </div>
      <button type="submit" class="button is-primary is-pulled-right" :class="{ 'is-loading': loading }">
        Log In
      </button>
      <!-- <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader> -->
    </form>
  </div>
</div>
</template>

<style scoped lang="scss">
@import "brand";

.design-background {
  height: 40%;
  background-color: $brand-blue;
  background-image: url('/static/img/login-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}
.grey-background {
  height: 60%;
  background-color: $general-grey;
}
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // min-height: 100%;
}
.login-component {
  height: 100%;
}
.login-container {
  margin: 0 auto;
  width: 500px;
  position: absolute;
  top: 35%;
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
import { CLEAR_NEXT_ROUTE } from '@/store/mutations'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import { swal } from 'Helpers'
import auth from 'Auth'
import logo from '../../../static/img/logo.svg'

export default {
  name: 'LoginComponent',
  components: {
    ClipLoader
  },
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      logoSvg: logo
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
          'text': 'An error occurred while logging in. Please try again.',
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
