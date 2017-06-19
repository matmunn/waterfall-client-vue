import UserTaskTable from '@/components/UserTaskTable'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import moment from 'moment'

const testData = {
  tasks: [
    {
      completed: true,
      blocks: [1, 2]
    },
    {
      is_absence: true,
      blocks: [1, 2, 3]
    },
    {
      blocks: [1, 2, 3, 4]
    }
  ]
}

describe('components/UserTaskTable.vue', () => {
  it('initial data should be set correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      startDate: moment().day(1).format('YYYY-MM-DD'),
      endDate: moment().day(5).format('YYYY-MM-DD'),
      loading: false
    })
  })

  it('startedLoading works correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    expect(wrapper.vm.loading).to.equal(false)

    wrapper.vm.startedLoading()

    expect(wrapper.vm.loading).to.equal(true)
  })

  it('startedLoading works correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })
    wrapper.setData({ loading: true })

    wrapper.vm.finishedLoading()

    expect(wrapper.vm.loading).to.equal(false)
  })

  it('updateDates works correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    const testDates = {
      start: '2017-01-01 09:00:00',
      end: '2017-01-02 09:00:00'
    }

    wrapper.vm.updateDates(testDates)

    // These become the Monday and Friday dates of the week
    expect(wrapper.vm.startDate).to.equal('2017-01-02')
    expect(wrapper.vm.endDate).to.equal('2017-01-06')
  })

  it('totalWeeklyHours is calculated correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    expect(wrapper.vm.totalWeeklyHours).to.equal(9)
  })

  it('completedHours is calculated correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    expect(wrapper.vm.completedHours).to.equal(2)
  })

  it('absenceHours is calculated correctly', () => {
    const wrapper = mount(UserTaskTable, { propsData: testData, store, router })

    expect(wrapper.vm.absenceHours).to.equal(3)
  })
})
