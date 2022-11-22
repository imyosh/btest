import React from 'react'
import './timeLineElement.scss'

import Img from './user.png'

import { ContextMenuTrigger } from 'react-contextmenu'

const TimeLineElement = ({ contextMenuTriggerId, data }) => {
  return (
    <ContextMenuTrigger
      attributes={{ className: 'timeLineElement' }}
      id={`${contextMenuTriggerId}`}
    >
      <img className='timeLineElement__img' src={data.artistImage}></img>
      <div className='timeLineElement__group'>
        <span className='timeLineElement__date'>
          {new Date(data.createdAt).toLocaleString()}
        </span>
        <p className='timeLineElement__comment'>
          {data.artistName} - {data.version_comment}
        </p>
      </div>
    </ContextMenuTrigger>
  )
}

export default TimeLineElement
