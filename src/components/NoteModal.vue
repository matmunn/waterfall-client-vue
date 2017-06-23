<template>
<div class="modal" :class="{ 'is-active': showModal }">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Notes for '{{ this.task.description }}'
      </p>
      <button class="delete" @click='hide'></button>
    </header>
    <section class="modal-card-body">
      <div>
        <form @submit.prevent='saveNote'>
          <div class="field">
            <label class="label">Message</label>
            <textarea class="textarea" v-model='noteMessage'></textarea>
          </div>
          <button type="submit" class="button is-primary is-block" :class="{ 'is-loading': loading }">
            Save Note
          </button>
        </form>
      </div>
      <hr>
      <div v-if='this.notes.length'>
        <ModalNote v-for='note in notes' :note='note' :key='note.id'></ModalNote>
      </div>
      <div v-else>
        <h3 class="title is-4">This task doesn't have any notes yet.</h3>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-pulled-right" @click='hide'>
        Close
      </button>
    </footer>
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
    notes: {
      default () {
        return []
      }
    },
    task: Object,
    modalVisible: {
      default: false
    }
  },
  data () {
    return {
      noteMessage: '',
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
    hide () {
      this.$emit('hideModal')
    },
    ...mapActions(['addNote'])
  },
  computed: {
    showModal () {
      return this.modalVisible
    }
  }
}
</script>
