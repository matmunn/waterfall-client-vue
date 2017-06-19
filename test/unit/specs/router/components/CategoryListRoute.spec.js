import CategoryListRoute from '@/router/routeComponents/admin/CategoryListRoute'
import { mount } from 'avoriaz'
import store from '@/store'
import router from '@/router'

describe('router/routeComponents/admin/CategoryListRoute.vue', () => {
  it('gets all categories when created', () => {
    const categoriesSpy = sinon.spy(CategoryListRoute.methods, 'getAllCategories')

    mount(CategoryListRoute, { store, router })

    expect(categoriesSpy.called).to.equal(true)

    categoriesSpy.restore()
  })
})
