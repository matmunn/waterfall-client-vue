import CategoryForm from '@/components/CategoryForm'
import helpers from 'Helpers'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'

describe('components/CategoryForm.vue', () => {
  it('initial data should be set correctly', () => {
    const wrapper = mount(CategoryForm, { store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      description: '',
      color: 'FF0000',
      visible: true,
      loading: false
    })
  })

  it('should render correct contents if editing', () => {
    const getCategoryStub = sinon.stub(helpers, 'getCategory').returns({
      description: 'Editing Category',
      hex_color: 'FFFF00',
      display_in_list: false
    })

    const wrapper = mount(CategoryForm, { store, router, propsData: { editing: true } })

    wrapper.update()

    expect(wrapper.vm.$el.querySelector('#name').value).to.include('Editing Category')
    expect(wrapper.vm.$el.querySelector('#color').value).to.include('FFFF00')

    getCategoryStub.restore()
  })

  it('should dispatch the correct action if editing', () => {
    const getCategoryStub = sinon.stub(helpers, 'getCategory').returns({
      description: 'Editing Category',
      hex_color: 'FFFF00',
      display_in_list: false
    })

    const wrapper = mount(CategoryForm, { store, router, propsData: { editing: true, category: 1 } })

    const editCategoryStub = sinon.stub(wrapper.vm, 'editCategory').resolves()

    return wrapper.vm.saveCategory().then(() => {
      expect(editCategoryStub.calledWith({ description: 'Editing Category', color: 'FFFF00', visible: false, id: 1 })).to.equal(true)

      editCategoryStub.restore()
      getCategoryStub.restore()
    })
  })

  it('should dispatch the correct action if adding a new category', () => {
    const wrapper = mount(CategoryForm, { store, router, propsData: { editing: false } })

    const addCategoryStub = sinon.stub(wrapper.vm, 'addCategory').resolves()

    wrapper.setData({ description: 'New Category', color: '00FF00' })

    return wrapper.vm.saveCategory().then(() => {
      expect(addCategoryStub.calledWith({ description: 'New Category', color: '00FF00', visible: true })).to.equal(true)

      addCategoryStub.restore()
    })
  })

  it('should show a toast if there is an error', () => {
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    const wrapper = mount(CategoryForm, { store, router, propsData: { editing: false } })

    const addCategoryStub = sinon.stub(wrapper.vm, 'addCategory').rejects()

    wrapper.setData({ description: 'New Category', color: '00FF00' })

    return wrapper.vm.saveCategory().then(() => {
      expect(toastrSpy.calledWith(`An error occurred while processing your request`, 'Error')).to.equal(true)

      addCategoryStub.restore()
      toastrSpy.restore()
    })
  })
})
