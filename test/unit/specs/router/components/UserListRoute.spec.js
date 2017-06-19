import UserListRoute from '@/router/routeComponents/admin/UserListRoute'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'

describe('router/routeComponents/admin/UserListRoute.vue', () => {
  it('gets all categories when created', () => {
    const categoriesSpy = sinon.spy(UserListRoute.methods, 'getAllCategories')
    const usersSpy = sinon.spy(UserListRoute.methods, 'getAllUsers')

    mount(UserListRoute, { store, router })

    expect(categoriesSpy.called).to.equal(true)
    expect(usersSpy.called).to.equal(true)

    categoriesSpy.restore()
    usersSpy.restore()
  })
})
