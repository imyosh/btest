import React from 'react'
import './nav.scss'

import ROUTES from 'Constants/routes'
import { NavLink, useNavigate } from 'react-router-dom'

import Logo from '../svg/nav_logo.svg'

const nav = ({ setIsUserLogged }) => {
  const navigate = useNavigate()

  const logOut = () => {
    window.testConfirm('Log out', 'Are you sure you want to log out ?', () => {
      window.api.unlinkSync(window.api.store.path)
      setTimeout(() => {
        setIsUserLogged(false)
        navigate('/')
      }, 250)
    })
  }

  return (
    <div className='nav'>
      <Logo
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(ROUTES.PROJECTS)}
      />
      <div className='nav__group'>
        <NavLink className='nav__link' to={ROUTES.PROJECTS}>
          Projects
        </NavLink>
        <NavLink className='nav__link' to={'/collaborators'}>
          Collaborators
        </NavLink>
      </div>
      <div onClick={logOut} className='nav__logout'>
        Log out
      </div>
    </div>
  )
}

export default nav
