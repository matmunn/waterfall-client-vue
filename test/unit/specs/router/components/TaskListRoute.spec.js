import TaskListRoute from '@/router/routeComponents/admin/TaskListRoute'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import Auth from 'Auth'

describe('router/routeComponents/admin/TaskListRoute.vue', () => {
  it('fetches the correct data when created', () => {
    const usersSpy = sinon.spy(TaskListRoute.methods, 'getAllUsers')
    const tasksSpy = sinon.spy(TaskListRoute.methods, 'getAllTasks')
    const clientsSpy = sinon.spy(TaskListRoute.methods, 'getAllClients')
    const AuthUserStub = sinon.stub(Auth, 'getUser').returns({ id: 1 })

    mount(TaskListRoute, { store, router })

    // expect(wrapper.vm.selectedUser).to.equal(1)

    expect(usersSpy.called).to.equal(true)
    expect(tasksSpy.called).to.equal(true)
    expect(clientsSpy.called).to.equal(true)

    usersSpy.restore()
    tasksSpy.restore()
    clientsSpy.restore()
    AuthUserStub.restore()
  })
})
