<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <UserForm :user='parseInt(this.$route.params.id)' :editing='true' />
      </div>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'

export default {
  name: 'UserEditRoute',
  components: {
    UserForm
  }
}
</script>
