import React, { useState, useEffect } from 'react'
import { Routes, Route, useMatch } from 'react-router'
import ROUTES from 'Constants/routes'
import loadable from '@loadable/component'

import Projects from '../pages/projects/projects'
import ProjectView from '../pages/projectView/projectView'
import Collaborators from '../pages/collaborators/Collaborators'
import Nav from 'Core/Nav'
import Header from 'Core/Header'
import SetPathModal from '../components/setPathModal/SetPathModal'

const Login = loadable(() =>
  import(/* webpackChunkName: "WelcomeChunk" */ 'Pages/login/login')
)

const UndoRedo = loadable(() =>
  import(/* webpackChunkName: "UndoRedoChunk" */ 'Pages/undoredo/undoredo')
)

const AppRoutes = ({ isUserLogged, setIsUserLogged }) => {
  if (!isUserLogged) return <Login setIsUserLogged={setIsUserLogged} />
  return (
    <>
      <Header />
      <Nav setIsUserLogged={setIsUserLogged} />
      <Routes>
        {/* <Route path={ROUTES.LOGIN} element={<Login />}></Route> */}
        <Route path={ROUTES.PROJECTS} element={<Projects />}></Route>
        <Route path={ROUTES.PROJECTVIEW} element={<ProjectView />}></Route>
        <Route path={ROUTES.COLLABORATORS} element={<Collaborators />}></Route>
        <Route path={ROUTES.UNDOREDO} element={<UndoRedo />}></Route>
      </Routes>
    </>
  )
}

export default AppRoutes
