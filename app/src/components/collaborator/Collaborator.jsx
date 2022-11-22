import React from 'react'
import './collaborator.scss'

const Collaborator = ({ img, id, width, height }) => {
  return (
    <div style={{ width, height }} className='collaborator'>
      <img src={img}></img>
    </div>
  )
}

export default Collaborator
