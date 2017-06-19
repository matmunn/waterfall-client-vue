<template>
  <div>
    <table>
      <tr>
        <th>
          Category Description
        </th>
        <th colspan="2">
          Hex Color
        </th>
        <th></th>
      </tr>
      <AdminCategory v-for="category in categories" :category="category" :key="category.id" />
    </table>
  </div>
</template>

<style scoped>
  table {
    margin: 0 auto;
  }
</style>

<script>
  import AdminCategory from '@/components/AdminCategory'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'CategoryListRoute',
    components: {
      AdminCategory
    },
    computed: mapGetters(['categories']),
    methods: mapActions(['getAllCategories']),
    created () {
      this.getAllCategories()
    }
  }
</script>
