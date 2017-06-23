<template>
<div>
  <input :id='datepickerId' type='text' class="input" readonly>
</div>
</template>

<style scoped>
input.form-control {
  background-color: #FFFFFF;
}
</style>
<style>
.minuteselectspan .minuteselect {
  padding-right: 1.5em;
}
</style>

<script>
import $ from 'jquery'
require('savi-bootstrap-daterangepicker')
// import daterangepicker from 'savi-bootstrap-daterangepicker'
import moment from 'moment'

export default {
  name: 'DateRangePicker',
  props: ['value', 'startTime', 'endTime', 'id'],
  methods: {
    updateDates (startDate, endDate) {
      this.$emit('input', { start: startDate, end: endDate })
    }
  },
  computed: {
    datepickerId () {
      return this.id || 'daterangepicker'
    }
  },
  mounted () {
    $(`#${this.datepickerId}`).daterangepicker({
      timePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 60,
      autoApply: true,
      startDate: this.startTime || moment().minute(0),
      endDate: this.endTime || moment().add(2, 'hour').minute(0),
      disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 18, 19, 20, 21, 22, 23],
      locale: {
        format: 'YYYY-MM-DD HH:mm'
      },
      icons: {
        calendar: ''
      }
    }, (start, end, label) => {
      this.updateDates(moment(start).format('YYYY-MM-DD HH:mm'), moment(end).format('YYYY-MM-DD HH:mm'))
    })
  }
}
</script>
