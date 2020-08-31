import { fork, cancel, takeEvery } from 'redux-saga/effects'

function * takeLatestBy (patternOrChannel, worker, getKey, ...args) {
  const tasks = {}

  yield takeEvery(
    patternOrChannel,
    function * () {
      const key = getKey(...arguments)
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
