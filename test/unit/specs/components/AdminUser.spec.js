import Vue from 'vue'
import AdminUser from '@/components/AdminUser'
import helpers from 'Helpers'
import { getRenderedText } from '../../helpers'

const testUser = {
  user: {
    id: 1,
    name: 'Foo User',
    email: 'foo@bar.com',
    category_id: 1
  }
}

describe('AdminUser.vue', () => {
  it('should render correct contents', () => {
    const result = getRenderedText(AdminUser, testUser)

    expect(result).to.include('Foo User')
    expect(result).to.include('foo@bar.com')
  })

  it('should compute values correctly', () => {
    const Ctor = Vue.extend(AdminUser)
    const vm = new Ctor({ propsData: testUser }).$mount()

    expect(vm.deleteLink).to.equal(`/admin/users/1/delete`)
    expect(vm.editLink).to.equal(`/admin/users/1/edit`)
  })

  it('deleteUser should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const Ctor = Vue.extend(AdminUser)
    const vm = new Ctor({ propsData: testUser }).$mount()

    const dispatchDeleteStub = sinon.stub(vm, 'dispatchDelete').returns(true)

    return vm.deleteUser().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      swalStub.restore()
    })
  })

  it('deleteUser does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()
    const Ctor = Vue.extend(AdminUser)
    const vm = new Ctor({ propsData: testUser }).$mount()

    vm.deleteUser()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
