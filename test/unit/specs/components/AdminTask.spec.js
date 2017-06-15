import Vue from 'vue'
import AdminTask from '@/components/AdminTask'
import helpers from 'Helpers'
import { getRenderedText } from '../../helpers'

const testTask = {
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

describe('AdminTask.vue', () => {
  it('should render correct contents', () => {
    expect(getRenderedText(AdminTask, testTask))
      .to.include('Bar Task')
  })

  it('should compute values correctly', () => {
    const Ctor = Vue.extend(AdminTask)
    const vm = new Ctor({ propsData: testTask }).$mount()

    expect(vm.deleteLink).to.equal(`/admin/tasks/1/delete`)
    expect(vm.editLink).to.equal(`/admin/tasks/1/edit`)

    expect(vm.completedClass).to.equal('fa-check')

    const Ctor2 = Vue.extend(AdminTask)
    testTask.task.completed = false
    const vm2 = new Ctor2({ propsData: testTask }).$mount()

    expect(vm2.completedClass).to.equal('fa-times')
  })

  it('deleteTask should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const Ctor = Vue.extend(AdminTask)
    const vm = new Ctor({ propsData: testTask }).$mount()

    const dispatchDeleteStub = sinon.stub(vm, 'dispatchDelete').returns(true)

    return vm.deleteTask().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      swalStub.restore()
    })
  })

  it('deleteTask does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()
    const Ctor = Vue.extend(AdminTask)
    const vm = new Ctor({ propsData: testTask }).$mount()

    vm.deleteTask()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
