import Vue from 'vue'
import CategoryForm from '@/components/CategoryForm'
import helpers from 'Helpers'
import { getRenderedText } from '../../helpers'

const testData = {
  user: {
    id: 1,
    name: 'Foo User',
    email: 'foo@bar.com',
    category_id: 1
  },
  editing: true
}

describe('CategoryForm.vue', () => {
  it('should render correct contents if editing', () => {
    const result = getRenderedText(CategoryForm, testData)

    expect(result).to.include('Foo User')
    expect(result).to.include('foo@bar.com')
  })

  it('should render correct contents if not editing', () => {
    testData.editing = false
    const result = getRenderedText(CategoryForm, testData)

    expect(result).to.include('Foo User')
    expect(result).to.include('foo@bar.com')
  })

  it('should compute values correctly', () => {
    const Ctor = Vue.extend(CategoryForm)
    const vm = new Ctor({ propsData: testData }).$mount()

    expect(vm.deleteLink).to.equal(`/admin/users/1/delete`)
    expect(vm.editLink).to.equal(`/admin/users/1/edit`)
  })
})
