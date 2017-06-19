import AdminTask from '@/components/AdminTask'
import helpers from 'Helpers'
import store from '@/store'
import router from '@/router'
import { mount } from 'avoriaz'

const testData = {
  task: {
    id: 1,
    user_id: 1,
    client_id: 1,
    description: 'Bar Task',
    start_date: '2017-01-01 09:00:00',
    end_date: '2017-01-01 12:00:00',
    completed: true,
    blocks: [0, 1]
  }
}

describe('components/AdminTask.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(AdminTask, { store, router, propsData: testData })

    expect(wrapper.text()).to.include('Bar Task')
  })

  it('should compute values correctly', () => {
    const wrapper = mount(AdminTask, { store, router, propsData: testData })

    expect(wrapper.vm.deleteLink).to.equal(`/admin/tasks/1/delete`)
    expect(wrapper.vm.editLink).to.equal(`/admin/tasks/1/edit`)
    expect(wrapper.vm.completedClass).to.equal('fa-check')

    testData.task.completed = false
    wrapper.setProps(testData)

    expect(wrapper.vm.completedClass).to.equal('fa-times')
  })

  it('confirmDelete should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const wrapper = mount(AdminTask, { store, router, propsData: testData })

    const dispatchDeleteStub = sinon.spy(wrapper.vm, 'deleteTask')

    return wrapper.vm.confirmDelete().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      expect(dispatchDeleteStub.calledWith(1)).to.equal(true)
      swalStub.restore()
    })
  })

  it('confirmDelete does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()

    const wrapper = mount(AdminTask, { store, router, propsData: testData })

    wrapper.vm.confirmDelete()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
