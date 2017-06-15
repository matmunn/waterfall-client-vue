<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <TaskForm :editing='false' />
      </div>
    </div>
  </div>
</template>

<script>
import TaskForm from '@/components/TaskForm'

export default {
  name: 'TaskAddRoute',
  components: {
    TaskForm
  }
}
</script>
