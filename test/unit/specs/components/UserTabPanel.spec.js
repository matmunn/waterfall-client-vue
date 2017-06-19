// import UserTabPanel from '@/components/UserTabPanel'
// import Auth from 'Auth'
// import { mount } from 'avoriaz'
// import store from '@/store'
// import router from '@/router'

// const testData = {
//   category: {
//     id: 1,
//     description: 'Foo Category'
//   }
// }

// describe('components/UserTabPanel.vue', () => {
//   it('initial data should be set correctly', () => {
//     const wrapper = mount(UserTabPanel, { propsData: testData, store, router })

//     expect(wrapper.data()).to.eql({
//       activeTab: 0
//     })
//   })

//   it('isActiveUserCategory generates correct response if logged in and category matches', () => {
//     const isLoggedInStub = sinon.stub(Auth, 'isLoggedIn').returns(true)
//     const getUserStub = sinon.stub(Auth, 'getUser').returns({
//       id: 1,
//       name: 'Bar User',
//       category_id: 1
//     })

//     const wrapper = mount(UserTabPanel, { propsData: testData, store, router })

//     expect(wrapper.vm.isActiveUserCategory).to.equal('active')

//     isLoggedInStub.restore()
//     getUserStub.restore()
//   })

  // it(`isActiveUserCategory generates nothing if logged in and category doesn't match`, () => {
  //   const isLoggedInStub = sinon.stub(Auth, 'isLoggedIn').returns(true)
  //   const getUserStub = sinon.stub(Auth, 'getUser').returns({
  //     id: 1,
  //     name: 'Bar User',
  //     category_id: 2
  //   })

  //   const wrapper = mount(UserTabPanel, { propsData: testData, store, router })

  //   expect(wrapper.vm.isActiveUserCategory).to.equal('')

  //   isLoggedInStub.restore()
  //   getUserStub.restore()
  // })

  // it(`isActiveUserCategory generates nothing if not logged in`, () => {
  //   const isLoggedInStub = sinon.stub(Auth, 'isLoggedIn').returns(false)

  //   const wrapper = mount(UserTabPanel, { propsData: testData, router, store })

  //   expect(wrapper.vm.isActiveUserCategory).to.equal('')

  //   isLoggedInStub.restore()
  // })
// })
