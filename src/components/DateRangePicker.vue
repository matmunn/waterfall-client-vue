<template>
<div>
  <input :id='datepickerId' type='text' class="form-control" readonly>
</div>
</template>

<style scoped>
input.form-control {
  background-color: #FFFFFF;
}
</style>

<script>
import $ from 'jquery'
import daterangepicker from 'savi-bootstrap-daterangepicker'
import moment from 'moment'

export default {
  name: 'DateRangePicker',
  props: ['value', 'startTime', 'endTime', 'id'],
  methods: {
    updateDates (startDate, endDate) {
      this.$emit('input', {start: startDate, end: endDate})
    }
  },
  computed: {
    datepickerId () {
      return this.id || 'daterangepicker'
    }
  },
  mounted () {
    $.prototype.daterangepicker = daterangepicker
    $(`#${this.datepickerId}`).daterangepicker({
      timePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 60,
      autoApply: true,
      startDate: this.startTime || moment().minute(0).format('YYYY-MM-DD HH:mm'),
      endDate: this.endTime || moment().add(2, 'hour').minute(0).format('YYYY-MM-DD HH:mm'),
      disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 18, 19, 20, 21, 22, 23],
      locale: {
        format: 'YYYY-MM-DD HH:mm'
      }
    }, (start, end, label) => {
      this.updateDates(moment(start).format('YYYY-MM-DD HH:mm'), moment(end).format('YYYY-MM-DD HH:mm'))
    })
  }
}
</script>
