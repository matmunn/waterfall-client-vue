import { mutations, getters, actions } from '@/store/modules/users'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { SET_USERS, ADD_USER, UPDATE_USER, DELETE_USER } = mutations

describe('store/modules/users.js', () => {
  describe('MUTATIONS', () => {
    it('SET_USERS', () => {
      const state = {
        users: []
      }

      SET_USERS(state, [{ id: 1, name: 'Foo' }])

      expect(state.users.length).to.equal(1)
      expect(state.users).to.eql([{ id: 1, name: 'Foo' }])
    })

    it('ADD_USER', () => {
      const state = {
        users: [
          { id: 1, name: 'Foo' }
        ]
      }

      ADD_USER(state, { id: 2, name: 'Bar' })

      expect(state.users.length).to.equal(2)
      expect(state.users).to.include({ id: 2, name: 'Bar' })
    })

    it('UPDATE_USER', () => {
      const state = {
        users: [{ id: 1, name: 'Foo' }]
      }

      UPDATE_USER(state, { id: 1, name: 'Bar' })

      expect(state.users).to.eql([{ id: 1, name: 'Bar' }])
    })

    it('DELETE_USER', () => {
      const state = {
        users: [{ id: 1, name: 'Foo' }]
      }

      DELETE_USER(state, 1)

      expect(state.users.length).to.equal(0)
    })
  })

  describe('GETTERS', () => {
    it('users', () => {
      const state = {
        users: [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }]
      }

      const result = getters.users(state)

      expect(result.length).to.equal(2)
      expect(result).to.eql([{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }])
    })

    it('categoryUsers', () => {
      const state = {
        users: [
          { id: 1, name: 'Foo', category_id: 3 },
          { id: 2, name: 'Bar', category_id: 4 }
        ]
      }

      const result = getters.categoryUsers(state, getters)(3)

      expect(result.length).to.equal(1)
      expect(result).to.eql([{ id: 1, name: 'Foo', category_id: 3 }])
    })

    it('user', () => {
      const state = {
        users: [
          { id: 1, name: 'Foo', category_id: 3 },
          { id: 2, name: 'Bar', category_id: 4 }
        ]
      }

      const result = getters.user(state, getters)(2)

      expect(result).to.eql({ id: 2, name: 'Bar', category_id: 4 })
    })
  })

  describe('ACTIONS', () => {
    it('getAllUsers successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/users').reply(200, [{ id: 1, name: 'Foo' }])
      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_USERS')
          expect(payload).to.eql([{ id: 1, name: 'Foo' }])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getAllUsers({ commit })
      Promise.all([
        result.should.be.fulfilled,
        result.should.eventually.equal(true)
      ]).should.notify(done)
    })

    it('getAllUsers rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/users').reply(201)
      const commit = (type, payload) => {}

      return actions.getAllUsers({ commit }).should.be.rejected
    })

    it('getAllUsers rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/users').reply(404)
      const commit = (type, payload) => {}

      return actions.getAllUsers({ commit }).should.be.rejected
    })

    it('addUser successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/user').reply(201)
      const commit = (type, payload) => {}

      const result = actions.addUser({ commit }, { name: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('addUser rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/user').reply(200)
      const commit = (type, payload) => {}

      return actions.addUser({ commit }, { name: 'Foo' }).should.be.rejected
    })

    it('addUser rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/user').reply(404)
      const commit = (type, payload) => {}

      return actions.addUser({ commit }, { name: 'Foo' }).should.be.rejected
    })

    it('editUser successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/user/1').reply(200)
      const commit = (type, payload) => {}

      const result = actions.editUser({ commit }, { id: 1, name: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('editUser rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/user/1').reply(201)
      const commit = (type, payload) => {}

      return actions.editUser({ commit }, { id: 1, name: 'Foo' }).should.be.rejected
    })

    it('editUser rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/user/1').reply(404)
      const commit = (type, payload) => {}

      return actions.editUser({ commit }, { id: 1, name: 'Foo' }).should.be.rejected
    })

    it('deleteUser successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/user/1').reply(200)
      const commit = (type, payload) => {}

      const result = actions.deleteUser({ commit }, 1)
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('deleteUser rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/user/1').reply(201)
      const commit = (type, payload) => {}

      return actions.deleteUser({ commit }, 1).should.be.rejected
    })

    it('deleteUser rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/user/1').reply(404)
      const commit = (type, payload) => {}

      return actions.deleteUser({ commit }, 1).should.be.rejected
    })
  })
})
