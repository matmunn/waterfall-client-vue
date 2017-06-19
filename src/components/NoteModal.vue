<template>
<div class="modal fade" :id='this.id' tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Notes for '{{ this.task.description }}'</h4>
      </div>
      <div class="modal-body">
        <div>
          <form @submit.prevent='saveNote'>
            <div class="form-group">
              <label>Message</label>
              <textarea class="form-control" v-model='noteMessage'></textarea>
            </div>
            <input v-if='!loading' type="submit" value='Save Note' class="btn btn-primary btn-block">
            <ClipLoader v-if='loading' :color='`#3097D1`' :size='`30px`'></ClipLoader>
          </form>
        </div>
        <hr>
        <div v-if='this.notes.length'>
          <ModalNote v-for='note in notes' :note='note' :key='note.id' />
        </div>
        <div v-else>
          <h3>This task doesn't have any notes yet.</h3>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
h3 {
  text-align: center;
}
</style>

<script>
import ModalNote from '@/components/ModalNote'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import { toastr } from 'Helpers'
import { mapActions } from 'vuex'

export default {
  name: 'NoteModal',
  components: {
    ModalNote,
    ClipLoader
  },
  props: {
    'notes': {
      default () {
        return []
      }
    },
    task: Object
  },
  data () {
    return {
      noteMessage: '',
      id: `modal${this.task.id}`,
      loading: false
    }
  },
  methods: {
    saveNote () {
      this.loading = true
      const noteData = {
        entry: this.task.id,
        message: this.noteMessage
      }

      return this.addNote(noteData).then(() => {
        this.loading = false
        this.noteMessage = ''
      }, () => {
        this.loading = false
        toastr.error('There was an error while submitting your request', 'Error')
      })
    },
    ...mapActions(['addNote'])
  }
}
</script>
