import React from 'react'
import './projectBounces.scss'

import List from '../list/List'
import AudioElement from '../audioElement/AudioElement'

const ProjectBounces = ({ bounces }) => {
  return (
    <div className='projectBounces'>
      <List
        items={bounces ? bounces : []}
        Element={AudioElement}
        emptyMessage='No Bounces'
        offset={1}
      />
    </div>
  )
}

export default ProjectBounces
