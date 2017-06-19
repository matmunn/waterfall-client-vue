import ClientListRoute from '@/router/routeComponents/admin/ClientListRoute'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'

describe('router/routeComponents/admin/ClientListRoute.vue', () => {
  it('gets all categories when created', () => {
    const clientsSpy = sinon.spy(ClientListRoute.methods, 'getAllClients')
    const usersSpy = sinon.spy(ClientListRoute.methods, 'getAllUsers')

    mount(ClientListRoute, { store, router })

    expect(clientsSpy.called).to.equal(true)
    expect(usersSpy.called).to.equal(true)

    clientsSpy.restore()
    usersSpy.restore()
  })
})
