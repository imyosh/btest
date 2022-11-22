import React, { useState, useEffect } from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'
import { Provider } from 'react-redux'
import AppRoutes from 'Core/routes'
import './root.scss'

import { connect } from 'react-redux'
import { setUser } from '../redux/components/user/userSlice'
import { readConfigRequest, readConfigResponse } from 'secure-electron-store'

import setupFilesOperations from '../funtions/filesOperations'
import setupWhatcers from '../funtions/setupWhatcers'
import { setProjects } from '../redux/components/projects/projectsSlice'
import { setHomeFolderPath } from '../redux/components/homeFolder/homeFolderPathSlice'

import SetPathModal from '../components/setPathModal/SetPathModal'
import NotifyModal from '../components/notifiyModal/NotifyModal'
import LoadingModal from '../components/loadingModal/LoadingModal'
import ConfirmModal from '../components/confrimModal/ConfirmModal'

import Axios from 'axios'

// Axios.defaults.baseURL = 'http://18.117.221.18:8080'
Axios.defaults.baseURL = 'http://localhost:8080'

window.resetApp = () => window.api.unlinkSync(window.api.store.path)

const Root = ({ store, history, setUser, setHomeFolderPath, setProjects }) => {
  const [isUserLogged, setIsUserLogged] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    window.api.store.clearRendererBindings()
    window.api.store.onReceive(
      readConfigResponse,
      function ({ key, success, value }) {
        switch (key) {
          case 'projects': {
            if (value) setProjects(value)
            break
          }
          case 'user':
            if (value) {
              setIsUserLogged(true)
              setUser(value)

              window.api.store.send(readConfigRequest, 'homeFolderPath')
            } else setIsUserLogged(false)
            break
          case 'homeFolderPath':
            if (!value) setIsModalOpen(true)
            else {
              setupFilesOperations(value)
              setHomeFolderPath(value)
            }
        }
      }
    )
    window.api.store.send(readConfigRequest, 'user')
    window.api.store.send(readConfigRequest, 'projects')
    setupWhatcers(store)
  }, [])

  return (
    <React.Fragment>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <NotifyModal />
          <LoadingModal />
          <ConfirmModal />
          <SetPathModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

          <AppRoutes
            // isModalOpen={isModalOpen}
            // setIsModalOpen={setIsModalOpen}
            isUserLogged={isUserLogged}
            setIsUserLogged={setIsUserLogged}
          ></AppRoutes>
        </HistoryRouter>
      </Provider>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  userToken: state.user.token,
})

const mapDispatchToProps = { setUser, setHomeFolderPath, setProjects }
export default connect(mapStateToProps, mapDispatchToProps)(Root)
