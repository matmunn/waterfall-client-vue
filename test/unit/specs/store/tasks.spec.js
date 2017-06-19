import config from 'Config'
import { mutations, getters, actions } from '@/store/modules/tasks'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const { SET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, SET_TASK_COMPLETE_STATUS } = mutations

describe('store/modules/tasks.js', () => {
  describe('MUTATIONS', () => {
    it('SET_TASKS', () => {
      const state = {
        tasks: [
          { id: 1, description: 'Foo Bar' }
        ]
      }

      SET_TASKS(state, [{ id: 2, description: 'Bar Baz' }, { id: 3, description: 'Baz Foo' }])

      expect(state.tasks.length).to.equal(2)
      expect(state.tasks).to.not.include({ id: 1, description: 'Foo Bar' })
    })

    it('ADD_TASK', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Foo Bar'
          }
        ]
      }

      ADD_TASK(state, { id: 2, description: 'Bar Baz' })

      expect(state.tasks.length).to.equal(2)
      expect(state.tasks).to.include({ id: 2, description: 'Bar Baz' })
    })

    it('UPDATE_TASK', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Foo Bar'
          }
        ]
      }

      UPDATE_TASK(state, { id: 1, description: 'Baz Bar' })

      expect(state.tasks).to.deep.equal([{ id: 1, description: 'Baz Bar' }])
    })

    it('DELETE_TASK', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Foo Bar'
          }
        ]
      }

      DELETE_TASK(state, 1)

      expect(state.tasks.length).to.equal(0)
    })

    it('SET_TASK_COMPLETE_STATUS', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Foo Bar',
            completed: false
          }
        ]
      }

      SET_TASK_COMPLETE_STATUS(state, { taskId: 1, status: true })

      expect(state.tasks).to.eql([{ id: 1, description: 'Foo Bar', completed: true }])

      SET_TASK_COMPLETE_STATUS(state, { taskId: 5, status: false })

      expect(state.tasks).to.eql([{ id: 1, description: 'Foo Bar', completed: true }])
    })
  })

  describe('GETTERS', () => {
    it('tasks', () => {
      const state = {
        tasks: [
          { id: 1, description: 'Foo Bar' },
          { id: 2, description: 'Baz Bar' }
        ]
      }

      const result = getters.tasks(state)

      expect(result.length).to.equal(2)
      expect(result).to.deep.equal([{ id: 1, description: 'Foo Bar' }, { id: 2, description: 'Baz Bar' }])
    })

    it('task', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Foo Bar'
          },
          {
            id: 2,
            description: 'Baz Bar'
          }
        ]
      }

      const result = getters.task(state, getters)(2)

      expect(result).to.deep.equal({ id: 2, description: 'Baz Bar' })
    })

    it('sortedTasksWithDate', () => {
      const state = {
        tasks: [
          {
            user_id: 1,
            description: 'Foo',
            start_date: '2017-01-01 11:00:00',
            end_date: '2017-01-01 12:00:00'
          },
          {
            user_id: 2,
            description: 'Bar',
            start_date: '2017-01-01 10:00:00',
            end_date: '2017-01-01 11:00:00'
          },
          {
            user_id: 1,
            description: 'Baz',
            start_date: '2017-01-03 11:00:00',
            end_date: '2017-01-03 12:00:00'
          }
        ]
      }

      const result = getters.sortedTasksWithDate(state, getters)('2017-01-01', '2017-01-02')

      expect(result.length).to.equal(2)
      expect(result).to.eql([
        {
          user_id: 2,
          description: 'Bar',
          start_date: '2017-01-01 11:00:00',
          end_date: '2017-01-01 12:00:00'
        },
        {
          user_id: 1,
          description: 'Foo',
          start_date: '2017-01-01 11:00:00',
          end_date: '2017-01-01 12:00:00'
        }
      ])
    })

    it('sortedTasks', () => {
      const state = {
        tasks: [
          {
            id: 1,
            description: 'Item 1',
            completed: false,
            start_date: '2017-01-01 10:00:00'
          },
          {
            id: 2,
            description: 'Item 2',
            completed: true,
            start_date: '2017-01-01 12:00:00'
          },
          {
            id: 3,
            description: 'Item 3',
            completed: false,
            start_date: '2017-01-01 09:00:00'
          },
          {
            id: 4,
            description: 'Item 4',
            completed: true,
            start_date: '2017-01-01 11:00:00'
          }
        ]
      }
      const result = getters.sortedTasks(state)

      expect(result).to.eql([
        {
          id: 3,
          description: 'Item 3',
          completed: false,
          start_date: '2017-01-01 09:00:00'
        },
        {
          id: 1,
          description: 'Item 1',
          completed: false,
          start_date: '2017-01-01 10:00:00'
        },
        {
          id: 4,
          description: 'Item 4',
          completed: true,
          start_date: '2017-01-01 11:00:00'
        },
        {
          id: 2,
          description: 'Item 2',
          completed: true,
          start_date: '2017-01-01 12:00:00'
        }
      ])
    })

    it('userTasks', () => {
      const state = {
        tasks: [
          {
            user_id: 1,
            description: 'Foo',
            start_date: '2017-01-01 11:00:00',
            end_date: '2017-01-01 12:00:00'
          },
          {
            user_id: 2,
            description: 'Bar',
            start_date: '2017-01-01 11:00:00',
            end_date: '2017-01-01 12:00:00'
          },
          {
            user_id: 1,
            description: 'Baz',
            start_date: '2017-01-03 11:00:00',
            end_date: '2017-01-03 12:00:00'
          }
        ]
      }

      const result = getters.userTasks(state, getters)(1, '2017-01-01', '2017-01-02')

      expect(result.length).to.equal(1)
      expect(result).to.eql([{ user_id: 1, description: 'Foo', start_date: '2017-01-01 11:00:00', end_date: '2017-01-01 12:00:00' }])
    })
  })

  describe('ACTIONS', () => {
    it('getAllTasks successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks`).reply(200, [ { id: 1, description: 'Foo' } ])

      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_TASKS')
          expect(payload).to.eql([ { id: 1, description: 'Foo' } ])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getAllTasks({ commit })

      Promise.all([
        result.should.be.fulfilled,
        result.should.eventually.equal(1)
      ]).should.notify(done)
    })

    it('getAllTasks rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks`).reply(201)
      const commit = (type, payload) => {}

      return actions.getAllTasks({ commit }).should.be.rejected
    })

    it('getAllTasks rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks`).reply(404)
      const commit = (type, payload) => {}

      return actions.getAllTasks({ commit }).should.be.rejected
    })

    it('getTasksBetweenDates successfully', done => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks/2017-01-01/2017-01-03`).reply(200, [ { id: 1, description: 'Foo' } ])

      const commit = (type, payload) => {
        try {
          expect(type).to.equal('SET_TASKS')
          expect(payload).to.eql([ { id: 1, description: 'Foo' } ])
        } catch (error) {
          done(error)
        }
      }

      const result = actions.getTasksBetweenDates({ commit }, { start: '2017-01-01', end: '2017-01-03' })

      Promise.all([
        result.should.be.fulfilled,
        result.should.eventually.equal(1)
      ]).should.notify(done)
    })

    it('getTasksBetweenDates rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks/2017-01-01/2017-01-03`).reply(201)
      const commit = (type, payload) => {}

      return actions.getTasksBetweenDates({ commit }, {start: '2017-01-01', end: '2017-01-03'}).should.be.rejected
    })

    it('getTasksBetweenDates rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(`${config.apiHost}/api/tasks/2017-01-01/2017-01-03`).reply(404)
      const commit = (type, payload) => {}

      return actions.getTasksBetweenDates({ commit }, {start: '2017-01-01', end: '2017-01-03'}).should.be.rejected
    })

    it('markTaskComplete successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/complete`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.markTaskComplete({ commit }, 1)
      return result.should.eventually.equal(true) && result.should.be.fulfilled
    })

    it('markTaskComplete rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/complete`).reply(201)
      const commit = (type, payload) => {}

      return actions.markTaskComplete({ commit }, 1).should.be.rejected
    })

    it('markTaskComplete rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/complete`).reply(404)
      const commit = (type, payload) => {}

      return actions.markTaskComplete({ commit }, 1).should.be.rejected
    })

    it('markTaskIncomplete successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/incomplete`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.markTaskIncomplete({ commit }, 1)
      return result.should.eventually.equal(true) && result.should.be.fulfilled
    })

    it('markTaskIncomplete rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/incomplete`).reply(201)
      const commit = (type, payload) => {}

      return actions.markTaskIncomplete({ commit }, 1).should.be.rejected
    })

    it('markTaskIncomplete rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1/incomplete`).reply(404)
      const commit = (type, payload) => {}

      return actions.markTaskIncomplete({ commit }, 1).should.be.rejected
    })

    it('addTask successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/task`).reply(201)
      const commit = (type, payload) => {}

      const result = actions.addTask({ commit }, { id: 1 })
      return result.should.eventually.equal(true) && result.should.be.fulfilled
    })

    it('addTask rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/task`).reply(200)
      const commit = (type, payload) => {}

      return actions.addTask({ commit }, { id: 1 }).should.be.rejected
    })

    it('addTask rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${config.apiHost}/api/task`).reply(404)
      const commit = (type, payload) => {}

      return actions.addTask({ commit }, { id: 1 }).should.be.rejected
    })

    it('editTask successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.editTask({ commit }, { id: 1 })
      return result.should.eventually.equal(true) && result.should.be.fulfilled
    })

    it('editTask rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.editTask({ commit }, { id: 1 }).should.be.rejected
    })

    it('editTask rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onPatch(`${config.apiHost}/api/task/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.editTask({ commit }, { id: 1 }).should.be.rejected
    })

    it('deleteTask successfully', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/task/1`).reply(200)
      const commit = (type, payload) => {}

      const result = actions.deleteTask({ commit }, 1)
      return result.should.eventually.equal(true) && result.should.be.fulfilled
    })

    it('deleteTask rejects on unexpected HTTP code', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/task/1`).reply(201)
      const commit = (type, payload) => {}

      return actions.deleteTask({ commit }, 1).should.be.rejected
    })

    it('deleteTask rejects on error', () => {
      const mock = new MockAdapter(axios)
      mock.onDelete(`${config.apiHost}/api/task/1`).reply(404)
      const commit = (type, payload) => {}

      return actions.deleteTask({ commit }, 1).should.be.rejected
    })
  })
})
