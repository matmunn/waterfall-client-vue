<template>
<form @submit.prevent="saveCategory">
  <div class="form-group">
    <label for="name">Category Name</label>
    <input id="name" type="text" v-model="description" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="color">Hex Color</label>
    <input id="color" type="text" v-model="color" class="form-control" required>
  </div>
  <div class="form-group">
    <label>
      <input type="checkbox" v-model='visible'>
      &nbsp;Display in category list?
    </label>
  </div>
  <div class="form-group">
    <input v-if='!loading' type="submit" value="Save Category" class="btn btn-large btn-success">
    <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
  </div>
</form>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader'
import helpers from 'Helpers'
import { mapActions } from 'vuex'

export default {
  name: 'CategoryForm',
  props: ['category', 'editing'],
  components: {
    ClipLoader
  },
  data () {
    return {
      description: '',
      color: 'FF0000',
      visible: true,
      loading: false
    }
  },
  methods: {
    saveCategory () {
      this.loading = true

      const categoryData = {
        description: this.description,
        color: this.color,
        visible: this.visible
      }

      let action = this.addCategory
      if (this.editing) {
        categoryData.id = this.category
        action = this.editCategory
      }

      return action(categoryData).then(() => {
        this.loading = false

        this.$router.push('/admin/categories')
      }, () => {
        this.loading = false

        helpers.toastr.error(`An error occurred while processing your request`, 'Error')
      })
    },
    ...mapActions(['addCategory', 'editCategory'])
  },
  created () {
    if (this.editing) {
      const editingCategory = helpers.getCategory(this.category)
      this.description = editingCategory.description
      this.color = editingCategory.hex_color
      this.visible = editingCategory.display_in_list
    }
  }
}
</script>
