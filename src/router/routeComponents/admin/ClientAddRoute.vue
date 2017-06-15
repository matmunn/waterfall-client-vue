<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <ClientForm :editing='false'></ClientForm>
      </div>
    </div>
  </div>
</template>

<script>
  import ClientForm from '@/components/ClientForm'

  export default {
    name: 'ClientAddRoute',
    components: {
      ClientForm
    }
  }
</script>
