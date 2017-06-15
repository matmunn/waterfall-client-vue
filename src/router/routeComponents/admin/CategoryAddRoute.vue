<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <CategoryForm :editing='false' />
      </div>
    </div>
  </div>
</template>

<script>
  import CategoryForm from '@/components/CategoryForm'

  export default {
    name: 'CategoryAddRoute',
    components: {
      CategoryForm
    }
  }
</script>
