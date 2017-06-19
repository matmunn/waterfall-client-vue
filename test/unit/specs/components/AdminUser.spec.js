import AdminUser from '@/components/AdminUser'
import helpers from 'Helpers'
import store from '@/store'
import router from '@/router'
import { mount } from 'avoriaz'

const testData = {
  user: {
    id: 1,
    name: 'Foo User',
    email: 'foo@bar.com',
    category_id: 1
  }
}

describe('components/AdminUser.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(AdminUser, { store, router, propsData: testData })

    const result = wrapper.text()

    expect(result).to.include('Foo User')
    expect(result).to.include('foo@bar.com')
  })

  it('should compute values correctly', () => {
    const wrapper = mount(AdminUser, { store, router, propsData: testData })

    expect(wrapper.vm.deleteLink).to.equal(`/admin/users/1/delete`)
    expect(wrapper.vm.editLink).to.equal(`/admin/users/1/edit`)
  })

  it('confirmDelete should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const wrapper = mount(AdminUser, { store, router, propsData: testData })

    const dispatchDeleteStub = sinon.stub(wrapper.vm, 'deleteUser').returns(true)

    return wrapper.vm.confirmDelete().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      expect(dispatchDeleteStub.calledWith(1)).to.equal(true)

      swalStub.restore()
    })
  })

  it('confirmDelete does nothing on cancel', () => {
    const swalStub = sinon.stub(helpers, 'swal').rejects()

    const wrapper = mount(AdminUser, { store, router, propsData: testData })

    const dispatchDeleteStub = sinon.stub(wrapper.vm, 'deleteUser').returns(true)

    return wrapper.vm.confirmDelete().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(false)

      swalStub.restore()
    })
  })
})
