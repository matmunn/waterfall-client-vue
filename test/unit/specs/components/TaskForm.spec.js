import TaskForm from '@/components/TaskForm'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import helpers from 'Helpers'
import moment from 'moment'
import timekeeper from 'timekeeper'
import Auth from 'Auth'

describe('components/TaskForm.vue', () => {
  it('initial data should be set correctly if browsing before 0900', () => {
    timekeeper.travel(moment().hour(8).toDate())

    const getTaskStub = sinon.stub(helpers, 'getTask').returns({
      id: 1
    })
    const getAuthUserStub = sinon.stub(Auth, 'getUser').returns({
      id: 2
    })

    const wrapper = mount(TaskForm, { propsData: { editing: false }, store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      editingTask: { id: 1 },
      user: 2,
      client: null,
      description: '',
      completed: false,
      recurring: false,
      recurrencePeriod: 0,
      recurrenceType: 'Weeks',
      loading: false,
      absence: false,
      timings: {
        start: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
        end: moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm')
      }
    })

    getTaskStub.restore()
    getAuthUserStub.restore()
  })

  it('initial data should be set correctly if browsing after 0900', () => {
    timekeeper.travel(moment().hour(11).toDate())

    const getTaskStub = sinon.stub(helpers, 'getTask').returns({
      id: 1
    })
    const getAuthUserStub = sinon.stub(Auth, 'getUser').returns({
      id: 2
    })

    const wrapper = mount(TaskForm, { propsData: { editing: false }, store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      editingTask: { id: 1 },
      user: 2,
      client: null,
      description: '',
      completed: false,
      recurring: false,
      recurrencePeriod: 0,
      recurrenceType: 'Weeks',
      loading: false,
      absence: false,
      timings: {
        start: moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm'),
        end: moment().hour(13).minute(0).format('YYYY-MM-DD HH:mm')
      }
    })

    getTaskStub.restore()
    getAuthUserStub.restore()
  })

  it('correct data is set if editing', () => {
    timekeeper.travel(moment().hour(11).toDate())

    const getTaskStub = sinon.stub(helpers, 'getTask').returns({
      id: 1,
      user_id: 2,
      client_id: 3,
      description: 'Bar Task',
      start_date: '2017-01-02 09:00:00',
      end_date: '2017-01-03 11:00:00',
      completed: false,
      is_recurring: true,
      recurrence_period: 4,
      recurrence_type: 'Days',
      is_absence: false
    })
    const getClientStub = sinon.stub(helpers, 'getClient').returns({
      description: 'Foo Client'
    })

    const wrapper = mount(TaskForm, { propsData: { editing: true }, store, router })

    expect(wrapper.vm.user).to.equal(2)
    expect(wrapper.vm.client).to.eql({ description: 'Foo Client' })
    expect(wrapper.vm.description).to.equal('Bar Task')
    expect(wrapper.vm.timings).to.eql({
      start: '2017-01-02 09:00',
      end: '2017-01-03 11:00'
    })
    expect(wrapper.vm.completed).to.equal(false)
    expect(wrapper.vm.recurring).to.equal(true)
    expect(wrapper.vm.recurrencePeriod).to.equal(4)
    expect(wrapper.vm.recurrenceType).to.equal('Days')
    expect(wrapper.vm.absence).to.equal(false)

    getTaskStub.restore()
    getClientStub.restore()
  })

  it('saveTask dispatches the correct action if adding a new task', () => {
    timekeeper.travel(moment().hour(8).toDate())

    const getAuthUserStub = sinon.stub(Auth, 'getUser').returns({
      id: 2
    })

    const wrapper = mount(TaskForm, { propsData: { editing: false }, store, router })

    const addTaskStub = sinon.stub(wrapper.vm, 'addTask').resolves()

    return wrapper.vm.saveTask().then(() => {
      const expectedResults = {
        user: 2,
        client: null,
        description: '',
        startTime: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
        endTime: moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm'),
        completed: false,
        recurring: false,
        recurrencePeriod: 0,
        recurrenceType: 'Weeks',
        absence: false
      }

      expect(addTaskStub.calledWith(expectedResults)).to.equal(true)

      getAuthUserStub.restore()
      addTaskStub.restore()
    })
  })

  it('saveTask dispatches the correct action if editing a task', () => {
    timekeeper.travel(moment().hour(8).toDate())

    const getAuthUserStub = sinon.stub(Auth, 'getUser').returns({
      id: 3
    })
    const getTaskStub = sinon.stub(helpers, 'getTask').returns({
      id: 1,
      user_id: 3,
      client_id: 2,
      description: 'Bar Task',
      start_date: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
      end_date: moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm'),
      completed: false,
      is_recurring: true,
      recurrence_period: 4,
      recurrence_type: 'Days',
      is_absence: false
    })
    const getClientStub = sinon.stub(helpers, 'getClient').returns({
      description: 'Foo Client'
    })

    const wrapper = mount(TaskForm, { propsData: { editing: true }, store, router })

    wrapper.vm.client = { id: 2 }

    const editTaskStub = sinon.stub(wrapper.vm, 'editTask').resolves()

    return wrapper.vm.saveTask().then(() => {
      const expectedResults = {
        user: 3,
        client: 2,
        description: 'Bar Task',
        startTime: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
        endTime: moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm'),
        completed: false,
        recurring: true,
        recurrencePeriod: 4,
        recurrenceType: 'Days',
        absence: false,
        id: 1
      }

      expect(editTaskStub.calledWith(expectedResults)).to.equal(true)

      getAuthUserStub.restore()
      getTaskStub.restore()
      getClientStub.restore()
      editTaskStub.restore()
    })
  })

  it('saveTask causes a toast to be shown if there is a time error', () => {
    const wrapper = mount(TaskForm, { propsData: { editing: false }, store, router })

    const addTaskStub = sinon.stub(wrapper.vm, 'addTask').returns(Promise.reject('time-error'))
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    return wrapper.vm.saveTask().then(() => {
      expect(toastrSpy.calledWith(`The end time must be after the start time`, 'Error')).to.equal(true)

      addTaskStub.restore()
      toastrSpy.restore()
    })
  })

  it('saveTask causes a toast to be shown if there is a general error', () => {
    const wrapper = mount(TaskForm, { propsData: { editing: false }, store, router })

    const addTaskStub = sinon.stub(wrapper.vm, 'addTask').rejects()
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    return wrapper.vm.saveTask().then(() => {
      expect(toastrSpy.calledWith(`An error occurred while processing your request`, 'Error')).to.equal(true)

      addTaskStub.restore()
      toastrSpy.restore()
    })
  })
})
