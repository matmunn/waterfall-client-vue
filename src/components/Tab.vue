<template>
<div v-show='isActive'>
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    selected: {
      default: false
    },
    name: {
      required: true
    }
  },
  data () {
    return {
      isActive: false
    }
  }
}
</script>
