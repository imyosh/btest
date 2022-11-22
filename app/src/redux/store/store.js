import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createHashHistory } from 'history'
import { createReduxHistoryContext } from 'redux-first-history'
import undoable from 'easy-redux-undo'

import homeFolderPathSlice from '../components/homeFolder/homeFolderPathSlice'
import counterReducer from '../components/counter/counterSlice'
import complexReducer from '../components/complex/complexSlice'

import userReducer from '../components/user/userSlice'
import projectsReducer from '../components/projects/projectsSlice'

const { routerMiddleware, createReduxHistory, routerReducer } =
  createReduxHistoryContext({
    history: createHashHistory(),
  })

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    homeFolderPath: homeFolderPathSlice,
    user: userReducer,
    projects: projectsReducer,
    undoable: undoable(
      combineReducers({
        counter: counterReducer,
        complex: complexReducer,
      })
    ),
  }),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    routerMiddleware,
  ],
})

export const history = createReduxHistory(store)
