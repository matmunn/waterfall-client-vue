import ClientForm from '@/components/ClientForm'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'
import helpers from 'Helpers'

describe('components/ClientForm.vue', () => {
  it('initial data should be set correctly', () => {
    const getClientStub = sinon.stub(helpers, 'getClient').returns({
      name: 'Foo Client'
    })

    const wrapper = mount(ClientForm, { store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      editingClient: { name: 'Foo Client' },
      clientName: '',
      clientAccountManager: '',
      loading: false
    })

    getClientStub.restore()
  })

  it('should set correct data if editing', () => {
    const getClientStub = sinon.stub(helpers, 'getClient').returns({
      name: 'Foo Client',
      account_manager_id: 3
    })

    const wrapper = mount(ClientForm, { store, router, propsData: { editing: true } })

    const result = wrapper.data()

    expect(result.clientName).to.equal('Foo Client')
    expect(result.clientAccountManager).to.equal(3)

    getClientStub.restore()
  })

  it('should dispatch the correct action for saveClient if adding a new client', () => {
    const wrapper = mount(ClientForm, { store, router, propsData: { editing: false } })

    wrapper.vm.clientName = 'Foo Client'
    wrapper.vm.clientAccountManager = 4

    const addClientStub = sinon.stub(wrapper.vm, 'addClient').resolves()

    return wrapper.vm.saveClient().then(() => {
      expect(addClientStub.calledWith({ name: 'Foo Client', accountManager: 4 })).to.equal(true)

      addClientStub.restore()
    })
  })

  it('should dispatch the correct action for saveClient if editing a client', () => {
    const wrapper = mount(ClientForm, { store, router, propsData: { editing: true } })

    wrapper.vm.clientName = 'Foo Client'
    wrapper.vm.clientAccountManager = 4
    wrapper.vm.editingClient = {
      id: 1
    }

    const editClientStub = sinon.stub(wrapper.vm, 'editClient').resolves()

    return wrapper.vm.saveClient().then(() => {
      expect(editClientStub.calledWith({ name: 'Foo Client', accountManager: 4, id: 1 })).to.equal(true)

      editClientStub.restore()
    })
  })

  it('should display a toast if saveClient rejects', () => {
    const wrapper = mount(ClientForm, { store, router, propsData: { editing: false } })

    const addClientStub = sinon.stub(wrapper.vm, 'addClient').rejects()
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    return wrapper.vm.saveClient().then(() => {
      expect(toastrSpy.calledWith(`An error occurred while processing your request`, 'Error')).to.equal(true)

      addClientStub.restore()
      toastrSpy.restore()
    })
  })
})
