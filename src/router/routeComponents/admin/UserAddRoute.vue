<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <UserForm :editing='false' />
      </div>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'

export default {
  name: 'UserAddRoute',
  components: {
    UserForm
  }
}
</script>
