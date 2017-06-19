import config from 'Config'
import { mutations, getters, actions } from '@/store/modules/auth'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { LOGIN, LOGOUT } = mutations

describe('store/modules/auth.js', () => {
  describe('MUTATIONS', () => {
    it('LOGIN', () => {
      const state = { loginStatus: false, user: {} }

      LOGIN(state, { name: 'Foo Bar' })

      expect(state.loginStatus).to.equal(true)
      expect(state.user.name).to.equal('Foo Bar')
    })

    it('LOGOUT', () => {
      const state = { loginStatus: true, user: { name: 'Foo Bar' } }

      LOGOUT(state)

      expect(state.loginStatus).to.equal(false)
      expect(state.user).to.deep.equal({})
    })
  })

  describe('GETTERS', () => {
    it('loginStatus', () => {
      const state = {
        loginStatus: false
      }

      const result = getters.loginStatus(state)

      expect(result).to.equal(false)
    })

    it('authUser', () => {
      const state = {
        user: {
          id: 1,
          name: 'Foo Bar'
        }
      }

      const result = getters.authUser(state)

      expect(result).to.deep.equal({ id: 1, name: 'Foo Bar' })
    })
  })

  describe('ACTIONS', () => {
    it('attemptLogin successfully', done => {
      const mock = new MockAdapter(axios)

      const payload = { id: 1, name: 'Foo Bar' }

      mock.onPost(`${config.apiHost}/api/login`).reply(200, payload)

      const commit = (type, payload) => {
        try {
          expect(type).to.equal('LOGIN')
          expect(payload).to.eql(payload)
        } catch (error) {
          done(error)
        }
      }

      const result = actions.attemptLogin({ commit }, { email: 'foo@bar.com', password: 'foo' })

      Promise.all([
        result.should.be.fulfilled,
        result.should.eventually.equal(payload)
      ]).should.notify(done)
    })

    it('attemptLogin rejects on unexpected HTTP status code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/login`).reply(201)
      const commit = (type, payload) => {}

      return actions.attemptLogin({ commit }).should.be.rejected
    })

    it('attemptLogin rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/login`).reply(404)
      const commit = (type, payload) => {}

      return actions.attemptLogin({ commit }).should.be.rejected
    })

    it('logout successfully', done => {
      const commit = (type, payload) => {
        try {
          expect(type).to.equal('LOGOUT')
        } catch (error) {
          done(error)
        }
      }

      const result = actions.logout({ commit })

      result.should.be.fulfilled.notify(done)
    })
  })
})
