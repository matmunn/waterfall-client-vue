import { getCategory, getUser, getClient, getNotes, getTask } from '@/helpers/helpers'
import store from '@/store'

describe('helpers/helpers.js', () => {
  before(function () {
    this.initialState = store.state
  })

  after(function () {
    store.replaceState(this.initialState)
  })

  it('getCategory returns item that exists', () => {
    store.replaceState(Object.assign(store.state,
      {
        categories: {
          categories: [
            { id: 1, description: 'Foo Bar' }
          ]
        }
      })
    )

    expect(getCategory(1)).to.eql({ id: 1, description: 'Foo Bar' })
  })

  it(`getCategory returns empty object for item that doesn't exist`, () => {
    store.replaceState(Object.assign(store.state,
      {
        categories: {
          categories: [
            { id: 1, description: 'Foo Bar' }
          ]
        }
      })
    )

    expect(getCategory(2)).to.eql({})
  })

  it('getUser returns item that exists', () => {
    store.replaceState(Object.assign(store.state,
      {
        users: {
          users: [
            { id: 2, name: 'Foo User' }
          ]
        }
      })
    )

    expect(getUser(2)).to.eql({ id: 2, name: 'Foo User' })
  })

  it(`getUser returns empty object for item that doesn't exist`, () => {
    store.replaceState(Object.assign(store.state,
      {
        users: {
          users: [
            { id: 2, name: 'Foo User' }
          ]
        }
      })
    )

    expect(getUser(1)).to.eql({})
  })

  it('getClient returns item that exists', () => {
    store.replaceState(Object.assign(store.state,
      {
        clients: {
          clients: [
            { id: 3, name: 'Bar Client' }
          ]
        }
      })
    )

    expect(getClient(3)).to.eql({ id: 3, name: 'Bar Client' })
  })

  it(`getClient returns empty object for item that doesn't exist`, () => {
    store.replaceState(Object.assign(store.state,
      {
        clients: {
          clients: [
            { id: 3, name: 'Bar Client' }
          ]
        }
      })
    )

    expect(getClient(1)).to.eql({})
  })

  it('getNotes returns item that exists', () => {
    store.replaceState(Object.assign(store.state,
      {
        notes: {
          notes: [
            { id: 3, name: 'Note 1', entry_id: 4 },
            { id: 2, name: 'Note 2', entry_id: 2 },
            { id: 1, name: 'Note 3', entry_id: 4 }
          ]
        }
      })
    )

    expect(getNotes(4).length).to.equal(2)
    expect(getNotes(4)).to.eql([
      { id: 3, name: 'Note 1', entry_id: 4 },
      { id: 1, name: 'Note 3', entry_id: 4 }
    ])
  })

  it(`getNotes returns empty array for item that doesn't exist`, () => {
    store.replaceState(Object.assign(store.state,
      {
        notes: {
          notes: [
            { id: 3, name: 'Note 1', entry_id: 4 },
            { id: 2, name: 'Note 2', entry_id: 2 },
            { id: 1, name: 'Note 3', entry_id: 4 }
          ]
        }
      })
    )

    expect(getNotes(1)).to.eql([])
  })

  it('getTask returns item that exists', () => {
    store.replaceState(Object.assign(store.state,
      {
        tasks: {
          tasks: [
            { id: 5, name: 'Baz Client' }
          ]
        }
      })
    )

    expect(getTask(5)).to.eql({ id: 5, name: 'Baz Client' })
  })

  it(`getTask returns empty object for item that doesn't exist`, () => {
    store.replaceState(Object.assign(store.state,
      {
        tasks: {
          tasks: [
            { id: 5, name: 'Baz Client' }
          ]
        }
      })
    )

    expect(getTask(1)).to.eql({})
  })
})
