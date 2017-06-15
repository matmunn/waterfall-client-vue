<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <ClientForm :client='parseInt(this.$route.params.id)' :editing='true' />
      </div>
    </div>
  </div>
</template>

<script>
  import ClientForm from '@/components/ClientForm'

  export default {
    name: 'ClientEditRoute',
    components: {
      ClientForm
    }
  }
</script>
