import Vue from 'vue'
import AdminClient from '@/components/AdminClient'
import helpers from 'Helpers'
import { getRenderedText } from '../../helpers'

const testClient = {
  client: {
    id: 1,
    name: 'Foo Client',
    account_manager_id: 1
  }
}

describe('AdminClient.vue', () => {
  it('should render correct contents', () => {
    expect(getRenderedText(AdminClient, testClient))
      .to.include('Foo Client')
  })

  it('should compute values correctly', () => {
    const Ctor = Vue.extend(AdminClient)
    const vm = new Ctor({ propsData: testClient }).$mount()

    expect(vm.deleteLink).to.equal(`/admin/clients/1/delete`)
    expect(vm.editLink).to.equal(`/admin/clients/1/edit`)
  })

  it('deleteClient should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const Ctor = Vue.extend(AdminClient)
    const vm = new Ctor({ propsData: testClient }).$mount()

    const dispatchDeleteStub = sinon.stub(vm, 'dispatchDelete').returns(true)

    return vm.deleteClient().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)

      swalStub.restore()
    })
  })

  it('deleteClient does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()
    const Ctor = Vue.extend(AdminClient)
    const vm = new Ctor({ propsData: testClient }).$mount()

    vm.deleteClient()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
