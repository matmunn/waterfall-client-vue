<template>
  <div>
    You are now logged out
  </div>
</template>

<script>
  import Auth from 'Auth'
  export default {
    name: 'LogoutComponent',
    created () {
      Auth.logout().then(() => {
        this.$router.push('/')
      })
    }
  }
</script>
