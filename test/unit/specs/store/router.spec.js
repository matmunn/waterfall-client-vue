import { mutations, getters } from '@/store/modules/router'

const { SET_NEXT_ROUTE, CLEAR_NEXT_ROUTE } = mutations

describe('store/modules/router.js', () => {
  describe('MUTATIONS', () => {
    it('SET_NEXT_ROUTE', () => {
      const state = {
        nextRoute: null
      }

      SET_NEXT_ROUTE(state, 'foo')

      expect(state.nextRoute).to.equal('foo')
    })

    it('CLEAR_NEXT_ROUTE', () => {
      const state = {
        nextRoute: 'foo'
      }

      CLEAR_NEXT_ROUTE(state)

      expect(state.nextRoute).to.eql(null)
    })
  })

  describe('GETTERS', () => {
    it('nextRoute', () => {
      const state = {
        nextRoute: 'foo'
      }

      const result = getters.nextRoute(state)

      expect(result).to.equal('foo')
    })
  })
})
