import AdminClient from '@/components/AdminClient'
import helpers from 'Helpers'
import store from '@/store'
import router from '@/router'
import { mount } from 'avoriaz'

const testData = {
  client: {
    id: 1,
    name: 'Foo Client',
    account_manager_id: 1
  }
}

describe('components/AdminClient.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(AdminClient, { propsData: testData, router })

    expect(wrapper.text()).to.include('Foo Client')
  })

  it('should compute values correctly', () => {
    const wrapper = mount(AdminClient, { propsData: testData, router, store })

    expect(wrapper.vm.deleteLink).to.equal(`/admin/clients/1/delete`)
    expect(wrapper.vm.editLink).to.equal(`/admin/clients/1/edit`)
  })

  it('confirmDelete should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const wrapper = mount(AdminClient, { store, router, propsData: testData })

    const dispatchDeleteStub = sinon.stub(wrapper.vm, 'deleteClient').returns(true)

    return wrapper.vm.confirmDelete().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      expect(dispatchDeleteStub.calledWith(1)).to.equal(true)

      swalStub.restore()
    })
  })

  it('confirmDelete does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()

    const wrapper = mount(AdminClient, { store, router, propsData: testData })

    wrapper.vm.confirmDelete()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
