import ModalNote from '@/components/ModalNote'
import helpers from 'Helpers'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'

const testData = {
  note: {
    id: 2,
    message: 'Foo Note',
    created_by: 1,
    created_at: '2017-01-02 09:00:00',
    updated_at: '2017-01-03 09:00:00'
  }
}

describe('components/ModalNote.vue', () => {
  it('initial data should be set correctly', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    const result = wrapper.data()

    expect(result).to.eql({
      editing: false,
      pendingDelete: false,
      noteMessage: 'Foo Note',
      deleteLoading: false,
      editLoading: false
    })
  })

  it('newestDate is set to the right value', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    expect(wrapper.vm.newestDate).to.eql('2017-01-03 09:00:00')

    wrapper.setProps({
      note: {
        message: 'Foo Note',
        created_by: 1,
        created_at: '2017-01-02 09:00:00',
        updated_at: '2017-01-01 09:00:00'
      }
    })

    expect(wrapper.vm.newestDate).to.eql('2017-01-02 09:00:00')
  })

  it('enableEdit sets editing correctly', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    wrapper.vm.enableEdit()

    expect(wrapper.vm.editing).to.equal(true)
  })

  it('cancelEdit sets editing correctly', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    wrapper.vm.enableEdit()

    expect(wrapper.vm.editing).to.equal(true)

    wrapper.vm.cancelEdit()

    expect(wrapper.vm.editing).to.equal(false)
  })

  it('toggleDeleteMode sets delete mode correctly', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    wrapper.vm.toggleDeleteMode()

    expect(wrapper.vm.pendingDelete).to.equal(true)

    wrapper.vm.toggleDeleteMode()

    expect(wrapper.vm.pendingDelete).to.equal(false)
  })

  it('confirmDeleteNote works as expected', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    const deleteNoteStub = sinon.stub(wrapper.vm, 'deleteNote').resolves()

    return wrapper.vm.confirmDeleteNote().then(() => {
      expect(deleteNoteStub.calledWith(2)).to.equal(true)

      deleteNoteStub.restore()
    })
  })

  it('confirmDeleteNote shows a toast on error', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    const deleteNoteStub = sinon.stub(wrapper.vm, 'deleteNote').rejects()
    const toastrSpy = sinon.spy(helpers.toastr, 'error')

    return wrapper.vm.confirmDeleteNote().then(() => {
      expect(toastrSpy.calledWith(`There was an error deleting the note.`, 'Error')).to.equal(true)

      deleteNoteStub.restore()
      toastrSpy.restore()
    })
  })

  it('saveNote works as expected', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    const editNoteStub = sinon.stub(wrapper.vm, 'editNote').resolves()

    return wrapper.vm.saveNote().then(() => {
      expect(editNoteStub.calledWith({ message: 'Foo Note', id: 2 })).to.equal(true)

      editNoteStub.restore()
    })
  })

  it('saveNote resets correctly on error', () => {
    const wrapper = mount(ModalNote, { propsData: testData, store, router })

    const editNoteStub = sinon.stub(wrapper.vm, 'editNote').rejects()
    const toastrSpy = sinon.spy(helpers.toastr, 'error')
    const cancelEditSpy = sinon.spy(wrapper.vm, 'cancelEdit')

    return wrapper.vm.saveNote().then(() => {
      expect(cancelEditSpy.called).to.equal(true)
      expect(toastrSpy.calledWith(`There was an error updating the note.`, 'Error')).to.equal(true)

      editNoteStub.restore()
      toastrSpy.restore()
      cancelEditSpy.restore()
    })
  })
})
