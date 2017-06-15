import { mutations, getters } from '@/store/modules/misc'
const { SET_NOTIFICATION_PERMISSION } = mutations

describe('store/modules/misc.js', () => {
  describe('MUTATIONS', () => {
    it('SET_NOTIFICATION_PERMISSION', () => {
      const state = {
        notificationPermission: false
      }

      SET_NOTIFICATION_PERMISSION(state, true)

      expect(state.notificationPermission).to.equal(true)
    })
  })

  describe('GETTERS', () => {
    it('notificationPermission', () => {
      const state = {
        notificationPermission: false
      }

      const result = getters.notificationPermission(state)

      expect(result).to.equal(false)
    })
  })
})
