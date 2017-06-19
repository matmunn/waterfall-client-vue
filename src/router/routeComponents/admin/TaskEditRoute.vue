<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <TaskForm :task='parseInt(this.$route.params.id)' :editing='true'></TaskForm>
      </div>
    </div>
  </div>
</template>

<script>
import TaskForm from '@/components/TaskForm'

export default {
  name: 'TaskEditRoute',
  components: {
    TaskForm
  }
}
</script>
