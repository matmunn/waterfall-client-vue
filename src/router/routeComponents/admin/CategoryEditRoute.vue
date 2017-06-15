<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <CategoryForm :category='parseInt(this.$route.params.id)' :editing='true' />
      </div>
    </div>
  </div>
</template>

<script>
  import CategoryForm from '@/components/CategoryForm'

  export default {
    name: 'CategoryEditRoute',
    components: {
      CategoryForm
    }
  }
</script>
