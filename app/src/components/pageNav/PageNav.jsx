import React, { useRef } from 'react'
import './pageNav.scss'

import { NavLink } from 'react-router-dom'

const NavItem = ({ to, title, defaultChecked }) => {
  const inputRef = useRef(null)
  return (
    <>
      <input
        ref={inputRef}
        type='radio'
        name='tabs'
        defaultChecked={defaultChecked}
      ></input>
      <NavLink
        onClick={(e) => inputRef.current.click()}
        className='nav__link pageNav__item'
        to={to}
      >
        {title}
      </NavLink>
    </>
  )
}

const PageNav = ({ items, itemWidth, children }) => {
  return (
    <div style={{ '--item-width': itemWidth }} className='pageNav'>
      {items.map(({ to, title }, i) => (
        <NavItem key={i} to={to} title={title} />
      ))}
      <div className='slide'></div>

      {children}
    </div>
  )
}

export default PageNav
