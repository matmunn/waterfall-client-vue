import Vue from 'vue'
import NoteModal from '@/components/NoteModal'
import toastr from 'toastr'

const testData = {
  task: {
    id: 1,
    description: 'Foo Task'
  }
}

describe('components/NoteModal.vue', () => {
  it('inital data should be set correctly', () => {
    const Ctor = Vue.extend(NoteModal)
    const vm = new Ctor({ propsData: testData }).$mount()

    const result = vm.$options.data()

    expect(result).to.eql({
      noteMessage: '',
      id: 'modal1',
      loading: false
    })
  })

  it('saveNote work correctly', () => {
    const Ctor = Vue.extend(NoteModal)
    const vm = new Ctor({ propsData: testData }).$mount()

    const addNoteStub = sinon.stub(vm, 'addNote').resolves()

    vm.noteMessage = 'This is a message'

    return vm.saveNote().then(() => {
      expect(vm.loading).to.equal(false)
      expect(vm.noteMessage).to.equal('')

      addNoteStub.restore()
    })
  })

  it('saveNote shows a toast on error', () => {
    const Ctor = Vue.extend(NoteModal)
    const vm = new Ctor({ propsData: testData }).$mount()

    const addNoteStub = sinon.stub(vm, 'addNote').rejects()
    const toastrSpy = sinon.spy(toastr, 'error')

    return vm.saveNote().then(() => {
      expect(toastrSpy.calledWith('There was an error while submitting your request', 'Error')).to.equal(true)

      addNoteStub.restore()
      toastrSpy.restore()
    })
  })
})
