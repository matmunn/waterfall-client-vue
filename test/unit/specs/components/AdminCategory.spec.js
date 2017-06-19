import AdminCategory from '@/components/AdminCategory'
import helpers from 'Helpers'
import store from '@/store'
import router from '@/router'
import { mount } from 'avoriaz'

const testData = {
  category: {
    id: 1,
    description: 'Test Category',
    hex_color: 'FF0000',
    display_in_list: 1
  }
}

describe('components/AdminCategory.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(AdminCategory, { propsData: testData, router })

    expect(wrapper.text()).to.include('Test Category')
  })

  it('should compute values correctly', () => {
    const wrapper = mount(AdminCategory, { propsData: testData, router })

    expect(wrapper.vm.deleteLink).to.equal(`/admin/categories/1/delete`)
    expect(wrapper.vm.fillSample).to.equal(`background-color: #FF0000`)
    expect(wrapper.vm.editLink).to.equal(`/admin/categories/1/edit`)
  })

  it('confirmDelete should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const wrapper = mount(AdminCategory, { store, propsData: testData, router })

    const dispatchDeleteStub = sinon.stub(wrapper.vm, 'deleteCategory').returns(true)

    return wrapper.vm.confirmDelete().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)
      expect(dispatchDeleteStub.calledWith(1)).to.equal(true)

      swalStub.restore()
    })
  })

  it('confirmDelete does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()

    const wrapper = mount(AdminCategory, { store, router, propsData: testData })

    wrapper.vm.confirmDelete()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
