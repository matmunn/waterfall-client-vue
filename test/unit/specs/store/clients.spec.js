import config from 'Config'
import { mutations, getters, actions } from '@/store/modules/clients'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { SET_CLIENTS, ADD_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } = mutations

describe('store/modules/clients.js', () => {
  describe('MUTATIONS', () => {
    it('SET_CLIENTS', () => {
      const state = {
        clients: []
      }

      SET_CLIENTS(state, [
        { name: 'Foo' },
        { name: 'Bar' }
      ])

      expect(state.clients).to.deep.equal([{ name: 'Foo' }, { name: 'Bar' }])
    })

    it('ADD_CLIENT', () => {
      const state = {
        clients: [{ name: 'Foo' }]
      }

      ADD_CLIENT(state, { name: 'Bar' })

      expect(state.clients.length).to.equal(2)
      expect(state.clients).to.include({ name: 'Bar' })
    })

    it('UPDATE_CLIENT', () => {
      const state = {
        clients: [
          {
            id: 1,
            name: 'Foo'
          }
        ]
      }

      UPDATE_CLIENT(state, { id: 1, name: 'Bar' })

      expect(state.clients.length).to.equal(1)
      expect(state.clients).to.deep.equal([{ id: 1, name: 'Bar' }])
    })

    it('DELETE_CLIENT', () => {
      const state = {
        clients: [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }]
      }

      DELETE_CLIENT(state, 2)

      expect(state.clients.length).to.equal(1)
      expect(state.clients).to.deep.equal([{ id: 1, name: 'Foo' }])
    })
  })

  describe('GETTERS', () => {
    it('clients', () => {
      const state = {
        clients: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' }
        ]
      }

      const result = getters.clients(state)

      expect(result).to.deep.equal([{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }])
    })

    it('client', () => {
      const state = {
        clients: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' }
        ]
      }

      const result = getters.client(state, getters)(1)

      expect(result).to.deep.equal({ id: 1, name: 'Foo' })
    })
  })

  describe('ACTIONS', () => {
    it('getAllClients successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/clients`).reply(200, [{ id: 1, name: 'Foo' }])
      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_CLIENTS')
          expect(payload).to.eql([{ id: 1, name: 'Foo' }])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getAllClients({ commit })

      Promise.all([
        result.should.eventually.equal(true),
        result.should.be.fulfilled
      ]).should.notify(done)
    })

    it('getAllClients rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/clients`).reply(201)
      const commit = (type, payload) => {}

      return actions.getAllClients({ commit }).should.be.rejected
    })

    it('getAllClients rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/clients`).reply(404)
      const commit = (type, payload) => {}

      return actions.getAllClients({ commit }).should.be.rejected
    })

    it('addClient successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/client`).reply(201)
      const commit = (type, payload) => {}

      const result = actions.addClient({ commit }, { name: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('addClient rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/client`).reply(200)
      const commit = (type, payload) => {}

      return actions.addClient({ commit }, { name: 'Foo' }).should.be.rejected
    })

    it('addClient rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/client`).reply(404)
      const commit = (type, payload) => {}

      return actions.addClient({ commit }, { name: 'Foo' }).should.be.rejected
    })

    it('editClient successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/client/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.editClient({ commit }, { id: 1, name: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('editClient rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/client/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.editClient({ commit }, { id: 1, name: 'Foo' }).should.be.rejected
    })

    it('editClient rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/client/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.editClient({ commit }, { id: 1, name: 'Foo' }).should.be.rejected
    })

    it('deleteClient successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/client/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.deleteClient({ commit }, 1)
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('deleteClient rejects on unexpected HTTP status code', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/client/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.deleteClient({ commit }, 1).should.be.rejected
    })

    it('deleteClient rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/client/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.deleteClient({ commit }, 1).should.be.rejected
    })
  })
})
