import { isLoggedIn, attemptLogin, logout, getUser, getToken, expireInvalidLogins } from '@/helpers/authentication'
import store from '@/store'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import moment from 'moment'

describe('helpers/authentication.js', function () {
  before(function () {
    this.initialState = store.state
  })

  after(function () {
    store.replaceState(this.initialState)
  })

  afterEach(function () {
    store.replaceState(this.initialState)
  })

  it('isLoggedIn', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: false
          }
        )
      })
    )

    expect(isLoggedIn()).to.eql(false)

    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: true
          }
        )
      })
    )

    expect(isLoggedIn()).to.eql(true)
  })

  it('attemptLogin', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: false
          }
        )
      })
    )
    const mock = new MockAdapter(axios)
    mock.onPost('/api/login').reply(200, { id: 1, name: 'Foo User' })

    expect(store.state.auth.loginStatus).to.equal(false)
    expect(store.state.auth.user).to.eql({})

    const result = attemptLogin('foo@bar.com', 'foobar')
    result.then(() => {
      expect(store.state.auth.loginStatus).to.equal(true)
      expect(store.state.auth.user).to.eql({ id: 1, name: 'Foo User' })
    })
  })

  it('logout', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: true,
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    logout()

    expect(store.state.auth.loginStatus).to.eql(false)
    expect(store.state.auth.user).to.eql({})
  })

  it('getUser', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    expect(getUser()).to.eql({ id: 1, name: 'Foo User', api_token: 'bartoken' })
  })

  it('getToken with no user set', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            user: {}
          }
        )
      })
    )

    expect(getToken()).to.eql('')
  })

  it('getToken with user set', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    expect(getToken()).to.eql('bartoken')
  })

  it('expireInvalidLogins if expiry date is in the past', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: true,
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    localStorage.setItem('loginExpires', moment().subtract(25, 'hours'))

    expireInvalidLogins()

    expect(store.state.auth.loginStatus).to.equal(false)
    expect(store.state.auth.user).to.eql({})
  })

  it('expireInvalidLogins does nothing if expiry date is in the future', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: true,
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    localStorage.setItem('loginExpires', moment().add(25, 'hours'))

    expireInvalidLogins()

    expect(store.state.auth.loginStatus).to.equal(true)
    expect(store.state.auth.user).to.eql({ id: 1, name: 'Foo User', api_token: 'bartoken' })
  })

  it('expireInvalidLogins does nothing if expiry date is not set', function () {
    store.replaceState(Object.assign(this.initialState,
      {
        auth: Object.assign(this.initialState.auth,
          {
            loginStatus: true,
            user: { id: 1, name: 'Foo User', api_token: 'bartoken' }
          }
        )
      })
    )

    localStorage.removeItem('loginExpires')

    expireInvalidLogins()

    expect(store.state.auth.loginStatus).to.equal(true)
    expect(store.state.auth.user).to.eql({ id: 1, name: 'Foo User', api_token: 'bartoken' })
  })
})
