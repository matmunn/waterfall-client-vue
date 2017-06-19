import AdminRoute from '@/router/routeComponents/AdminRoute'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import Auth from 'Auth'

describe('router/routeComponents/AdminRoute.vue', () => {
  it('sets the correct data when created', () => {
    const AuthUserStub = sinon.stub(Auth, 'getUser').returns({ name: 'Foo User' })

    const wrapper = mount(AdminRoute, { store, router })

    expect(wrapper.computed().userName()).to.equal('Foo User')

    AuthUserStub.restore()
  })
})
