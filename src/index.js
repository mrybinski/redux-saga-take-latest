import {
  fork,
  cancel,
  takeEvery,
  getContext,
  setContext
} from 'redux-saga/effects'

function * internalWorker (worker, getKey, ...args) {
  const tasks = yield getContext('takeLatestByTasks')
  const key = getKey(...args)
  const previousTask = tasks[key]
  if (previousTask) {
    yield cancel(previousTask)
  }

  tasks[key] = yield fork(worker, ...args)
}

function * takeLatestBy (patternOrChannel, worker, getKey, ...args) {
  const takeLatestByTasks = yield getContext('takeLatestByTasks')
  if (!takeLatestByTasks) yield setContext({ takeLatestByTasks: {} })
  yield takeEvery(patternOrChannel, internalWorker, worker, getKey, ...args)
}

module.exports = takeLatestBy
