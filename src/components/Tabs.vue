<template>
<div>
  <div class="tabs">
    <ul>
      <li v-for='tab in tabs' :class='{ "is-active": tab.isActive }'>
        <a href="#" @click='selectTab(tab)'>
          {{ tab.name }}
        </a>
      </li>
    </ul>
  </div>
  <div class="tab-details">
    <slot></slot>
  </div>
</div>
</template>

<script>
import { forEach } from 'lodash'

export default {
  name: 'Tabs',
  data () {
    return {
      tabs: []
    }
  },
  methods: {
    selectTab (selectedTab) {
      forEach(this.tabs, tab => {
        tab.isActive = tab.name === selectedTab.name
      })
    }
  },
  mounted () {
    this.tabs = this.$children
  }
}
</script>
