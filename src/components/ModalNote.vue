<template>
<div>
  <div class="columns">
    <div class="column is-10">
      <p class="title is-5">
        <strong>{{ newestDate }} by {{ getUserName() }}</strong><br />
      </p>
    </div>
    <div class="column is-2 has-text-right">
      <i class="fa fa-lg fa-edit title is-5" @click='enableEdit'></i>
      <i class="fa fa-lg fa-trash-o title is-5" @click='toggleDeleteMode'></i>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <div v-if='!editing'>
        <p class="subtitle is-6">
          {{ noteMessage }}
        </p>
      </div>
      <div v-if='editing'>
        <form @submit.prevent='saveNote'>
          <div class="columns">
            <div class="column">
              <div class="field">
                <textarea v-model='noteMessage' class='textarea'></textarea>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <button type='submit' class='button is-primary column is-12' :class="{ 'is-loading': editLoading }">
                Save
              </button>
            </div>
            <div class="column is-6">
              <button v-if='!editLoading' class='button column is-12' @click='cancelEdit'>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      <div v-if='pendingDelete'>
        <div class="columns">
          <div class="column has-text-centered">
            <strong>Are you sure you want to delete this note?</strong>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <button class='button is-danger column is-12' :class="{ 'is-loading': deleteLoading }" @click='confirmDeleteNote'>
              Delete
            </button>
          </div>
        </div>
      </div>
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
      this.pendingDelete = false
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
      if (this.pendingDelete) {
        this.editing = false
      }
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
