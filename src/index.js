import { fork, cancel, takeEvery } from 'redux-saga/effects'

function * takeLatestBy (patternOrChannel, worker, getKey, ...args) {
  const tasks = {}

  yield takeEvery(
    patternOrChannel,
    function * () {
      const action = arguments[arguments.length - 1]
      const key = getKey(action)
      const previousTask = tasks[key]
      if (previousTask) {
        yield cancel(previousTask)
      }

      tasks[key] = yield fork(worker, ...arguments)
    },
    ...args
  )
}

module.exports = takeLatestBy
