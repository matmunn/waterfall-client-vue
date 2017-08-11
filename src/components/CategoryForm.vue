<template>
<form @submit.prevent="saveCategory">
  <div class="field">
    <label class="label" for="name">Category Name</label>
    <input id="name" type="text" v-model="description" class="input" required>
  </div>
  <div class="field">
    <label class="label" for="color">Hex Color</label>
    <input id="color" type="text" v-model="color" class="input" required>
  </div>
  <div class="field">
    <p class="control">
      <label class="checkbox">
        <input type="checkbox" v-model='visible'>
        &nbsp;Display in category list?
      </label>
    </p>
  </div>
  <div class="field">
    <button type="submit" class="button is-primary is-pulled-right" :class="{ 'is-loading': loading }">
      Save Category
    </button>
  </div>
</form>
</template>

<script>
import helpers from 'Helpers'
import { mapActions } from 'vuex'

export default {
  name: 'CategoryForm',
  props: ['category', 'editing'],
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
