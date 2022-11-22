import React from 'react'
import './header.scss'

import { connect } from 'react-redux'

import { getBase64 } from '../funtions'

import userimg from './user.png'

const Header = ({ Image }) => {
  console.log(Image)

  return (
    <div className='header'>
      <div className='header__avatar'>
        <img src={Image}></img>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  Image: state.user.user.Image,
})

export default connect(mapStateToProps)(Header)
