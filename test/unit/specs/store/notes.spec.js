import config from 'Config'
import { mutations, getters, actions } from '@/store/modules/notes'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { SET_NOTES, ADD_NOTE, UPDATE_NOTE, DELETE_NOTE } = mutations

describe('store/modules/notes.js', () => {
  describe('MUTATIONS', () => {
    it('SET_NOTES', () => {
      const state = {
        notes: []
      }

      SET_NOTES(state, [
        { id: 1, description: 'Foo' },
        { id: 2, description: 'Bar' }
      ])

      expect(state.notes).to.eql([{ id: 1, description: 'Foo' }, { id: 2, description: 'Bar' }])
    })

    it('ADD_NOTE', () => {
      const state = {
        notes: [{ id: 1, description: 'Foo' }]
      }

      ADD_NOTE(state, { id: 2, description: 'Bar' })

      expect(state.notes.length).to.equal(2)
      expect(state.notes).to.eql([{ id: 2, description: 'Bar' }, { id: 1, description: 'Foo' }])
    })

    it('UPDATE_NOTE', () => {
      const state = {
        notes: [{ id: 1, description: 'Foo' }]
      }

      UPDATE_NOTE(state, { id: 1, description: 'Bar' })

      expect(state.notes).to.eql([{ id: 1, description: 'Bar' }])
    })

    it('DELETE_NOTE', () => {
      const state = {
        notes: [{ id: 1, description: 'Foo' }]
      }

      DELETE_NOTE(state, 1)

      expect(state.notes.length).to.equal(0)
    })
  })

  describe('GETTERS', () => {
    it('notes', () => {
      const state = {
        notes: [{ id: 1, description: 'Foo' }]
      }

      const result = getters.notes(state)
      expect(result.length).to.equal(1)
      expect(result).to.eql([{ id: 1, description: 'Foo' }])
    })

    it('taskNotes', () => {
      const state = {
        notes: [
          { id: 1, description: 'Foo', entry_id: 1 },
          { id: 2, description: 'Bar', entry_id: 2 }
        ]
      }

      const result = getters.taskNotes(state, getters)(1)
      expect(result.length).to.equal(1)
      expect(result).to.eql([{ id: 1, description: 'Foo', entry_id: 1 }])
    })
  })

  describe('ACTIONS', () => {
    it('getAllNotes successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/notes`).reply(200, [{ id: 1, description: 'Foo', entry_id: 1 }])
      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_NOTES')
          expect(payload).to.eql([{ id: 1, description: 'Foo', entry_id: 1 }])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getAllNotes({ commit })
      Promise.all([
        result.should.be.fulfilled,
        result.should.eventually.equal(1)
      ]).should.notify(done)
    })

    it('getAllNotes rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/notes`).reply(201)
      const commit = (type, payload) => {}

      return actions.getAllNotes({ commit }).should.be.rejected
    })

    it('getAllNotes rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/notes`).reply(404)
      const commit = (type, payload) => {}

      return actions.getAllNotes({ commit }).should.be.rejected
    })

    it('addNote successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/note`).reply(201)
      const commit = (type, payload) => {}

      const result = actions.addNote({ commit }, { description: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('addNote rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/note`).reply(200)
      const commit = (type, payload) => {}

      return actions.addNote({ commit }, { description: 'Foo' }).should.be.rejected
    })

    it('addNote rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/note`).reply(404)
      const commit = (type, payload) => {}

      return actions.addNote({ commit }, { description: 'Foo' }).should.be.rejected
    })

    it('editNote successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/note/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.editNote({ commit }, { id: 1, description: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('editNote rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/note/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.editNote({ commit }, { id: 1, description: 'Foo' }).should.be.rejected
    })

    it('editNote rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/note/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.editNote({ commit }, { id: 1, description: 'Foo' }).should.be.rejected
    })

    it('deleteNote successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/note/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.deleteNote({ commit }, 1)
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('deleteNote rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/note/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.deleteNote({ commit }, 1).should.be.rejected
    })

    it('deleteNote rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/note/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.deleteNote({ commit }, 1).should.be.rejected
    })
  })
})
