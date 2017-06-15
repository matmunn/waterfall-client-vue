import { mutations, getters, actions } from '@/store/modules/categories'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { SET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } = mutations

describe('store/modules/categories.js', () => {
  describe('MUTATIONS', () => {
    it('SET_CATEGORIES', () => {
      const state = { categories: [{ name: 'Baz' }] }

      SET_CATEGORIES(state, [{ name: 'Foo' }, { name: 'Bar' }])

      expect(state.categories).to.include({ name: 'Foo' })
      expect(state.categories).to.include({ name: 'Bar' })
      expect(state.categories).to.not.include({ name: 'Baz' })
    })

    it('ADD_CATEGORY', () => {
      const state = { categories: [{ name: 'Baz' }] }

      ADD_CATEGORY(state, { name: 'Foo' })

      expect(state.categories).to.include({ name: 'Foo' })
      expect(state.categories).to.include({ name: 'Baz' })
    })

    it('UPDATE_CATEGORY', () => {
      const state = { categories: [{ id: 1, name: 'Baz' }] }

      UPDATE_CATEGORY(state, { id: 1, name: 'Foo' })

      expect(state.categories).to.include({ id: 1, name: 'Foo' })
      expect(state.categories).to.not.include({ id: 1, name: 'Baz' })
    })

    it('DELETE_CATEGORY', () => {
      const state = { categories: [{ id: 1, name: 'Baz' }] }

      DELETE_CATEGORY(state, 1)

      expect(state.categories).to.deep.equal([])
    })
  })

  describe('GETTERS', () => {
    it('categories', () => {
      const state = { categories: [{ name: 'Foo' }, { name: 'Bar' }] }

      const result = getters.categories(state)

      expect(result).to.deep.equal([{ name: 'Foo' }, { name: 'Bar' }])
    })

    it('category', () => {
      const state = {
        categories: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' }
        ]
      }

      const result = getters.category(state, getters)(2)

      expect(result).to.deep.equal({ id: 2, name: 'Bar' })
    })

    it('displayCategories', () => {
      const state = {
        categories: [
          {
            name: 'Foo',
            display_in_list: true
          },
          {
            name: 'Bar',
            display_in_list: false
          }
        ]
      }

      const result = getters.displayCategories(state)

      expect(result).to.deep.equal([{ name: 'Foo', display_in_list: true }])
    })
  })

  describe('ACTIONS', () => {
    it('getAllCategories successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/categories').reply(200, [{ id: 1, description: 'Foo Category' }])
      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_CATEGORIES')
          expect(payload).to.eql([{ id: 1, description: 'Foo Category' }])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getAllCategories({ commit })

      result.should.eventually.equal(true).notify(done)
    })

    it('getAllCategories rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/categories').reply(201)
      const commit = (type, payload) => {}

      return actions.getAllCategories({ commit }).should.be.rejected
    })

    it('getAllCategories rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet('/api/categories').reply(404)
      const commit = (type, payload) => {}

      return actions.getAllCategories({ commit }).should.be.rejected
    })

    it('addCategory successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/category').reply(201)
      const commit = (type, payload) => {}

      const result = actions.addCategory({ commit })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('addCategory rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/category').reply(200)
      const commit = (type, payload) => {}

      return actions.addCategory({ commit }).should.be.rejected
    })

    it('addCategory rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/api/category').reply(404)
      const commit = (type, payload) => {}

      return actions.addCategory({ commit }).should.be.rejected
    })

    it('editCategory successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/category/1').reply(200)
      const commit = (type, payload) => {}

      const result = actions.editCategory({ commit }, { id: 1, description: 'Foo' })
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('editCategory rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/category/1').reply(201)
      const commit = (type, payload) => {}

      return actions.editCategory({ commit }, { id: 1, description: 'Foo' }).should.be.rejected
    })

    it('editCategory rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch('/api/category/1').reply(404)
      const commit = (type, payload) => {}

      return actions.editCategory({ commit }, { id: 1, description: 'Foo' }).should.be.rejected
    })

    it('deleteCategory successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/category/1').reply(200)
      const commit = (type, payload) => {}

      const result = actions.deleteCategory({ commit }, 1)
      return result.should.be.fulfilled && result.should.eventually.equal(true)
    })

    it('deleteCategory rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/category/1').reply(201)
      const commit = (type, payload) => {}

      return actions.deleteCategory({ commit }, 1).should.be.rejected
    })

    it('deleteCategory rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete('/api/category/1').reply(404)
      const commit = (type, payload) => {}

      return actions.deleteCategory({ commit }, 1).should.be.rejected
    })
  })
})
