import UserForm from '@/components/UserForm'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import helpers from 'Helpers'

describe('components/UserForm.vue', () => {
  it('initial data should be set correctly', () => {
    const getUserStub = sinon.stub(helpers, 'getUser').returns({
      name: 'Foo User'
    })

    const wrapper = mount(UserForm, { propsData: { editing: false }, store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      editingUser: { name: 'Foo User' },
      name: '',
      email: '',
      password: '',
      category: '',
      loading: false
    })

    getUserStub.restore()
  })

  it('correct data is set if editing', () => {
    const getUserStub = sinon.stub(helpers, 'getUser').returns({
      name: 'Foo User',
      email: 'foo@bar.com',
      category_id: 2
    })

    const wrapper = mount(UserForm, { propsData: { editing: true }, store, router })

    const result = wrapper.data()

    expect(result.name).to.equal('Foo User')
    expect(result.email).to.equal('foo@bar.com')
    expect(result.category).to.equal(2)

    getUserStub.restore()
  })

  it('password is required if not editing', () => {
    const wrapper = mount(UserForm, { attachToDocument: true, propsData: { editing: false }, store, router })

    expect(wrapper.find('#password')[0].hasAttribute('required', 'true')).to.equal(true)
  })

  it('saveUser shows a toast if it is rejected', () => {
    const wrapper = mount(UserForm, { propsData: { editing: false }, store, router })

    const addUserStub = sinon.stub(wrapper.vm, 'addUser').rejects()
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    return wrapper.vm.saveUser().then(() => {
      expect(toastrSpy.calledWith(`An error occurred while processing your request`, `Error`)).to.equal(true)

      addUserStub.restore()
      toastrSpy.restore()
    })
  })

  it('should dispatch the correct action for saveUser if adding a new user', () => {
    const wrapper = mount(UserForm, { store, router, propsData: { editing: false } })

    wrapper.vm.name = 'Foo User'
    wrapper.vm.email = 'foo@bar.com'
    wrapper.vm.password = 'foobar'
    wrapper.vm.category = 3

    const addUserStub = sinon.stub(wrapper.vm, 'addUser').resolves()

    return wrapper.vm.saveUser().then(() => {
      const expectedData = {
        name: 'Foo User',
        email: 'foo@bar.com',
        password: 'foobar',
        category: 3
      }
      expect(addUserStub.calledWith(expectedData)).to.equal(true)

      addUserStub.restore()
    })
  })

  it('should dispatch the correct action for saveUser if editing a client', () => {
    const wrapper = mount(UserForm, { store, router, propsData: { editing: true } })

    wrapper.vm.name = 'Foo User'
    wrapper.vm.email = 'foo@bar.com'
    wrapper.vm.password = 'foobar'
    wrapper.vm.category = 3
    wrapper.vm.editingUser = {
      id: 4
    }

    const editUserStub = sinon.stub(wrapper.vm, 'editUser').resolves()

    return wrapper.vm.saveUser().then(() => {
      const expectedData = {
        name: 'Foo User',
        email: 'foo@bar.com',
        password: 'foobar',
        category: 3,
        id: 4
      }

      expect(editUserStub.calledWith(expectedData)).to.equal(true)

      editUserStub.restore()
    })
  })
})
