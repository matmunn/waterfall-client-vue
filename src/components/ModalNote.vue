<template>
<div>
  <div>
    <div class="col-md-10">
      <p>
        <strong>{{ newestDate }} by {{ getUserName() }}</strong><br />
        <div v-if='!editing'>
          {{ noteMessage }}
        </div>
        <div v-if='editing'>
          <form @submit.prevent='saveNote'>
            <div class="form-group">
              <textarea v-model='noteMessage' class='form-control'></textarea>
            </div>
            <input v-if='!editLoading' type='submit' value='Save' class='btn btn-primary col-md-6'>
            <button v-if='!editLoading' class='btn btn-default col-md-6' @click='cancelEdit'>Cancel</button>
            <ClipLoader v-if='editLoading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
          </form>
        </div>
        <div v-if='pendingDelete'>
          <div class="row">
            <strong>Are you sure you want to delete this note?</strong>
          </div>
          <div class="row">
            <ClipLoader v-if='deleteLoading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
            <button v-if='!deleteLoading' class='btn btn-danger col-md-6 col-md-offset-3' @click='confirmDeleteNote'>Delete</button>
          </div>
        </div>
      </p>
    </div>
    <div class="col-md-2 text-right">
      <i class="fa fa-lg fa-edit" @click='enableEdit'></i>
      <i class="fa fa-lg fa-trash-o" @click='toggleDeleteMode'></i>
    </div>
    <div class="clearfix"></div>
  </div>
  <hr>
</div>
</template>

<style scoped>
.fa {
  cursor: pointer;
}
</style>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader'
import moment from 'moment'
import helpers from 'Helpers'
import { mapActions } from 'vuex'

const { getUser } = helpers

export default {
  name: 'ModalNote',
  props: ['note'],
  components: {
    ClipLoader
  },
  data () {
    return {
      editing: false,
      pendingDelete: false,
      noteMessage: this.note.message,
      deleteLoading: false,
      editLoading: false
    }
  },
  computed: {
    newestDate () {
      const createdAt = moment(this.note.created_at)
      const updatedAt = moment(this.note.updated_at)
      return createdAt > updatedAt ? createdAt.format('YYYY-MM-DD HH:mm:ss') : updatedAt.format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getUserName () {
      return getUser(this.note.created_by).name || 'Unknown'
    },
    enableEdit () {
      this.editing = true
    },
    saveNote () {
      this.editLoading = true

      const noteData = {
        message: this.noteMessage,
        id: this.note.id
      }

      return this.editNote(noteData).then(() => {
        this.editing = false
        this.editLoading = false
      }, () => {
        this.cancelEdit()
        this.editLoading = false

        helpers.toastr.error(`There was an error updating the note.`, 'Error')
      })
    },
    toggleDeleteMode () {
      this.pendingDelete = !this.pendingDelete
    },
    confirmDeleteNote () {
      this.deleteLoading = true

      return this.deleteNote(this.note.id).then(() => {
        this.deleteLoading = false
      }, () => {
        this.deleteLoading = false
        helpers.toastr.error(`There was an error deleting the note.`, 'Error')
      })
    },
    cancelEdit () {
      this.noteMessage = this.note.message
      this.editing = false
    },
    ...mapActions(['editNote', 'deleteNote'])
  }
}
</script>
