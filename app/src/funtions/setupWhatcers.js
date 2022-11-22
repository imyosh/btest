import isEqual from 'is-equal'
import watch from 'redux-watch'
import debounce from 'lodash.debounce'
import { writeConfigRequest } from 'secure-electron-store'

window.isEqual = isEqual

const setupWhatcers = (store) => {
  let tasksWatcher = watch(store.getState, 'projects', isEqual)
  store.subscribe(
    debounce(
      tasksWatcher((newVal, oldVal, objectPath) => {
        // if (newVal.activeId === oldVal.activeId) {
        window.api.store.send(writeConfigRequest, 'projects', newVal.data)
        // console.log(newVal, oldVal)
        // }
      }),
      1000
    )
  )
}

export default setupWhatcers
