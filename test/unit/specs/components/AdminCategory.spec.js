import Vue from 'vue'
import AdminCategory from '@/components/AdminCategory'
import helpers from 'Helpers'
import { getRenderedText } from '../../helpers'

const testCategory = {
  category: {
    id: 1,
    description: 'Test Category',
    hex_color: 'FF0000',
    display_in_list: 1
  }
}

describe('AdminCategory.vue', () => {
  it('should render correct contents', () => {
    expect(getRenderedText(AdminCategory, testCategory))
      .to.include('Test Category')
  })

  it('should compute values correctly', () => {
    const Ctor = Vue.extend(AdminCategory)
    const vm = new Ctor({ propsData: testCategory }).$mount()

    expect(vm.deleteLink).to.equal(`/admin/categories/1/delete`)
    expect(vm.fillSample).to.equal(`background-color: #FF0000`)
    expect(vm.editLink).to.equal(`/admin/categories/1/edit`)
  })

  it('deleteCategory should work as expected', function () {
    const swalStub = sinon.stub(helpers, 'swal').resolves()

    const Ctor = Vue.extend(AdminCategory)
    const vm = new Ctor({ propsData: testCategory }).$mount()

    const dispatchDeleteStub = sinon.stub(vm, 'dispatchDelete').returns(true)

    return vm.deleteCategory().then(() => {
      expect(swalStub.called).to.equal(true)
      expect(dispatchDeleteStub.called).to.equal(true)

      swalStub.restore()
    })
  })

  it('deleteCategory does nothing on cancel', () => {
    const stub = sinon.stub(helpers, 'swal').rejects()
    const Ctor = Vue.extend(AdminCategory)
    const vm = new Ctor({ propsData: testCategory }).$mount()

    vm.deleteCategory()

    expect(stub.called).to.equal(true)

    stub.restore()
  })
})
