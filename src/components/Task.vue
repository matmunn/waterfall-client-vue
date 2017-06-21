<template>
<tr :class="classes">
  <td :title='title'>
    {{ getClient(this.task.client_id).name }}
  </td>
  <td :title='title' class='job-description'>
    {{ this.task.description }}
  </td>
  <td>
    {{ this.task.blocks.length }}h
  </td>
  <td class="check-mark">
    <i class="fa fa-check" v-if="!task.completed" @click="markCompleted"></i>
    <!-- <i class="material-icons" v-if="!task.completed" @click="markCompleted">done</i> -->
    <i class="fa fa-times" v-else @click="markIncomplete"></i>
    <!-- <i class="material-icons" v-else @click="markIncomplete">clear</i> -->
    <i class="fa fa-comment-o" data-toggle="modal" :data-target='"#modal" + this.task.id'></i>
    ({{ this.notes.length }})
  </td>
  <!-- Vue ranges are 1 indexed while our blocks are 0 indexed, need to subtract 1 to compensate -->
  <td v-for="x in 35">
    <div :class='fillClasses' v-if="shadeCell(x - 1)" :style="backgroundColor">
      <i class="fa fa-square fa-lg"></i>
    </div>
  </td>
  <NoteModal :notes='this.notes' :task='this.task' />
</tr>
</template>

<style scoped lang="scss">
tr.strikethrough {
  opacity: 0.3;

  td:before {
    content: " ";
    position: absolute;
    top: 50%;
    width: 100%;
    left: 0;
    border-bottom: 2px solid red;
    z-index: 2;
    pointer-events: none;
  }
}

.modal-open tr.strikethrough {
  opacity: 1;
}

td {
  position: relative;

  &:first-of-type {
    white-space: nowrap;
  }
}
.check-mark {
  min-width: 70px;
}
.fa {
  cursor: pointer;
}
.fa-check {
  color: yellowgreen;
}
.fa-times {
  color: red;
}
td:not(:first-of-type):not(:nth-of-type(2)) {
  text-align: center;
}
td {
  &:first-of-type, &:nth-of-type(2), &:nth-of-type(3) {
    padding: 3px 10px;
  }
}
td:nth-of-type(7n+4) {
  border-right-width: 2px;
}
.filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  i {
    cursor: initial;
    position: relative;
    top: 3px;
  }
}
.job-description {
  width: 12vw;
  max-width: 12vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.added_during_week {
  background-color: #de8ef8 !important;
  color: #de8ef8 !important;
}
</style>

<script>
import moment from 'moment'
import helpers from 'Helpers'
import NoteModal from './NoteModal'
import { mapActions } from 'vuex'

const { getUser, getClient, getNotes } = helpers

export default {
  name: 'Task',
  props: ['task', 'background'],
  components: {
    NoteModal
  },
  methods: {
    markCompleted () {
      return this.markTaskComplete(this.task.id).catch(() => {
        helpers.toastr.error(`There was an error and your task couldn't be marked as complete.`, 'Error')
      })
    },
    markIncomplete () {
      return this.markTaskIncomplete(this.task.id).catch(() => {
        helpers.toastr.error(`There was an error and your task couldn't be marked as incomplete.`, 'Error')
      })
    },
    shadeCell (cell) {
      return this.task.blocks.indexOf(cell) > -1
    },
    getClient,
    getUser,
    ...mapActions(['markTaskComplete', 'markTaskIncomplete'])
  },
  computed: {
    classes () {
      let classes = ''
      if (this.task.completed) {
        classes += 'strikethrough'
      }
      return classes
    },
    fillClasses () {
      let classes = 'filler'
      if (this.task.task_added_during_week) {
        classes += ' added_during_week'
      }
      return classes
    },
    backgroundColor () {
      let color = this.background || 'AEAEAE'
      if (this.task.is_absence) {
        color = 'f06767'
      }
      return `background-color: #${color}; color: #${color}`
    },
    notes () {
      return getNotes(this.task.id)
    },
    title () {
      const createdAt = moment(this.task.created_at)
      return `${this.task.description}\n` +
        `\nClient: ${getClient(this.task.client_id).name}\n` +
        `Account Manager: ${getUser(getClient(this.task.client_id).account_manager_id).name}\n` +
        `\nCreated on ${createdAt.format('D MMM [at] HH:mm')} by ${getUser(this.task.created_by).name || 'Unknown'}`
    }
  }
}
</script>
